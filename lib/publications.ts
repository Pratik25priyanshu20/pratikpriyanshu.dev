export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  status: "published" | "under-review" | "preprint";
  abstract: string;
  highlights: string[];
  links: { label: string; url: string }[];
  color: string;
}

export const publications: Publication[] = [
  {
    id: "exoveil-paper",
    title:
      "ExoVeil: Detecting Single-Transit Exoplanets Through Learned Stellar Behaviour",
    authors: "Pratik Priyanshu",
    venue: "arXiv preprint 2606.02778 — in preparation for A&A submission",
    year: 2026,
    status: "preprint",
    abstract:
      "A self-supervised Transformer world model that predicts stellar brightness from raw flux and treats transits as anomalies — enabling single-transit detection where phase-folding classifiers (ExoMiner, AstroNet, RAVEN) score 0%. Combines matched-filter detection, XGBoost classification, and split conformal prediction with aleatoric/epistemic uncertainty decomposition.",
    highlights: [
      "AUC 0.938 on Kepler DR25; 179 new transit-like signals in a blind search of 3,737 stars (46 vetted monotransit candidates)",
      "Zero-shot cross-mission transfer: 47/47 confirmed TESS planets in the PLATO LOPS2 field recovered without retraining",
      "First application of conformal prediction to transit detection (95.9% empirical coverage at 95% nominal)",
    ],
    links: [
      { label: "arXiv", url: "https://arxiv.org/abs/2606.02778" },
      { label: "PyPI", url: "https://pypi.org/project/exoveil/" },
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/ExoVeil" },
    ],
    color: "#facc15",
  },
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
      "Hybrid XLM-RoBERTa system with engineered linguistic features for conflict misinformation detection under extreme class imbalance (94:1 ratio) on 34K+ tweets. Ranked 4th in the PROMID shared task.",
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
    id: "imageclef-2026",
    title:
      "ImageCLEF 2026 — Multimodal Reasoning: QLoRA Fine-Tuning of Qwen3-VL for Multilingual Exam Question Answering",
    authors: "Pratik Priyanshu",
    venue: "CLEF 2026 Working Notes (under review)",
    year: 2026,
    status: "under-review",
    abstract:
      "Fine-tuned Qwen3-VL-8B-Thinking with QLoRA on EXAMS-V for multilingual exam question answering across 6 languages and 32 subjects, targeting both textual multiple-choice and open-question answering tracks.",
    highlights: [
      "Ranked 1st in Textual MCQ (0.754 accuracy) on the official ImageCLEF 2026 leaderboard",
      "Ranked 2nd in Textual OpenQA (COMET 0.529) among all participating systems",
      "Evaluated across 6 languages and 32 subject areas from EXAMS-V",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/Pratik25priyanshu20/imageclef-multimodal-reasoning-2026-",
      },
    ],
    color: "#06b6d4",
  },
  {
    id: "eloquent-2026",
    title:
      "ELOQUENT 2026 — CultuRAG: Explicit Cultural Grounding for Multilingual LLMs",
    authors: "Pratik Priyanshu",
    venue: "CLEF 2026 Working Notes (under review)",
    year: 2026,
    status: "under-review",
    abstract:
      "Proposed CultuRAG, an explicit cultural-grounding method for multilingual LLMs that retrieves culturally-anchored context in the target language to raise cultural specificity in generated responses.",
    highlights: [
      "+34% cultural-specificity score (CSP) on Qwen2.5-32B via explicit cultural grounding",
      "Native-language retrieval outperformed English-language context by an additional 11%",
      "Evaluated on the ELOQUENT 2026 shared task at CLEF",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/Pratik25priyanshu20/eloquent-cultural-robustness-2026-",
      },
    ],
    color: "#10b981",
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
      "A novel geometric metric for tri-modal (text-image-audio) coherence that integrates Gramian volume geometry, contrastive calibration, and training-free Matryoshka scale-consistency estimation. Instantiated on both dual-space (CLIP+CLAP) and unified-space (Gemini Embedding 2) backbones; ensemble of uncorrelated errors outperforms either individually.",
    highlights: [
      "Spearman ρ = 0.785 (p < 10⁻⁶), ICC(3,k) = 0.872 on 100 human-annotated samples",
      "Embedding-agnostic across dual-space (CLIP+CLAP, 512-d) and unified-space (Gemini Embedding 2, 3072-d)",
      "630+ controlled experimental runs; outperformed cosine+z-norm, CCA, CLIPScore, and retrieval-rank baselines",
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
