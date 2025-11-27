"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Line } from "react-chartjs-2"
import { motion } from "framer-motion"
import { 
  FaBolt, 
  FaChartLine, 
  FaWallet, 
  FaLeaf, 
  FaHome, 
  FaChartBar, 
  FaShoppingCart, 
  FaCog, 
  FaSignOutAlt,
  FaArrowUp,
  FaArrowDown,
  FaSync,
  FaLightbulb,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExchangeAlt
} from "react-icons/fa"
import { BoltIcon } from "../components/Icons"
import { signOutUser } from "../services/authService"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = () => {
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState("live")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedSite, setSelectedSite] = useState("site1")
  const [showAlerts, setShowAlerts] = useState(false)
  const [liveData, setLiveData] = useState([1.2, 0.8, 2.5, 4.2, 3.8, 5.5, 3.2])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const totalSites = 5

  const sitesData = {
    site1: {
      name: "Site Alpha",
      inverterNumber: "INV-001",
      activePower: "12.5 kW",
      powerFactor: "0.95",
      frequency: "50.2 Hz"
    },
    site2: {
      name: "Site Beta",
      inverterNumber: "INV-002",
      activePower: "8.3 kW",
      powerFactor: "0.92",
      frequency: "50.1 Hz"
    },
    site3: {
      name: "Site Gamma",
      inverterNumber: "INV-003",
      activePower: "15.7 kW",
      powerFactor: "0.98",
      frequency: "50.0 Hz"
    },
    site4: {
      name: "Site Delta",
      inverterNumber: "INV-004",
      activePower: "10.2 kW",
      powerFactor: "0.94",
      frequency: "49.9 Hz"
    },
    site5: {
      name: "Site Epsilon",
      inverterNumber: "INV-005",
      activePower: "13.1 kW",
      powerFactor: "0.96",
      frequency: "50.3 Hz"
    }
  }

  const alertsData = [
    { id: 1, type: "warning", message: "Peak demand detected at Site Alpha", time: "2 min ago", icon: FaExclamationTriangle, color: "amber" },
    { id: 2, type: "success", message: "Energy purchase completed successfully", time: "15 min ago", icon: FaCheckCircle, color: "emerald" },
    { id: 3, type: "warning", message: "Power factor below optimal at Site Beta", time: "1 hour ago", icon: FaExclamationTriangle, color: "amber" },
    { id: 4, type: "info", message: "Scheduled maintenance for Site Gamma", time: "3 hours ago", icon: FaLightbulb, color: "blue" },
    { id: 5, type: "success", message: "Bill payment processed", time: "5 hours ago", icon: FaCheckCircle, color: "emerald" }
  ]

  const energyStats = [
    {
      title: "Total Available Energy",
      value: "25.8 kW",
      subtitle: "Available capacity",
      icon: FaBolt,
      color: "blue",
      bgGradient: "from-blue-500/20 to-blue-600/20",
      change: "+2.4 kW",
      trend: "up"
    },
    {
      title: "Today's Total",
      value: "52.8 kWh",
      subtitle: "24h consumption",
      icon: FaChartLine,
      color: "cyan",
      bgGradient: "from-cyan-500/20 to-cyan-600/20",
      change: "+5.2 kWh",
      trend: "up"
    },
    {
      title: "Cost Today",
      value: "₹845",
      subtitle: "Running total",
      icon: FaWallet,
      color: "emerald",
      bgGradient: "from-emerald-500/20 to-emerald-600/20",
      change: "+₹120",
      trend: "up"
    },
    {
      title: "Efficiency",
      value: "87%",
      subtitle: "Performance score",
      icon: FaLeaf,
      color: "green",
      bgGradient: "from-green-500/20 to-green-600/20",
      change: "+2%",
      trend: "up"
    }
  ]

  const getConsumptionData = () => {
    const dataByPeriod: Record<string, { labels: string[], data: number[] }> = {
      live: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        data: liveData
      },
      today: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        data: [1.5, 1.2, 3.0, 4.8, 4.2, 5.8, 3.5]
      },
      week: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [45, 52, 48, 58, 62, 55, 50]
      },
      month: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [320, 380, 350, 420]
      }
    }

    const periodData = dataByPeriod[selectedPeriod]
    return {
      labels: periodData.labels,
      datasets: [
        {
          label: "Energy Usage (kWh)",
          data: periodData.data,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2
        }
      ]
    }
  }

  const consumptionData = getConsumptionData()

  // Live data simulation
  useEffect(() => {
    let interval: number | undefined
    if (selectedPeriod === "live") {
      interval = window.setInterval(() => {
        setLiveData(prev => {
          const newData = [...prev]
          newData.shift()
          newData.push(Math.random() * 6 + 1)
          return newData
        })
      }, 3000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedPeriod])

  const recentActivity = [
    { 
      action: "Energy Purchase", 
      amount: "50 kWh", 
      status: "completed", 
      time: "2h ago", 
      icon: FaShoppingCart,
      color: "emerald"
    },
    { 
      action: "Peak Alert", 
      amount: "4.5 kW", 
      status: "warning", 
      time: "5h ago", 
      icon: FaExclamationTriangle,
      color: "amber"
    },
    { 
      action: "Bill Payment", 
      amount: "₹12,500", 
      status: "completed", 
      time: "1d ago", 
      icon: FaCheckCircle,
      color: "emerald"
    },
  ]

  const sidebarItems = [
    { icon: FaHome, label: "Dashboard", path: "/dashboard", active: true },
    { icon: FaChartBar, label: "Energy", path: "/energy-consumption", active: false },
    { icon: FaShoppingCart, label: "Purchases", path: "/purchases", active: false },
    { icon: FaCog, label: "Settings", path: "/settings", active: false },
  ]

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)"
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)"
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -top-48 -left-48 animate-pulse blur-3xl"></div>
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full -bottom-60 -right-60 animate-pulse delay-700 blur-3xl"></div>
      </div>

      {/* Top Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-20 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 relative z-20"
      >
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <BoltIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">PowerNetPro</h1>
              <p className="text-xs text-white/60">Smart Energy Management</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2 ml-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/p2p-market")}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium text-sm"
            >
              <FaExchangeAlt />
              <span>P2P Market</span>
            </motion.button>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={async () => {
            const result = await signOutUser();
            if (result.success) {
              navigate("/");
            }
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Sign Out</span>
        </motion.button>
      </motion.header>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-20 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 gap-8 relative z-10"
        >
          {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-4">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  item.active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
                title={item.label}
              >
                <item.icon className="text-xl" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Peer to Peer Energy Trading Portal
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-white/70">Total Sites: <span className="font-bold text-white">{totalSites}</span></p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAlerts(!showAlerts)}
                className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-amber-300 transition-all"
              >
                <FaExclamationTriangle />
                <span className="text-sm">Alerts ({alertsData.length})</span>
              </motion.button>
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="live" className="bg-slate-800">Live</option>
              <option value="today" className="bg-slate-800">Today</option>
              <option value="week" className="bg-slate-800">This Week</option>
              <option value="month" className="bg-slate-800">This Month</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FaSync className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-4 mb-6"
        >
          {energyStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`text-${stat.color}-400 text-xl`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  stat.trend === "up" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                }`}>
                  {stat.trend === "up" ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/50 text-xs">{stat.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Line Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Energy Consumption</h3>
                <p className="text-white/60 text-sm">Today's usage pattern</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">Live</span>
              </div>
            </div>
            <div className="h-64">
              <Line data={consumptionData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Site Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Site Details</h3>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full px-4 py-2 mb-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(sitesData).map(([key, site]) => (
                <option key={key} value={key} className="bg-slate-800">
                  {site.name}
                </option>
              ))}
            </select>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/60 text-sm mb-1">Inverter Number</p>
                <p className="text-white font-bold text-lg">{sitesData[selectedSite as keyof typeof sitesData].inverterNumber}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/60 text-sm mb-1">Active Power</p>
                <p className="text-emerald-400 font-bold text-lg">{sitesData[selectedSite as keyof typeof sitesData].activePower}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/60 text-sm mb-1">Power Factor</p>
                <p className="text-cyan-400 font-bold text-lg">{sitesData[selectedSite as keyof typeof sitesData].powerFactor}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/60 text-sm mb-1">Frequency</p>
                <p className="text-blue-400 font-bold text-lg">{sitesData[selectedSite as keyof typeof sitesData].frequency}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activity & Quick Actions */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${activity.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <activity.icon className={`text-${activity.color}-400`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{activity.action}</p>
                      <p className="text-sm text-white/50">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{activity.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === "completed" 
                        ? "bg-emerald-500/20 text-emerald-300" 
                        : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/energy-consumption")}
                className="p-4 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl text-left hover:shadow-lg transition-all"
              >
                <FaChartBar className="text-2xl mb-2" />
                <p className="font-semibold">Analytics</p>
                <p className="text-xs opacity-80">View details</p>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/purchases")}
                className="p-4 bg-gradient-to-br from-emerald-600 to-green-600 text-white rounded-xl text-left hover:shadow-lg transition-all"
              >
                <FaShoppingCart className="text-2xl mb-2" />
                <p className="font-semibold">Purchase</p>
                <p className="text-xs opacity-80">Buy energy</p>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/settings")}
                className="p-4 bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-xl text-left hover:shadow-lg transition-all"
              >
                <FaCog className="text-2xl mb-2" />
                <p className="font-semibold">Settings</p>
                <p className="text-xs opacity-80">Configure</p>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl text-left hover:shadow-lg transition-all"
              >
                <FaLightbulb className="text-2xl mb-2" />
                <p className="font-semibold">Tips</p>
                <p className="text-xs opacity-80">Save energy</p>
              </motion.button>
            </div>

            {/* Savings Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl text-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-80">Monthly Savings</p>
                  <p className="text-2xl font-bold">₹2,450</p>
                </div>
                <div className="text-4xl">🎉</div>
              </div>
              <p className="text-xs opacity-80 mt-2">You're doing great! Keep it up.</p>
            </motion.div>
          </motion.div>
        </div>
        </div>
      </div>

      {/* Alerts Panel */}
      {showAlerts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowAlerts(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Alerts & Notifications</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAlerts(false)}
                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center text-red-400"
              >
                ✕
              </motion.button>
            </div>
            <div className="space-y-3">
              {alertsData.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-${alert.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <alert.icon className={`text-${alert.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">{alert.message}</p>
                      <p className="text-white/50 text-sm">{alert.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard

