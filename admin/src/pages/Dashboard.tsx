import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBolt, FaChartLine, FaNetworkWired, FaSearch, FaBell, FaCog, FaServer, FaChartBar, FaUser, FaWallet, FaShoppingCart, FaList } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

interface Site {
  id: string;
  userId: string;
  organizationName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  buyerEmail: string;
  sellerEmail: string;
  unitsTraded: number;
  pricePerUnit: number;
  totalAmount: number;
  status: string;
  createdAt: Timestamp;
}

interface Listing {
  id: string;
  sellerId: string;
  sellerEmail: string;
  units: number;
  pricePerUnit: number;
  status: string;
  createdAt: Timestamp;
}

interface WalletInfo {
  balance: number;
}

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/admin/login");
    }
  }, [currentUser, navigate]);

  // Load all users from transactions and listings
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const transactionsSnapshot = await getDocs(collection(db, "energy_transactions"));
        const listingsSnapshot = await getDocs(collection(db, "energy_listings"));
        const usersSnapshot = await getDocs(collection(db, "users"));
        
        const userMap = new Map<string, User>();
        
        // From transactions
        transactionsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.buyerId && data.buyerEmail) {
            userMap.set(data.buyerId, { id: data.buyerId, email: data.buyerEmail });
          }
          if (data.sellerId && data.sellerEmail) {
            userMap.set(data.sellerId, { id: data.sellerId, email: data.sellerEmail });
          }
        });
        
        // From listings
        listingsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.sellerId && data.sellerEmail) {
            userMap.set(data.sellerId, { id: data.sellerId, email: data.sellerEmail });
          }
        });

        // From users collection (get name and phone)
        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          const existingUser = userMap.get(doc.id);
          if (existingUser) {
            userMap.set(doc.id, {
              ...existingUser,
              name: data.name || data.displayName,
              phone: data.phone || data.phoneNumber
            });
          } else {
            userMap.set(doc.id, {
              id: doc.id,
              email: data.email,
              name: data.name || data.displayName,
              phone: data.phone || data.phoneNumber
            });
          }
        });
        
        setUsers(Array.from(userMap.values()));
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  }, []);

  // Load user-specific data when a user is selected
  useEffect(() => {
    if (!selectedUserId) {
      setTransactions([]);
      setListings([]);
      setWalletInfo(null);
      setSites([]);
      setSelectedSiteId(null);
      return;
    }

    // Real-time listener for transactions
    const transactionsQuery = query(
      collection(db, "energy_transactions")
    );
    const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const userTransactions = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Transaction))
        .filter((t) => t.buyerId === selectedUserId || t.sellerId === selectedUserId);
      setTransactions(userTransactions);
    });

    // Real-time listener for listings
    const listingsQuery = query(
      collection(db, "energy_listings"),
      where("sellerId", "==", selectedUserId)
    );
    const unsubListings = onSnapshot(listingsQuery, (snapshot) => {
      const userListings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Listing));
      setListings(userListings);
    });

    // Real-time listener for wallet
    const walletQuery = query(
      collection(db, "user_wallets"),
      where("userId", "==", selectedUserId)
    );
    const unsubWallet = onSnapshot(walletQuery, (snapshot) => {
      if (!snapshot.empty) {
        const walletData = snapshot.docs[0].data();
        setWalletInfo({ balance: walletData.balance || 0 });
      } else {
        setWalletInfo({ balance: 0 });
      }
    });

    // Load sites for this user
    const loadSites = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const userSites: Site[] = [];
        usersSnapshot.forEach((doc) => {
          if (doc.id === selectedUserId) {
            const data = doc.data();
            if (data.organizationName || data.address) {
              userSites.push({
                id: doc.id,
                userId: doc.id,
                organizationName: data.organizationName,
                address: data.address,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode
              });
            }
          }
        });
        setSites(userSites);
      } catch (error) {
        console.error("Error loading sites:", error);
      }
    };
    loadSites();

    return () => {
      unsubTransactions();
      unsubListings();
      unsubWallet();
    };
  }, [selectedUserId]);

  const installations = [
    {
      id: 1,
      name: "TechPark Alpha",
      location: "Silicon Valley, CA",
      capacity: "750 kW",
      currentLoad: "520 kW",
      efficiency: "94.2%",
      status: "Optimal",
      statusColor: "emerald",
    },
    {
      id: 2,
      name: "Metro Hub Central",
      location: "Downtown, NY",
      capacity: "1200 kW",
      currentLoad: "980 kW",
      efficiency: "91.8%",
      status: "Active",
      statusColor: "blue",
    },
    {
      id: 3,
      name: "Industrial Zone B",
      location: "Texas",
      capacity: "2000 kW",
      currentLoad: "450 kW",
      efficiency: "88.5%",
      status: "Standby",
      statusColor: "amber",
    },
  ];

  const metrics = [
    { label: "Total Output", value: "3.8 MW", icon: FaBolt, color: "violet", change: "+8.2%" },
    { label: "Active Nodes", value: "24", icon: FaNetworkWired, color: "cyan", change: "+3" },
    { label: "Efficiency Rate", value: "92.4%", icon: FaChartLine, color: "emerald", change: "+2.1%" },
    { label: "System Health", value: "98%", icon: FaServer, color: "rose", change: "+0.5%" },
  ];

  const filteredInstallations = installations.filter(inst =>
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
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
          <h1 className="text-2xl font-bold text-white">PowerNetPro</h1>
        </div>        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search installations..."
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

          <motion.button 
            whileHover={{ scale: 1.05 }} 
            onClick={async () => {
              await logout();
              navigate("/admin/login");
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-white flex items-center gap-2"
          >
            <FaSignOutAlt /> Sign Out
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20 p-8 overflow-auto">
        {/* Metrics Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
              <div className="relative z-10">
                <metric.icon className={`text-${metric.color}-400 text-3xl mb-3`} />
                <h3 className="text-white/70 text-sm mb-1">{metric.label}</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-white">{metric.value}</p>
                  <span className="text-emerald-400 text-sm font-semibold">{metric.change}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View Toggle and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => { setSelectedView("users"); setSelectedUserId(null); setSelectedSiteId(null); }}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                selectedView === "users"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <FaUser className="inline mr-2" /> Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedView("installations")}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                selectedView === "installations"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <FaServer className="inline mr-2" /> Installations
            </motion.button>
          </div>

          <div className="flex gap-3">
            <Link to="/transactions">
              <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-2 bg-violet-500/20 border border-violet-400/30 rounded-xl text-violet-300 hover:bg-violet-500/30 transition-all flex items-center gap-2">
                <FaBolt /> Transactions
              </motion.button>
            </Link>
            <Link to="/ecosystem">
              <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-all flex items-center gap-2">
                <FaNetworkWired /> Network View
              </motion.button>
            </Link>
            <Link to="/kpis">
              <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300 hover:bg-emerald-500/30 transition-all flex items-center gap-2">
                <FaChartBar /> Analytics
              </motion.button>
            </Link>
            <Link to="/trends">
              <motion.button whileHover={{ scale: 1.05 }} className="px-6 py-2 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-300 hover:bg-amber-500/30 transition-all flex items-center gap-2">
                <FaChartLine /> Trends
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        {selectedView === "users" ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Users List - Left Side */}
            <div className="col-span-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[calc(100vh-280px)] overflow-y-auto"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaUser /> All Users
                </h2>
                <div className="space-y-2">
                  {users
                    .filter((user) =>
                      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((user) => (
                      <motion.div
                        key={user.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { setSelectedUserId(user.id); setSelectedSiteId(null); }}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          selectedUserId === user.id
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                            : "bg-white/5 hover:bg-white/10 text-white/80"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {user.email[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{user.name || user.email}</p>
                            <p className="text-xs opacity-70 truncate">{user.email}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            </div>

            {/* User Details - Right Side */}
            <div className="col-span-8">
              {selectedUserId ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* User Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                      <FaWallet className="text-emerald-400 text-2xl mb-2" />
                      <p className="text-white/70 text-sm">Wallet Balance</p>
                      <p className="text-2xl font-bold text-white">{walletInfo?.balance || 0} kWh</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                      <FaShoppingCart className="text-blue-400 text-2xl mb-2" />
                      <p className="text-white/70 text-sm">Purchases</p>
                      <p className="text-2xl font-bold text-white">
                        {transactions.filter((t) => t.buyerId === selectedUserId).length}
                      </p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                      <FaBolt className="text-violet-400 text-2xl mb-2" />
                      <p className="text-white/70 text-sm">Sales</p>
                      <p className="text-2xl font-bold text-white">
                        {transactions.filter((t) => t.sellerId === selectedUserId).length}
                      </p>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                      <FaList className="text-amber-400 text-2xl mb-2" />
                      <p className="text-white/70 text-sm">Active Listings</p>
                      <p className="text-2xl font-bold text-white">
                        {listings.filter((l) => l.status !== "sold").length}
                      </p>
                    </motion.div>
                  </div>

                  {/* Sites Section */}
                  {sites.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FaServer /> User Sites
                      </h3>
                      <div className="space-y-3">
                        {sites.map((site) => (
                          <motion.div
                            key={site.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedSiteId(selectedSiteId === site.id ? null : site.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all ${
                              selectedSiteId === site.id
                                ? "bg-gradient-to-r from-cyan-600 to-blue-600"
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-white">{site.organizationName || "No Organization Name"}</p>
                                <p className="text-sm text-white/70">
                                  {site.address}, {site.city}, {site.state} - {site.zipCode}
                                </p>
                              </div>
                              <FaChartLine className="text-white/50" />
                            </div>
                            
                            {/* Site Details - Expanded */}
                            {selectedSiteId === site.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                className="mt-4 pt-4 border-t border-white/20 space-y-2"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-white/50 text-xs">Organization</p>
                                    <p className="text-white font-medium">{site.organizationName || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/50 text-xs">City</p>
                                    <p className="text-white font-medium">{site.city || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/50 text-xs">State</p>
                                    <p className="text-white font-medium">{site.state || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-white/50 text-xs">Zip Code</p>
                                    <p className="text-white font-medium">{site.zipCode || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <p className="text-white/50 text-xs">Full Address</p>
                                  <p className="text-white font-medium">{site.address || "N/A"}</p>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transactions Section */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Transaction History</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {transactions.length === 0 ? (
                        <p className="text-white/50 text-center py-8">No transactions found</p>
                      ) : (
                        transactions.map((transaction) => (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                transaction.status === "completed"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                  : transaction.status === "pending"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                                  : "bg-red-500/20 text-red-300 border border-red-400/30"
                              }`}>
                                {transaction.status}
                              </span>
                              <span className="text-white/50 text-xs">
                                {transaction.createdAt?.toDate().toLocaleDateString()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-white/50">Type</p>
                                <p className="text-white font-semibold">
                                  {transaction.buyerId === selectedUserId ? "Purchase" : "Sale"}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/50">Units</p>
                                <p className="text-white font-semibold">{transaction.unitsTraded} kWh</p>
                              </div>
                              <div>
                                <p className="text-white/50">Price/Unit</p>
                                <p className="text-white font-semibold">₹{transaction.pricePerUnit}</p>
                              </div>
                              <div>
                                <p className="text-white/50">Total Amount</p>
                                <p className="text-white font-semibold">₹{transaction.totalAmount}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 h-full flex items-center justify-center">
                  <div className="text-center">
                    <FaUser className="text-6xl text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 text-lg">Select a user to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Installations Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-6"
          >
            {filteredInstallations.map((inst, index) => (
              <motion.div
                key={inst.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{inst.name}</h3>
                    <p className="text-white/50 text-sm">{inst.location}</p>
                  </div>
                  <span className={`px-3 py-1 bg-${inst.statusColor}-500/20 border border-${inst.statusColor}-400/30 rounded-full text-${inst.statusColor}-300 text-xs font-semibold`}>
                    {inst.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Capacity</span>
                    <span className="text-white font-semibold">{inst.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Current Load</span>
                    <span className="text-white font-semibold">{inst.currentLoad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Efficiency</span>
                    <span className="text-emerald-400 font-semibold">{inst.efficiency}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link to="/ecosystem">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
