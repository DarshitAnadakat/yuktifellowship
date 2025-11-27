import { Link } from "react-router-dom";
import { FaSignOutAlt, FaBolt, FaSearch, FaBell, FaCog, FaExchangeAlt, FaArrowUp, FaArrowDown, FaCheckCircle, FaSpinner, FaTimes, FaCalendar, FaFilter, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

interface Transaction {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  sellerId: string;
  sellerName: string;
  units: number;
  pricePerUnit: number;
  totalPrice: number;
  status: "pending" | "completed" | "failed";
  createdAt: any;
  completedAt?: any;
  listingId?: string;
}

const TransactionsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Load all transactions from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "energy_transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(transactionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error loading transactions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.buyerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === "completed").length;
  const pendingTransactions = transactions.filter(t => t.status === "pending").length;
  const failedTransactions = transactions.filter(t => t.status === "failed").length;
  const totalUnitsTraded = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.units, 0);
  const totalRevenue = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const stats = [
    { label: "Total Transactions", value: totalTransactions, icon: FaExchangeAlt, color: "blue", change: "All time" },
    { label: "Completed", value: completedTransactions, icon: FaCheckCircle, color: "green", change: `${((completedTransactions / totalTransactions) * 100).toFixed(1)}%` },
    { label: "Total Units Traded", value: `${totalUnitsTraded.toLocaleString()} kWh`, icon: FaBolt, color: "cyan", change: "Energy Credits" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: FaArrowUp, color: "emerald", change: "Marketplace" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center"
          >
            <FaBolt className="text-white text-xl" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">PowerNetPro Admin</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-80 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" />
          </div>
          
          <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors relative">
            <FaBell className="text-white text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <FaCog className="text-white text-xl" />
          </motion.button>

          <Link to="/">
            <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white flex items-center gap-2">
              <FaSignOutAlt /> Sign Out
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-20 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white transition-all"
                >
                  <FaArrowLeft className="text-xl" />
                </motion.button>
              </Link>
              <h2 className="text-4xl font-bold text-white">Transaction Monitor</h2>
            </div>
            <p className="text-white/60 ml-16">Real-time P2P energy transaction tracking</p>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 flex items-center justify-center`}>
                  <stat.icon className={`text-2xl text-${stat.color}-400`} />
                </div>
                <span className="text-sm text-white/60">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterStatus("all")}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              filterStatus === "all"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <FaFilter />
            All ({totalTransactions})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterStatus("completed")}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              filterStatus === "completed"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <FaCheckCircle />
            Completed ({completedTransactions})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterStatus("pending")}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              filterStatus === "pending"
                ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <FaSpinner />
            Pending ({pendingTransactions})
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterStatus("failed")}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              filterStatus === "failed"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <FaTimes />
            Failed ({failedTransactions})
          </motion.button>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="text-6xl text-white/30 mx-auto mb-4 animate-spin" />
              <p className="text-white/60 text-lg">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FaExchangeAlt className="text-6xl text-white/30 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      transaction.status === "completed"
                        ? "bg-green-500/20"
                        : transaction.status === "pending"
                        ? "bg-yellow-500/20"
                        : "bg-red-500/20"
                    }`}>
                      <FaExchangeAlt className={`text-2xl ${
                        transaction.status === "completed"
                          ? "text-green-400"
                          : transaction.status === "pending"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Transaction #{transaction.id.slice(0, 8)}</h3>
                      <p className="text-white/60 text-sm flex items-center gap-2 mt-1">
                        <FaCalendar className="text-xs" />
                        {transaction.createdAt?.toDate?.()?.toLocaleString() || "Recent"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">₹{transaction.totalPrice.toLocaleString()}</p>
                    <p className="text-white/60 text-sm">{transaction.units} kWh</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium mt-2 ${
                      transaction.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : transaction.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {transaction.status === "completed" && <FaCheckCircle />}
                      {transaction.status === "pending" && <FaSpinner className="animate-spin" />}
                      {transaction.status === "failed" && <FaTimes />}
                      {transaction.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-white/60 text-xs mb-1 flex items-center gap-1">
                      <FaArrowDown className="text-red-400" />
                      Buyer
                    </p>
                    <p className="text-white font-medium">{transaction.buyerName}</p>
                    {transaction.buyerEmail && (
                      <p className="text-white/60 text-xs">{transaction.buyerEmail}</p>
                    )}
                    {transaction.buyerPhone && (
                      <p className="text-white/60 text-xs">{transaction.buyerPhone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1 flex items-center gap-1">
                      <FaArrowUp className="text-green-400" />
                      Seller
                    </p>
                    <p className="text-white font-medium">{transaction.sellerName}</p>
                    <p className="text-white/60 text-xs">ID: {transaction.sellerId.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1">Price per kWh</p>
                    <p className="text-white font-medium">₹{transaction.pricePerUnit}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1">Buyer ID</p>
                    <p className="text-white font-mono text-xs">{transaction.buyerId.slice(0, 12)}...</p>
                  </div>
                </div>

                {transaction.buyerAddress && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-white/60 text-xs mb-1">Delivery Address</p>
                    <p className="text-white text-sm">{transaction.buyerAddress}</p>
                  </div>
                )}

                {transaction.completedAt && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-white/60 text-xs">Completed at: {transaction.completedAt?.toDate?.()?.toLocaleString()}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsDashboard;
