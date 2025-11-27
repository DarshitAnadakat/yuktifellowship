import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EcosystemDashboard from "./pages/EcosystemDashboard";
import KPIsDashboard from "./pages/KPIsDashboard";
import TrendsDashboard from "./pages/TrendsDashboard";
import TransactionsDashboard from "./pages/TransactionsDashboard";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ecosystem" element={<EcosystemDashboard />} /> 
          <Route path="/kpis" element={<KPIsDashboard />} /> 
          <Route path="/trends" element={<TrendsDashboard />} /> 
          <Route path="/transactions" element={<TransactionsDashboard />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
