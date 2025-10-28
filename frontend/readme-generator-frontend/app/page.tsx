"use client";

import { useState } from "react";
import { Sparkles, Github, Key, CheckCircle, Linkedin, User } from "lucide-react";
import ApiInput from "../src/components/ApiInput";
import RepoInputAndReadme from "../src/components/RepoInputAndReadme";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const [apiKey, setApiKey] = useState("");
  const [isValid, setIsValid] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Hero Navbar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Readmify
          </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Star Repo</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl sm:rounded-3xl mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
            AI-Powered README Generator
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create stunning, professional README.md files for any GitHub repository in seconds using the power of AI
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <Card className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-gray-200 dark:border-gray-800">
            <div className="space-y-6 sm:space-y-8">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Get Started
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Enter your API key and repository URL to begin
                </p>
              </div>

              {/* API Key Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-lg">Google Gemini API Key</h3>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-4 sm:p-5 border border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                      Your API key is encrypted and never stored on our servers
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong className="text-gray-800 dark:text-gray-200">Cost Notice:</strong> Each analysis uses your Gemini API credits. 
                    <a 
                      href="https://ai.google.dev/pricing" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                    >
                      Check pricing here
                    </a>
                  </p>
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium inline-block"
                  >
                    → Get your free API key
                  </a>
                </div>

                <ApiInput
                  value={apiKey}
                  onChange={setApiKey}
                  onValidationChange={setIsValid}
                />
              </div>

              {/* Repo Input Section */}
              {isValid && (
                <div className="animate-fade-in pt-4 border-t border-gray-200 dark:border-gray-800">
                  <RepoInputAndReadme apiKey={apiKey} />
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made by{" "}
            <a
              href="https://oviyan-portfolio.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Oviyan
            </a>
          </p>
        </div>
      </footer>

      {/* Floating LinkedIn Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://linkedin.com/in/oviyan-s"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          title="Connect with Oviyan"
        >
          <Linkedin className="w-7 h-7" />
          
          {/* Hover Badge */}
          <div className="absolute right-full mr-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">Connect on LinkedIn</span>
              </div>
              <div className="absolute right-2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
