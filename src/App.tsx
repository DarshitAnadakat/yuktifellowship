import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import LoginOTP from "./pages/LoginOTP.tsx";
import ProfileSetupOrg from "./pages/ProfileSetupOrg.tsx";
import ProfileSetupContact from "./pages/ProfileSetupContact.tsx";
import ProfileSetupKYC from "./pages/ProfileSetupKYC.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import EnergyConsumption from "./pages/EnergyConsumption.tsx";
import P2PMarket from "./pages/P2PMarket.tsx";
import Purchases from "./pages/Purchases.tsx";
import Settings from "./pages/Settings.tsx";
import FirebaseTest from "./pages/FirebaseTest.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { AlertProvider } from "./contexts/AlertContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Admin Panel imports
import AdminLogin from "../admin/src/pages/Login.tsx";
import AdminWelcome from "../admin/src/pages/Welcome.tsx";
import AdminDashboard from "../admin/src/pages/Dashboard.tsx";
import AdminEcosystem from "../admin/src/pages/EcosystemDashboard.tsx";
import AdminKPIs from "../admin/src/pages/KPIsDashboard.tsx";
import AdminTrends from "../admin/src/pages/TrendsDashboard.tsx";
import AdminTransactions from "../admin/src/pages/TransactionsDashboard.tsx";
import { AuthProvider as AdminAuthProvider } from "../admin/src/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <ErrorBoundary>
          <Router>
          <Routes>
            {/* Test route */}
            <Route path="/test-firebase" element={<FirebaseTest />} />
            
            {/* Auth routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login-otp" element={<LoginOTP />} />
            <Route path="/profile-setup-org" element={<ProfileSetupOrg />} />
            <Route path="/profile-setup-contact" element={<ProfileSetupContact />} />
            <Route path="/profile-setup-kyc" element={<ProfileSetupKYC />} />

            {/* Protected routes - Pages have their own navigation */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/energy-consumption" element={<EnergyConsumption />} />
            <Route path="/p2p-market" element={<P2PMarket />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/settings" element={<Settings />} />

            {/* Admin Panel routes */}
            <Route path="/admin" element={<AdminAuthProvider><AdminWelcome /></AdminAuthProvider>} />
            <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
            <Route path="/admin/dashboard" element={<AdminAuthProvider><AdminDashboard /></AdminAuthProvider>} />
            <Route path="/admin/ecosystem" element={<AdminAuthProvider><AdminEcosystem /></AdminAuthProvider>} />
            <Route path="/admin/kpis" element={<AdminAuthProvider><AdminKPIs /></AdminAuthProvider>} />
            <Route path="/admin/trends" element={<AdminAuthProvider><AdminTrends /></AdminAuthProvider>} />
            <Route path="/admin/transactions" element={<AdminAuthProvider><AdminTransactions /></AdminAuthProvider>} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </AlertProvider>
    </AuthProvider>
  );
}

export default App;
