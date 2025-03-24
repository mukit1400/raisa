import ChatInterface from "../components/chat-interface"
import { GyroShineHeader } from "@/components/gyro-shine-header"

export default function Page() {
  return (
    <div className="flex h-screen modern-gradient retro:bg-black girlypop:girlypop-gradient">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto">
        <GyroShineHeader />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}

