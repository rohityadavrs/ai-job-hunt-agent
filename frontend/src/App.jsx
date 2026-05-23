import {useState, useRef} from "react";
import { parseResume, searchJobs, generateCoverLetter } from "./services/api";

const STEPS = ["upload", "parsing", "profile", "searching", "results", "applying"];

function StepDots({step}) {
    const active = ["upload", "profile", "results", "applying"];
    const labels = ["Resume", "Profile", "Jobs", "Apply"];
    const cur = step === "parsing" ? 0 : step === "searching" ? 2 : active.indexOf(step);
    return (
        <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 32}}>
            {labels.map((l, i) => (
                <div key={l} style={{display: "flex", alignItems: "center", gap: 8}}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        opacity: i > cur ? 0.35 : 1,
                        transition: "opacity 0.3s"
                    }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            background: i < cur ? "var(--color-text-primary)" : i === cur ? "var(--color-text-primary)" : "transparent",
                            border: "1.5px solid var(--color-text-primary)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 500,
                            color: i <= cur ? "var(--color-background-primary)" : "var(--color-text-primary)",
                            transition: "all 0.3s"
                        }}>
                            {i < cur ? <i className="ti ti-check" style={{fontSize: 12}}/> : i + 1}
                        </div>
                        <span style={{
                            fontSize: 13,
                            fontWeight: i === cur ? 500 : 400,
                            color: "var(--color-text-secondary)"
                        }}>{l}</span>
                    </div>
                    {i < 3 && <div style={{
                        width: 24,
                        height: 1,
                        background: "var(--color-border-tertiary)",
                        opacity: i >= cur ? 0.5 : 1
                    }}/>}
                </div>
            ))}
        </div>
    );
}

function LoadingPulse({message}) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 0",
            gap: 16
        }}>
            <div style={{display: "flex", gap: 6}}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "var(--color-text-primary)",
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                        opacity: 0.4
                    }}/>
                ))}
            </div>
            <p style={{fontSize: 14, color: "var(--color-text-secondary)", margin: 0}}>{message}</p>
            <style>{`@keyframes pulse { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }`}</style>
        </div>
    );
}

function SkillBadge({skill}) {
    return (
        <span style={{
            fontSize: 12, padding: "3px 10px", borderRadius: 20,
            border: "0.5px solid var(--color-border-secondary)",
            color: "var(--color-text-secondary)",
            background: "var(--color-background-secondary)",
            whiteSpace: "nowrap"
        }}>{skill}</span>
    );
}

function MatchBadge({score}) {
    const color = score >= 90 ? "var(--color-background-success)" : score >= 80 ? "var(--color-background-warning)" : "var(--color-background-secondary)";
    const text = score >= 90 ? "var(--color-text-success)" : score >= 80 ? "var(--color-text-warning)" : "var(--color-text-secondary)";
    return (
        <span style={{
            fontSize: 12,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 6,
            background: color,
            color: text
        }}>
      {score}% match
    </span>
    );
}

export default function App() {
    const [step, setStep] = useState("upload");
    const [resumeText, setResumeText] = useState("");
    const [pdfBase64, setPdfBase64] = useState(null);
    const [pdfName, setPdfName] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [profile, setProfile] = useState(null);
    const [editProfile, setEditProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;

        setPdfFile(file);

        if (file.type === "application/pdf") {
            const reader = new FileReader();

            reader.onload = (e) => {
                setPdfBase64(e.target.result.split(",")[1]);
                setPdfName(file.name);
                setResumeText("");
            };

            reader.readAsDataURL(file);

        } else {

            file.text().then(t => {
                setResumeText(t);
                setPdfBase64(null);
                setPdfName("");
            });
        }
    };

    const parseResume = async () => {
        if (!resumeText.trim() && !pdfFile) return;

        setError(null);
        setLoading(true);
        setLoadingMsg("Analysing your resume...");
        setStep("parsing");

        try {

            const formData = new FormData();

            if (pdfFile) {
                formData.append("file", pdfFile);
            }

            if (resumeText.trim()) {
                formData.append("resume_text", resumeText);
            }

            const parsed = await parseResume(pdfFile || new File(
                [resumeText], "resume.txt", { type: "text/plain" }
            ));

            setProfile(parsed);

            setEditProfile({
                ...parsed,
                skills: parsed.skills?.join(", ") || ""
            });

            setStep("profile");

        } catch (e) {

            setError(
                "Could not parse resume: " + e.message
            );

            setStep("upload");

        } finally {

            setLoading(false);
        }
    };

    const searchJobs = async () => {

        const finalProfile = {

            ...editProfile,

            skills:
                editProfile.skills
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean)

        };

        setProfile(finalProfile);

        setError(null);

        setLoading(true);

        setLoadingMsg(
            "Searching jobs..."
        );

        setStep("searching");


        try {

            const data = await searchJobs(finalProfile.desiredRole);
            setJobs(data.jobs || []);
            setStep("results");


        } catch (e) {

            setError(
                "Job search failed: "
                + e.message
            );

            setStep("profile");

        } finally {

            setLoading(false);

        }

    };

    const applyToJob = async (job) => {
        setSelectedJob(job);
        setStep("applying");
        setGenerating(true);
        setCoverLetter("");
        try {
            const resumeText = `${profile.name}, ${profile.currentTitle}, ${profile.yearsExperience} yrs exp. Skills: ${profile.skills.join(", ")}. ${profile.summary}`;
            const jobDescription = `${job.title} at ${job.company} (${job.location}). ${job.description}. Requirements: ${job.requirements.join(", ")}.`;
            const result = await generateCoverLetter({ resume_text: resumeText, job_description: jobDescription });
            setCoverLetter(result.cover_letter);
        } catch (e) {
            setCoverLetter("Could not generate cover letter. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const card = {
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1rem 1.25rem"
    };

    if (step === "parsing") return (
        <div style={{padding: "1rem 0"}}>
            <StepDots step={step}/>
            <LoadingPulse message={loadingMsg}/>
        </div>
    );

    if (step === "searching") return (
        <div style={{padding: "1rem 0"}}>
            <StepDots step={step}/>
            <LoadingPulse message={loadingMsg}/>
        </div>
    );

    if (step === "applying") return (
        <div style={{padding: "1rem 0"}}>
            <StepDots step={step}/>
            <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 20}}>
                <button onClick={() => setStep("results")} style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "var(--color-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14
                }}>
                    <i className="ti ti-arrow-left" style={{fontSize: 16}}/> Back
                </button>
                <h2 style={{margin: 0, fontSize: 18, fontWeight: 500}}>Apply: {selectedJob?.title}</h2>
            </div>

            <div style={{...card, marginBottom: 16}}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 8
                }}>
                    <div>
                        <p style={{margin: 0, fontWeight: 500, fontSize: 15}}>{selectedJob?.company}</p>
                        <p style={{margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)"}}>
                            <i className="ti ti-map-pin" style={{fontSize: 13, verticalAlign: -1, marginRight: 4}}
                               aria-hidden/>
                            {selectedJob?.location}
                            {selectedJob?.salary && <> · {selectedJob.salary}</>}
                        </p>
                    </div>
                    <a
                        href={selectedJob?.applyUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "8px 16px", borderRadius: "var(--border-radius-md)",
                            background: "var(--color-text-primary)", color: "var(--color-background-primary)",
                            fontSize: 13, fontWeight: 500, textDecoration: "none", cursor: "pointer",
                            border: "none"
                        }}
                    >
                        Open job page <i className="ti ti-external-link" style={{fontSize: 14}}/>
                    </a>
                </div>
            </div>

            <div style={{...card}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
                    <h3 style={{margin: 0, fontSize: 15, fontWeight: 500}}>Cover letter</h3>
                    {!generating && coverLetter && (
                        <button onClick={copy} style={{
                            background: "none",
                            border: "0.5px solid var(--color-border-secondary)",
                            borderRadius: "var(--border-radius-md)",
                            padding: "4px 12px",
                            cursor: "pointer",
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            color: "var(--color-text-secondary)"
                        }}>
                            <i className={`ti ti-${copied ? "check" : "copy"}`} style={{fontSize: 14}}/>
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    )}
                </div>
                {generating
                    ? <LoadingPulse message="Crafting your cover letter…"/>
                    : <pre style={{
                        margin: 0,
                        fontFamily: "var(--font-sans)",
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "var(--color-text-primary)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word"
                    }}>{coverLetter}</pre>
                }
            </div>
        </div>
    );

    if (step === "results") return (
        <div style={{padding: "1rem 0"}}>
            <StepDots step={step}/>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
                <div>
                    <h2 style={{margin: 0, fontSize: 18, fontWeight: 500}}>{jobs.length} jobs found</h2>
                    <p style={{margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)"}}>Based on your
                        profile · Freshly searched</p>
                </div>
                <button onClick={() => setStep("profile")} style={{
                    background: "none",
                    border: "0.5px solid var(--color-border-secondary)",
                    borderRadius: "var(--border-radius-md)",
                    padding: "6px 14px",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--color-text-secondary)"
                }}>
                    Edit profile
                </button>
            </div>
            {error && <p style={{color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12}}>{error}</p>}
            <div style={{display: "grid", gap: 12}}>
                {jobs.map(job => (
                    <div key={job.id} style={{...card, transition: "border-color 0.2s"}}
                         onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-border-secondary)"}
                         onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border-tertiary)"}
                    >
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 12,
                            flexWrap: "wrap"
                        }}>
                            <div style={{flex: 1}}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap",
                                    marginBottom: 4
                                }}>
                                    <span style={{fontWeight: 500, fontSize: 15}}>{job.title}</span>
                                    <MatchBadge score={job.matchScore}/>
                                </div>
                                <p style={{margin: 0, fontSize: 13, color: "var(--color-text-secondary)"}}>
                                    {job.company} · {job.location}
                                    {job.salary && <> · <span
                                        style={{color: "var(--color-text-primary)"}}>{job.salary}</span></>}
                                    <span style={{marginLeft: 8, opacity: 0.6}}>{job.posted}</span>
                                </p>
                                <p style={{
                                    margin: "8px 0",
                                    fontSize: 13,
                                    lineHeight: 1.6,
                                    color: "var(--color-text-secondary)"
                                }}>{job.description}</p>
                                <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
                                    {(job.requirements || []).slice(0, 4).map(r => <SkillBadge key={r} skill={r}/>)}
                                </div>
                            </div>
                            <button
                                onClick={() => applyToJob(job)}
                                style={{
                                    padding: "8px 18px", borderRadius: "var(--border-radius-md)",
                                    background: "var(--color-text-primary)", color: "var(--color-background-primary)",
                                    border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                                    display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0
                                }}
                            >
                                Apply <i className="ti ti-arrow-right" style={{fontSize: 14}}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (step === "profile") {
        const p = editProfile || {};
        const field = (label, key, multi = false) => (
            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                <label style={{fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500}}>{label}</label>
                {multi
                    ? <textarea value={p[key] || ""}
                                onChange={e => setEditProfile(prev => ({...prev, [key]: e.target.value}))}
                                rows={2} style={{fontSize: 14, resize: "vertical", lineHeight: 1.5}}/>
                    : <input value={p[key] || ""}
                             onChange={e => setEditProfile(prev => ({...prev, [key]: e.target.value}))}
                             style={{fontSize: 14}}/>
                }
            </div>
        );
        return (
            <div style={{padding: "1rem 0"}}>
                <StepDots step={step}/>
                <h2 style={{margin: "0 0 4px", fontSize: 18, fontWeight: 500}}>Your profile</h2>
                <p style={{margin: "0 0 20px", fontSize: 13, color: "var(--color-text-secondary)"}}>Review and edit
                    before we search for jobs</p>
                {error && <p style={{color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12}}>{error}</p>}
                <div style={{...card, display: "grid", gap: 16}}>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
                        {field("Name", "name")}
                        {field("Current title", "currentTitle")}
                    </div>
                    {field("Desired role (we'll search for this)", "desiredRole")}
                    {field("Skills (comma-separated)", "skills")}
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
                        {field("Location", "location")}
                        {field("Years of experience", "yearsExperience")}
                    </div>
                    {field("Education", "education")}
                    {field("Professional summary", "summary", true)}
                </div>
                <button
                    onClick={searchJobs}
                    style={{
                        marginTop: 20, width: "100%", padding: "12px 0",
                        borderRadius: "var(--border-radius-md)",
                        background: "var(--color-text-primary)", color: "var(--color-background-primary)",
                        border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                    }}
                >
                    <i className="ti ti-search" style={{fontSize: 16}}/>
                    Find matching jobs
                </button>
            </div>
        );
    }

    return (
        <div style={{padding: "1rem 0"}}>
            <StepDots step={step}/>
            <h2 style={{margin: "0 0 4px", fontSize: 18, fontWeight: 500}}>Upload your resume</h2>
            <p style={{margin: "0 0 20px", fontSize: 13, color: "var(--color-text-secondary)"}}>PDF or paste your resume
                text — we'll extract your profile and find matching jobs</p>
            {error && <p style={{color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12}}>{error}</p>}

            <div
                onClick={() => fileRef.current.click()}
                onDragOver={e => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFile(e.dataTransfer.files[0]);
                }}
                style={{
                    border: `1.5px dashed ${dragOver ? "var(--color-border-primary)" : "var(--color-border-secondary)"}`,
                    borderRadius: "var(--border-radius-lg)",
                    padding: "28px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? "var(--color-background-secondary)" : "transparent",
                    marginBottom: 16,
                    transition: "all 0.2s"
                }}
            >
                <input ref={fileRef} type="file" accept=".pdf,.txt,.doc" style={{display: "none"}}
                       onChange={e => handleFile(e.target.files[0])}/>
                {pdfBase64 ? (
                    <>
                        <i className="ti ti-file-text" style={{
                            fontSize: 28,
                            color: "var(--color-text-secondary)",
                            marginBottom: 8,
                            display: "block"
                        }}/>
                        <p style={{margin: 0, fontWeight: 500, fontSize: 14}}>{pdfName}</p>
                        <p style={{margin: "4px 0 0", fontSize: 12, color: "var(--color-text-secondary)"}}>PDF ready ·
                            Click to change</p>
                    </>
                ) : (
                    <>
                        <i className="ti ti-upload" style={{
                            fontSize: 28,
                            color: "var(--color-text-secondary)",
                            marginBottom: 8,
                            display: "block"
                        }}/>
                        <p style={{margin: 0, fontWeight: 500, fontSize: 14}}>Drop your PDF here</p>
                        <p style={{margin: "4px 0 0", fontSize: 12, color: "var(--color-text-secondary)"}}>or click to
                            browse</p>
                    </>
                )}
            </div>

            <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 16}}>
                <div style={{flex: 1, height: "0.5px", background: "var(--color-border-tertiary)"}}/>
                <span style={{fontSize: 12, color: "var(--color-text-tertiary)"}}>or paste text</span>
                <div style={{flex: 1, height: "0.5px", background: "var(--color-border-tertiary)"}}/>
            </div>

            <textarea
                value={resumeText}
                onChange={e => {
                    setResumeText(e.target.value);
                    if (e.target.value) {
                        setPdfBase64(null);
                        setPdfName("");
                    }
                }}
                placeholder="Paste your resume text here…"
                rows={8}
                style={{width: "100%", boxSizing: "border-box", fontSize: 13, lineHeight: 1.6, resize: "vertical"}}
            />

            <button
                onClick={parseResume}
                disabled={!resumeText.trim() && !pdfBase64}
                style={{
                    marginTop: 16, width: "100%", padding: "12px 0",
                    borderRadius: "var(--border-radius-md)",
                    background: (resumeText.trim() || pdfBase64) ? "var(--color-text-primary)" : "var(--color-background-secondary)",
                    color: (resumeText.trim() || pdfBase64) ? "var(--color-background-primary)" : "var(--color-text-tertiary)",
                    border: "none", cursor: (resumeText.trim() || pdfBase64) ? "pointer" : "not-allowed",
                    fontSize: 14, fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.2s"
                }}
            >
                <i className="ti ti-sparkles" style={{fontSize: 16}}/>
                Parse resume & find jobs
            </button>
        </div>
    );
}
