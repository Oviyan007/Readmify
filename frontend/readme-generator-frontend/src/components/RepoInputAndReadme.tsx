import { useState } from "react";
import { 
  Github, 
  Loader2, 
  Copy, 
  Download, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface RepoInputAndReadmeProps {
  apiKey: string;
}

const RepoInputAndReadme = ({ apiKey }: RepoInputAndReadmeProps) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [readme, setReadme] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateReadme = async () => {
    if (!repoUrl.trim()) return;
    setIsGenerating(true);
    setReadme(null);
    setError(null);

    try {
      const res = await fetch("https://readmify.onrender.com/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl,api_key: apiKey  }),
      });

      if (!res.ok) throw new Error("Failed to generate README");

      const data = await res.json();
      setReadme(data.readme);
    } catch (err: any) {
      setError(err.message || "Failed to generate README");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!readme) return;
    try {
      await navigator.clipboard.writeText(readme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadReadme = () => {
    if (!readme) return;
    const blob = new Blob([readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Repository URL Input */}
      <div>
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
          <Github className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold">Repository URL</span>
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={isGenerating}
          />
          <button
            onClick={generateReadme}
            disabled={!repoUrl.trim() || isGenerating}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap
              ${!repoUrl.trim() || isGenerating
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            {error}
          </p>
        </div>
      )}

      {/* README Output */}
      {readme && (
        <div className="space-y-4 animate-fade-in">
          {/* Header with Actions */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-bold text-gray-800 dark:text-white">
                Generated README
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200 dark:border-gray-700"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={downloadReadme}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200 dark:border-gray-700"
                title="Download README.md"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* README Preview */}
          <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-6 border border-gray-200 dark:border-gray-800 max-h-[600px] overflow-y-auto">
            <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {readme}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Sparkles icon component (since we can't use it from lucide-react if needed)
const SparklesIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

export default RepoInputAndReadme;
