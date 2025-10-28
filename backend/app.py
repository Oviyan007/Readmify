import tempfile
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from git import Repo
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import hashlib
import base64
import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

load_dotenv()
SECRET_KEY = os.getenv("ENCRYPTION_KEY", "elevate-resume-ai-secret-key-2024")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========= Request Models =========
class GenerateReadmeRequest(BaseModel):
    repo_url: str
    api_key: str

# ========= AES Decryption =========
def derive_key_and_iv(password: str, salt: bytes, key_len=32, iv_len=16):
    derived = b""
    password_bytes = password.encode()
    while len(derived) < (key_len + iv_len):
        d_i = hashlib.md5((derived[-16:] if derived else b"") + password_bytes + salt).digest()
        derived += d_i
    return derived[:key_len], derived[key_len:key_len+iv_len]

def decrypt_api_key(encrypted_base64: str) -> str:
    try:
        encrypted_base64 = encrypted_base64.replace(" ", "+")
        encrypted_bytes = base64.b64decode(encrypted_base64)
        if not encrypted_bytes.startswith(b"Salted__"):
            raise ValueError("Invalid format: missing Salted__ prefix")
        
        salt = encrypted_bytes[8:16]
        ciphertext = encrypted_bytes[16:]
        key, iv = derive_key_and_iv(SECRET_KEY, salt)
        
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_padded = decryptor.update(ciphertext) + decryptor.finalize()
        pad_len = decrypted_padded[-1]
        return decrypted_padded[:-pad_len].decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to decrypt API key: {str(e)}")

# ========= Helper Functions =========
def read_limited_file(file_path, max_lines=500):
    """Read first `max_lines` lines of a file to reduce payload"""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = []
            for i, line in enumerate(f):
                if i >= max_lines:
                    break
                lines.append(line)
            return "".join(lines)
    except Exception:
        return ""

def gather_repo_files(tmp_dir):
    """Collect relevant files from repo, including frontend & backend"""
    relevant_exts = (".py", ".js", ".ts", ".html", ".css", ".md")
    files_content = []

    for root, dirs, files in os.walk(tmp_dir):
        for file in files:
            if file.endswith(relevant_exts):
                path = os.path.join(root, file)
                files_content.append(read_limited_file(path))
    return files_content

def detect_project_type(tmp_dir):
    """Detect project type based on common files"""
    files = os.listdir(tmp_dir)
    if any(f.endswith("requirements.txt") or f.endswith("pyproject.toml") for f in files):
        return "Python"
    if "package.json" in files:
        return "Node.js / Frontend"
    if "pom.xml" in files or "build.gradle" in files:
        return "Java"
    if any(f.endswith(".html") for f in files):
        return "Frontend"
    return "Unknown"

# ========= Endpoints =========
@app.get("/")
def index():
    return {"message": "working...!!"}

@app.post("/validate-api-key")
def validate_api_key(api_key: str):
    try:
        decrypted_api_key = decrypt_api_key(api_key)
        client = genai.Client(api_key=decrypted_api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=["Hello"]
        )
        if not response or not response.text:
            raise HTTPException(status_code=401, detail="Invalid API key")
        return {"valid": True, "message": "API key is valid"}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid API key")

@app.post("/generate-readme")
def generate_readme(request: GenerateReadmeRequest):
    try:
        decrypted_api_key = decrypt_api_key(request.api_key)
        client = genai.Client(api_key=decrypted_api_key)

        # Clone repo
        with tempfile.TemporaryDirectory() as tmp_dir:
            Repo.clone_from(request.repo_url, tmp_dir)

            repo_files = gather_repo_files(tmp_dir)
            if not repo_files:
                raise HTTPException(status_code=400, detail="No readable files found in the repo")

            project_type = detect_project_type(tmp_dir)

            # AI Prompt
            prompt = f"""
You are a professional software documentation writer.
Project Type: {project_type}

Project files content:
{''.join(repo_files)}

Instructions:
- Analyze project files carefully.
- Generate a professional README.md with sections:
  Title, Description, Features, Installation, Usage, Demo (if any), Tech Stack, API / Endpoints, Contributing, License
- Include instructions relevant to the detected project type ({project_type})
- Use Markdown formatting properly
- Include code snippets and terminal commands in code blocks
- Output only the final README.md content
"""

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt]
            )

            if not response or not response.text:
                raise HTTPException(status_code=500, detail="Failed to generate README")

            return {"readme": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
