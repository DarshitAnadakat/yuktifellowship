import { Link } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt, FaBolt, FaServer, FaNetworkWired, FaChartArea, FaCog, FaBell, FaDownload, FaExpand } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

const EcosystemDashboard = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("Building 1");
  const [activeTab, setActiveTab] = useState("ecosystem");
  const [selectedMetric, setSelectedMetric] = useState("power");

  const buildings = ["Building 1", "Building 2", "Building 3", "Building 4", "All Buildings"];

  const metrics = [
    { id: "power", label: "Active Power", value: "3.2 MW", change: "+8.5%", trend: "up", color: "emerald" },
    { id: "energy", label: "Energy Generated", value: "125 MWh", change: "+12.3%", trend: "up", color: "blue" },
    { id: "efficiency", label: "System Efficiency", value: "94.2%", change: "+2.1%", trend: "up", color: "violet" },
    { id: "nodes", label: "Active Nodes", value: "24/24", change: "0", trend: "stable", color: "cyan" }
  ];

  const systemData = [
    { label: "Inverters", value: "12", status: "optimal", icon: <FaServer /> },
    { label: "Transformers", value: "6", status: "optimal", icon: <FaNetworkWired /> },
    { label: "Meters", value: "24", status: "optimal", icon: <FaBolt /> },
    { label: "Controllers", value: "8", status: "optimal", icon: <FaCog /> }
  ];

  const powerFlowData = [
    { source: "Solar Array A", output: "850 kW", efficiency: "96%", status: "optimal" },
    { source: "Solar Array B", output: "780 kW", efficiency: "94%", status: "optimal" },
    { source: "Solar Array C", output: "920 kW", efficiency: "95%", status: "optimal" },
    { source: "Wind Turbine 1", output: "450 kW", efficiency: "92%", status: "good" },
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
          <Link to="/dashboard">
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
          <div>
            <h1 className="text-xl font-bold text-white">Energy Ecosystem</h1>
            <p className="text-xs text-white/60">Real-time System Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors relative">
            <FaBell className="text-white text-lg" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <FaDownload className="text-white text-lg" />
          </motion.button>
          <Link to="/">
            <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white flex items-center gap-2">
              <FaSignOutAlt /> Sign Out
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 px-8 pb-8 space-y-6">
        {/* Metrics Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 cursor-pointer ${
                selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-white/70 text-sm">{metric.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  metric.trend === 'up' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white">{metric.value}</div>
              <div className="text-xs text-white/50 mt-1">{metric.id === 'nodes' ? 'All systems operational' : 'vs last hour'}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs & Building Selection */}
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab("ecosystem")}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                activeTab === "ecosystem"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              Ecosystem View
            </motion.button>
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
                className="px-6 py-2 rounded-xl font-medium text-white/70 hover:bg-white/10 transition-all"
              >
                Trend Analysis
              </motion.button>
            </Link>
          </div>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
          >
            {buildings.map((building) => (
              <option key={building} value={building} className="bg-slate-800">
                {building}
              </option>
            ))}
          </select>
        </div>

        {/* System Components Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">System Components</h3>
          <div className="grid grid-cols-4 gap-4">
            {systemData.map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl text-blue-400">{item.icon}</div>
                  <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded-full">
                    {item.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="text-sm text-white/60">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Power Flow Visualization */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Power Flow Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Real-time Power Flow</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <FaExpand className="text-white/70" />
                </button>
                <select className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none">
                  <option>Live</option>
                  <option>1H</option>
                  <option>24H</option>
                </select>
              </div>
            </div>
            <div className="relative h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl overflow-hidden">
              {/* Animated wave effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
                ></motion.div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaChartArea className="text-white/20 text-9xl" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">3.0 MW</div>
                    <div className="text-xs text-white/60">Generation</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">2.8 MW</div>
                    <div className="text-xs text-white/60">Consumption</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">0.2 MW</div>
                    <div className="text-xs text-white/60">Grid Export</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Power Sources List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Power Sources</h3>
            <div className="space-y-3">
              {powerFlowData.map((source, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + (i * 0.1) }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-white">{source.source}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      source.status === 'optimal' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {source.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-white">{source.output}</div>
                      <div className="text-xs text-white/60">Output</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-400">{source.efficiency}</div>
                      <div className="text-xs text-white/60">Efficiency</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Charts Grid */}
        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Energy Distribution</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm">View All →</button>
            </div>
            <div className="relative h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl overflow-hidden flex items-center justify-center">
              <FaNetworkWired className="text-white/20 text-7xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Historical Performance</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm">Analyze →</button>
            </div>
            <div className="relative h-64 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl overflow-hidden flex items-center justify-center">
              <FaChartArea className="text-white/20 text-7xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemDashboard;
