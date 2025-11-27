import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBolt, FaChartLine, FaShieldAlt, FaRocket } from "react-icons/fa";

const Welcome = () => {
  const features = [
    { icon: <FaBolt />, title: "Real-time Monitoring", desc: "Track energy flow instantly" },
    { icon: <FaChartLine />, title: "Advanced Analytics", desc: "Deep insights & reports" },
    { icon: <FaShieldAlt />, title: "Secure & Reliable", desc: "Enterprise-grade security" },
    { icon: <FaRocket />, title: "High Performance", desc: "Optimized for speed" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full -top-48 -left-48 animate-pulse blur-3xl"></div>
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 rounded-full -bottom-60 -right-60 animate-pulse delay-700 blur-3xl"></div>
        <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <FaBolt className="text-white text-2xl" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold">PowerNetPro</h1>
              <p className="text-white/70 mt-1">Command Center</p>
            </div>
          </div>

          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Transform your energy infrastructure with intelligent monitoring, predictive analytics, and seamless management.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (i + 1), duration: 0.5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all"
              >
                <div className="text-2xl mb-2 text-blue-400">{feature.icon}</div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-12 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3">Welcome Back</h2>
            <p className="text-white/70">Access your command center</p>
          </div>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all mb-6"
            >
              Enter Dashboard →
            </motion.button>
          </Link>

          <div className="space-y-3 text-sm text-white/60 text-center">
            <p>Trusted by 1000+ energy installations worldwide</p>
            <div className="flex justify-center gap-4 pt-4">
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
