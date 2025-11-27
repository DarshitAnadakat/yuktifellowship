import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BoltIcon, HomeIcon, ChartIcon, DocumentIcon, SettingsIcon, LogoutIcon, AlertIcon } from "./Icons";
import { signOutUser } from "../services/authService";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: <HomeIcon />, path: "/dashboard", label: "Overview", color: "violet" },
    { icon: <ChartIcon />, path: "/energy-consumption", label: "Analytics", color: "blue" },
    { icon: <DocumentIcon />, path: "/purchases", label: "Transactions", color: "emerald" },
    { icon: <SettingsIcon />, path: "/settings", label: "Configure", color: "amber" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Horizontal Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 z-50 px-6 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BoltIcon />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              PowerNetPro
            </h1>
            <p className="text-xs text-slate-500">Smart Energy Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive(item.path)
                  ? `bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white shadow-lg scale-105`
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className={isActive(item.path) ? "scale-110" : ""}>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-3 hover:bg-slate-100 rounded-xl transition-all hover:scale-110">
            <AlertIcon />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-300"></div>
          
          <button
            onClick={async () => {
              const result = await signOutUser();
              if (result.success) {
                navigate("/");
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <LogoutIcon />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-24 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout; 