import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function LoginModal({ isOpen, onClose , openSignUp}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      if (token) {
        localStorage.setItem("token", token);
        onClose();
        navigate("/dashboard");
      } else {
        setError("Invalid login response from server.");
      }

    } catch (err) {
      console.log("Login error:", err);

      if (err.response) {
        setError("Invalid email or password.");
      } else {
        setError("Backend not reachable. Check if server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-8 rounded-xl shadow-xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6">
          Please enter your details to log in
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="john@example.com"
            required
            className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Min 8 Characters"
            required
            className="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
            }`}
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>

        </form>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
         <span
  onClick={openSignUp}
  className="text-indigo-600 cursor-pointer font-semibold hover:underline"
>
  SignUp
</span>
        </p>

      </div>
    </div>
  );
}