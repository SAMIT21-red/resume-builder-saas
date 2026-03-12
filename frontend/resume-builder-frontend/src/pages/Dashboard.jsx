import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Plus,
  LogOut,
  FileText,
  Trash2,
  Edit3,
  X,
  Layout
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  // ✅ Load Dashboard Data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userRes, resumeRes] = await Promise.all([
          api.get("/api/users/me"),
          api.get("/api/resumes")
        ]);

        setUser(userRes.data);
        setResumes(resumeRes.data);
      } catch (err) {
        console.error("Dashboard load failed", err);
        navigate("/"); // redirect if token invalid
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ✅ Create Resume
  const createResume = async () => {
    if (!title.trim()) return alert("Please enter a title");

    try {
      const res = await api.post("/api/resumes", {
        title,
        templateId: 1
      });

      const newResume = res.data;

      setShowModal(false);
      setTitle("");

      navigate(`/builder/${newResume.id}`);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Could not create resume. Check your subscription."
      );
    }
  };

  // ✅ Delete Resume
  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?"))
      return;

    try {
      await api.delete(`/api/resumes/${id}`);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">
          LOADING DASHBOARD...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50 px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">
            S
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800">
            RESUME_PRO <span className="text-blue-600">v5.0</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
           <img
    src={
      user?.profileImageUrl ||
      `https://ui-avatars.com/api/?name=${user?.name}`
    }
    alt="profile"
    className="w-10 h-10 rounded-full object-cover border shadow"
  />

  <div className="text-right hidden sm:block">
    <p className="text-sm font-bold">
      {user?.name}
    </p>

    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        user?.subscriptionPlan === "PREMIUM"
          ? "bg-amber-100 text-amber-700"
          : "bg-slate-200 text-slate-600"
      }`}
    >
      {user?.subscriptionPlan}
    </span>
  </div>


          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-sm uppercase"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between mb-10">
          <h2 className="text-4xl font-black uppercase">Dashboard</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl flex items-center gap-2 uppercase"
          >
            <Plus size={20} /> Create New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white border-2 border-dashed p-20 rounded-[2.5rem] text-center">
            <FileText size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-2xl font-black uppercase">
              No Resumes Found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-[2rem] border overflow-hidden"
              >
                <div className="h-32 bg-slate-50 flex items-center justify-center">
                  <Layout size={60} className="text-slate-200" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black uppercase truncate mb-1">
                    {resume.title}
                  </h3>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => navigate(`/builder/${resume.id}`)}
                      className="flex-1 bg-slate-900 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600"
                    >
                      <Edit3 size={16} /> EDIT
                    </button>

                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="w-12 h-12 flex items-center justify-center border rounded-xl text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-300"
            >
              <X size={24} />
            </button>

            <h3 className="text-3xl font-black uppercase mb-6">
              New Resume
            </h3>

            <input
              autoFocus
              type="text"
              placeholder="ENTER TITLE..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border-2 p-4 rounded-2xl mb-8"
            />

            <button
              onClick={createResume}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase"
            >
              Initialize Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;