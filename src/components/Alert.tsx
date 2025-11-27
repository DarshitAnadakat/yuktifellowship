import { useEffect, useState } from "react"

export type AlertType = "success" | "error" | "warning" | "info"

interface AlertProps {
  message: string
  type: AlertType
  duration?: number
  onClose?: () => void
}

const Alert = ({ message, type, duration = 3000, onClose }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-500"
      case "error":
        return "bg-red-50 text-red-800 border-red-500"
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-500"
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-500"
      default:
        return "bg-gray-50 text-gray-800 border-gray-500"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓"
      case "error":
        return "✕"
      case "warning":
        return "⚠"
      case "info":
        return "ℹ"
      default:
        return "•"
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border-l-4 shadow-lg animate-slide-in-right ${getAlertStyles()}`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="flex-shrink-0 mr-2 text-xl">{getIcon()}</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        ✕
      </button>
    </div>
  )
}

export default Alert 