import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { encryptApiKey } from "../utils/encryption";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const ApiInput = ({ value, onChange, onValidationChange }: ApiKeyInputProps) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateApiKey = async () => {
    if (!value.trim()) return;
    setIsValidating(true);

    try {
      const encryptedApiKey = encryptApiKey(value);

      const res = await fetch(
        `http://127.0.0.1:8000/validate-api-key?api_key=${encryptedApiKey}`,
        { method: "POST" }
      );
      const data = await res.json();
      const valid = data.valid === true;
      setIsValid(valid);
      onValidationChange?.(valid);
    } catch {
      setIsValid(false);
      onValidationChange?.(false);
    } finally {
      setIsValidating(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your Gemini API key"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsValid(null);
            onValidationChange?.(false);
          }}
          className="w-full px-4 py-3 pr-12 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <button
        onClick={validateApiKey}
        disabled={!value.trim() || isValidating}
        className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
          ${!value.trim() || isValidating
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          }`}
      > 
        {isValidating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Validating...</span>
          </>
        ) : (
          "Validate API Key"
        )}
      </button>

      {/* Validation Status */}
      {isValid === true && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            API key is valid and ready to use
          </p>
        </div>
      )}
      {isValid === false && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fade-in">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            Invalid API key. Please check and try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiInput;
