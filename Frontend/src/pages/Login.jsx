



// import React, { useContext, useState } from "react";
// import { motion } from "framer-motion";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import Loginn from "../Images/Login2.png";
// import axios from "axios";
// import { UserAppContext } from "../contexts/UserAppProvider";
// import { useNavigate } from "react-router-dom";
// import SuperAdminDashboard from "./SuperAdminDashboard";

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login, user } = useContext(UserAppContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "https://wemis-backend.onrender.com/superadmin/login",
//         { email, password }
//       );
//       login(response.data.token, response.data);

//       if (response.data.user.role === "superadmin") {
//         navigate("/superadmin/dashboard");
//       } else if (response.data.user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else if (response.data.user.role === "wlp") {
//         navigate("/wlp/dashboard");
//       } else {
//         navigate("/manufacture/dashboard");
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-600 flex items-center justify-center px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.7, ease: "easeOut" }}
//         className="w-full max-w-6xl h-[90vh] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border border-black/40"
//       >
//         {/* Left Side Image */}
//         <div className="hidden md:flex md:flex-1 relative">
//           <img
//             src={Loginn}
//             alt="Login Visual"
//             className="object-cover w-full h-full"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
//         </div>

//         {/* Right Side Form */}
//         <motion.div
//           initial={{ opacity: 0, x: 60 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="flex flex-col justify-center flex-1 px-8 sm:px-14 lg:px-20 bg-black/90 backdrop-blur-xl text-white"
//         >
//           {/* Branding Heading */}
//           <h2 className="text-3xl font-extrabold tracking-wide mb-2 text-white  py-1 rounded-md inline-block">
//             Traxo India Automation
//           </h2>

//           <h1 className="text-yellow-400 text-4xl font-bold mb-4 tracking-tight">
//             Login to Your Account
//           </h1>
//           <p className="text-gray-300 text-sm mb-8 max-w-sm">
//             Access your smart depot dashboard and monitor in real-time.
//           </p>

//           <form className="space-y-6 max-w-md w-full">
//             {/* Email Input */}
//             <div>
//               <label
//                 className="block mb-2 text-yellow-300 text-sm"
//                 htmlFor="email"
//               >
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full rounded-lg bg-black bg-opacity-80 border border-yellow-400 text-yellow-300 text-sm px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
//               />
//             </div>

//             {/* Password Input with Toggle */}
//             <div>
//               <label
//                 className="block mb-2 text-yellow-300 text-sm"
//                 htmlFor="password"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full rounded-lg bg-black bg-opacity-80 border border-yellow-400 text-yellow-300 text-sm px-4 py-3 pr-10 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-3 flex items-center text-yellow-400 hover:text-yellow-300"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <FaEye /> : <FaEyeSlash />}
//                 </button>
//               </div>
//             </div>

//             {/* Terms & Conditions */}
//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 className="w-4 h-4 text-yellow-400 bg-black border-yellow-400 rounded focus:ring-yellow-300"
//               />
//               <label className="text-gray-300 text-sm" htmlFor="terms">
//                 I agree to the{" "}
//                 <span className="text-yellow-400 hover:underline cursor-pointer">
//                   terms of service
//                 </span>
//               </label>
//             </div>

//             {/* Login Button */}
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               type="submit"
//               className="w-full bg-black text-yellow-400 border border-yellow-400 hover:bg-yellow-500 hover:text-black hover:shadow-lg hover:shadow-black transition-all text-base font-medium py-3 rounded-lg"
//               onClick={handleSubmit}
//             >
//               Login
//             </motion.button>
//           </form>

//           {/* Links Section */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 text-sm text-gray-300">
//             <a
//               href="#"
//               className="hover:text-yellow-400 transition-colors duration-200"
//             >
//               Forgot your password?
//             </a>
//             <p className="mt-4 sm:mt-0">
//               Don&apos;t have an account?{" "}
//               <a
//                 href="#"
//                 className="text-yellow-400 hover:underline font-medium"
//               >
//                 Create one
//               </a>
//             </p>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   )
// }

import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loginn from "../Images/Login2.png";
import axios from "axios";
import { UserAppContext } from "../contexts/UserAppProvider";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserAppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.websave.in/api/superadmin/login",
        { email, password }
      );

      if (response.data?.token && response.data?.user) {
        login(response.data.token, response.data.user);
        toast.success("Login Successful!", { position: "top-right" });

        // Redirect after short delay
        setTimeout(() => {
          switch (response.data.user.role) {
            case "superadmin":
              navigate("/superadmin/dashboard");
              break;
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "wlp":
              navigate("/wlp/dashboard");
              break;
            case "distibutor":
              navigate("/distibutor/dashboard");
              break;
            case "oem":
              navigate("/Oem/dashboard");
              break;
            default:
              navigate("/manufacturer/dashboard");
          }
        }, 1500);
      } else {
        toast.error("Invalid credentials. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Login failed! " + error.message, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-600 flex items-center justify-center px-4 relative">
      {/* Loading Overlay */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin shadow-lg"
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-6xl h-[90vh] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border border-black/40"
      >
        {/* Left Side Image */}
        <div className="hidden md:flex md:flex-1 relative">
          <img src={Loginn} alt="Login Visual" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>

        {/* Right Side Form */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center flex-1 px-8 sm:px-14 lg:px-20 bg-black/90 backdrop-blur-xl text-white"
        >
          <h2 className="text-3xl font-extrabold mb-2">Traxo India Automation</h2>
          <h1 className="text-yellow-400 text-4xl font-bold mb-4">Login to Your Account</h1>
          <form className="space-y-6 max-w-md w-full" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block mb-2 text-yellow-300 text-sm" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-black bg-opacity-80 border border-yellow-400 text-yellow-300 text-sm px-4 py-3"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-2 text-yellow-300 text-sm" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-black bg-opacity-80 border border-yellow-400 text-yellow-300 text-sm px-4 py-3 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 text-yellow-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-yellow-400 border border-yellow-400 py-3 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
