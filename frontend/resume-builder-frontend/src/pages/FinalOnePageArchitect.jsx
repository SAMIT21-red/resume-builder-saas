import React, { useState } from "react";
import { 
  Trash2, Plus, Download, User, Briefcase, 
  GraduationCap, Code, Award, Mail, Phone, 
  Linkedin, Github, Lightbulb, FileCheck, Camera, Save, 
  Palette, X, Lock, Crown
} from "lucide-react";

const FinalOnePageArchitect = () => {
  // --- STATE ---
  const [accentColor, setAccentColor] = useState("#2563eb");
  const [isSaving, setIsSaving] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [userPlan, setUserPlan] = useState("Basic"); // Options: "Basic", "Premium"

  const [resume, setResume] = useState({
    personal: { fullName: "SAMIT DUBEY", designation: "JAVA FULL STACK DEVELOPER", summary: "Motivated Java Developer...", pfp: null },
    contact: { email: "dubeysamit300@gmail.com", phone: "88509 57235", linkedin: "linkedin.com/in/samit-dubey", github: "github.com/samit21-red" },
    experience: [{ company: "MARKETINGVALE", role: "FREELANCE JAVA DEVELOPER", startDate: "JULY 2025", endDate: "SEPT 2025", description: "Developed API solutions..." }],
    projects: [{ title: "RESUME BUILDER API", description: "Comprehensive tool..." }],
    education: [{ institution: "University of Mumbai", degree: "BE IN COMPUTER SCIENCE", endDate: "BATCH 2027" }],
    skills: [{ name: "JAVA" }, { name: "SPRING BOOT" }],
    certifications: [{ name: "JAVA DEVELOPER CERT" }],
    interests: [{ name: "gaming" }]
  });

  // --- THEME DATA ---
  const templates = [
    { id: "architect", name: "Architect (Free)", isPremium: false, previewColor: "#2563eb" },
    { id: "modern", name: "Modern Dark", isPremium: true, previewColor: "#1e293b" },
    { id: "minimal", name: "Minimalist", isPremium: true, previewColor: "#64748b" },
  ];

  // --- PAYMENT HANDLER (Mocking Razorpay/Stripe) ---
  const handlePayment = () => {
    alert("Redirecting to Secure Payment Gateway... Amount: ₹999");
    // On Success:
    setTimeout(() => {
      setUserPlan("Premium");
      alert("Payment Successful! Premium Themes Unlocked.");
    }, 1500);
  };

  const selectTemplate = (template) => {
    if (template.isPremium && userPlan !== "Premium") {
      if (window.confirm("This is a Premium Theme. Would you like to upgrade for ₹999?")) {
        handlePayment();
      }
      return;
    }
    setAccentColor(template.previewColor);
    setShowThemeModal(false);
    alert(`Theme changed to ${template.name}`);
  };

  // --- UTILS ---
  const updateNested = (sec, field, val) => setResume(prev => ({ ...prev, [sec]: { ...prev[sec], [field]: val } }));
  const updateArray = (sec, i, field, val) => {
    const newArr = [...resume[sec]];
    newArr[i][field] = val;
    setResume(prev => ({ ...prev, [sec]: newArr }));
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col font-sans">
      
      {/* --- TOOLBAR --- */}
      <nav className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-[100] print:hidden shadow-sm">
        <div className="font-black text-xl flex items-center gap-2 tracking-tighter">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white italic">S</div>
          RESUME_PRO <span className="text-blue-600 ml-1 text-xs">v5.0</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowThemeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-bold text-xs hover:bg-purple-100 border border-purple-200"
          >
            <Palette size={16} /> CHANGE THEME
          </button>

          <button className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100">
            <Trash2 size={20} />
          </button>

          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-200">
            <Download size={16} /> PREVIEW & DOWNLOAD
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT EDITOR & RIGHT PREVIEW - (Keep your existing structures here) */}
        <aside className="w-[38%] overflow-y-auto p-6 space-y-8 bg-white border-r print:hidden">
            <h2 className="text-xs font-black text-blue-600 uppercase border-b-2 pb-1">01. Personal Information</h2>
            <input className="w-full p-2 border rounded-lg text-sm mt-2" value={resume.personal.fullName} onChange={(e) => updateNested("personal", "fullName", e.target.value)} />
        </aside>
        
        <main className="flex-1 bg-slate-400 p-8 overflow-y-auto flex justify-center">
            <div id="A4-Sheet" className="w-[210mm] h-[297mm] bg-white p-[12mm] shadow-2xl">
                <h1 className="text-[72px] font-black tracking-tighter" style={{ color: accentColor }}>{resume.personal.fullName}</h1>
                {/* ... rest of resume template ... */}
            </div>
        </main>
      </div>

      {/* --- THEME & PAYMENT MODAL --- */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-slate-900">Change Theme</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan: <span className={userPlan === 'Premium' ? 'text-amber-500' : 'text-blue-600'}>{userPlan}</span></p>
              </div>
              <button onClick={() => setShowThemeModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-3 gap-6">
              {templates.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => selectTemplate(t)}
                  className={`relative group cursor-pointer border-4 rounded-2xl overflow-hidden transition-all ${t.isPremium && userPlan !== 'Premium' ? 'grayscale-[0.5]' : 'hover:border-blue-500'}`}
                >
                  <div className="aspect-[3/4] bg-slate-100 flex items-center justify-center">
                    {/* Placeholder for template image */}
                    <div className="w-20 h-32 bg-white shadow-lg rounded p-2">
                        <div className="h-2 w-full mb-2" style={{backgroundColor: t.previewColor}}></div>
                        <div className="space-y-1">
                            <div className="h-1 w-full bg-slate-200"></div>
                            <div className="h-1 w-full bg-slate-200"></div>
                            <div className="h-1 w-2/3 bg-slate-200"></div>
                        </div>
                    </div>
                    
                    {t.isPremium && userPlan !== 'Premium' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Lock className="text-white" size={32} />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-white flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-700">{t.name}</span>
                    {t.isPremium && <Crown size={16} className="text-amber-500" />}
                  </div>
                </div>
              ))}
            </div>

            {userPlan === "Basic" && (
              <div className="m-8 mt-0 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-200">
                        <Crown size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900">Upgrade to Premium Plan</h4>
                        <p className="text-sm text-slate-500 font-medium">Unlock all premium themes and remove watermarks.</p>
                    </div>
                </div>
                <button 
                    onClick={handlePayment}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform"
                >
                    UPGRADE FOR ₹999
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { visibility: hidden; }
          #A4-Sheet { visibility: visible; position: absolute; left: 0; top: 0; width: 210mm; }
        }
      `}</style>
    </div>
  );
};

export default FinalOnePageArchitect;