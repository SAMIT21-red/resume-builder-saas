import React, { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Download, Lock, Crown, Plus, Trash2, Mail } from "lucide-react";

const templateMap = {
  basic: 1,
  modern: 2,
  corporate: 3,
  developer: 4
};

const ProResumeBuilder = () => {
  const { id } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState("basic");
  const previewRef = useRef(null);

  const templates = [
    { id: "basic", name: "Basic", premium: false },
    { id: "modern", name: "Modern", premium: true },
    { id: "corporate", name: "Corporate", premium: true },
    { id: "developer", name: "Developer", premium: true },
  ];

  const [resume, setResume] = useState({
    personal: { fullName: "SAMIT DUBEY", designation: "Java Developer", summary: "" },
    contact: { email: "", phone: "", linkedin: "", github: "" },
    experience: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    interests: [],
    languages: [],
  });

  // -------- STATE HELPERS --------
  const handleInput = (section, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const addItem = (section, fields) => {
    const newItem = Object.fromEntries(fields.map(f => [f, ""]));
    setResume(prev => ({
      ...prev,
      [section]: [...prev[section], { ...newItem, id: Date.now() }]
    }));
  };

  const updateItem = (section, id, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (section, id) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const handleUpgrade = async () => {
  const response = await fetch("http://localhost:8080/api/payment/create-checkout", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  const checkoutUrl = await response.text();

  window.location.href = checkoutUrl;
};



const [subscriptionPlan, setSubscriptionPlan] = useState("BASIC");

useEffect(() => {
  fetch("http://localhost:8080/api/users/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      setSubscriptionPlan(data.subscriptionPlan);
    });
}, []);

useEffect(() => {

  if (!id) return;

  const loadResume = async () => {

    try {

      const res = await fetch(
        `http://localhost:8080/api/resumes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await res.json();

      if (!data.resumeData) return;

      const r = data.resumeData;

      setResume({

        personal: {
          fullName: r.profileInfo?.fullName || "",
          designation: r.profileInfo?.designation || "",
          summary: r.profileInfo?.summary || ""
        },

        contact: {
          email: r.contactInfo?.email || "",
          phone: r.contactInfo?.phone || "",
          linkedin: r.contactInfo?.linkedin || "",
          github: r.contactInfo?.github || ""
        },

        experience: r.workExperience?.map((e, i) => ({
          id: i + 1,
          company: e.company,
          role: e.role,
          duration: `${e.startDate || ""} - ${e.endDate || ""}`,
          desc: e.description
        })) || [],

        education: r.education?.map((e, i) => ({
          id: i + 1,
          school: e.institution,
          degree: e.degree
        })) || [],

        skills: r.skills?.map((s, i) => ({
          id: i + 1,
          name: s.name
        })) || [],

        projects: r.projects?.map((p, i) => ({
          id: i + 1,
          title: p.title,
          desc: p.description
        })) || [],

        certifications: r.certifications?.map((c, i) => ({
          id: i + 1,
          name: c.title
        })) || [],

        languages: r.languages?.map((l, i) => ({
          id: i + 1,
          name: l.name
        })) || [],

        interests: r.interests?.map((i, index) => ({
          id: index + 1,
          name: i
        })) || []

      });

    } catch (err) {
      console.error("Failed to load resume", err);
    }

  };

  loadResume();

}, [id]);


const handleSaveResume = async () => {
  const payload = {

  templateId: templateMap[selectedTemplate],
  title: "My Resume",

  profileInfo: {
    fullName: resume.personal.fullName,
    designation: resume.personal.designation,
    summary: resume.personal.summary
  },

  contactInfo: {
    email: resume.contact.email,
    phone: resume.contact.phone,
    linkedin: resume.contact.linkedin,
    github: resume.contact.github
  },

  workExperience: resume.experience.map(e => ({
    company: e.company,
    role: e.role,
    startDate: "",
    endDate: "",
    description: e.desc
  })),

  education: resume.education.map(e => ({
    degree: e.degree,
    institution: e.school
  })),

  skills: resume.skills.map(s => ({
    name: s.name,
    progress: 80
  })),

  projects: resume.projects.map(p => ({
    title: p.title,
    description: p.desc
  })),

  certifications: resume.certifications.map(c => ({
    title: c.name
  })),

  languages: resume.languages.map(l => ({
    name: l.name
  })),

  interests: resume.interests.map(i => i.name)

};

  console.log("Saving Payload:", payload);

  try {
    const res = await fetch(`http://localhost:8080/api/resumes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Server error during save");

    alert("Resume saved successfully");
  } catch (err) {
    console.error(err);
    alert("Save failed");
  }
};

const handleTemplateChange = (template) => {
  if (template.premium && subscriptionPlan !== "PREMIUM") {
    alert("Upgrade to unlock this template.");
    return;
  }

  setSelectedTemplate(template.id);
};

const handleSendEmail = async () => {

  if (!resume.contact.email) {
    alert("Please enter email first.");
    return;
  }

  try {

    const element = previewRef.current;

   const pdfBlob = await html2pdf()
  .set({
    margin: [10, 10, 10, 10],
    filename: "resume.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  })
  .from(previewRef.current)
  .output("blob");


    const formData = new FormData();
    formData.append("file", pdfBlob, "resume.pdf");
    formData.append("to", resume.contact.email);

    const res = await fetch(
      "http://localhost:8080/api/payment/send-attachment",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      }
    );

    if (!res.ok) {
      throw new Error("Email sending failed");
    }

    alert("✅ Resume sent successfully!");

  } catch (error) {
    console.error(error);
    alert("❌ Failed to send email");
  }
};


  // -------- PREVIEW COMMON --------
  const PreviewSection = ({ title, children }) => (
  <div className="mt-6 pb-4 break-inside-avoid">
    <h3 className="font-bold border-b mb-3 pb-1">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

  const CommonPreview = () => (
    <>
      <PreviewSection title="Contact">
        <p>{resume.contact.email}</p>
        <p>{resume.contact.phone}</p>
        <p>{resume.contact.linkedin}</p>
        <p>{resume.contact.github}</p>
      </PreviewSection>

      <PreviewSection title="Experience">
        {resume.experience.map(item => (
          <div key={item.id}>
            <p className="font-semibold">{item.company}</p>
            <p className="text-sm">{item.role} | {item.duration}</p>
            <p className="text-sm">{item.desc}</p>
          </div>
        ))}
      </PreviewSection>

      <PreviewSection title="Projects">
        {resume.projects.map(item => (
          <div key={item.id}>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm">{item.desc}</p>
          </div>
        ))}
      </PreviewSection>

      <PreviewSection title="Education">
        {resume.education.map(item => (
          <div key={item.id}>
            <p>{item.school}</p>
            <p className="text-sm">{item.degree}</p>
          </div>
        ))}
      </PreviewSection>

      <PreviewSection title="Skills">
        {resume.skills.map(item => (
          <span key={item.id} className="mr-2 text-sm">{item.name}</span>
        ))}
      </PreviewSection>

      <PreviewSection title="Certifications">
        {resume.certifications.map(item => (
          <p key={item.id}>{item.name}</p>
        ))}
      </PreviewSection>

      <PreviewSection title="Interests">
        {resume.interests.map(item => (
          <p key={item.id}>{item.name}</p>
        ))}
      </PreviewSection>

      <PreviewSection title="Languages">
        {resume.languages.map(item => (
          <p key={item.id}>{item.name}</p>
        ))}
      </PreviewSection>
    </>
  );

  
  // -------- TEMPLATES --------
  const BasicTemplate = () => (
    <div className="p-10 min-h-[297mm] break-words leading-relaxed">
      <h1 className="text-3xl font-bold">{resume.personal.fullName}</h1>
      <p>{resume.personal.designation}</p>
      <p className="mt-3">{resume.personal.summary}</p>
      <CommonPreview />
    </div>
  );

  const ModernTemplate = () => (
    <div className="flex min-h-[297mm] break-words leading-relaxed">
      <div className="w-1/3 bg-slate-900 text-white p-6">
        <h1>{resume.personal.fullName}</h1>
        <p>{resume.personal.designation}</p>
      </div>
      <div className="flex-1 p-6">
        <p>{resume.personal.summary}</p>
        <CommonPreview />
      </div>
    </div>
  );

  const CorporateTemplate = () => (
    <div className="p-12 font-serif min-h-[297mm] break-words leading-relaxed">
      <h1 className="text-4xl border-b pb-4">{resume.personal.fullName}</h1>
      <p>{resume.personal.designation}</p>
            <p className="mt-3">{resume.personal.summary}</p>
      <CommonPreview />
    </div>
  );

  const DeveloperTemplate = () => (
<div className="bg-black text-green-400 font-mono p-10 min-h-[297mm] break-words leading-relaxed">      <h1>{`> ${resume.personal.fullName}_`}</h1>
      <p>{resume.personal.designation}</p>
            <p className="mt-3">{resume.personal.summary}</p>
      <CommonPreview />
    </div>
  );

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern": return <ModernTemplate />;
      case "corporate": return <CorporateTemplate />;
      case "developer": return <DeveloperTemplate />;
      default: return <BasicTemplate />;
    }
  };
  

return (
  <>
    <style>{printStyles}</style>

    <div className="min-h-screen bg-slate-200 flex flex-col">

      {/* NAVBAR */}
<nav className="no-print h-16 bg-white border-b px-8 flex justify-between items-center">       
   <h1 className="font-black text-lg">PRO RESUME BUILDER</h1>

        <div className="flex items-center gap-3">
  {templates.map(template => (
    <button
      key={template.id}
      onClick={() => handleTemplateChange(template)}
      className="text-xs px-3 py-1 border rounded"
    >
      {template.name}
      {template.premium && subscriptionPlan !== "PREMIUM" && (
        <Lock size={12} className="inline ml-1 text-red-500" />
      )}
    </button>
  )
  
  )}

  {subscriptionPlan !== "PREMIUM" && (
    <button
      onClick={handleUpgrade}
      className="bg-black text-white px-4 py-2 rounded text-xs flex items-center gap-2"
    >
      <Crown size={14}/> Upgrade
    </button>
  )}

<button
  onClick={handleSaveResume}
  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-xs flex items-center gap-2"
>
  Save
</button>

 <button
  onClick={handleSendEmail}
  className="bg-green-600 text-white px-4 py-2 rounded text-xs flex items-center gap-2"
>
  <Mail size={14}/> Send Email
</button>

<button
  onClick={() => window.print()}
  className="bg-blue-600 text-white px-4 py-2 rounded text-xs flex items-center gap-2"
>
  <Download size={14}/> Download
</button>


</div>
      </nav>

      <div className="flex flex-1">

        {/* LEFT EDITOR */}
<aside className="no-print w-1/2 bg-white p-6 overflow-y-auto border-r space-y-6">

          <Section title="Personal">
            <Input label="Full Name" value={resume.personal.fullName}
              onChange={e => handleInput("personal","fullName",e.target.value)} />
            <Input label="Designation" value={resume.personal.designation}
              onChange={e => handleInput("personal","designation",e.target.value)} />
            <Textarea label="Summary" value={resume.personal.summary}
              onChange={e => handleInput("personal","summary",e.target.value)} />
          </Section>

          <Section title="Contact">
            <Input label="Email" value={resume.contact.email}
              onChange={e => handleInput("contact","email",e.target.value)} />
            <Input label="Phone" value={resume.contact.phone}
              onChange={e => handleInput("contact","phone",e.target.value)} />
            <Input label="LinkedIn" value={resume.contact.linkedin}
              onChange={e => handleInput("contact","linkedin",e.target.value)} />
            <Input label="GitHub" value={resume.contact.github}
              onChange={e => handleInput("contact","github",e.target.value)} />
          </Section>

          <ArraySection title="Experience" section="experience"
            fields={["company","role","duration","desc"]}
            resume={resume} addItem={addItem}
            updateItem={updateItem} removeItem={removeItem} />

          <ArraySection title="Projects" section="projects"
            fields={["title","desc"]}
            resume={resume} addItem={addItem}
            updateItem={updateItem} removeItem={removeItem} />

          <ArraySection title="Education" section="education"
            fields={["school","degree"]}
            resume={resume} addItem={addItem}
            updateItem={updateItem} removeItem={removeItem} />

          <ArraySection title="Skills" section="skills"
            fields={["name"]}
            resume={resume} addItem={addItem}
            updateItem={updateItem} removeItem={removeItem} />

          <ArraySection title="Certifications" section="certifications"
            fields={["name"]}
            resume={resume} addItem={addItem}
            updateItem={updateItem} removeItem={removeItem} />

          <ArraySection title="Interests" section="interests"
            fields={["name"]}
            resume={resume} addItem={addItem}
            updateItem={updateItem} removeItem={removeItem} />

          <ArraySection title="Languages" section="languages"
            fields={["name"]}
            resume={resume} addItem={addItem}
            updateItem={updateItem} removeItem={removeItem} />

        </aside>

        {/* RIGHT PREVIEW */}
        <main className="print-container w-1/2 p-10 flex justify-center">
<div ref={previewRef} className="print-area w-[210mm] bg-white shadow-xl">            {renderTemplate()}
          </div>
        </main>

      </div>
    </div></>
  );
};

// ---------- REUSABLE ----------
const Section = ({ title, children }) => (
  <div>
    <h2 className="font-bold mb-3">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-semibold block mb-1">{label}</label>
    <input {...props} className="w-full border p-2 rounded" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-semibold block mb-1">{label}</label>
    <textarea {...props} rows={3} className="w-full border p-2 rounded" />
  </div>
);

const ArraySection = ({ title, section, fields, resume, addItem, updateItem, removeItem }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h2 className="font-bold">{title}</h2>
      <button
        onClick={() => addItem(section, fields)}
        className="text-blue-600 text-xs flex items-center gap-1">
        <Plus size={14}/> Add
      </button>
    </div>

    {resume[section].map(item => (
      <div key={item.id} className="border p-3 rounded mb-3 bg-slate-50 space-y-2">
        {fields.map(field => (
          <input key={field}
            className="w-full border p-2 rounded text-sm"
            placeholder={field}
            value={item[field]}
            onChange={e => updateItem(section,item.id,field,e.target.value)} />
        ))}
        <button
          onClick={() => removeItem(section,item.id)}
          className="text-red-500 text-xs flex items-center gap-1">
          <Trash2 size={14}/> Remove
        </button>
      </div>
    ))}
  </div>
);
const printStyles = `
@media print {

  body {
    margin: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .no-print {
    display: none !important;
  }

  .print-container {
    width: 100% !important;
    padding: 0 !important;
  }

  .print-container > div {
    width: 210mm !important;
    margin: 0 auto !important;
    box-shadow: none !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page {
    size: A4;
    margin: 10mm;
  }
}
`;
export default ProResumeBuilder;