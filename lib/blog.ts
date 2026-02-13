export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  url: string;
  thumbnail?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "multi-agent-orchestration",
    title: "Building Reliable Multi-Agent Systems: Lessons from ARKIS",
    excerpt:
      "How we designed a hierarchical agent architecture that achieves 94% task completion rate on complex multi-step workflows.",
    date: "2024-12-15",
    readTime: "8 min read",
    tags: ["Multi-Agent", "LLM", "Architecture"],
    url: "https://medium.com/@pratikpriyanshu12345/what-it-really-takes-to-evaluate-quantum-machine-learning-c0960219943f",
  },
  {
    id: "quantum-ml-primer",
    title: "A Practical Guide to Hybrid Quantum-Classical ML",
    excerpt:
      "Demystifying quantum machine learning: when it helps, when it doesn't, and how to get started with variational quantum circuits.",
    date: "2024-11-20",
    readTime: "12 min read",
    tags: ["Quantum", "ML", "Research"],
    url: "https://medium.com",
  },
  {
    id: "edge-ai-optimization",
    title: "Deploying ML Models to Edge: A Compression Toolkit",
    excerpt:
      "Practical techniques for achieving 85% model size reduction while retaining 98%+ accuracy for edge deployment.",
    date: "2024-10-08",
    readTime: "10 min read",
    tags: ["Edge AI", "Optimization", "Deployment"],
    url: "https://medium.com",
  },
];
