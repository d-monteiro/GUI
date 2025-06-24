"use client"

import { TypeAnimation } from "react-type-animation"

interface WelcomeAnimationProps {
  onComplete: () => void
}

export const WelcomeAnimation = ({ onComplete }: WelcomeAnimationProps) => {
  return (
    <div className="p-8 bg-black text-center">
      <TypeAnimation
        sequence={[
          "Welcome,",
          1000,
          "We are redefining the way humans interact with AI.",
          1000,
          () => {
            onComplete()
          },
        ]}
        wrapper="span"
        cursor={true}
        repeat={0} // Do not repeat
        className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-500"
        style={{
          display: 'inline-block',
          textShadow: '0 0 15px rgba(175, 253, 219, 0.5)',
        }}
      />
    </div>
  )
}