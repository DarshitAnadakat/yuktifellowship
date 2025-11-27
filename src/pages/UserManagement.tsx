import { Link } from "react-router-dom";
import { FaSignOutAlt, FaBolt, FaSearch, FaBell, FaCog, FaUser, FaExchangeAlt, FaArrowUp, FaArrowDown, FaCheckCircle, FaSpinner, FaTimes, FaCalendar, FaArrowLeft, FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, where, getDocs } from "firebase/firestore";
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
}

interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  units: number;
  pricePerUnit: number;
  totalPrice: number;
  status: "active" | "sold" | "cancelled";
  createdAt: any;
  location?: string;
  energyType?: string;
}

interface UserWallet {
  userId: string;
  balance: number;
  lastUpdated: any;
}

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [walletInfo, setWalletInfo] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all unique users from transactions
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const transactionsSnapshot = await getDocs(collection(db, "energy_transactions"));
        const listingsSnapshot = await getDocs(collection(db, "energy_listings"));
        
        const userMap = new Map<string, User>();
        
        // Extract users from transactions
        transactionsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (!userMap.has(data.buyerId)) {
            userMap.set(data.buyerId, {
              id: data.buyerId,
              name: data.buyerName || "Unknown",
              email: data.buyerEmail,
              phone: data.buyerPhone
            });
          }
          if (!userMap.has(data.sellerId)) {
            userMap.set(data.sellerId, {
              id: data.sellerId,
              name: data.sellerName || "Unknown"
            });
          }
        });
        
        // Extract users from listings
        listingsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (!userMap.has(data.sellerId)) {
            userMap.set(data.sellerId, {
              id: data.sellerId,
              name: data.sellerName || "Unknown"
            });
          }
        });
        
        setUsers(Array.from(userMap.values()));
        setLoading(false);
      } catch (error) {
        console.error("Error loading users:", error);
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Load user-specific data when a user is selected
  useEffect(() => {
    if (!selectedUserId) return;

    // Load user transactions
    const transactionsQuery = query(
      collection(db, "energy_transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const allTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      // Filter transactions for selected user
      const userTransactions = allTransactions.filter(
        t => t.buyerId === selectedUserId || t.sellerId === selectedUserId
      );
      setTransactions(userTransactions);
    });

    // Load user listings
    const listingsQuery = query(
      collection(db, "energy_listings"),
      orderBy("createdAt", "desc")
    );

    const unsubListings = onSnapshot(listingsQuery, (snapshot) => {
      const allListings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      
      // Filter listings for selected user
      const userListings = allListings.filter(l => l.sellerId === selectedUserId);
      setListings(userListings);
    });

    // Load wallet info
    const loadWallet = async () => {
      try {
        const walletSnapshot = await getDocs(
          query(collection(db, "user_wallets"), where("userId", "==", selectedUserId))
        );
        
        if (!walletSnapshot.empty) {
          const walletData = walletSnapshot.docs[0].data() as UserWallet;
          setWalletInfo(walletData);
        } else {
          setWalletInfo(null);
        }
      } catch (error) {
        console.error("Error loading wallet:", error);
      }
    };

    loadWallet();

    return () => {
      unsubTransactions();
      unsubListings();
    };
  }, [selectedUserId]);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = users.find(u => u.id === selectedUserId);

  // Calculate user stats
  const totalPurchases = transactions.filter(t => t.buyerId === selectedUserId && t.status === "completed").length;
  const totalSales = transactions.filter(t => t.sellerId === selectedUserId && t.status === "completed").length;
  const totalSpent = transactions
    .filter(t => t.buyerId === selectedUserId && t.status === "completed")
    .reduce((sum, t) => sum + t.totalPrice, 0);
  const totalEarned = transactions
    .filter(t => t.sellerId === selectedUserId && t.status === "completed")
    .reduce((sum, t) => sum + t.totalPrice, 0);

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
              <h2 className="text-4xl font-bold text-white">User Management</h2>
            </div>
            <p className="text-white/60 ml-16">View user-wise site details and transactions</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* User List Sidebar */}
          <div className="col-span-3">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 h-[calc(100vh-200px)] flex flex-col">
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
              </div>

              <div className="flex-1 overflow-auto space-y-2">
                {loading ? (
                  <div className="text-center py-8">
                    <FaSpinner className="text-3xl text-white/30 mx-auto mb-2 animate-spin" />
                    <p className="text-white/60 text-sm">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <FaUser className="text-3xl text-white/30 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedUserId === user.id
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                          : "bg-white/5 hover:bg-white/10 text-white/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selectedUserId === user.id ? "bg-white/20" : "bg-blue-500/20"
                        }`}>
                          <FaUser className={selectedUserId === user.id ? "text-white" : "text-blue-400"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          {user.email && (
                            <p className="text-xs opacity-70 truncate">{user.email}</p>
                          )}
                          <p className="text-xs opacity-50 font-mono truncate">{user.id.slice(0, 12)}...</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="col-span-9">
            {!selectedUserId ? (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center h-[calc(100vh-200px)] flex items-center justify-center">
                <div>
                  <FaUser className="text-6xl text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-lg">Select a user to view details</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-xl p-4"
                  >
                    <FaWallet className="text-green-400 text-2xl mb-2" />
                    <p className="text-white/60 text-sm">Wallet Balance</p>
                    <p className="text-2xl font-bold text-white">{walletInfo?.balance?.toLocaleString() || 0} kWh</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl border border-white/20 rounded-xl p-4"
                  >
                    <FaArrowDown className="text-blue-400 text-2xl mb-2" />
                    <p className="text-white/60 text-sm">Total Purchases</p>
                    <p className="text-2xl font-bold text-white">{totalPurchases}</p>
                    <p className="text-xs text-white/50">₹{totalSpent.toLocaleString()}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-violet-500/20 to-purple-600/20 backdrop-blur-xl border border-white/20 rounded-xl p-4"
                  >
                    <FaArrowUp className="text-violet-400 text-2xl mb-2" />
                    <p className="text-white/60 text-sm">Total Sales</p>
                    <p className="text-2xl font-bold text-white">{totalSales}</p>
                    <p className="text-xs text-white/50">₹{totalEarned.toLocaleString()}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-xl p-4"
                  >
                    <FaBolt className="text-amber-400 text-2xl mb-2" />
                    <p className="text-white/60 text-sm">Active Listings</p>
                    <p className="text-2xl font-bold text-white">{listings.filter(l => l.status === "active").length}</p>
                  </motion.div>
                </div>

                {/* Tabs */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-medium">
                      Transactions ({transactions.length})
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 font-medium transition-all">
                      Listings ({listings.length})
                    </button>
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-4 max-h-[500px] overflow-auto">
                    {transactions.length === 0 ? (
                      <div className="text-center py-12">
                        <FaExchangeAlt className="text-4xl text-white/30 mx-auto mb-4" />
                        <p className="text-white/60">No transactions found for this user</p>
                      </div>
                    ) : (
                      transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                transaction.buyerId === selectedUserId
                                  ? "bg-red-500/20"
                                  : "bg-green-500/20"
                              }`}>
                                {transaction.buyerId === selectedUserId ? (
                                  <FaArrowDown className="text-red-400 text-xl" />
                                ) : (
                                  <FaArrowUp className="text-green-400 text-xl" />
                                )}
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {transaction.buyerId === selectedUserId ? "Purchase" : "Sale"}
                                </p>
                                <p className="text-white/60 text-sm">
                                  {transaction.buyerId === selectedUserId 
                                    ? `From: ${transaction.sellerName}`
                                    : `To: ${transaction.buyerName}`
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-white">₹{transaction.totalPrice.toLocaleString()}</p>
                              <p className="text-white/60 text-sm">{transaction.units} kWh</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium mt-1 ${
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
                          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
                            <div>
                              <p className="text-white/60 text-xs">Price per kWh</p>
                              <p className="text-white text-sm">₹{transaction.pricePerUnit}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs">Date</p>
                              <p className="text-white text-sm">
                                {transaction.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs">Transaction ID</p>
                              <p className="text-white text-xs font-mono">{transaction.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
