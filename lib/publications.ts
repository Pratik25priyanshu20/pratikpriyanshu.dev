export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  status: "published" | "under-review";
  abstract: string;
  highlights: string[];
  links: { label: string; url: string }[];
  color: string;
}

export const publications: Publication[] = [
  {
    id: "promid",
    title:
      "Detecting 2022 Russo-Ukrainian Conflict Misinformation Using a Hybrid Transformer Approach",
    authors: "Pratik Priyanshu",
    venue:
      "PROMID Shared Task, FIRE 2025 (Forum for Information Retrieval Evaluation), CEUR Workshop Proceedings, Vol. 4173",
    year: 2025,
    status: "published",
    abstract:
      "Hybrid XLM-RoBERTa system with engineered linguistic features for conflict misinformation detection under extreme class imbalance (94:1 ratio) on 34K+ tweets.",
    highlights: [
      "0.918 weighted F1, recall 0.94, precision 0.87",
      "Addressed 94:1 class imbalance via class-weighted loss and decision threshold tuning",
      "Fused XLM-RoBERTa embeddings with 15 engineered linguistic features",
    ],
    links: [
      {
        label: "Paper",
        url: "https://ceur-ws.org/Vol-4173/T1-10.pdf",
      },
    ],
    color: "#3b82f6",
  },
  {
    id: "cmsci-paper",
    title:
      "Calibrated Multimodal Semantic Coherence Index (cMSCI)",
    authors: "Pratik Priyanshu",
    venue: "Manuscript under review",
    year: 2026,
    status: "under-review",
    abstract:
      "Calibrated uncertainty-aware evaluation metric for tri-modal (text-image-audio) coherence, extending GRAM (ICLR 2025) to heterogeneous embedding spaces with probabilistic scoring via ProbVLM and contrastive calibration.",
    highlights: [
      "Statistically significant human correlation (\u03C1 = 0.379, p = 0.039, ICC = 0.70)",
      "270 controlled experimental runs with effect sizes d > 2.2",
      "Outperformed CLIPScore, BLIPScore, and CCA baselines",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/Pratik25priyanshu20/MultiModal-Coherence-Evaluation-and-Generation",
      },
    ],
    color: "#a855f7",
  },
];
