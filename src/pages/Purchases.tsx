"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BoltIcon } from "../components/Icons"
import { Doughnut } from "react-chartjs-2"
import { motion } from "framer-motion"
import { 
  FaBolt, FaWallet, FaHistory, FaHome,
  FaShoppingCart, FaCog, FaSignOutAlt, FaPlus,
  FaClock, FaCheckCircle, FaSpinner, FaLeaf
} from "react-icons/fa"
import { useAlert } from "../contexts/AlertContext"
import { signOutUser } from "../services/authService"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from "chart.js"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
)

const Purchases = () => {
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState("month")

  // Sidebar navigation items
  const sidebarItems = [
    { icon: FaHome, label: "Dashboard", path: "/dashboard" },
    { icon: FaBolt, label: "Energy", path: "/energy-consumption" },
    { icon: FaShoppingCart, label: "Purchases", path: "/purchases", active: true },
    { icon: FaCog, label: "Settings", path: "/settings" },
  ]

  // Sample data - replace with actual data from your API
  const purchaseStats = [
    { icon: FaWallet, label: "Total Spent", value: "₹45,250", color: "blue", bgGradient: "from-blue-600 to-cyan-600" },
    { icon: FaHistory, label: "This Month", value: "₹12,800", color: "emerald", bgGradient: "from-emerald-600 to-green-600" },
    { icon: FaSpinner, label: "Pending", value: "₹3,500", color: "amber", bgGradient: "from-amber-600 to-orange-600" },
    { icon: FaLeaf, label: "Savings", value: "₹2,450", color: "cyan", bgGradient: "from-cyan-600 to-blue-600" }
  ]

  const chartData = {
    labels: ["Peak Hours", "Off-Peak Hours", "Renewable Energy"],
    datasets: [{
      data: [45, 35, 20],
      backgroundColor: [
        "rgba(34, 197, 94, 0.8)",
        "rgba(59, 130, 246, 0.8)",
        "rgba(251, 191, 36, 0.8)"
      ],
      borderColor: [
        "rgb(34, 197, 94)",
        "rgb(59, 130, 246)",
        "rgb(251, 191, 36)"
      ],
      borderWidth: 2
    }]
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "white",
          padding: 15,
          font: { size: 12 }
        }
      }
    }
  }

  const transactions = [
    {
      id: "TRX001",
      date: "2024-03-15",
      amount: "₹4,500",
      type: "Peak Hours",
      status: "completed",
      units: "450 kWh"
    },
    {
      id: "TRX002",
      date: "2024-03-14",
      amount: "₹3,200",
      type: "Off-Peak Hours",
      status: "completed",
      units: "400 kWh"
    },
    {
      id: "TRX003",
      date: "2024-03-13",
      amount: "₹2,800",
      type: "Renewable Energy",
      status: "pending",
      units: "350 kWh"
    },
    {
      id: "TRX004",
      date: "2024-03-12",
      amount: "₹3,800",
      type: "Peak Hours",
      status: "completed",
      units: "380 kWh"
    }
  ]

  // Simulate system alerts
  useEffect(() => {
    // Simulate load increase alert
    const loadTimer = setInterval(() => {
      const randomLoad = Math.floor(Math.random() * 30) + 70 // Random load between 70-100%
      if (randomLoad > 90) {
        showAlert(`High Load Alert: System load at ${randomLoad}%`, "warning")
      }
    }, 2000) // Check every 3 seconds

    // Simulate energy sharing status
    const sharingTimer = setInterval(() => {
      const isSharing = Math.random() > 0.7
      if (!isSharing) {
        showAlert("Energy Sharing Interrupted: Network connectivity issues", "error")
      }
    }, 60000) // Check every minute

    // Simulate power meter status
    const meterTimer = setInterval(() => {
      const meterStatus = Math.random() > 0.8
      if (!meterStatus) {
        showAlert("Power Meter Alert: Communication lost with smart meter", "error")
      }
    }, 50000) // Check every 50 seconds

    // Simulate communication status
    const commTimer = setInterval(() => {
      const commStatus = Math.random() > 0.85
      if (!commStatus) {
        showAlert("Communication Error: Unable to establish connection with grid", "warning")
      }
    }, 40000) // Check every 40 seconds

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(loadTimer)
      clearInterval(sharingTimer)
      clearInterval(meterTimer)
      clearInterval(commTimer)
    }
  }, [showAlert])

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
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-emerald-500 rounded-full filter blur-[120px]"
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
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg"
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
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Purchases</h1>
              <p className="text-white/70">Track and manage your energy purchases</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showAlert("New purchase feature coming soon!", "info")}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FaPlus />
              New Purchase
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-4 mb-6"
          >
            {purchaseStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Chart and Transactions */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Transaction History */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Transaction History</h3>
                  <p className="text-white/60 text-sm">Recent purchases and orders</p>
                </div>
                <div className="flex gap-3">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="week" className="bg-slate-800">This Week</option>
                    <option value="month" className="bg-slate-800">This Month</option>
                    <option value="year" className="bg-slate-800">This Year</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all" className="bg-slate-800">All Status</option>
                    <option value="completed" className="bg-slate-800">Completed</option>
                    <option value="pending" className="bg-slate-800">Pending</option>
                    <option value="failed" className="bg-slate-800">Failed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.status === "completed" ? "bg-emerald-500/20" : "bg-amber-500/20"
                      }`}>
                        {transaction.status === "completed" ? (
                          <FaCheckCircle className="text-emerald-400" />
                        ) : (
                          <FaClock className="text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{transaction.type}</p>
                        <p className="text-sm text-white/50">{transaction.id} • {transaction.units}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{transaction.amount}</p>
                      <p className="text-xs text-white/50">{transaction.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Usage Distribution Chart */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-2">Distribution</h3>
              <p className="text-white/60 text-sm mb-4">Purchase breakdown</p>
              <div className="h-[300px] flex items-center justify-center">
                <Doughnut data={chartData} options={doughnutOptions} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchases
