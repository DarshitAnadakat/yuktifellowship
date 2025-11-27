"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BoltIcon } from "../components/Icons"
import { motion } from "framer-motion"
import { 
  FaBolt, FaHome, FaShoppingCart, FaCog, FaSignOutAlt,
  FaUser, FaBell, FaCreditCard, FaLock, FaSlidersH, FaCamera,
  FaEnvelope, FaPhone, FaSave, FaToggleOn, FaToggleOff
} from "react-icons/fa"
import { signOutUser } from "../services/authService"

const Settings = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    alerts: {
      usage: true,
      billing: true,
      maintenance: false
    }
  })

  // Sidebar navigation items
  const sidebarItems = [
    { icon: FaHome, label: "Dashboard", path: "/dashboard" },
    { icon: FaBolt, label: "Energy", path: "/energy-consumption" },
    { icon: FaShoppingCart, label: "Purchases", path: "/purchases" },
    { icon: FaCog, label: "Settings", path: "/settings", active: true },
  ]

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "billing", label: "Billing", icon: FaCreditCard },
    { id: "security", label: "Security", icon: FaLock },
    { id: "preferences", label: "Preferences", icon: FaSlidersH }
  ]

  const handleNotificationChange = (key: string, value: boolean) => {
    if (key.includes(".")) {
      const [parent, child] = key.split(".")
      setNotifications(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setNotifications(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-3xl">
            <FaUser className="text-white" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-all">
            <FaCamera className="text-white text-sm" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
          <p className="text-sm text-white/60 mt-1">Update your profile picture</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">First Name</label>
          <input
            type="text"
            className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Last Name</label>
          <input
            type="text"
            className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
          <input
            type="tel"
            className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="+91 1234567890"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
      >
        <FaSave />
        Save Changes
      </motion.button>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", icon: FaEnvelope },
            { key: "push", label: "Push Notifications", icon: FaBell },
            { key: "sms", label: "SMS Notifications", icon: FaPhone }
          ].map(channel => (
            <div key={channel.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <channel.icon className="text-blue-400" />
                </div>
                <span className="text-white font-medium">{channel.label}</span>
              </div>
              <button
                onClick={() => handleNotificationChange(channel.key, !(notifications as any)[channel.key])}
                className="relative"
              >
                {(notifications as any)[channel.key] ? (
                  <FaToggleOn className="text-4xl text-emerald-500" />
                ) : (
                  <FaToggleOff className="text-4xl text-white/30" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Alert Preferences</h3>
        <div className="space-y-4">
          {[
            { key: "alerts.usage", label: "Usage Alerts", desc: "Get notified about consumption patterns" },
            { key: "alerts.billing", label: "Billing Alerts", desc: "Payment reminders and invoices" },
            { key: "alerts.maintenance", label: "Maintenance Alerts", desc: "System updates and maintenance" }
          ].map(alert => (
            <div key={alert.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <p className="text-white font-medium">{alert.label}</p>
                <p className="text-sm text-white/60">{alert.desc}</p>
              </div>
              <button
                onClick={() => {
                  const [parent, child] = alert.key.split(".")
                  handleNotificationChange(alert.key, !(notifications as any)[parent][child])
                }}
                className="relative"
              >
                {(() => {
                  const [parent, child] = alert.key.split(".")
                  return (notifications as any)[parent][child] ? (
                    <FaToggleOn className="text-4xl text-emerald-500" />
                  ) : (
                    <FaToggleOff className="text-4xl text-white/30" />
                  )
                })()}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500 rounded-full filter blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-500 rounded-full filter blur-[120px]"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-20 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col items-center py-8 space-y-8"
        >
          <div className="text-3xl">
            <BoltIcon className="text-blue-400" />
          </div>
          <div className="flex-1 flex flex-col space-y-4">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className={`p-3 rounded-xl transition-all ${
                  item.active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="text-xl" />
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              const result = await signOutUser();
              if (result.success) {
                navigate("/");
              }
            }}
            className="p-3 text-white/60 hover:text-red-400 rounded-xl hover:bg-white/10 transition-all"
          >
            <FaSignOutAlt className="text-xl" />
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-white/70">Manage your account preferences</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <tab.icon />
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8"
          >
            {activeTab === "profile" && renderProfileSettings()}
            {activeTab === "notifications" && renderNotificationSettings()}
            {activeTab === "billing" && (
              <div className="text-center py-12">
                <FaCreditCard className="text-6xl text-white/30 mx-auto mb-4" />
                <p className="text-white/60">Billing settings coming soon</p>
              </div>
            )}
            {activeTab === "security" && (
              <div className="text-center py-12">
                <FaLock className="text-6xl text-white/30 mx-auto mb-4" />
                <p className="text-white/60">Security settings coming soon</p>
              </div>
            )}
            {activeTab === "preferences" && (
              <div className="text-center py-12">
                <FaSlidersH className="text-6xl text-white/30 mx-auto mb-4" />
                <p className="text-white/60">Preference settings coming soon</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings
