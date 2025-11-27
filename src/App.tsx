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
import Layout from "./components/Layout.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { AlertProvider } from "./contexts/AlertContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Routes that should use the Layout component
const protectedRoutes = ["/dashboard", "/energy-consumption", "/purchases", "/settings"];

function App() {
  const isProtectedRoute = (path: string) => protectedRoutes.includes(path);

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
          </Routes>
        </Router>
      </ErrorBoundary>
    </AlertProvider>
    </AuthProvider>
  );
}

export default App;
