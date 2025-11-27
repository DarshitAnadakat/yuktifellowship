"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BoltIcon } from "../components/Icons"
import { Line, Bar } from "react-chartjs-2"
import { motion } from "framer-motion"
import { 
  FaBolt, FaChartLine, FaWallet, FaLeaf, FaHome, 
  FaShoppingCart, FaCog, FaSignOutAlt, FaSync, FaArrowUp, 
  FaArrowDown, FaClock, FaSolarPanel, FaFan
} from "react-icons/fa"
import { signOutUser } from "../services/authService"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const EnergyConsumption = () => {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState("week")
  const [compareMode, setCompareMode] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState("consumption")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedSiteForEfficiency, setSelectedSiteForEfficiency] = useState("site1")

  // Sites data
  const sitesData = {
    site1: { name: "Site Alpha", efficiency: [85, 88, 92, 87, 90, 89, 91] },
    site2: { name: "Site Beta", efficiency: [82, 85, 88, 84, 87, 86, 89] },
    site3: { name: "Site Gamma", efficiency: [88, 91, 94, 90, 93, 92, 95] },
    site4: { name: "Site Delta", efficiency: [80, 83, 86, 82, 85, 84, 87] },
    site5: { name: "Site Epsilon", efficiency: [86, 89, 91, 88, 90, 89, 92] }
  }

  // Sidebar navigation items
  const sidebarItems = [
    { icon: FaHome, label: "Dashboard", path: "/dashboard" },
    { icon: FaBolt, label: "Energy", path: "/energy-consumption", active: true },
    { icon: FaShoppingCart, label: "Purchases", path: "/purchases" },
    { icon: FaCog, label: "Settings", path: "/settings" },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  // Sample data - replace with actual data from your API
  const consumptionData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Current Week",
        data: [120, 150, 180, 90, 160, 140, 130],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4
      },
      ...(compareMode ? [{
        label: "Previous Week",
        data: [100, 130, 150, 110, 140, 130, 120],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4
      }] : [])
    ]
  }

  const efficiencyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Energy Efficiency",
      data: sitesData[selectedSiteForEfficiency as keyof typeof sitesData].efficiency,
      backgroundColor: "rgba(34, 197, 94, 0.8)"
    }]
  }

  const metrics = [
    { icon: FaBolt, value: "2,450", unit: "kWh", label: "Total kWh", change: "+5.2%", trend: "up", color: "blue", bgGradient: "from-blue-600 to-cyan-600" },
    { icon: FaLeaf, value: 85, unit: "%", label: "Efficiency", change: "+2.1%", trend: "up", color: "emerald", bgGradient: "from-emerald-600 to-green-600" },
    { icon: FaChartLine, value: "1,890", unit: "W", label: "Peak Usage", change: "-3.4%", trend: "down", color: "cyan", bgGradient: "from-cyan-600 to-blue-600" },
    { icon: FaWallet, value: "₹12,500", unit: "", label: "Cost", change: "+1.8%", trend: "up", color: "amber", bgGradient: "from-amber-600 to-orange-600" }
  ]

  const timeRanges = ["day", "week", "month", "year"]

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          color: "white",
          padding: 15,
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "white" }
      },
      x: {
        grid: { display: false },
        ticks: { color: "white" }
      }
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "white" }
      },
      x: {
        grid: { display: false },
        ticks: { color: "white" }
      }
    }
  }

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
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Energy Consumption</h1>
              <p className="text-white/70">Monitor and analyze your energy usage patterns</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeRanges.map((range) => (
                  <option key={range} value={range} className="bg-slate-800">
                    Last {range.charAt(0).toUpperCase() + range.slice(1)}
                  </option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCompareMode(!compareMode)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  compareMode
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                Compare
              </motion.button>
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

          {/* Metrics Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-4 mb-6"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.bgGradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <metric.icon className="text-white text-xl" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    metric.trend === "up" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                  }`}>
                    {metric.trend === "up" ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                    <span className="text-xs font-semibold">{metric.change}</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-1">{metric.label}</p>
                <h3 className="text-3xl font-bold text-white mb-1">{metric.value}<span className="text-lg text-white/60 ml-1">{metric.unit}</span></h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Consumption Trend Chart */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Consumption Trend</h3>
                  <p className="text-white/60 text-sm">Weekly usage pattern</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMetric("consumption")}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      selectedMetric === "consumption"
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                        : "text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Usage
                  </button>
                  <button
                    onClick={() => setSelectedMetric("cost")}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      selectedMetric === "cost"
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                        : "text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Cost
                  </button>
                </div>
              </div>
              <div className="h-[300px]">
                <Line data={consumptionData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Efficiency Analysis Chart */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Efficiency Analysis</h3>
                  <p className="text-white/60 text-sm">Daily performance metrics</p>
                </div>
                <select
                  value={selectedSiteForEfficiency}
                  onChange={(e) => setSelectedSiteForEfficiency(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(sitesData).map(([key, site]) => (
                    <option key={key} value={key} className="bg-slate-800">
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="h-[300px]">
                <Bar data={efficiencyData} options={barOptions} />
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">AI Recommendations</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: FaClock,
                  title: "Peak Hours Usage",
                  description: "Consider shifting heavy consumption tasks to off-peak hours for better rates",
                  saving: "Potential saving: ₹1,200/month",
                  color: "blue"
                },
                {
                  icon: FaFan,
                  title: "Equipment Efficiency",
                  description: "Your HVAC system shows signs of reduced efficiency. Schedule maintenance.",
                  saving: "Potential saving: ₹800/month",
                  color: "cyan"
                },
                {
                  icon: FaSolarPanel,
                  title: "Solar Integration",
                  description: "Based on your consumption pattern, solar integration could be beneficial",
                  saving: "Potential saving: ₹2,500/month",
                  color: "emerald"
                }
              ].map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  whileHover={{ y: -5 }}
                  className="p-5 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className={`w-10 h-10 bg-${rec.color}-500/20 rounded-lg flex items-center justify-center mb-3`}>
                    <rec.icon className={`text-${rec.color}-400 text-xl`} />
                  </div>
                  <h4 className="font-semibold text-white mb-2">{rec.title}</h4>
                  <p className="text-sm text-white/60 mb-3">{rec.description}</p>
                  <p className="text-sm text-emerald-400 font-medium">{rec.saving}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EnergyConsumption

