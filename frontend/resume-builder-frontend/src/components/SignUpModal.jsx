import { useState } from "react";
import api from "../api/axiosConfig";

export default function SignUpModal({ isOpen, onClose, openLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  if (!isOpen) return null;

  // ================= IMAGE SELECT =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= CLOUDINARY UPLOAD =================
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "samit-resume");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dwnfqpvhy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Image upload failed");
    }

    return data.secure_url;
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrl = null;

      // 🔥 Upload image FIRST before register
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }

      console.log("Sending Image URL:", imageUrl);

      await api.post("/auth/register", {
        name,
        email,
        password,
        profileImageUrl: imageUrl,
      });

      setShowVerification(true);

    } catch (err) {
      if (!err.response) {
        setError("Server not reachable.");
      } else {
        setError(err.response.data?.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND =================
  const resendVerification = async () => {
    try {
      await api.post("/auth/resend-verification", { email });
      alert("Verification email sent again!");
    } catch {
      alert("Failed to resend email.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-8 rounded-xl shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
        <p className="text-gray-500 mb-6">
          Join us today by entering your details below.
        </p>

        {/* ================= VERIFICATION SCREEN ================= */}
        {showVerification ? (
          <>
            <div className="bg-purple-100 text-purple-700 p-3 rounded-md mb-4 text-sm">
              We've sent a verification link to your email.
              Please verify to log in.
            </div>

            <button
              onClick={resendVerification}
              className="w-full py-2 mb-4 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Resend Verification Email
            </button>

            <p className="text-sm text-center">
              Back to{" "}
              <span
                onClick={openLogin}
                className="text-indigo-600 cursor-pointer font-semibold"
              >
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            {error && (
              <p className="text-red-500 mb-3 text-sm">{error}</p>
            )}

            <form onSubmit={handleRegister}>

              {/* IMAGE SECTION */}
              <div className="flex justify-center mb-6 relative">
                <label className="cursor-pointer relative">
                  <img
                    src={
                      preview ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border"
                  />

                  <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                    Edit
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full mb-4 p-3 border rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full mb-4 p-3 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Min 8 Characters"
                required
                minLength={8}
                className="w-full mb-6 p-3 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                {loading ? "Creating..." : "SIGN UP"}
              </button>

            </form>

            <p className="text-sm mt-4 text-center">
              Already an account?{" "}
              <span
                onClick={openLogin}
                className="text-indigo-600 cursor-pointer font-semibold"
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}