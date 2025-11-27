import { Link } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt, FaBolt, FaChartLine, FaChartBar, FaLeaf, FaCog, FaBug, FaExpand, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

const KPIsDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const kpis = [
    {
      title: "Demand Forecasting Accuracy",
      value: "94.5%",
      trend: "+2.3%",
      icon: FaChartLine,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-blue-600/20",
      category: "forecasting",
    },
    {
      title: "Mean Absolute Percentage Error",
      value: "3.2%",
      trend: "-0.5%",
      icon: FaChartBar,
      color: "text-emerald-400",
      bgColor: "from-emerald-500/20 to-emerald-600/20",
      category: "forecasting",
    },
    {
      title: "Load Balancing Efficiency",
      value: "98.7%",
      trend: "+1.2%",
      icon: FaBolt,
      color: "text-cyan-400",
      bgColor: "from-cyan-500/20 to-cyan-600/20",
      category: "efficiency",
    },
    {
      title: "Peak Load Reduction",
      value: "15.3%",
      trend: "+3.1%",
      icon: FaChartLine,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-blue-600/20",
      category: "efficiency",
    },
    {
      title: "Demand Response Activation Rate",
      value: "92.4%",
      trend: "+1.8%",
      icon: FaBolt,
      color: "text-orange-400",
      bgColor: "from-orange-500/20 to-orange-600/20",
      category: "response",
    },
    {
      title: "Energy Consumption Reduction",
      value: "18.6%",
      trend: "+2.7%",
      icon: FaLeaf,
      color: "text-emerald-400",
      bgColor: "from-emerald-500/20 to-emerald-600/20",
      category: "sustainability",
    },
    {
      title: "Grid Stability Index",
      value: "96.8%",
      trend: "+1.5%",
      icon: FaBolt,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-blue-600/20",
      category: "stability",
    },
    {
      title: "Renewable Energy Utilization Rate",
      value: "85.2%",
      trend: "+4.2%",
      icon: FaLeaf,
      color: "text-emerald-400",
      bgColor: "from-emerald-500/20 to-emerald-600/20",
      category: "sustainability",
    },
    {
      title: "AI Model Training Time",
      value: "2.3h",
      trend: "-0.5h",
      icon: FaCog,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-blue-600/20",
      category: "ai",
    },
    {
      title: "Fault Detection Codes",
      value: "12",
      trend: "-3",
      icon: FaBug,
      color: "text-red-400",
      bgColor: "from-red-500/20 to-red-600/20",
      category: "maintenance",
    },
  ];

  const filteredKpis = selectedCategory === "all" 
    ? kpis 
    : kpis.filter(kpi => kpi.category === selectedCategory);

  const categories = [
    { id: "all", label: "All Metrics" },
    { id: "forecasting", label: "Forecasting" },
    { id: "efficiency", label: "Efficiency" },
    { id: "sustainability", label: "Sustainability" },
    { id: "stability", label: "Stability" },
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
          <Link to="/admin/ecosystem">
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
          <Link to="/admin">
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
        {/* Tabs & Filter */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Link to="/admin/ecosystem">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-xl font-medium text-white/70 hover:bg-white/10 transition-all"
                >
                  Ecosystem View
                </motion.button>
              </Link>
              <Link to="/admin/kpis">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                >
                  KPI Analytics
                </motion.button>
              </Link>
              <Link to="/admin/trends">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-xl font-medium text-white/70 hover:bg-white/10 transition-all"
                >
                  Trend Analysis
                </motion.button>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <FaFilter className="text-white/70" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-800">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* KPIs Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredKpis.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${kpi.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <kpi.icon className={`${kpi.color} text-2xl`} />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <FaExpand className="text-white/70 text-sm" />
                </motion.button>
              </div>
              
              <h3 className="text-white/90 font-medium mb-3 text-sm">{kpi.title}</h3>
              
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-white">{kpi.value}</span>
                <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                  kpi.trend.startsWith('+') || kpi.trend.startsWith('-') && parseFloat(kpi.trend) < 0
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {kpi.trend}
                </span>
              </div>
              
              <div className="text-xs text-white/50">vs last period</div>
              
              {/* Progress Bar */}
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${parseFloat(kpi.value)}%` }}
                  transition={{ delay: 0.3 + (index * 0.1), duration: 1 }}
                  className={`h-full bg-gradient-to-r ${kpi.bgColor.replace('/20', '/80').replace('/20', '/60')}`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Average Performance", value: "94.2%", color: "blue" },
            { label: "Metrics Improving", value: "8/10", color: "emerald" },
            { label: "Critical Alerts", value: "0", color: "red" },
            { label: "System Health", value: "Excellent", color: "cyan" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
            >
              <div className="text-white/60 text-sm mb-1">{stat.label}</div>
              <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default KPIsDashboard;
