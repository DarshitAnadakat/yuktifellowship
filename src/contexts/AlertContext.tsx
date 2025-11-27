import { createContext, useContext, useState, ReactNode } from "react"
import Alert, { AlertType } from "../components/Alert"

interface AlertContextType {
  showAlert: (message: string, type: AlertType) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

interface AlertItem {
  id: string
  message: string
  type: AlertType
}

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  const showAlert = (message: string, type: AlertType) => {
    const id = Math.random().toString(36).substring(7)
    setAlerts(prev => [...prev, { id, message, type }])
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-50 alert-stack">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            message={alert.message}
            type={alert.type}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
} 