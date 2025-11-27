"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FaBolt, FaHome, FaShoppingCart, FaCog, FaSignOutAlt,
  FaExchangeAlt, FaStore, FaMoneyBillWave, FaHistory, FaUser,
  FaCheckCircle, FaSpinner, FaTimes,
  FaArrowUp, FaArrowDown, FaSearch
} from "react-icons/fa"
import { BoltIcon } from "../components/Icons"
import { signOutUser } from "../services/authService"
import { useAuth } from "../contexts/AuthContext"
import { useAlert } from "../contexts/AlertContext"
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  setDoc
} from "firebase/firestore"
import { db } from "../config/firebase"

interface Listing {
  id: string
  sellerId: string
  sellerName: string
  units: number
  pricePerUnit: number
  totalPrice: number
  status: "active" | "sold" | "cancelled"
  createdAt: any
  location?: string
  energyType?: string
}

interface Transaction {
  id: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  units: number
  pricePerUnit: number
  totalPrice: number
  status: "pending" | "completed" | "failed"
  createdAt: any
  completedAt?: any
}

const P2PMarket = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { showAlert } = useAlert()
  const [activeTab, setActiveTab] = useState<"marketplace" | "sell" | "history">("marketplace")
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showSellModal, setShowSellModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [walletBalance, setWalletBalance] = useState<number>(1000)

  // Sidebar navigation
  const sidebarItems = [
    { icon: FaHome, label: "Dashboard", path: "/dashboard", active: false },
    { icon: FaBolt, label: "Energy", path: "/energy-consumption", active: false },
    { icon: FaExchangeAlt, label: "P2P Market", path: "/p2p-market", active: true },
    { icon: FaShoppingCart, label: "Purchases", path: "/purchases", active: false },
    { icon: FaCog, label: "Settings", path: "/settings", active: false }
  ]

  // Buy form state
  const [buyForm, setBuyForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    units: 0,
    address: ""
  })

  // Sell form state
  const [sellForm, setSellForm] = useState({
    sellerName: "",
    units: 0,
    pricePerUnit: 0,
    location: "",
    energyType: "solar",
    description: ""
  })

  // Load listings from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "energy_listings"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[]
      setListings(listingsData)
    }, (error) => {
      console.error("Error loading listings:", error)
    })

    return () => unsubscribe()
  }, [])

  // Load transactions from Firestore
  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, "energy_transactions"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[]
      
      // Filter transactions for current user
      const userTransactions = transactionsData.filter(
        t => t.buyerId === currentUser.uid || t.sellerId === currentUser.uid
      )
      setTransactions(userTransactions)
    }, (error) => {
      console.error("Error loading transactions:", error)
    })

    return () => unsubscribe()
  }, [currentUser])

  // Load and initialize wallet balance
  useEffect(() => {
    if (!currentUser) return

    const walletRef = doc(db, "user_wallets", currentUser.uid)

    const unsubscribe = onSnapshot(walletRef, async (docSnap) => {
      if (docSnap.exists()) {
        // Wallet exists, load balance
        setWalletBalance(docSnap.data().balance || 1000)
      } else {
        // Create new wallet with default balance
        try {
          await setDoc(walletRef, {
            userId: currentUser.uid,
            balance: 1000,
            lastUpdated: serverTimestamp()
          })
          setWalletBalance(1000)
        } catch (error) {
          console.error("Error creating wallet:", error)
          setWalletBalance(1000)
        }
      }
    })

    return () => unsubscribe()
  }, [currentUser])

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedListing || !currentUser) return

    const totalUnits = buyForm.units

    try {
      // Create transaction
      await addDoc(collection(db, "energy_transactions"), {
        buyerId: currentUser.uid,
        buyerName: buyForm.buyerName,
        buyerEmail: buyForm.buyerEmail,
        buyerPhone: buyForm.buyerPhone,
        buyerAddress: buyForm.address,
        sellerId: selectedListing.sellerId,
        sellerName: selectedListing.sellerName,
        units: buyForm.units,
        pricePerUnit: selectedListing.pricePerUnit,
        totalPrice: buyForm.units * selectedListing.pricePerUnit,
        status: "completed",
        listingId: selectedListing.id,
        createdAt: serverTimestamp(),
        completedAt: serverTimestamp()
      })

      // Update listing status to sold
      const listingRef = doc(db, "energy_listings", selectedListing.id)
      await updateDoc(listingRef, {
        status: "sold",
        soldAt: serverTimestamp(),
        buyerId: currentUser.uid
      })

      // Update buyer wallet - ADD units (buyer receives energy)
      const buyerWalletRef = doc(db, "user_wallets", currentUser.uid)
      await updateDoc(buyerWalletRef, {
        balance: walletBalance + totalUnits,
        lastUpdated: serverTimestamp()
      })

      showAlert("Purchase successful! Transaction completed.", "success")
      setShowBuyModal(false)
      setBuyForm({
        buyerName: "",
        buyerEmail: "",
        buyerPhone: "",
        units: 0,
        address: ""
      })
      setSelectedListing(null)
    } catch (error) {
      console.error("Purchase error:", error)
      showAlert("Failed to complete purchase. Please try again.", "error")
    }
  }

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    // Check if user has sufficient units to sell
    if (walletBalance < sellForm.units) {
      showAlert(`Insufficient energy credits! You need ${sellForm.units} kWh but only have ${walletBalance} kWh`, "error")
      return
    }

    try {
      // Create listing
      await addDoc(collection(db, "energy_listings"), {
        sellerId: currentUser.uid,
        sellerName: sellForm.sellerName,
        units: sellForm.units,
        pricePerUnit: sellForm.pricePerUnit,
        totalPrice: sellForm.units * sellForm.pricePerUnit,
        location: sellForm.location,
        energyType: sellForm.energyType,
        description: sellForm.description,
        status: "active",
        createdAt: serverTimestamp()
      })

      // Deduct units from seller's wallet (they're offering energy for sale)
      const sellerWalletRef = doc(db, "user_wallets", currentUser.uid)
      await updateDoc(sellerWalletRef, {
        balance: walletBalance - sellForm.units,
        lastUpdated: serverTimestamp()
      })

      showAlert("Listing created successfully! Units deducted from your wallet.", "success")
      setShowSellModal(false)
      setSellForm({
        sellerName: "",
        units: 0,
        pricePerUnit: 0,
        location: "",
        energyType: "solar",
        description: ""
      })
    } catch (error) {
      console.error("Listing error:", error)
      showAlert("Failed to create listing. Please try again.", "error")
    }
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.energyType?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch && listing.status === "active"
  })

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full -top-48 -left-48 animate-pulse blur-3xl"></div>
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full -bottom-60 -right-60 animate-pulse delay-700 blur-3xl"></div>
      </div>

      {/* Top Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-20 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 relative z-20"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <BoltIcon className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">PowerNetPro</h1>
            <p className="text-xs text-white/60">P2P Energy Market</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Wallet Balance */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 rounded-xl px-6 py-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <FaBolt className="text-white text-lg" />
            </div>
            <div>
              <p className="text-white/60 text-xs">Energy Credits</p>
              <p className="text-white font-bold text-lg">{walletBalance.toLocaleString()} kWh</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              const result = await signOutUser();
              if (result.success) {
                navigate("/");
              }
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-20 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 gap-8 relative z-10"
        >
          <div className="flex-1 flex flex-col gap-4">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  item.active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
                title={item.label}
              >
                <item.icon className="text-xl" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto relative z-10">
          {/* Page Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Peer-to-Peer Energy Market</h1>
            <p className="text-white/70">Trade energy units directly with other users</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("marketplace")}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === "marketplace"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              <FaStore />
              Marketplace
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("sell")}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === "sell"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              <FaMoneyBillWave />
              Sell Energy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              <FaHistory />
              Transaction History
            </motion.button>
          </div>

          {/* Marketplace Tab */}
          {activeTab === "marketplace" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search by seller or energy type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{listing.units} kWh</h3>
                        <p className="text-white/60 text-sm">{listing.energyType || "Solar"}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <FaBolt className="text-blue-400 text-xl" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-white/70">
                        <FaUser className="text-sm" />
                        <span className="text-sm">{listing.sellerName}</span>
                      </div>
                      {listing.location && (
                        <div className="flex items-center gap-2 text-white/70">
                          <FaBolt className="text-sm" />
                          <span className="text-sm">{listing.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-4 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Price per kWh</span>
                        <span className="text-2xl font-bold text-white">₹{listing.pricePerUnit}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white/70">Total Price</span>
                        <span className="text-lg font-semibold text-green-400">₹{listing.totalPrice}</span>
                      </div>
                    </div>

                    {listing.sellerId === currentUser?.uid ? (
                      <div className="w-full py-3 bg-white/10 border border-white/20 text-white/50 rounded-xl font-medium text-center">
                        Your Listing
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedListing(listing)
                          setBuyForm({ ...buyForm, units: listing.units })
                          setShowBuyModal(true)
                        }}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        Buy Now
                      </motion.button>
                    )}
                  </motion.div>
                ))}

                {filteredListings.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FaStore className="text-6xl text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">No active listings available</p>
                    <p className="text-white/40 text-sm mt-2">
                      Note: Your own listings appear in the "Sell Energy" tab
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Sell Tab */}
          {activeTab === "sell" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Create Energy Listing</h2>
                
                <button
                  onClick={() => setShowSellModal(true)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FaMoneyBillWave />
                  Create New Listing
                </button>

                {/* User's Active Listings */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Active Listings</h3>
                  <div className="space-y-4">
                    {listings
                      .filter(l => l.sellerId === currentUser?.uid && l.status === "active")
                      .map((listing) => (
                        <div
                          key={listing.id}
                          className="bg-white/5 border border-white/10 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{listing.units} kWh</p>
                              <p className="text-white/60 text-sm">₹{listing.pricePerUnit}/kWh</p>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-semibold">₹{listing.totalPrice}</p>
                              <p className="text-white/60 text-sm">Active</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {listings.filter(l => l.sellerId === currentUser?.uid && l.status === "active").length === 0 && (
                      <div className="text-center py-8 bg-white/5 border border-white/10 rounded-xl">
                        <FaStore className="text-4xl text-white/30 mx-auto mb-2" />
                        <p className="text-white/60">No active listings yet</p>
                        <p className="text-white/40 text-sm mt-1">Create a listing to start selling energy</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Transaction History Tab */}
          {activeTab === "history" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Transactions List */}
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          transaction.buyerId === currentUser?.uid
                            ? "bg-red-500/20"
                            : "bg-green-500/20"
                        }`}>
                          {transaction.buyerId === currentUser?.uid ? (
                            <FaArrowDown className="text-red-400 text-xl" />
                          ) : (
                            <FaArrowUp className="text-green-400 text-xl" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {transaction.buyerId === currentUser?.uid ? "Purchase" : "Sale"}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {transaction.buyerId === currentUser?.uid 
                              ? `From: ${transaction.sellerName}`
                              : `To: ${transaction.buyerName}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">₹{transaction.totalPrice}</p>
                        <p className="text-white/60 text-sm">{transaction.units} kWh</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-white/60 text-sm">Price per kWh</p>
                        <p className="text-white font-medium">₹{transaction.pricePerUnit}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Date</p>
                        <p className="text-white font-medium">
                          {transaction.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Status</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                          transaction.status === "completed" 
                            ? "bg-green-500/20 text-green-400"
                            : transaction.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {transaction.status === "completed" && <FaCheckCircle />}
                          {transaction.status === "pending" && <FaSpinner className="animate-spin" />}
                          {transaction.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Transaction ID</p>
                        <p className="text-white font-mono text-xs">{transaction.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <FaHistory className="text-6xl text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">No transactions yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Buy Modal */}
      <AnimatePresence>
        {showBuyModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowBuyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Purchase Energy</h2>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleBuySubmit} className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={buyForm.buyerName}
                    onChange={(e) => setBuyForm({ ...buyForm, buyerName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={buyForm.buyerEmail}
                    onChange={(e) => setBuyForm({ ...buyForm, buyerEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={buyForm.buyerPhone}
                    onChange={(e) => setBuyForm({ ...buyForm, buyerPhone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Units (kWh) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={selectedListing.units}
                    value={buyForm.units}
                    onChange={(e) => setBuyForm({ ...buyForm, units: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-white/60 text-sm mt-1">Max: {selectedListing.units} kWh</p>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Delivery Address *</label>
                  <textarea
                    required
                    value={buyForm.address}
                    onChange={(e) => setBuyForm({ ...buyForm, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Price per kWh</span>
                    <span className="text-white font-medium">₹{selectedListing.pricePerUnit}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Units</span>
                    <span className="text-white font-medium">{buyForm.units} kWh</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-400">
                      ₹{buyForm.units * selectedListing.pricePerUnit}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Confirm Purchase
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sell Modal */}
      <AnimatePresence>
        {showSellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowSellModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">List Energy for Sale</h2>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSellSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={sellForm.sellerName}
                    onChange={(e) => setSellForm({ ...sellForm, sellerName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Units Available (kWh) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={sellForm.units || ""}
                    onChange={(e) => setSellForm({ ...sellForm, units: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Price per kWh (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    step="0.1"
                    value={sellForm.pricePerUnit || ""}
                    onChange={(e) => setSellForm({ ...sellForm, pricePerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={sellForm.location}
                    onChange={(e) => setSellForm({ ...sellForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Energy Type *</label>
                  <select
                    required
                    value={sellForm.energyType}
                    onChange={(e) => setSellForm({ ...sellForm, energyType: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="solar" className="bg-slate-800">Solar</option>
                    <option value="wind" className="bg-slate-800">Wind</option>
                    <option value="hydro" className="bg-slate-800">Hydro</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Description (Optional)</label>
                  <textarea
                    value={sellForm.description}
                    onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional details about your energy listing..."
                  />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Total Units</span>
                    <span className="text-white font-medium">{sellForm.units} kWh</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Price per kWh</span>
                    <span className="text-white font-medium">₹{sellForm.pricePerUnit}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-white font-semibold">Total Value</span>
                    <span className="text-2xl font-bold text-green-400">
                      ₹{sellForm.units * sellForm.pricePerUnit}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Create Listing
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default P2PMarket
