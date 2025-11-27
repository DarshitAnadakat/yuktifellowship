import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaBolt, FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaRocket, FaChartLine } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/admin/dashboard");
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      username: !formData.username ? "Email is required" : "",
      password: !formData.password ? "Password is required" : formData.password.length < 6 ? "Password must be at least 6 characters" : "",
      general: "",
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(error => error)) {
      setIsLoading(true);
      try {
        await login(formData.username, formData.password);
        navigate("/admin/dashboard");
      } catch (error: any) {
        setErrors(prev => ({ 
          ...prev, 
          general: error.code === "auth/invalid-credential" 
            ? "Invalid email or password" 
            : "Login failed. Please try again." 
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const features = [
    { icon: <FaBolt />, text: "Real-time Energy Monitoring" },
    { icon: <FaChartLine />, text: "Advanced Analytics Dashboard" },
    { icon: <FaShieldAlt />, text: "Enterprise-grade Security" },
    { icon: <FaRocket />, text: "Lightning Fast Performance" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full -top-48 -left-48 animate-pulse blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/20 rounded-full -bottom-60 -right-60 animate-pulse delay-700 blur-3xl"></div>
        <div className="absolute w-80 h-80 bg-blue-500/10 rounded-full top-1/3 left-1/3 animate-pulse delay-1000 blur-3xl"></div>
        <div className="absolute w-64 h-64 bg-cyan-500/10 rounded-full bottom-1/4 right-1/4 animate-pulse delay-500 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white space-y-8 hidden lg:block"
        >
          <div className="space-y-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6"
            >
              <FaBolt className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-6xl font-bold leading-tight">
              Welcome to<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                PowerNetPro
              </span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-lg">
              Your comprehensive energy management platform with intelligent monitoring, predictive analytics, and seamless control.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all group"
              >
                <div className="text-3xl text-blue-400 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <span className="text-lg">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-8 pt-8">
            <div>
              <div className="text-4xl font-bold">1000+</div>
              <div className="text-white/60">Active Installations</div>
            </div>
            <div className="h-16 w-px bg-white/20"></div>
            <div>
              <div className="text-4xl font-bold">99.9%</div>
              <div className="text-white/60">Uptime</div>
            </div>
            <div className="h-16 w-px bg-white/20"></div>
            <div>
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-white/60">Support</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Enhanced Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <FaBolt className="text-white text-2xl" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-white/70">Access your command center</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                    <FaUser />
                  </div>
                  <input
                    type="email"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-3 bg-white/20 border ${
                      errors.username ? 'border-rose-500' : 'border-white/30'
                    } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm`}
                  />
                </div>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-300 text-sm mt-2 flex items-center gap-1"
                  >
                    ⚠️ {errors.username}
                  </motion.p>
                )}
              </motion.div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-500/20 border border-rose-500/50 rounded-xl p-3 text-rose-300 text-sm"
                >
                  ⚠️ {errors.general}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 py-3 bg-white/20 border ${
                      errors.password ? 'border-rose-500' : 'border-white/30'
                    } rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-300 text-sm mt-2 flex items-center gap-1"
                  >
                    ⚠️ {errors.password}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 bg-white/20 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot Password?
                </a>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">Sign In to Dashboard</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 space-y-4"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/60">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['Google', 'GitHub', 'Microsoft'].map((provider, i) => (
                  <motion.button
                    key={provider}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + (i * 0.1) }}
                    className="py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all text-sm"
                  >
                    {provider}
                  </motion.button>
                ))}
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-white/70">
                  Don't have an account?{" "}
                  <a href="#" className="text-violet-300 hover:text-violet-200 font-medium transition-colors">
                    Request Access
                  </a>
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 text-sm text-white/60">
                <a href="#" className="hover:text-white transition-colors">Support</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <span>•</span>
                <Link to="/admin" className="hover:text-white transition-colors">Home</Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
