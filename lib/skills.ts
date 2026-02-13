export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  emoji: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    emoji: "💻",
    skills: [
      { name: "Python" },
      { name: "C++" },
      { name: "TypeScript" },
      { name: "SQL" },
    ],
  },
  {
    title: "ML Frameworks",
    emoji: "🧠",
    skills: [
      { name: "PyTorch" },
      { name: "TensorFlow" },
      { name: "JAX" },
      { name: "Keras" },
      { name: "scikit-learn" },
      { name: "Hugging Face" },
    ],
  },
  {
    title: "Deep Learning",
    emoji: "🔬",
    skills: [
      { name: "Transformers" },
      { name: "CNNs" },
      { name: "GANs" },
      { name: "RNNs/LSTMs" },
      { name: "Diffusion Models" },
      { name: "Graph Neural Nets" },
    ],
  },
  {
    title: "LLM & Agents",
    emoji: "🤖",
    skills: [
      { name: "LangChain" },
      { name: "LangGraph" },
      { name: "RAG" },
      { name: "Fine-tuning" },
      { name: "Prompt Engineering" },
      { name: "Multi-Agent Systems" },
    ],
  },
  {
    title: "MLOps & Infra",
    emoji: "⚙️",
    skills: [
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "MLflow" },
      { name: "Weights & Biases" },
      { name: "DVC" },
      { name: "Airflow" },
    ],
  },
  {
    title: "Data & Databases",
    emoji: "📊",
    skills: [
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Redis" },
      { name: "Pinecone" },
      { name: "ChromaDB" },
      { name: "Pandas" },
    ],
  },
  {
    title: "Cloud & Compute",
    emoji: "☁️",
    skills: [
      { name: "AWS" },
      { name: "GCP" },
      { name: "CUDA" },
      { name: "TensorRT" },
      { name: "NVIDIA Jetson" },
    ],
  },
  {
    title: "Quantum Computing",
    emoji: "⚛️",
    skills: [
      { name: "Qiskit" },
      { name: "PennyLane" },
      { name: "Cirq" },
      { name: "JAX" },
      { name: "FLAX" },
      { name: "Quantum ML" },
    ],
  },
  {
    title: "Tools & Practices",
    emoji: "🛠️",
    skills: [
      { name: "Git" },
      { name: "Linux" },
      { name: "CI/CD" },
      { name: "FastAPI" },
      { name: "Jupyter" },
      { name: "VS Code" },
    ],
  },
];
