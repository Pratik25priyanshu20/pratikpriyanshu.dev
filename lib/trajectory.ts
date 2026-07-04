export interface Milestone {
  id: string;
  /** position along the timeline, 0..1 */
  x: number;
  /** flare height in px — significance */
  h: number;
  /** short always-visible label */
  label: string;
  date: string;
  title: string;
  blurb: string;
  color: string;
  tag?: string;
}

export const milestones: Milestone[] = [
  {
    id: "btech",
    label: "B.Tech",
    x: 0.04,
    h: 18,
    date: "2023",
    title: "B.Tech, Computer Science",
    blurb: "Thesis: deep learning for melanoma detection from dermatoscopic images.",
    color: "#a0a0a0",
  },
  {
    id: "msc",
    label: "M.Sc.",
    x: 0.15,
    h: 24,
    date: "Oct 2024",
    title: "M.Sc. begins — SRH Heidelberg",
    blurb: "Applied Data Science & Analytics. The research arc starts here.",
    color: "#60a5fa",
  },
  {
    id: "arkis",
    label: "ARKIS",
    x: 0.23,
    h: 34,
    date: "Winter 2024–25",
    title: "ARKIS",
    blurb: "Trust-aware agentic RAG with contradiction-penalized confidence.",
    color: "#3b82f6",
  },
  {
    id: "autobahn",
    label: "ADAS",
    x: 0.3,
    h: 32,
    date: "Early 2025",
    title: "Autobahn — ADAS stack",
    blurb: "Camera/LiDAR/radar fusion with ISO 26262 safety architecture.",
    color: "#06b6d4",
  },
  {
    id: "swim",
    label: "SWIM",
    x: 0.38,
    h: 52,
    date: "Mar–Sep 2025",
    title: "SWIM",
    blurb: "5-agent system forecasting harmful algal blooms across German lakes.",
    color: "#10b981",
  },
  {
    id: "jurag",
    label: "JuRAG",
    x: 0.47,
    h: 36,
    date: "Oct–Dec 2025",
    title: "JuRAG",
    blurb: "Retrieval & faithfulness evaluation over 251k German court decisions.",
    color: "#ef4444",
  },
  {
    id: "promid",
    label: "FIRE '25",
    x: 0.56,
    h: 52,
    date: "Dec 2025",
    title: "First publication — FIRE 2025",
    blurb: "PROMID shared task, ranked 4th. CEUR Workshop Proceedings Vol. 4173.",
    color: "#3b82f6",
    tag: "published",
  },
  {
    id: "cmsci",
    label: "cMSCI",
    x: 0.65,
    h: 74,
    date: "Jan–Mar 2026",
    title: "cMSCI",
    blurb: "Tri-modal coherence metric, ρ = 0.785 vs human judgment. Under review.",
    color: "#a855f7",
    tag: "under review",
  },
  {
    id: "exoveil",
    label: "ExoVeil",
    x: 0.76,
    h: 98,
    date: "Dec 2025 – May 2026",
    title: "ExoVeil — arXiv + PyPI",
    blurb: "Single-transit exoplanet detection. 179 new candidates, 47/47 zero-shot TESS.",
    color: "#facc15",
    tag: "arXiv:2606.02778",
  },
  {
    id: "clef",
    label: "CLEF '26",
    x: 0.85,
    h: 68,
    date: "2026",
    title: "CLEF 2026 — two shared tasks",
    blurb: "1st in ImageCLEF Textual MCQ; CultuRAG at ELOQUENT. Working notes under review.",
    color: "#06b6d4",
    tag: "1st place",
  },
  {
    id: "hnep",
    label: "HNEP",
    x: 0.93,
    h: 94,
    date: "Mar 2026 – present",
    title: "HNEP — M.Sc. thesis",
    blurb: "Quantum Contribution Taxonomy. pip install hnep. Defence: July 2026.",
    color: "#8b5cf6",
    tag: "thesis",
  },
];

export const yearTicks = [
  { x: 0.04, label: "2023" },
  { x: 0.15, label: "2024" },
  { x: 0.47, label: "2025" },
  { x: 0.8, label: "2026" },
];
