"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FaBolt, FaUser, FaBriefcase, FaCheckCircle } from "react-icons/fa"

const ProfileSetupContact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    alternatePhone: "",
    alternateEmail: ""
  })
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const designations = ["CEO", "Director", "Manager", "Executive", "Other"]
  const departments = ["Administration", "Operations", "Finance", "Technical", "Other"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/profile-setup-kyc")
  }

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 2:
        return formData.designation && formData.department
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Enter phone number"
                maxLength={10}
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
              >
                <option value="" className="bg-slate-800">Select designation</option>
                {designations.map(designation => (
                  <option key={designation} value={designation} className="bg-slate-800">{designation}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
              >
                <option value="" className="bg-slate-800">Select department</option>
                {departments.map(department => (
                  <option key={department} value={department} className="bg-slate-800">{department}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Alternate Phone (Optional)</label>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Enter alternate phone number"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Alternate Email (Optional)</label>
              <input
                type="email"
                name="alternateEmail"
                value={formData.alternateEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Enter alternate email"
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48 animate-pulse blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full -bottom-60 -right-60 animate-pulse delay-700 blur-3xl"></div>
        <div className="absolute w-80 h-80 bg-white/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000 blur-3xl"></div>
      </div>

      {/* Left Side - Progress */}
      <div className="hidden lg:flex lg:w-1/3 relative z-10 items-center justify-center p-12">
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
          
          <h1 className="text-4xl font-bold mb-4">Contact Details</h1>
          <p className="text-white/80 mb-8">Set up your contact information for seamless communication</p>

          <div className="space-y-4">
            {[
              { icon: <FaUser />, label: "Personal Information", completed: isStepComplete(1) },
              { icon: <FaBriefcase />, label: "Professional Details", completed: isStepComplete(2) }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  step === i + 1 ? 'bg-white/20' : 'bg-white/5'
                } transition-all`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                  item.completed ? 'bg-green-400 text-white' : 'bg-white/10 text-white/70'
                }`}>
                  {item.completed ? <FaCheckCircle /> : item.icon}
                </div>
                <span className="text-lg">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {step === 1 ? 'Personal Information' : 'Professional Details'}
              </h2>
              <p className="text-white/70">Step {step} of 2</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 2) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                ></motion.div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {renderStep()}
              </motion.div>

              <div className="flex justify-between mt-8 gap-4">
                <button
                  type="button"
                  onClick={() => step === 1 ? navigate(-1) : setStep(1)}
                  className="px-6 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  ← Back
                </button>
                
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isStepComplete(step)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepComplete(step)}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Complete Setup →
                  </button>
                )}
              </div>
            </form>
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

export default ProfileSetupContact

