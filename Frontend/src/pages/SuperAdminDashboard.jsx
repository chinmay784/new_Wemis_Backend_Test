import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserCog, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import Navbar from "./Navbar";
import { UserAppContext } from "../contexts/UserAppProvider";
import axios from "axios";

const SuperAdminDashboard = () => {
  const [data, setData] = useState(null);
  const { token: contextToken } = useContext(UserAppContext);
  const tkn = contextToken || localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/superadmin/fetchAllAdmins_Elements_wlp",
        {},
        {
          headers: {
            Authorization: `Bearer ${tkn}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#121212] mt-36">
      <Navbar />

      <main className="p-8">
        {/* Dashboard Overview */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1E1E1E] rounded-xl shadow-lg p-6 mb-6 border border-yellow-400/20"
        >
          <h2 className="text-xl font-semibold text-yellow-400">
            Dashboard Overview
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            Welcome back! Here's what's happening with your system.
          </p>
        </motion.section>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "System Administrators",
              value: data?.adminsCount || 0,
              icon: <FaUserCog className="text-yellow-400 text-3xl" />,
            },
            {
              title: "Total WLP/Reseller",
              value: 0, // Hardcoded as per your request
              icon: <FaMapMarkerAlt className="text-yellow-400 text-3xl" />,
            },
            {
              title: "Total Elements",
              value: data?.elementsCount || 0,
              icon: <FaBox className="text-yellow-400 text-3xl" />,
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1A1A1A] rounded-xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 hover:shadow-yellow-500/20 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-200 font-medium">{card.title}</h3>
                  <p className="text-3xl font-bold mt-2 text-yellow-400">
                    {card.value}
                  </p>
                </div>
                {card.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1E1E1E] p-6 rounded-xl shadow-lg border border-yellow-400/20"
        >
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">
            Event Records
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-300">
              <thead className="bg-[#2A2A2A] text-yellow-400">
                <tr>
                  <th className="px-6 py-3 text-left">Event Type (Role)</th>
                  <th className="px-6 py-3 text-left">Description (Element Name)</th>
                  <th className="px-6 py-3 text-left">Time (Created At)</th>
                </tr>
              </thead>
              <tbody>
                {data?.admins?.map((admin, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-[#1F1F1F] transition"
                  >
                    <td className="px-6 py-3">{admin.role}</td>
                    <td className="px-6 py-3">{admin?.adminId?.name_of_business }</td>
                    <td className="px-6 py-3">{formatDate(admin.createdAt)}</td>
                  </tr>
                ))}
                {data?.elements?.map((element, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-[#1F1F1F] transition"
                  >
                    <td className="px-6 py-3">Element</td>
                    <td className="px-6 py-3">{element.elementName}</td>
                    <td className="px-6 py-3">{formatDate(element.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
