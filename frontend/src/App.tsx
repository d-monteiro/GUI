"use client"

import { useState } from 'react'
import { Background } from "@/components/layout/background"
import { DynamicButton } from "@/components/dynamic/button"

function App(){

  return (
    <>
      <Background variant="mesh">
      <DynamicButton></DynamicButton>
      </Background>
    </>
  )
}

export default App
