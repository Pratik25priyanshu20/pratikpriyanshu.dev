export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  url: string;
  thumbnail?: string;
  comingSoon?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "quantum-ml-evaluation",
    title: "What It Really Takes to Evaluate Quantum Machine Learning",
    excerpt:
      "Why most QML benchmarks are misleading, and what a rigorous evaluation framework actually looks like: scaffold splits, uncertainty estimation, and trainability diagnostics.",
    date: "2025-01-10",
    readTime: "12 min read",
    tags: ["Quantum", "ML", "Research"],
    url: "https://medium.com/@pratikpriyanshu12345/what-it-really-takes-to-evaluate-quantum-machine-learning-c0960219943f",
  },
  {
    id: "quantum-ml-platform",
    title: "Building a Reproducible Classical Quantum ML Platform for Molecular Prediction",
    excerpt:
      "End to end walkthrough of building a config-driven, reproducible framework for fair comparison of classical GNNs, variational quantum circuits, and hybrid architectures.",
    date: "2025-01-05",
    readTime: "10 min read",
    tags: ["Quantum", "ML", "Architecture"],
    url: "https://dev.to/pratik25priyanshu20/building-a-reproducible-classical-quantum-ml-platform-for-molecular-prediction-1hl0",
  },
  {
    id: "production-rag-deep-dive",
    title: "Production RAG Systems: A Deep Dive",
    excerpt:
      "From naive retrieval to trust-aware, multi-agent RAG: domain gating, contradiction detection, confidence calibration, and epistemic safety in production.",
    date: "2025-02-01",
    readTime: "15 min read",
    tags: ["GenAI", "RAG", "Architecture"],
    comingSoon: true,
    url: "#",
  },
];
