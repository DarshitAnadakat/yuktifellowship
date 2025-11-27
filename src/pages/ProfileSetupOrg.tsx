"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FaBolt, FaBuilding, FaFileAlt, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import { saveOrganizationDetails } from "../services/authService"
import { useAlert } from "../contexts/AlertContext"

const ProfileSetupOrg = () => {
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "",
    industry: "",
    regNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  })
  const [step, setStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { showAlert } = useAlert()

  const orgTypes = ["Private Limited", "Public Limited", "Partnership", "Proprietorship", "Others"]
  const industries = ["Manufacturing", "Energy", "Technology", "Retail", "Others"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      showAlert("Please login first", "error")
      navigate("/")
      return
    }

    setIsSaving(true)
    try {
      const result = await saveOrganizationDetails(currentUser.uid, {
        organizationName: formData.orgName,
        organizationType: formData.orgType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.pincode
      })

      if (result.success) {
        showAlert("Organization details saved successfully!", "success")
        navigate("/profile-setup-contact")
      } else {
        showAlert(result.error || "Failed to save organization details", "error")
      }
    } catch (error: any) {
      showAlert(error.message || "An error occurred", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.orgName && formData.orgType && formData.industry
      case 2:
        return formData.regNumber
      case 3:
        return formData.address && formData.city && formData.state && formData.pincode
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Organization Name</label>
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Enter organization name"
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Organization Type</label>
              <select
                name="orgType"
                value={formData.orgType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
              >
                <option value="" className="bg-slate-800">Select organization type</option>
                {orgTypes.map(type => (
                  <option key={type} value={type} className="bg-slate-800">{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
              >
                <option value="" className="bg-slate-800">Select industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind} className="bg-slate-800">{ind}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Registration Number</label>
              <input
                type="text"
                name="regNumber"
                value={formData.regNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Enter registration number"
              />
              <p className="mt-2 text-sm text-white/60">This could be your GST, CIN, or any other business registration number</p>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Enter complete address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Enter state"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">PIN Code</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Enter PIN code"
                maxLength={6}
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
          
          <h1 className="text-4xl font-bold mb-4">Organization Setup</h1>
          <p className="text-white/80 mb-8">Complete your organization profile to get started</p>

          <div className="space-y-4">
            {[
              { icon: <FaBuilding />, label: "Basic Information", completed: isStepComplete(1) },
              { icon: <FaFileAlt />, label: "Registration Details", completed: isStepComplete(2) },
              { icon: <FaMapMarkerAlt />, label: "Address Information", completed: isStepComplete(3) }
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
                {step === 1 ? 'Organization Details' : step === 2 ? 'Registration' : 'Business Address'}
              </h2>
              <p className="text-white/70">Step {step} of 3</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
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
                  onClick={() => setStep(prev => prev - 1)}
                  className={`px-6 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all ${
                    step === 1 ? 'invisible' : ''
                  }`}
                >
                  ← Back
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev + 1)}
                    disabled={!isStepComplete(step)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepComplete(step) || isSaving}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isSaving ? 'Saving...' : 'Complete Setup →'}
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

export default ProfileSetupOrg

