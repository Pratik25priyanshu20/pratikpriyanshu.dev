export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  challenge: string;
  approach: string;
  implementation: string[];
  metrics: { label: string; value: string }[];
  learnings: string[];
  researchContribution?: string[];
  whyThisMatters?: string;
  techStack: string[];
  links: { label: string; url: string }[];
  color: string;
}

export const projects: Project[] = [
  {
    id: "arkis",
    title: "ARKIS | Trust-Aware Agentic RAG System",
    tagline: "Epistemically-grounded multi-agent retrieval system with contradiction detection and adaptive hybrid retrieval",
    description:
      "A research-grade, trust-aware Retrieval-Augmented Generation (RAG) system that integrates domain gating, hybrid retrieval, evidence clustering, contradiction detection, and confidence calibration to minimize hallucinations in high-stakes environments.",
    challenge:
      "Modern RAG systems generate answers even when evidence is weak, leading to hallucinations in high-stakes domains such as legal, security, and enterprise AI. There is no principled mechanism to enforce domain boundaries, deduplicate redundant evidence, detect contradictory sources, penalize unsafe synthesis, or calibrate confidence based on epistemic risk.",
    approach:
      "Designed a hierarchical, agentic RAG architecture that enforces epistemic safety at every stage: Domain Gating Agent prevents out-of-scope queries; Adaptive Hybrid Retrieval combines dense embeddings (BGE-large) with BM25 keyword search; Evidence Extraction Agent restricts synthesis to explicit statements only; Evidence Scoring & Clustering provides relevance scoring with redundancy reduction; Contradiction Detection Agent performs pairwise semantic conflict analysis; Confidence Calibration Layer penalizes contradictory evidence; Curator Agent logs knowledge gaps for active learning.",
    implementation: [
      "Built LangGraph-based multi-agent orchestration pipeline",
      "Implemented hybrid retrieval (cosine similarity + BM25 fusion with \u03b1-weighting)",
      "Developed evidence clustering using Union-Find algorithm",
      "Integrated pairwise contradiction detection via LLM-based semantic comparison",
      "Designed confidence scoring combining grounding score, LLM synthesis score, and contradiction penalty (capped at 0.4)",
      "Implemented partial-answer policy for sparse evidence",
      "Created JSON-based knowledge gap logging for dataset expansion",
      "Developed evaluation harness to measure hallucination mitigation",
    ],
    metrics: [
      { label: "Unit Tests (Pillar 2)", value: "29+" },
      { label: "Hallucination Mitigation", value: "4-Layer" },
      { label: "Avg Confidence", value: "0.78" },
      { label: "Ungrounded Responses", value: "0%" },
    ],
    learnings: [
      "Retrieval quality is not sufficient \u2014 evidence filtering is critical",
      "Hybrid retrieval reduces false negatives in keyword-sensitive queries",
      "Redundant evidence inflates confidence without increasing correctness",
      "Contradiction-aware synthesis improves trust calibration",
      "Logging epistemic failures enables active knowledge base improvement",
    ],
    researchContribution: [
      "Formalized hallucination mitigation as a multi-stage epistemic filtering process",
      "Introduced contradiction-penalized confidence calibration",
      "Designed decision-centric logging for knowledge gap tracking",
      "Proposed theoretical direction: information-theoretic analysis of retrieval-conditioned generation",
    ],
    whyThisMatters:
      "ARKIS demonstrates how agentic architectures can move beyond heuristic RAG systems toward trust-aware, verifiable AI systems suitable for enterprise and safety-critical applications.",
    techStack: [
      "Python",
      "LangGraph",
      "SentenceTransformers (BGE)",
      "Qdrant",
      "BM25",
      "Hybrid Retrieval",
      "FastAPI",
      "Redis",
      "Docker",
      "Ollama (LLaMA 3)",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/ARKIS-Agentic-RAG" },
    ],
    color: "#3b82f6",
  },
  {
    id: "quantum",
    title: "Quantum ML | Hybrid Classical Quantum Architectures",
    tagline: "Reproducible experimental framework for evaluating classical, quantum, and hybrid architectures on molecular property prediction",
    description:
      "A research-grade framework for fair, controlled comparison of classical graph neural networks, variational quantum circuits, and hybrid classical\u2013quantum architectures for molecular property prediction. Rather than assuming quantum advantage, the goal is to isolate architectural effects under consistent data preprocessing, batching, training, and evaluation protocols.",
    challenge:
      "Quantum machine learning is frequently demonstrated on small-scale examples with weak classical baselines and limited evaluation protocols. Such setups make it difficult to assess whether hybrid architectures offer meaningful benefits beyond classical alternatives. This project addresses that gap by implementing strong classical graph baselines (GNN, GAT, MPNN+GRU+Set2Set), designing enhanced variational quantum circuits with data re-uploading and hardware-aware ans\u00e4tze, introducing a gated hybrid architecture with dimension-matched fusion, enforcing scaffold-based generalization splits, and incorporating uncertainty estimation with quantum trainability diagnostics.",
    approach:
      "Data pipeline uses QM9 molecular dataset with RDKit-based graph construction, optional 3D conformer generation (ETKDG + MMFF optimization), and geometry-aware atom/bond features. Training uses JAX-compatible BatchedGraph abstraction with padding and masking, deterministic config-driven experiment setup, and multi-stage hybrid training to mitigate gradient instability. Three model families are compared: Classical (message-passing GNN, GAT, MPNN), Quantum (4-qubit and 8-qubit VQCs, quantum kernels), and Hybrid (dimension-matched gated fusion).",
    implementation: [
      "Gated hybrid model projecting classical and quantum branches into equal-dimensional latent spaces with learned per-sample gating weights",
      "4-qubit and 8-qubit variational quantum circuits with data re-uploading and hardware-aware ans\u00e4tze",
      "Strong classical baselines: GNN, GAT, MPNN+GRU+Set2Set",
      "Scaffold-based train/test splits using Murcko scaffolds for generalization evaluation",
      "Multi-seed training with Monte Carlo dropout uncertainty estimation",
      "Barren plateau diagnostics and shot-noise modeling for quantum circuits",
      "Config-driven experiment tracking with structured model registry",
      "FastAPI inference layer with unit tests and CI integration",
    ],
    metrics: [
      { label: "Variational Circuit", value: "8-qubit" },
      { label: "Evaluation", value: "Scaffold" },
      { label: "Fusion Architecture", value: "Gated" },
      { label: "Framework", value: "Reproducible" },
    ],
    learnings: [
      "Hybrid quantum\u2013classical modeling is best framed as conditional feature integration, not assumed global advantage",
      "Scaffold-based splits expose generalization failures hidden by random splits",
      "Multi-stage hybrid training is critical to mitigate gradient instability at the quantum\u2013classical boundary",
      "Per-sample gating reveals when quantum-derived representations contribute meaningfully vs. add noise",
      "Barren plateau diagnostics should be standard practice, not optional",
    ],
    researchContribution: [
      "Reframed hybrid quantum\u2013classical modeling as a conditional feature integration problem",
      "Designed gated fusion architecture enabling analysis of per-sample quantum contribution",
      "Enforced methodologically rigorous comparison protocol absent from most QML literature",
      "Proposed evaluation framework combining scaffold splits, uncertainty estimation, and trainability diagnostics",
    ],
    whyThisMatters:
      "Most QML research claims advantage without rigorous baselines. This framework provides the controlled experimental methodology needed to honestly evaluate when \u2014 and whether \u2014 quantum representations add value over strong classical alternatives.",
    techStack: [
      "Python",
      "JAX",
      "PyTorch",
      "PennyLane",
      "Qiskit",
      "RDKit",
      "FastAPI",
      "NumPy",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/Quantum-ML-Drug-discovery" },
      { label: "Article", url: "https://medium.com/@pratikpriyanshu12345/what-it-really-takes-to-evaluate-quantum-machine-learning-c0960219943f" },
    ],
    color: "#8b5cf6",
  },
  {
    id: "swim",
    title: "SWIM | Edge AI Inference Engine",
    tagline: "Optimized deep learning inference for resource-constrained edge devices",
    description:
      "A lightweight inference engine designed for deploying deep learning models on edge devices with strict latency and memory constraints, using model compression and hardware-aware optimization.",
    challenge:
      "Deploying state-of-the-art ML models to edge devices (IoT, mobile, embedded) requires dramatic model compression without catastrophic accuracy loss, while respecting hardware-specific constraints.",
    approach:
      "Combined multiple compression techniques including quantization, pruning, and knowledge distillation with hardware-aware neural architecture search to find optimal model configurations for target devices.",
    implementation: [
      "Built quantization pipeline supporting INT8, INT4, and mixed-precision inference",
      "Implemented structured pruning with iterative magnitude-based channel removal",
      "Designed knowledge distillation framework for teacher-student model compression",
      "Created hardware-aware profiler for latency estimation on target devices",
      "Developed ONNX export pipeline for cross-platform deployment",
    ],
    metrics: [
      { label: "Model Size Reduction", value: "85%" },
      { label: "Inference Speedup", value: "4.2x" },
      { label: "Accuracy Retained", value: "98.1%" },
      { label: "Devices Supported", value: "6+" },
    ],
    learnings: [
      "Mixed-precision quantization provides better accuracy-latency tradeoffs than uniform quantization",
      "Hardware-aware optimization is crucial because theoretical FLOPs don't predict real-world latency",
      "Knowledge distillation recovers most accuracy lost from aggressive compression",
    ],
    techStack: [
      "Python",
      "PyTorch",
      "ONNX",
      "TensorRT",
      "NVIDIA Jetson",
      "Docker",
      "C++",
    ],
    links: [
      { label: "GitHub", url: "https://github.com" },
      { label: "Demo", url: "#" },
    ],
    color: "#10b981",
  },
  {
    id: "homomorphic",
    title: "Homomorphic ML | Privacy Preserving Inference",
    tagline: "Running machine learning inference directly on encrypted data (CKKS, 128-bit security)",
    description:
      "Built an end-to-end privacy-preserving ML system enabling secure inference on sensitive healthcare data without exposing plaintext inputs to the server. The model never sees raw patient features \u2014 only encrypted vectors.",
    challenge:
      "Cloud ML conflicts with data protection laws (GDPR Articles 9, 25, 32). Healthcare and financial institutions cannot send raw data to third-party ML providers. However, homomorphic encryption introduces high computational overhead, noise growth, limited multiplicative depth, and activation function constraints.",
    approach:
      "Selected CKKS scheme for approximate floating-point arithmetic. Replaced non-polynomial activations (ReLU, sigmoid) with HE-compatible polynomial approximations. Designed a shallow NN architecture to control multiplicative depth. Used batching (SIMD slots) to improve throughput. Implemented affine calibration to align encrypted logits with plaintext predictions. Optimized encryption parameters (poly_modulus_degree 8192\u201316384, global_scale \u2248 2^40) for ML workloads with managed noise growth through controlled depth, rescaling, and weight normalization.",
    implementation: [
      "FastAPI encrypted inference server with client SDK (encrypt \u2192 send \u2192 decrypt)",
      "TenSEAL CKKS implementation with 128-bit security (RLWE hardness)",
      "Encrypted Logistic Regression: single encrypted dot product + bias, minimal depth",
      "HE-friendly Neural Network: Input \u2192 Linear \u2192 (0.5x + 0.5) \u2192 Linear \u2192 Logit with depth-free activation",
      "SIMD batching for throughput optimization across ciphertext slots",
      "Affine calibration layer to align encrypted logits with plaintext predictions",
      "Streamlit dashboard for secure prediction demo",
      "Benchmarking suite: encrypted vs plaintext accuracy, confusion matrix alignment, logit deviation analysis",
    ],
    metrics: [
      { label: "Security Level", value: "128-bit" },
      { label: "Accuracy Deviation", value: "<3%" },
      { label: "Inference Latency", value: "~1s" },
      { label: "Encryption Overhead", value: "10\u2013100x" },
    ],
    learnings: [
      "Polynomial activation approximation is the primary HE bottleneck for accuracy",
      "CKKS is significantly better suited than BFV for ML workloads due to approximate arithmetic",
      "SIMD batching is essential for practical encrypted inference speeds",
      "HE inference is viable today; encrypted training remains impractical",
    ],
    researchContribution: [
      "Demonstrated end-to-end encrypted inference pipeline with cryptographic separation of client/server roles",
      "Implemented affine calibration for post-encryption logit alignment \u2014 reducing probability drift",
      "Designed depth-controlled NN architecture compatible with CKKS noise budget",
      "Benchmarked real-world accuracy\u2013latency tradeoffs absent from most HE-ML literature",
    ],
    whyThisMatters:
      "As GDPR and healthcare data regulations tighten, privacy-preserving ML moves from academic curiosity to production necessity. This system proves that encrypted inference is viable today for classification workloads on sensitive data.",
    techStack: [
      "Python",
      "TenSEAL (CKKS)",
      "Microsoft SEAL",
      "PyTorch",
      "Scikit-learn",
      "FastAPI",
      "Streamlit",
      "NumPy",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/Homomorphic-Encryption-for-Machine-Learning" },
    ],
    color: "#f59e0b",
  },
  {
    id: "autobahn",
    title: "Autobahn | Autonomous Perception & ADAS Stack",
    tagline: "Production-grade multi-sensor perception engine with ISO-26262 safety architecture and real-time latency guarantees",
    description:
      "A modular ADAS perception and safety stack integrating camera, LiDAR, and radar fusion with interaction-aware prediction, explainable AI, safety diagnostics, and scenario validation, built to mirror German OEM architecture principles.",
    challenge:
      "Production ADAS systems must fuse heterogeneous sensors under strict real-time constraints while guaranteeing functional safety (ISO 26262), explainability, and deterministic behavior during failure modes. Most portfolio projects stop at object detection. Production systems require multi-sensor redundancy, fault diagnostics, deterministic replay, scenario validation, and safety-layer escalation.",
    approach:
      "Structured the system as a staged orchestrator pipeline across five layers: Perception Layer with YOLOv8 2D detection, LiDAR clustering (RANSAC + DBSCAN), and radar ghost filtering with Doppler velocity extraction; Fusion Layer with camera\u2013LiDAR late fusion (IoU + BEV matching), radar\u2013camera velocity enrichment, and weighted position merging; Tracking & Prediction with Kalman filtering, top-K trajectory hypotheses, and rule-based interaction reasoning; Safety Layer with ASIL classification, plausibility checks, redundant detection voting, DTC logging, and sensor health scoring; Validation Layer with CARLA-style YAML scenario runner, MOT evaluation (MOTA/IDF1/HOTA), latency budget analysis, and failure simulation dashboard.",
    implementation: [
      "Modular orchestrator refactored into 15 clean pipeline stages",
      "Radar fusion pipeline with Doppler-based velocity refinement",
      "LiDAR BEV encoder (7-channel grid representation)",
      "Grad-CAM explainability for safety certification alignment",
      "Deterministic recording + replay system (msgpack + gzip)",
      "CI pipeline with latency regression gating",
      "Config validator enforcing enum/range/dependency constraints",
    ],
    metrics: [
      { label: "Mean Latency/Stage", value: "<0.5ms" },
      { label: "Passing Tests", value: "179" },
      { label: "Sensor Fusion", value: "3-Modal" },
      { label: "ADAS Scenarios", value: "20+" },
    ],
    learnings: [
      "ISO 26262-inspired ASIL escalation requires plausibility violation detection across speed, position jump, and overlap sanity checks",
      "Redundant detection cross-validation is essential for safety-critical perception",
      "Sensor degradation scoring (camera blur, LiDAR density, radar consistency) enables graceful failure handling",
      "Deterministic replay with failure injection is the backbone of ADAS validation",
      "Full-pipeline latency budgets must be validated per-stage, not just end-to-end",
    ],
    researchContribution: [
      "Designed a 5-layer perception-to-validation architecture mirroring German OEM principles",
      "Implemented interaction-aware trajectory prediction with rule-based reasoning",
      "Built Grad-CAM explainability pipeline aligned with safety certification requirements",
      "Developed automated scenario validation framework with pass/fail metrics for failure injection",
    ],
    whyThisMatters:
      "Autobahn demonstrates the full engineering depth required for production autonomous driving, not just detection, but fusion, tracking, safety, explainability, and validation under real-time constraints.",
    techStack: [
      "Python",
      "PyTorch",
      "ONNX",
      "ONNX Runtime",
      "OpenCV",
      "NumPy",
      "Scikit-learn",
      "DeepSORT / ByteTrack",
      "MsgPack + GZip",
      "Streamlit",
      "GitHub Actions CI",
      "ISO 26262",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/Autobahn-Autonomous-Driving-Perception-System" },
    ],
    color: "#06b6d4",
  },
];
