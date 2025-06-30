"use client"

import { useWebSocket } from "@/hooks/WebSocket"

import { useState } from 'react'
import { Background } from "@/components/layout/background"
import { WelcomeAnimation } from "@/components/WelcomeAnimation"
import { ChatBlob } from "@/components/ChatBlob";
import { QueryPage } from "@/components/QueryPage"
import { DynamicUI } from "@/components/dynamic/UI"
import { DynamicText } from "@/components/dynamic/text"

type AppStep = "welcome" | "query" | "gui";

function App(){
  const { send } = useWebSocket();

  const [currentStep, setCurrentStep] = useState<AppStep>("welcome");

  const handleSubmit = (query: string) => {
    send({
      type: "user_message",
      content: query,
    });
    setCurrentStep("gui")
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
            <DynamicUI/>
            <ChatBlob />
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
