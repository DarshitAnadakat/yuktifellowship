import { Link } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt, FaChartLine, FaChartArea, FaBolt, FaArrowUp, FaArrowDown, FaCalendar, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

const TrendsDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("energy");

  const trendData = [
    {
      id: "energy",
      title: "Energy Consumption Trend",
      value: "2,547 kWh",
      change: "+12.5%",
      trend: "up",
      period: "vs last week",
      icon: FaBolt,
      color: "blue",
      data: [65, 72, 68, 75, 80, 78, 85],
    },
    {
      id: "demand",
      title: "Peak Demand Pattern",
      value: "453 kW",
      change: "-8.3%",
      trend: "down",
      period: "vs last week",
      icon: FaChartLine,
      color: "emerald",
      data: [55, 58, 52, 48, 45, 42, 40],
    },
    {
      id: "efficiency",
      title: "Grid Efficiency",
      value: "94.7%",
      change: "+3.2%",
      trend: "up",
      period: "vs last week",
      icon: FaChartArea,
      color: "cyan",
      data: [88, 89, 90, 92, 93, 94, 95],
    },
  ];

  const timeRanges = [
    { id: "24h", label: "24 Hours" },
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
  ];

  const insights = [
    {
      title: "Peak Usage Hours",
      description: "Highest consumption between 6 PM - 9 PM",
      impact: "High",
      color: "orange",
    },
    {
      title: "Efficiency Improvement",
      description: "Grid efficiency increased by 3.2% this week",
      impact: "Positive",
      color: "emerald",
    },
    {
      title: "Cost Optimization",
      description: "Potential savings of ₹12,500 identified",
      impact: "Medium",
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -top-48 -left-48 animate-pulse blur-3xl"></div>
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full -bottom-60 -right-60 animate-pulse delay-700 blur-3xl"></div>
      </div>

      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/ecosystem">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <FaArrowLeft className="text-white text-lg" />
            </motion.button>
          </Link>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center"
          >
          <FaBolt className="text-white text-xl" />
        </motion.div>
          <h1 className="text-2xl font-bold text-white">PowerNetPro</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2">
            <span className="text-white/70 text-sm">Energy Generated:</span>
            <span className="text-emerald-400 font-bold">100 kWh</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2">
            <span className="text-white/70 text-sm">Energy Exported:</span>
            <span className="text-blue-400 font-bold">90 kWh</span>
          </div>
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white flex items-center gap-2"
            >
              <FaSignOutAlt />
              Sign Out
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-6 relative z-10">
        {/* Tabs & Time Range */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Link to="/ecosystem">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-xl font-medium text-white/70 hover:bg-white/10 transition-all"
                >
                  Ecosystem View
                </motion.button>
              </Link>
              <Link to="/kpis">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-xl font-medium text-white/70 hover:bg-white/10 transition-all"
                >
                  KPI Analytics
                </motion.button>
              </Link>
              <Link to="/trends">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                >
                  Trend Analysis
                </motion.button>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <FaCalendar className="text-white/70" />
              {timeRanges.map((range) => (
                <motion.button
                  key={range.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range.id
                      ? "bg-white/20 text-white"
                      : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  {range.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trend Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        >
          {trendData.map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setSelectedMetric(trend.id)}
              className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all ${
                selectedMetric === trend.id
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br from-${trend.color}-500/20 to-${trend.color}-600/20 rounded-xl flex items-center justify-center`}>
                  <trend.icon className={`text-${trend.color}-400 text-xl`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  trend.trend === "up"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
                }`}>
                  {trend.trend === "up" ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                  <span className="text-sm font-semibold">{trend.change}</span>
                </div>
              </div>
              
              <h3 className="text-white/90 font-medium mb-2 text-sm">{trend.title}</h3>
              <div className="text-3xl font-bold text-white mb-1">{trend.value}</div>
              <div className="text-xs text-white/50">{trend.period}</div>

              {/* Mini Chart */}
              <div className="mt-4 flex items-end gap-1 h-12">
                {trend.data.map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: 0.3 + (i * 0.05), duration: 0.4 }}
                    className={`flex-1 bg-gradient-to-t from-${trend.color}-500/50 to-${trend.color}-400/30 rounded-t`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Chart Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Detailed Trend Analysis</h2>
            <div className="flex items-center gap-2">
              <FaFilter className="text-white/70" />
              <select className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm">
                <option value="energy" className="bg-slate-800">Energy Consumption</option>
                <option value="demand" className="bg-slate-800">Peak Demand</option>
                <option value="efficiency" className="bg-slate-800">Grid Efficiency</option>
                <option value="cost" className="bg-slate-800">Cost Analysis</option>
              </select>
            </div>
          </div>

          {/* Large Chart Placeholder */}
          <div className="relative h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl overflow-hidden flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <FaChartArea className="text-white/20 text-8xl mb-4" />
              <p className="text-white/60 text-lg font-medium">Advanced Chart Visualization</p>
              <p className="text-white/40 text-sm mt-2">Real-time trend data will be displayed here</p>
            </div>
          </div>
        </motion.div>

        {/* Insights Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + (index * 0.1) }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold">{insight.title}</h3>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-${insight.color}-500/20 text-${insight.color}-300`}>
                  {insight.impact}
                </span>
              </div>
              <p className="text-white/60 text-sm">{insight.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrendsDashboard;
