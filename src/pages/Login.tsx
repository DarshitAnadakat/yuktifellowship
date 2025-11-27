"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BoltIcon } from "../components/Icons"
import { signInUser, signUpUser } from "../services/authService"
import { useAuth } from "../contexts/AuthContext"
import { useAlert } from "../contexts/AlertContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const { currentUser } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard")
    }
  }, [currentUser, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      let result
      if (isSignUp) {
        result = await signUpUser(email, password)
        if (result.success) {
          showAlert("Account created! Please check your email for verification.", "success")
          // Navigate to profile setup
          navigate("/profile-setup-org")
        } else {
          showAlert(result.error || "Sign up failed", "error")
        }
      } else {
        result = await signInUser(email, password)
        if (result.success) {
          showAlert("Login successful!", "success")
          // Check if profile is complete
          navigate("/dashboard")
        } else {
          showAlert(result.error || "Login failed", "error")
        }
      }
    } catch (error: any) {
      showAlert(error.message || "An error occurred", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48 animate-pulse blur-3xl"></div>
        <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full -bottom-60 -right-60 animate-pulse delay-700 blur-3xl"></div>
        <div className="absolute w-72 h-72 bg-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000 blur-3xl"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center shadow-2xl">
              <BoltIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">PowerNetPro</h1>
              <p className="text-white/80 mt-1">Smart Energy Management</p>
            </div>
          </div>
          <p className="text-white/90 text-lg leading-relaxed mb-8">
            Experience the future of energy management with real-time monitoring, intelligent analytics, and seamless control at your fingertips.
          </p>
          <div className="space-y-4">
            {["Real-time Monitoring", "Advanced Analytics", "Cost Optimization", "Carbon Tracking"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  ✓
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white/70">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/30 bg-white/20 text-blue-600 focus:ring-white/50" />
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                disabled={isProcessing || !email || !password}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </span>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                  onClick={() => setIsSignUp(!isSignUp)} 
                  className="text-white font-medium hover:underline transition-all"
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center gap-4 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

