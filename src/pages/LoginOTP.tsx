"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FaBolt, FaShieldAlt, FaCheckCircle } from "react-icons/fa"

const LoginOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(30)
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    navigate("/profile-setup-org")
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setTimeLeft(30)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsResending(false)
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOTP = [...otp]
    newOTP[index] = value
    setOtp(newOTP)

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`) as HTMLInputElement
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`) as HTMLInputElement
      if (prevInput) prevInput.focus()
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48 animate-pulse blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full -bottom-60 -right-60 animate-pulse delay-700 blur-3xl"></div>
        <div className="absolute w-80 h-80 bg-white/5 rounded-full top-1/3 left-1/3 animate-pulse delay-1000 blur-3xl"></div>
      </div>

      {/* Left Side - Info */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg text-white"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center shadow-2xl mb-8"
          >
            <FaBolt className="text-white text-3xl" />
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4">
            Secure <span className="text-cyan-300">Verification</span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            We've sent a 6-digit verification code to your registered email address to ensure account security.
          </p>

          <div className="space-y-4">
            {[
              { icon: <FaShieldAlt />, text: "256-bit Encryption" },
              { icon: <FaCheckCircle />, text: "Multi-factor Authentication" },
              { icon: <FaBolt />, text: "Instant Verification" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-cyan-300 text-xl">
                  {item.icon}
                </div>
                <span className="text-lg">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <FaShieldAlt className="text-white text-2xl" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Verify Code</h2>
              <p className="text-white/70">Enter the 6-digit code sent to your email</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + (index * 0.05) }}
                    type="text"
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                    maxLength={1}
                  />
                ))}
              </div>

              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-white/70">
                    Resend code in <span className="font-bold text-cyan-300">{timeLeft}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-sm text-cyan-300 hover:text-cyan-200 font-medium transition-colors disabled:opacity-50"
                  >
                    {isResending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin"></span>
                        Resending...
                      </span>
                    ) : (
                      "Resend Code"
                    )}
                  </button>
                )}
              </div>

              <button 
                type="submit" 
                disabled={otp.some(digit => !digit) || isVerifying}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-3 border-violet-600 border-t-transparent rounded-full animate-spin"></span>
                    Verifying...
                  </span>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate(-1)}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                ← Back to Login
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/50">
                Didn't receive the code? Check your spam folder
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginOTP

