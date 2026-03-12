import { useState } from "react";
import LoginModal from "../components/LoginModal";
import SignUpModal from "../components/SignUpModal";
import api from "../api/axios";
import { FileText, Zap, ShieldCheck, Smartphone } from "lucide-react";

export default function Home() {

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleUpgrade = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {

      const res = await api.post("/api/payment/create-checkout");
      window.location.href = res.data;

    } catch (err) {
      console.error(err);
      alert("Unable to start payment.");
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans">

      {/* ================= NAVBAR ================= */}

      <nav className="flex justify-between items-center px-10 py-5 backdrop-blur bg-white/70 border-b sticky top-0 z-50">

        <h1 className="text-2xl font-black tracking-tight">
          <span className="text-indigo-600">Resume</span>Pro
        </h1>

        <div className="flex gap-6 items-center">

          <button
            onClick={() => setShowLogin(true)}
            className="px-5 py-2 text-sm font-semibold hover:text-indigo-600"
          >
            Login
          </button>

          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
          >
            Get Started
          </button>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="px-10 py-28 bg-gradient-to-br from-indigo-50 via-white to-purple-50">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <div>

            <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-semibold">
              Trusted by 50,000+ professionals
            </span>

            <h2 className="text-5xl font-extrabold mt-6 leading-tight">

              Build Your  
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                {" "}Dream Resume
              </span>

              <br /> in Minutes

            </h2>

            <p className="text-slate-600 mt-6 text-lg">
              Create modern ATS-friendly resumes with powerful editing tools
              and beautiful templates designed to help you land interviews faster.
            </p>

            <div className="flex gap-4 mt-8">

              <button
                onClick={() => setShowLogin(true)}
                className="px-7 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
              >
                Start Building →
              </button>

              <button className="px-7 py-3 border border-slate-300 rounded-xl hover:bg-slate-100 transition">
                View Templates
              </button>

            </div>

            {/* STATS */}

            <div className="flex gap-12 mt-12">

              <Stat number="50K+" label="Resumes Created" />
              <Stat number="95%" label="Success Rate" />
              <Stat number="4.9★" label="User Rating" />

            </div>

          </div>


          {/* HERO PREVIEW */}

          <div className="bg-white p-8 rounded-3xl shadow-2xl border hover:scale-[1.02] transition">

           <div className="h-72 bg-white rounded-xl border shadow-sm p-6 text-sm">

  <div className="mb-4">
    <h3 className="font-bold text-lg">Samit Dubey</h3>
    <p className="text-slate-500 text-xs">Java Developer</p>
  </div>

  <div className="border-t pt-2 mb-3">
    <p className="text-xs text-slate-600">
      Detail-oriented developer specializing in Spring Boot and React.
    </p>
  </div>

  <div className="border-t pt-2 mb-3">
    <h4 className="font-semibold text-xs mb-1">Experience</h4>
    <p className="text-xs">MarketingVale — Freelance Java Developer</p>
    <p className="text-[11px] text-slate-500">
      Built REST APIs using Spring Boot.
    </p>
  </div>

  <div className="border-t pt-2">
    <h4 className="font-semibold text-xs mb-1">Skills</h4>

    <div className="flex flex-wrap gap-1">

      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px]">
        Java
      </span>

      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px]">
        Spring Boot
      </span>

      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px]">
        React
      </span>

      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[10px]">
        SQL
      </span>

    </div>
  </div>

</div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="px-10 py-24 bg-white">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold">
            Powerful Features
          </h2>

          <p className="text-slate-500 mt-4">
            Everything you need to build a winning resume
          </p>

        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">

          <FeatureCard
            icon={<FileText size={30} />}
            title="Smart Editor"
            desc="Intelligent editing tools to craft professional resumes."
          />

          <FeatureCard
            icon={<Zap size={30} />}
            title="Lightning Fast"
            desc="Create stunning resumes in minutes."
          />

          <FeatureCard
            icon={<ShieldCheck size={30} />}
            title="Secure"
            desc="Your data is protected with enterprise security."
          />

          <FeatureCard
            icon={<Smartphone size={30} />}
            title="Mobile Ready"
            desc="Edit and download resumes anywhere."
          />

        </div>

      </section>


      {/* ================= PRICING ================= */}

      <section className="px-10 py-24 bg-slate-50">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold">
            Simple Pricing
          </h2>

          <p className="text-slate-500 mt-4">
            Choose the plan that works best for you
          </p>

        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

          {/* FREE PLAN */}

          <div className="p-10 bg-white rounded-2xl shadow-md border">

            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <p className="text-4xl font-extrabold mb-6">₹0</p>

            <ul className="space-y-3 text-slate-600 mb-8">
              <li>✔ 1 Resume Template</li>
              <li>✔ Basic Editor</li>
              <li>✔ PDF Download</li>
            </ul>

            <button
              onClick={() => setShowLogin(true)}
              className="w-full py-3 bg-slate-200 rounded-xl font-semibold hover:bg-slate-300 transition"
            >
              Get Started
            </button>

          </div>


          {/* PREMIUM PLAN */}

          <div className="p-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl relative overflow-hidden">

            <div className="absolute top-4 right-4 text-xs bg-white text-indigo-600 px-3 py-1 rounded-full font-semibold">
              Most Popular
            </div>

            <h3 className="text-2xl font-bold mb-4">Premium</h3>
            <p className="text-4xl font-extrabold mb-6">₹299</p>

            <ul className="space-y-3 mb-8">
              <li>✔ All Premium Templates</li>
              <li>✔ Advanced Editor</li>
              <li>✔ Unlimited Resumes</li>
              <li>✔ Email Resume</li>
              <li>✔ Priority Support</li>
            </ul>

            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:scale-105 transition"
            >
              Upgrade to Premium
            </button>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="bg-slate-900 text-slate-400 px-10 py-16">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-white text-xl font-bold mb-4">
              ResumePro
            </h3>

            <p>
              Build professional resumes that help you land your dream job faster.
            </p>

          </div>

          <FooterColumn title="Product" items={["Templates","Features","Pricing"]} />
          <FooterColumn title="Support" items={["Help Center","Contact","FAQ"]} />
          <FooterColumn title="Company" items={["About","Careers","Privacy"]} />

        </div>

      </footer>


      {/* ================= MODALS ================= */}

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        openSignUp={() => {
          setShowLogin(false);
          setShowSignUp(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        openLogin={() => {
          setShowSignUp(false);
          setShowLogin(true);
        }}
      />

    </div>
  );
}


/* ================= COMPONENTS ================= */

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition">

    <div className="text-indigo-600 mb-4">{icon}</div>

    <h3 className="font-bold text-lg mb-2">{title}</h3>

    <p className="text-slate-500">{desc}</p>

  </div>
);

const FooterColumn = ({ title, items }) => (
  <div>
    <h4 className="text-white font-semibold mb-4">{title}</h4>
    <ul className="space-y-2">
      {items.map((item,i) => (
        <li key={i} className="hover:text-white cursor-pointer">{item}</li>
      ))}
    </ul>
  </div>
);

const Stat = ({ number, label }) => (
  <div>
    <h3 className="text-2xl font-bold">{number}</h3>
    <p className="text-slate-500 text-sm">{label}</p>
  </div>
);