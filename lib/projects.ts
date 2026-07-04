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
  pipInstall?: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: "hnep",
    title: "HNEP | Reproducible Benchmarking Framework for Quantum-Classical Hybrid Learning",
    tagline:
      "A multi-method evaluation protocol that reveals how quantum components contribute \u2014 not just whether they help \u2014 through the Quantum Contribution Taxonomy (GENUINE / REGULARIZER / IGNORED / DEAD WEIGHT)",
    description:
      "M.Sc. thesis project. HNEP (Hybrid Network Evaluation Protocol, v3.0) is a reproducible benchmarking framework for quantum-classical hybrid learning that combines graded surrogation, structural interventions, and convergent validity analysis across 7 model families and 4 molecular datasets. It introduces the Quantum Contribution Taxonomy \u2014 the first two-dimensional classification of quantum roles in hybrid models \u2014 and shows that single-method QML evaluations can produce systematically incomplete or contradictory conclusions.",
    challenge:
      "QML benchmarks report only \u201cquantum helps or not.\u201d Surrogation studies report only \u201cnecessary or replaceable.\u201d Neither captures the possibility that a quantum branch can be classically replaceable yet structurally load-bearing (a regularizer role). Existing single-method evaluations produce contradictory conclusions on the same data, and the field lacks a principled way to characterise how a quantum component actually contributes to a hybrid model.",
    approach:
      "HNEP v3.0 combines graded surrogation (linear / MLP / deep MLP surrogates on both RDKit descriptors and GNN embeddings) with structural interventions (no-entanglement, single-layer, no-quantum ablations) and convergent validity analysis via CKA and mutual information at the latent level. The protocol is applied identically across 4 molecular datasets and 7 model families, with cluster-aware bootstrapping, permutation-based p-values, and both random and scaffold splits. All hybrid models are trained under a fair, matched training budget after an early undertraining pitfall was identified.",
    implementation: [
      "~60 modules built in JAX/Flax + PennyLane + RDKit, released as pip install hnep (v0.3.0)",
      "7 model families benchmarked: GNN, GAT-fixed, MPNN+Set2Set (classical); VQC-4q, Quantum Kernel IQP (quantum); Hybrid-V1 concat and Hybrid-V2 gated (hybrid, all 4-qubit)",
      "4 molecular datasets covering distinct regimes: QM9 (134K), ESOL (1128), FreeSolv (642), Lipophilicity (4200)",
      "Graded surrogation ladder (linear \u2192 MLP \u2192 deep MLP) run against RDKit descriptors AND GNN embeddings for convergent validity",
      "Structural interventions: no-entanglement, single-layer, and full no-quantum ablations",
      "First-ever application of scaffold splitting to QML benchmarking, alongside random splits",
      "Cluster-aware bootstrapping and permutation-based p-values; 5 seeds across all runs",
      "280+ controlled runs plus retraining reruns after a training-budget confound was identified",
    ],
    metrics: [
      { label: "Model Families", value: "7" },
      { label: "Datasets", value: "4" },
      { label: "Controlled Runs", value: "280+" },
      { label: "PyPI Release", value: "v0.3.0" },
    ],
    learnings: [
      "Surrogation and interventions can give divergent conclusions on the same dataset \u2014 convergent validity is not optional",
      "A quantum branch can be classically replaceable yet structurally load-bearing (ESOL: \u221229% on removal despite surrogation score 0.08) \u2014 a mode absent from prior QML literature",
      "At 4 qubits, entangling gates do nothing (\u0394 = 0.000 across all datasets): shallow circuits with small qubit counts operate as parameterised single-qubit rotations",
      "Training budget is a confound \u2014 undertrained hybrid models give misleading QCT classifications and can flip conclusions",
      "More qubits and more complex fusion do not help: VQC-8q dropped for no improvement, gated V2 fusion underperforms simple V1 concatenation",
    ],
    researchContribution: [
      "Proposed the Quantum Contribution Taxonomy (QCT) \u2014 first two-dimensional classification of quantum roles in hybrid models (GENUINE / IGNORED / REGULARIZER / DEAD WEIGHT)",
      "Showed that on QM9 the quantum branch aligns more closely with targets than its classical counterpart \u2014 first quantitative evidence of quantum-target alignment at the latent level",
      "Introduced convergent-validity multi-method evaluation to QML, exposing that single-method conclusions can be systematically incomplete",
      "First application of chemistry-aware scaffold splitting to QML benchmarking \u2014 standard classical ML practice since 2018, never before applied to QML",
    ],
    whyThisMatters:
      "QML literature reports contradictory conclusions because it relies on single-method evaluations. HNEP argues \u201cdoes quantum help?\u201d is the wrong question \u2014 the right question is how it contributes, and answering it requires convergent validity across independent methods.",
    techStack: [
      "Python",
      "JAX/Flax",
      "PennyLane",
      "RDKit",
      "NumPy",
      "PyTorch",
      "FastAPI",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/Quantum-ML-Drug-discovery" },
      { label: "PyPI", url: "https://pypi.org/project/hnep/" },
      { label: "Article", url: "https://medium.com/@pratikpriyanshu12345/what-it-really-takes-to-evaluate-quantum-machine-learning-c0960219943f" },
    ],
    pipInstall: "pip install hnep",
    color: "#8b5cf6",
  },
  {
    id: "exoveil",
    title: "ExoVeil | Detecting Single-Transit Exoplanets via Learned Stellar Behaviour",
    tagline:
      "Transformer world model that predicts stellar brightness and flags transits as anomalies \u2014 detecting planets that classification-based systems structurally cannot see",
    description:
      "ExoVeil is a self-supervised, prediction-based transit detection system for exoplanet science. It learns each star\u2019s quiescent photometric behaviour and treats transits as departures from that baseline, enabling single-transit detection \u2014 a regime in which phase-folding classifiers (ExoMiner, AstroNet, RAVEN) score 0% by construction. Released as an open-source package (pip install exoveil) with pretrained weights and a candidate catalogue.",
    challenge:
      "Modern ML transit vetters treat the problem as binary classification on phase-folded light curves, which requires a known period. Long-period, small-planet systems \u2014 including the Earth-analog regime that motivates missions such as PLATO \u2014 may transit only once during an observation window, leaving classification-based systems with nothing to fold. The planets we most want to find are precisely the ones current ML pipelines are structurally unable to detect.",
    approach:
      "Reframe transit detection as anomaly detection over raw flux time series. A causal Transformer encoder (6 layers, 8 heads, ~3.2M parameters) is trained on 16,499 Kepler light curves with transit-masked self-supervised learning \u2014 the model never sees a transit during training, making transits maximally anomalous at inference. Prediction residuals are variance-weighted by the model\u2019s learned uncertainty and passed through a matched-filter bank of box templates. An XGBoost classifier separates planets from false positives using 21 features derived from the world model and stellar parameters. Split conformal prediction provides coverage-guaranteed candidate rankings with aleatoric/epistemic uncertainty decomposition.",
    implementation: [
      "Causal Transformer world model (6L, 8H, d_model=192, ~3.2M params) trained with transit-masked self-supervised next-step prediction",
      "Learnable continuous time encoding (16 sinusoidal bases) for irregular cadence and a learned detrending module at 8\u00d7 downsampled resolution",
      "Two output heads producing predicted flux and log-variance, trained with Gaussian NLL and variance regularisation",
      "Variance-weighted matched-filter bank via FFT across durations [3, 5, 7, 9, 13, 17, 25] with MAD-based local thresholding",
      "XGBoost classifier on 21 features (folded residual SNR, variance-normalised depth, epistemic uncertainty ratio, stellar parameters)",
      "Split conformal prediction (\u03b1 = 0.05) with MC Dropout (T = 30) for aleatoric/epistemic decomposition",
      "Blind search pipeline over 3,737 Kepler stars with automated eclipsing-binary and giant-star vetting",
      "Zero-shot cross-mission inference pipeline for TESS 2-minute cadence and PLATO 25-second cadence",
    ],
    metrics: [
      { label: "Kepler DR25 AUC", value: "0.938" },
      { label: "New Candidates", value: "179" },
      { label: "TESS Zero-Shot", value: "47 / 47" },
      { label: "Conformal Coverage", value: "95.9%" },
    ],
    learnings: [
      "Detection and classification are distinct problems: hand-crafted scoring on world-model residuals achieved AUC 0.36 because eclipsing binaries produce deeper residuals than planets \u2014 a learned classifier on top is essential",
      "Variance-weighted matched filtering meaningfully improves single-transit sensitivity by suppressing false triggers in photometrically noisy regions",
      "Zero-shot transfer from Kepler to TESS (100% recovery of 47 confirmed planets in the PLATO LOPS2 field) suggests the world model learns genuine stellar physics rather than mission-specific artefacts",
      "Classification-based ML has a structural blind spot in the single-transit regime \u2014 the exact regime PLATO is designed to explore",
      "PLATO\u2019s 25-second cadence shifts the sensitivity boundary substantially: preliminary tests reach detection at 100 ppm, approaching the Earth-analog depth of 84 ppm",
    ],
    researchContribution: [
      "First prediction-based transit detection system with quantitative depth-vs-recovery curves in the single-transit regime",
      "First application of conformal prediction to transit detection (95.9% empirical coverage against 95% nominal)",
      "Blind-search catalogue of 179 new transit-like signals not in the Kepler DR25 TCE catalogue, including 46 vetted monotransit candidates (strongest: KIC 11706231, 231 ppm on a cool dwarf)",
      "Zero-shot cross-mission transfer demonstrated end-to-end, providing an ML path toward PLATO\u2019s few-transit detection needs",
    ],
    whyThisMatters:
      "The planets that matter most \u2014 Earth analogs around Sun-like stars \u2014 transit rarely. Classification-based ML cannot see them. ExoVeil extends detection into that regime, provides formal uncertainty guarantees, and demonstrates cross-mission transfer to TESS and PLATO cadences without retraining.",
    techStack: [
      "Python",
      "PyTorch",
      "Transformer",
      "XGBoost",
      "Conformal Prediction",
      "MC Dropout",
      "Astropy",
      "Lightkurve",
      "MAST",
    ],
    links: [
      { label: "arXiv", url: "https://arxiv.org/abs/2606.02778" },
      { label: "PyPI", url: "https://pypi.org/project/exoveil/" },
      { label: "GitHub", url: "https://github.com/Pratik25priyanshu20/ExoVeil" },
    ],
    pipInstall: "pip install exoveil",
    color: "#facc15",
  },
  {
    id: "cmsci",
    title: "cMSCI | Calibrated Multimodal Coherence Evaluation",
    tagline:
      "Embedding-agnostic geometric metric for tri-modal (text-image-audio) coherence — validated across dual-space (CLIP+CLAP) and unified-space (Gemini Embedding 2) backbones; manuscript under review",
    description:
      "Proposed cMSCI (calibrated Multimodal Semantic Coherence Index), a novel geometric metric for tri-modal semantic coherence evaluation that integrates Gramian volume geometry, contrastive calibration, and uncertainty-aware adaptive weighting (including training-free Matryoshka scale-consistency estimation). Instantiated on both dual-space (CLIP + CLAP, 512-d) and unified-space (Gemini Embedding 2, 3072-d) backbones, with an ensemble of uncorrelated errors outperforming either individually.",
    challenge:
      "Evaluating semantic coherence across text, image, and audio modalities lacks principled metrics. Existing scores (CLIPScore, BLIPScore, CCA) operate in single embedding spaces, ignore calibration, and provide no uncertainty estimates. No framework exists for measuring whether generated multimodal content is semantically aligned across three modalities simultaneously — especially in a way that transfers across different embedding backbones and remains reliable without a reference-quality ground truth.",
    approach:
      "Designed cMSCI as a geometrically grounded composite metric combining Gramian volume across modality embeddings, contrastive calibration against domain-specific negatives, and uncertainty-aware adaptive weighting via training-free Matryoshka scale-consistency estimation. Applied to both dual-space (CLIP + CLAP) and unified-space (Gemini Embedding 2) backbones to demonstrate embedding-agnosticism. Validated with 100 human-annotated samples, leave-one-out cross-validation, and 630+ controlled experimental runs, with full statistical rigour (Wilcoxon, Holm-Bonferroni, bootstrap CIs, power analysis).",
    implementation: [
      "Gramian-volume-based cMSCI metric with contrastive calibration and uncertainty-aware adaptive weighting",
      "Training-free Matryoshka scale-consistency estimation for embedding-agnostic uncertainty",
      "Dual-space instantiation on CLIP + CLAP (512-d) and unified-space instantiation on Gemini Embedding 2 (3072-d)",
      "Ensemble of dual-space and unified-space cMSCI variants, exploiting uncorrelated error structure",
      "630+ controlled experimental runs across prompts, seeds, and perturbation conditions",
      "Human evaluation study: 100 human-annotated samples, ICC(3,k) = 0.872, leave-one-out cross-validation ρ = 0.749",
      "Baseline comparison against cosine+z-norm, CCA, CLIPScore, and retrieval-rank scoring",
      "Full statistical suite: Wilcoxon, Shapiro-Wilk, Holm-Bonferroni, bootstrap BCa CIs, power analysis",
    ],
    metrics: [
      { label: "Human Correlation", value: "\u03C1 = 0.785" },
      { label: "ICC(3,k)", value: "0.872" },
      { label: "Controlled Runs", value: "630+" },
      { label: "Statistical Significance", value: "p < 10\u207B\u2076" },
    ],
    learnings: [
      "Gramian-volume geometry combined with contrastive calibration yields a coherence metric that meaningfully correlates with human judgment (\u03C1 = 0.785, p < 10\u207B\u2076)",
      "cMSCI is embedding-agnostic: it works on dual-space (CLIP + CLAP) and unified-space (Gemini Embedding 2) backbones with comparable behaviour",
      "Ensembling dual-space and unified-space instantiations outperforms either alone by exploiting uncorrelated error modes",
      "Matryoshka scale-consistency provides training-free uncertainty estimation across embedding dimensions",
      "Rigorous baseline comparison against cosine+z-norm, CCA, CLIPScore, and retrieval-rank scoring is essential to substantiate metric claims",
    ],
    researchContribution: [
      "Proposed cMSCI, a novel geometric metric for tri-modal coherence evaluation combining Gramian volume, contrastive calibration, and uncertainty-aware adaptive weighting",
      "Demonstrated embedding-agnosticism by instantiating and validating cMSCI on both dual-space and unified-space embedding backbones",
      "Introduced training-free Matryoshka scale-consistency estimation as a general-purpose uncertainty signal for embedding-based metrics",
      "Outperformed all baselines (cosine+z-norm, CCA, CLIPScore, retrieval rank) with \u03C1 = 0.785 on 100 human-annotated samples",
    ],
    whyThisMatters:
      "As multimodal generation systems proliferate, principled evaluation metrics are essential. cMSCI shows that a single geometric metric can capture meaningful coherence across heterogeneous embedding backbones — and that combining independent embedding spaces produces stronger evaluation than any one alone.",
    techStack: [
      "Python",
      "CLIP",
      "CLAP",
      "Gemini Embedding 2",
      "Matryoshka Embeddings",
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
