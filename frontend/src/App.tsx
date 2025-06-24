"use client"

import { useState } from 'react'
import { Background } from "@/components/layout/background"
import { DynamicButton } from "@/components/dynamic/button"
import { WelcomeAnimation } from "@/components/WelcomeAnimation"
import { QueryPage } from '@/components/QueryPage'

type AppStep = "welcome" | "query" | "gui";

function App(){
  const [currentStep, setCurrentStep] = useState<AppStep>("welcome");

  const handleSubmit = (query: string) => {
    console.log("Submitted query:", query)
    setCurrentStep("gui")
    // await fetch('/api/query', { method: 'POST', body: JSON.stringify({ query }) })
  }

  const renderContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
            <WelcomeAnimation onComplete={() => setCurrentStep("query")} />
        );
      case "query":
        return (
            <QueryPage onSubmit={handleSubmit}/>
        );
      case "gui":
         return (
          <Background variant="mesh">
          <div className="p-8">
            <h1 className="text-2xl text-white">This is the GUI step.</h1>
            <DynamicButton onClick={() => setCurrentStep("welcome")}>
              Reset
            </DynamicButton>
          </div>
          </Background>
        );
      default:
        return null; // Or a default view
    }
  };


  return (
    <main className="bg-black min-h-screen w-full flex items-center justify-center">
      {renderContent()}
    </main>
  )
}

export default App
