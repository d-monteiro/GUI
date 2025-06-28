"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"

interface QueryPageProps {
  onSubmit?: (query: string) => void
  placeholder?: string
  title?: string
  subtitle?: string
}

const QueryPage = ({
  onSubmit,
  placeholder = "Ask me anything...",
  title = "What can We help you with?",
}: QueryPageProps) => {
  const [query, setQuery] = useState("")

  const exampleQuestions = [
    "Help me plan my trip to Japan.",
    "Help me clean up this data.",
    "?",
    "?",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && onSubmit) {
      onSubmit(query.trim())
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
    if (onSubmit) {
      onSubmit(example)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-8 mb-30">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-white">{title}</h1>
          </div>
        </div>

        {/* Main Input */}
        <div className="relative mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full px-6 py-4 text-lg bg-black/40 backdrop-blur-2xl border-2 border-[#5bc7e4]/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-[#5bc7e4]/60 focus:ring-2 focus:ring-[#5bc7e4]/20 transition-all duration-300 pr-14"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#5bc7e4]/20 to-[#38b5e5]/20 backdrop-blur-xl border border-[#5bc7e4]/30 rounded-xl text-[#affddb] hover:from-[#5bc7e4]/30 hover:to-[#38b5e5]/30 hover:border-[#5bc7e4]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Example Questions */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <span className="text-sm font-medium">Try these examples</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(question)}
                className="group relative p-6 bg-black/30 backdrop-blur-2xl border border-[#78d9e2]/20 rounded-2xl text-left text-white hover:border-[#78d9e2]/40 hover:bg-black/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#78d9e2]/10"
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <p className="text-sm md:text-base leading-relaxed group-hover:text-[#affddb] transition-colors duration-300">
                    {question}
                  </p>
                </div>

                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#affddb]/0 via-[#5bc7e4]/0 to-[#38b5e5]/0 group-hover:from-[#affddb]/10 group-hover:via-[#5bc7e4]/10 group-hover:to-[#38b5e5]/10 transition-all duration-300 -z-10" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="text-center">
          <p className="text-white/40 text-sm">
            Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd> to submit or click an example above
          </p>
        </div>
      </div>
    </div>
  )
}

export { QueryPage }
