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
    id: "jurag",
    title: "JuRAG | Graph-Augmented Legal Retrieval & Responsible AI",
    tagline: "Research framework evaluating how retrieval strategy affects faithfulness, fairness, and grounding in AI-assisted legal decision support across 251k German court decisions",
    description:
      "A research framework for building trustworthy legal AI systems, evaluated on 251,038 real German court decisions. It investigates how retrieval strategy — from dense embedding search to citation graph-augmented hybrid retrieval — affects the quality, faithfulness, and fairness of AI-assisted legal decision support.",
    challenge:
      "Legal AI systems must be faithful, fair, and grounded — yet most RAG implementations treat retrieval as a black box. Dense embeddings miss exact statute references, hybrid retrieval can introduce noise, and no principled framework exists to measure how retrieval strategy impacts downstream hallucination rates, demographic bias, or citation grounding in legal contexts. This project addresses four research questions: whether hybrid retrieval outperforms dense-only for German legal text, whether citation graph augmentation improves precedent retrieval, how retrieval strategies affect faithfulness, and whether they introduce or mitigate demographic biases.",
    approach:
      "Designed a LangGraph StateGraph pipeline with 4 nodes: Query Understanding + Retrieval (domain/intent classification dispatching to 3 retrieval variants), Legal Analysis + Citation Grounding (NLI-verified claim-source entailment), Validation (multi-run LLM-as-Judge with calibrated confidence), and Report Generation. Three retrieval variants are compared: S1 (dense BGE-M3 + cross-encoder reranking), S2 (hybrid dense + BM25 with Reciprocal Rank Fusion), and S3 (graph-augmented hybrid with citation graph 1-hop expansion and PageRank-informed re-scoring). Section-aware chunking tags each chunk with German legal structure (Tenor, Tatbestand, Entscheidungsgründe) for intent-based boosting.",
    implementation: [
      "3 retrieval variants: dense (BGE-M3 + reranker), hybrid (dense + BM25 + RRF), graph-augmented (hybrid + citation graph 1-hop expansion with PageRank/HITS scoring)",
      "Citation graph module built on 251k decisions with PageRank, HITS hub/authority scores, and temporal recency weighting",
      "NLI-based citation grounding using mDeBERTa cross-encoder — revealing true grounding at 42–45% vs. 81.7% without NLI verification",
      "6-dimension Responsible AI evaluation: citation grounding, hallucination detection, demographic perturbation testing (50 pairs), paraphrase consistency, confidence calibration (ECE/Brier), cross-lingual fairness",
      "Section-aware retrieval with intent-based boosting for German legal document structure",
      "Statistical rigor: Wilcoxon signed-rank, Mann-Whitney U, Cohen's d, bootstrap CIs (10k resamples), Holm-Bonferroni correction",
      "Streamlit dashboard with 5 interactive tabs and FastAPI backend",
      "95 unit + integration tests with Makefile automation",
    ],
    metrics: [
      { label: "Court Decisions", value: "251,038" },
      { label: "Retrieval Variants", value: "3" },
      { label: "RAI Dimensions", value: "6" },
      { label: "Evaluation Metrics", value: "14" },
    ],
    learnings: [
      "Hybrid retrieval achieves 50% higher citation accuracy on keyword-heavy legal queries — BM25 captures exact statute references that dense embeddings miss",
      "NLI verification is essential: without it, citation accuracy appeared at 81.7%; with NLI, actual grounding dropped to 42–45%, exposing false attributions",
      "BM25 can introduce noise for purely semantic queries, occasionally degrading hybrid results below dense-only",
      "Section-aware chunking with intent-based boosting significantly improves retrieval relevance for structured legal documents",
      "Demographic perturbation testing reveals subtle biases invisible to standard accuracy metrics",
    ],
    researchContribution: [
      "Demonstrated that retrieval strategy choice directly impacts downstream faithfulness and fairness in legal AI",
      "Introduced NLI-verified citation grounding as a standard for legal RAG evaluation",
      "Designed graph-augmented retrieval with PageRank/HITS-informed re-scoring for legal precedent discovery",
      "Built a 6-dimension Responsible AI evaluation framework with statistical rigor for legal AI systems",
    ],
    whyThisMatters:
      "Legal AI demands verifiable faithfulness. JuRAG shows that retrieval strategy is not just an engineering choice — it directly determines whether an AI system hallucinates, introduces bias, or produces grounded legal analysis.",
    techStack: [
      "Python",
      "LangGraph",
      "Qdrant",
      "BGE-M3",
      "BM25",
      "mDeBERTa (NLI)",
      "NetworkX",
      "Ollama / Groq",
      "FastAPI",
      "Streamlit",
      "Docker",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/JuRAG" },
    ],
    color: "#ef4444",
  },
  {
    id: "cmsci",
    title: "cMSCI | Calibrated Multimodal Coherence Evaluation",
    tagline: "Novel uncertainty-aware evaluation metric for tri-modal (text-image-audio) coherence, extending GRAM to heterogeneous embedding spaces — manuscript under review",
    description:
      "Proposed cMSCI (calibrated Multimodal Semantic Coherence Index), a geometrically grounded, uncertainty-aware evaluation metric for tri-modal coherence. Extends GRAM (ICLR 2025) to heterogeneous embedding spaces (CLIP + CLAP) with probabilistic scoring via ProbVLM and contrastive calibration against domain-specific negative banks.",
    challenge:
      "Evaluating semantic coherence across text, image, and audio modalities lacks principled metrics. Existing scores (CLIPScore, BLIPScore) operate in single embedding spaces, ignore calibration, and provide no uncertainty estimates. No framework exists for measuring whether generated multimodal content is semantically aligned across three modalities simultaneously, especially in settings without reliable ground truth.",
    approach:
      "Designed cMSCI as a composite metric aggregating calibrated embedding similarities across CLIP (text-image) and CLAP (text-audio) spaces, with probabilistic scoring via ProbVLM and contrastive calibration. Structured the evaluation around three research questions: metric sensitivity to controlled perturbations (RQ1), effect of semantic planning on coherence (RQ2), and correlation with human judgments (RQ3). Applied rigorous statistical methodology throughout: Shapiro-Wilk normality testing, Wilcoxon signed-rank tests, Holm-Bonferroni correction, bootstrap CIs (10,000 resamples), and prospective power analysis.",
    implementation: [
      "cMSCI metric combining calibrated CLIP and CLAP similarities with probabilistic scoring via ProbVLM and contrastive negative banks",
      "270 controlled experimental runs across 30 prompts, 3 seeds, and 3 perturbation conditions (baseline, wrong_image, wrong_audio)",
      "4 planning modes compared: direct (baseline), single planner, council (3 LLM merge), and extended prompt",
      "Human evaluation study: 3 independent raters, 30 blind samples, ICC(3,k) = 0.873, Krippendorff's alpha = 0.684",
      "Hybrid generation pipeline: Stable Diffusion + CLIP-ranked retrieval for images, AudioLDM + CLAP-based retrieval for audio",
      "Full statistical suite: bootstrap BCa CIs, paired t-tests, Wilcoxon signed-rank, effect size estimation, power analysis",
      "Streamlit-based blind human evaluation app with session management and re-rating support",
      "84 unit tests with GitHub Actions CI/CD",
    ],
    metrics: [
      { label: "Effect Size (RQ1)", value: "d > 2.2" },
      { label: "Human Correlation", value: "\u03C1 = 0.379" },
      { label: "Controlled Runs", value: "270" },
      { label: "Statistical Significance", value: "p < 10\u207B\u00B9\u00B3" },
    ],
    learnings: [
      "cMSCI is sensitive to controlled semantic perturbations with large effect sizes (d > 2.2), confirming metric validity",
      "Semantic planning does not improve retrieval-based coherence (|d| \u2264 0.19) — an informative null result attributable to index ceiling effects",
      "Moderate but statistically significant human correlation (\u03C1 = 0.379, p = 0.039) indicates cMSCI captures meaningful coherence signal",
      "Honest null results are as valuable as positive findings — well-powered negative evidence prevents wasted research effort",
      "Cross-space coherence measurement requires calibration against domain-specific negatives to avoid inflated scores",
    ],
    researchContribution: [
      "Proposed cMSCI, a novel calibrated metric for tri-modal coherence evaluation extending GRAM (ICLR 2025) to heterogeneous embedding spaces",
      "Validated metric sensitivity with controlled perturbations and human judgment correlation",
      "Reported an informative null result on semantic planning with rigorous power analysis",
      "Outperformed CLIPScore, BLIPScore, and CCA baselines on coherence evaluation",
    ],
    whyThisMatters:
      "As multimodal generation systems proliferate, principled evaluation metrics are essential. cMSCI demonstrates that calibrated, uncertainty-aware metrics can capture meaningful coherence signals across heterogeneous modalities — and that honest reporting of null results advances the field as much as positive findings.",
    techStack: [
      "Python",
      "CLIP",
      "CLAP",
      "ProbVLM",
      "Stable Diffusion",
      "AudioLDM",
      "Hugging Face",
      "Streamlit",
      "Plotly",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/MultiModal-Coherence-Evaluation-and-Generation" },
    ],
    color: "#a855f7",
  },
  {
    id: "swim",
    title: "SWIM | Multi-Agent AI for Environmental Monitoring",
    tagline: "Surface Water Intelligence & Monitoring: a multi-agent system for predicting Harmful Algal Blooms across German lakes using satellite, in-situ, and visual data",
    description:
      "A multi-agent environmental monitoring system that predicts Harmful Algal Blooms (HABs) across German lakes by fusing satellite imagery, water quality sensors, weather data, and visual analysis through autonomous AI agents communicating via Google's Agent-to-Agent (A2A) protocol.",
    challenge:
      "Harmful algal blooms (HABs) threaten freshwater ecosystems and public health across Europe. Existing monitoring is reactive, detecting blooms after formation. Multi-modal environmental data (satellite imagery, water sensors, weather, photos) is siloed across agencies, and monolithic ML models degrade catastrophically when any data source fails.",
    approach:
      "Designed a multi-agent architecture where specialized AI agents each handle one data modality and communicate via Google's Agent-to-Agent (A2A) protocol. An orchestrator fuses agent predictions using confidence-weighted strategies, enabling graceful degradation when sensors fail instead of system-wide collapse.",
    implementation: [
      "Built 5 autonomous agents: HOMOGEN (data harmonization), CALIBRO (satellite calibration), VISIOS (visual HAB detection), PREDIKT (ensemble ML forecasting), and Orchestrator (A2A coordination + risk fusion)",
      "Implemented calibrated risk fusion with isotonic regression, per-agent uncertainty quantification, and confidence intervals",
      "Built RAG knowledge base with document ingestion (PDF/TXT/CSV), vector embeddings, and automatic context injection into agent queries",
      "Developed 12-endpoint REST API with JWT + API key auth, rate limiting, and input sanitization",
      "Created 8-tab Streamlit dashboard with live map, predictions, satellite intel, and risk analytics",
      "Containerized all agents with Docker Compose for independent deployment",
      "Ran controlled experiments: monolithic baselines (AUROC 0.814), modality ablation, feature dropout robustness, and agentic vs monolithic comparison across 7 German lakes",
    ],
    metrics: [
      { label: "AUROC (Bloom Prediction)", value: "0.814" },
      { label: "Autonomous AI Agents", value: "5" },
      { label: "Lines of Python", value: "14,000+" },
      { label: "Unit Tests", value: "112+" },
    ],
    learnings: [
      "Satellite-only features (5 variables) outperformed all 14 features combined (AUROC 0.850 vs 0.794): modality quality matters more than quantity",
      "Under 70% sensor failure, monolithic models lost 21.5% AUROC while the agentic architecture degraded significantly less through confidence-weighted fusion",
      "Agents that share predictions outperform independent agents under data degradation, confirming the value of inter-agent communication",
      "Google's A2A protocol enables clean agent decoupling: each agent is independently deployable and testable",
    ],
    researchContribution: [
      "Demonstrated graceful degradation under sensor failure via confidence-weighted multi-agent fusion",
      "Compared monolithic vs agentic architectures under controlled modality ablation",
      "Showed that satellite-only features can outperform full multi-modal stacks when quality is prioritized",
      "Integrated Google A2A protocol for production-grade inter-agent communication in environmental AI",
    ],
    whyThisMatters:
      "SWIM proves that multi-agent architectures are not just an abstraction layer but provide measurable resilience under real-world data degradation. When sensors fail, monolithic models collapse; agent-based systems degrade gracefully.",
    techStack: [
      "Python",
      "LangGraph",
      "Google A2A",
      "FastAPI",
      "PyTorch",
      "Sentinel-2",
      "Docker",
      "RAG",
      "Streamlit",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/Swim-Agents" },
    ],
    color: "#10b981",
  },
  {
    id: "haftung",
    title: "Haftung-AI | Multi-Agent Traffic Accident Liability Analysis",
    tagline: "9-agent system for analyzing traffic accident liability under German law (StVO) with vision perception, telemetry parsing, and RAG-augmented legal reasoning",
    description:
      "An LLM-powered multi-agent system for analyzing traffic accident liability under German traffic law (StVO). It orchestrates nine specialized agents through LangGraph — from YOLOv8 scene perception to CAN bus telemetry parsing to RAG-augmented legal reasoning — and compares three structurally distinct pipeline variants against 30 hand-authored ground-truth scenarios.",
    challenge:
      "Traffic accident liability analysis requires fusing heterogeneous evidence — dashcam video, vehicle telemetry, and legal statutes — into a coherent legal assessment. Pure LLM inference hallucinates legal references, while single-agent systems cannot handle the multi-modal evidence chain. No existing framework compares how retrieval augmentation and constraint validation improve baseline LLM reasoning for German traffic law.",
    approach:
      "Designed a 9-agent LangGraph pipeline with three structurally distinct variants: S1 (baseline pure LLM inference), S2 (RAG-augmented with German traffic statutes and case law via Qdrant), and S3 (RAG + iterative validation with constraint enforcement and multi-run LLM judge scoring). The Vision Agent performs YOLOv8 + DeepSORT object tracking with Kalman filtering and scene graph construction. The Telemetry Agent parses CAN bus data (CSV/ASC/BLF) for speed profiling. Evidence, Contradiction, and Causation agents handle legal reasoning, while the Validation Agent enforces consistency through iterative re-analysis loops.",
    implementation: [
      "9 specialized agents: Vision (YOLOv8 + DeepSORT + Kalman), Telemetry (CAN bus parsing), RAG (hybrid dense + BM25), Evidence extraction, Contradiction detection, Causation reasoning (3 variants), Validation (multi-run LLM judge), Report generation (Jinja2 + WeasyPrint PDF), TextInput",
      "3 pipeline variants compared: S1 (pure LLM), S2 (RAG-augmented), S3 (RAG + validation with constraint enforcement)",
      "YOLOv8 perception with DeepSORT tracking, Kalman + RTS smoothing, and scene graph construction",
      "ISO 26262 ASIL classification with Time-to-Collision safety metrics",
      "Hybrid retrieval (\u03B1=0.6 dense/BM25 blending) over German StVO statutes and case law",
      "30 ground-truth scenarios across 6 accident categories (rear-end, side, head-on, intersection, pedestrian, single-vehicle) with 5 variations each",
      "Evaluation suite: causation accuracy, responsibility MAE, contributing factors F1, ECE, Brier score, hallucination rate, retrieval quality (P@5, MRR, nDCG@5)",
      "244 passing tests (unit + integration + evaluation) with Docker Compose deployment",
    ],
    metrics: [
      { label: "Specialized Agents", value: "9" },
      { label: "Pipeline Variants", value: "3" },
      { label: "Test Scenarios", value: "30" },
      { label: "Passing Tests", value: "244" },
    ],
    learnings: [
      "RAG augmentation with legal statutes significantly reduces hallucinated legal references compared to pure LLM inference",
      "Iterative validation with constraint enforcement catches inconsistencies that single-pass analysis misses",
      "Multi-modal evidence fusion (vision + telemetry + legal) produces more defensible liability assessments than any single modality",
      "Pairwise contradiction detection between evidence sources is critical for legal reasoning integrity",
      "Structured evaluation against hand-authored ground truth exposes failure modes invisible to LLM self-evaluation",
    ],
    researchContribution: [
      "Designed a 9-agent architecture bridging perception, telemetry, and legal reasoning for accident analysis",
      "Compared three structurally distinct pipeline variants (pure LLM vs RAG vs RAG + validation) on hand-authored legal scenarios",
      "Integrated ISO 26262 safety classification with LLM-based legal reasoning",
      "Built a reproducible evaluation framework with 30 ground-truth scenarios and 8 quantitative metrics",
    ],
    whyThisMatters:
      "Haftung-AI demonstrates that multi-agent architectures can bridge the gap between raw sensor evidence and legal reasoning — showing measurable improvements from retrieval augmentation and constraint validation over pure LLM inference for safety-critical legal analysis.",
    techStack: [
      "Python",
      "LangGraph",
      "Groq (LLaMA 3.3 70B)",
      "Qdrant",
      "BGE-large",
      "BM25",
      "YOLOv8",
      "DeepSORT",
      "FastAPI",
      "Streamlit",
      "Docker",
      "WeasyPrint",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/Haftung-AI" },
    ],
    color: "#ec4899",
  },
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
