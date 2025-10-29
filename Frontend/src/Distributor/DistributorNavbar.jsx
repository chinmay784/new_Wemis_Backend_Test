import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Barcode,
  Users,
  Wrench,
  Settings,
  Map,
  Package,
  ArrowUpRight,
  RotateCcw,
  Repeat,
  ChevronDown,
  ChevronUp,
  QrCode,
  LogOut,
} from "lucide-react";
import { UserAppContext } from "../contexts/UserAppProvider";

const DistributorNavbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useContext(UserAppContext); // Using context logout

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Logout button handler
  const handleLogout = () => {
    logout(); // Call context logout to remove user/token
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="bg-black text-white">
      {/* Top Navbar */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-neutral-900 px-4 py-3 border-b border-yellow-400/40 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl text-yellow-400 tracking-wide">WEMIS</span>
        </div>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <button className="px-4 py-1.5 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition w-full md:w-auto">
            Product
          </button>
          <button className="px-4 py-1.5 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition w-full md:w-auto">
            Wallet
          </button>
          <button className="px-4 py-1.5 bg-neutral-800 text-yellow-400 font-semibold rounded-md hover:bg-yellow-400 hover:text-black transition w-full md:w-auto">
            <Settings size={16} className="inline mr-1" /> Settings
          </button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-yellow-400">SBT SOLUTIONS</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="w-9 h-9 rounded-full border border-yellow-400"
            />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition w-full md:w-auto flex items-center gap-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav
        ref={navRef}
        className="relative bg-neutral-950 border-b border-yellow-400/30 px-4 py-3 flex flex-wrap justify-center items-center gap-5 md:gap-10"
      >
        {/* Dashboard */}
        <Link
          to="/distributor/dashboard"
          className="flex items-center gap-2 text-yellow-400 hover:text-white font-semibold uppercase tracking-wide"
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        {/* Barcode Dropdown */}
        <div className="relative inline-block">
          <div
            className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-white font-semibold uppercase tracking-wide"
            onClick={() => toggleMenu("barcode")}
            tabIndex={0}
          >
            <Barcode size={18} /> Barcode
            {openMenu === "barcode" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {openMenu === "barcode" && (
            <div className="absolute left-0 mt-2 bg-neutral-900 border border-yellow-400/30 rounded-md shadow-lg z-30 w-48 md:w-56 overflow-auto">
              <ul className="text-sm text-yellow-300">
                <li>
                  <Link
                    to="/distributor/barcode"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-yellow-400 hover:text-black rounded transition"
                  >
                    <QrCode size={16} /> Barcode
                  </Link>
                </li>
                <li>
                  <Link
                    to="/distributor/allocate-barcode"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-yellow-400 hover:text-black rounded transition"
                  >
                    <ArrowUpRight size={16} /> Allocate Barcode
                  </Link>
                </li>
                <li>
                  <Link
                    to="/distributor/rollback-barcode"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-yellow-400 hover:text-black rounded transition"
                  >
                    <RotateCcw size={16} /> Rollback Barcode
                  </Link>
                </li>
                <li>
                  <Link
                    to="/distributor/renewal-allocation"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-yellow-400 hover:text-black rounded transition"
                  >
                    <Repeat size={16} /> Renewal Allocation
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Members Dropdown */}
        <div className="relative inline-block">
          <div
            className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-white font-semibold uppercase tracking-wide"
            onClick={() => toggleMenu("members")}
            tabIndex={0}
          >
            <Users size={18} /> Members
            {openMenu === "members" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {openMenu === "members" && (
            <div className="absolute left-0 mt-2 bg-neutral-900 border border-yellow-400/30 rounded-md shadow-lg z-30 w-40 md:w-44 overflow-auto">
              <ul className="text-sm text-yellow-300">
                <li>
                  <Link
                    to="/distributor/dealer"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-yellow-400 hover:text-black rounded transition"
                  >
                    <Users size={16} /> Dealer
                  </Link>
                </li>
                
              </ul>
            </div>
          )}
        </div>

        {/* Manage Device Dropdown */}
        <div className="relative inline-block">
          <div
            className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:text-white font-semibold uppercase tracking-wide"
            onClick={() => toggleMenu("device")}
            tabIndex={0}
          >
            <Package size={18} /> Manage Device
            {openMenu === "device" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {openMenu === "device" && (
            <div className="absolute left-0 mt-2 bg-neutral-900 border border-yellow-400/30 rounded-md shadow-lg z-30 w-40 md:w-44 overflow-auto">
              <ul className="text-sm text-yellow-300">
                <li>
                  <Link
                    to="/distributor/map-device"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-yellow-400 hover:text-black rounded transition"
                  >
                    <Map size={16} /> Map Device
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default DistributorNavbar;
