"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Line {
  text: string;
  kind: "in" | "out" | "ok" | "warn" | "accent";
}

const BANNER: Line[] = [
  { text: "pratik@observatory:~$ — research terminal v1.0", kind: "accent" },
  { text: "type `help` for commands, `exit` or ESC to close", kind: "out" },
];

const HELP = `available commands:
  ls projects/        list research projects
  cat about.txt       who is this guy
  pip install exoveil install the transit detector
  ./detect_transit    run detection on a light curve
  ./collapse_star     you probably shouldn't
  cite exoveil        copy BibTeX
  open <section>      jump to a section (projects, papers, contact)
  whoami              you, presumably
  clear               clear terminal
  exit                close terminal`;

const PROJECTS_LS = `drwxr-xr-x  hnep/          quantum contribution taxonomy (M.Sc. thesis)
drwxr-xr-x  exoveil/       single-transit exoplanet detection [arXiv:2606.02778]
drwxr-xr-x  cmsci/         tri-modal coherence metric (under review)
drwxr-xr-x  swim/          harmful algal bloom forecasting, 5 agents
drwxr-xr-x  jurag/         legal RAG over 251k German court decisions
drwxr-xr-x  haftung/       9-agent traffic liability analysis
drwxr-xr-x  arkis/         trust-aware agentic RAG
drwxr-xr-x  autobahn/      ADAS perception stack, ISO 26262`;

const ABOUT_TXT = `Pratik Priyanshu — ML researcher, Heidelberg.
M.Sc. Applied Data Science @ SRH Heidelberg (1.6). Thesis: HNEP.
Interests: scientific ML, uncertainty quantification, conformal
prediction, quantum ML, reproducible evaluation.
Currently: applying for PhD positions. Yes, this terminal is a hint
that I'd fit in your lab.`;

const TRANSIT_ART = `analyzing light curve (KIC 11706231, 4.2y baseline)...
flux ─╮╭─╮╭──╮ ╭─╮╭─╮╭─╮ ╭──╮╭─╮╭─╮╭─╮╭──╮╭─╮
      ╰╯ ╰╯  ╰─╯ ╰╯ ╰╯ ╰╮╭╯  ╰╯ ╰╯ ╰╯ ╰╯  ╰╯
                        ╰╯ ← systematic negative deviation
matched filter response: SNR 31.2 (threshold 4.0)
conformal set: {planet-candidate} @ 95% coverage
>> 1 monotransit candidate found. depth 231 ppm, duration 12.5h`;

const BIBTEX_EXOVEIL = `@misc{priyanshu2026exoveil,
  author = {Priyanshu, Pratik},
  title = {ExoVeil: Detecting Single-Transit Exoplanets Through Learned Stellar Behaviour},
  year = {2026},
  eprint = {2606.02778},
  archivePrefix = {arXiv}
}`;

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = useCallback((text: string, kind: Line["kind"] = "out") => {
    setLines((ls) => [
      ...ls,
      ...text.split("\n").map((t) => ({ text: t, kind })),
    ]);
  }, []);

  const run = useCallback(
    async (raw: string) => {
      const cmd = raw.trim();
      setLines((ls) => [...ls, { text: `$ ${cmd}`, kind: "in" }]);
      if (!cmd) return;

      const [head, ...rest] = cmd.split(/\s+/);
      const arg = rest.join(" ");

      switch (true) {
        case head === "help":
          print(HELP);
          break;
        case head === "ls":
          print(PROJECTS_LS);
          break;
        case head === "cat" && /about/.test(arg):
          print(ABOUT_TXT);
          break;
        case head === "pip" && /install/.test(cmd): {
          const pkg = /hnep/.test(cmd) ? "hnep" : "exoveil";
          print(`Collecting ${pkg}`);
          await new Promise((r) => setTimeout(r, 450));
          print(`  Downloading ${pkg}-0.3.0-py3-none-any.whl (pretrained weights included)`);
          await new Promise((r) => setTimeout(r, 550));
          print(`Installing collected packages: ${pkg}`);
          await new Promise((r) => setTimeout(r, 350));
          print(`Successfully installed ${pkg}-0.3.0`, "ok");
          print(`(this actually works — try it in a real shell)`, "warn");
          break;
        }
        case /detect_transit/.test(head): {
          print("loading world model (3.2M params)...");
          await new Promise((r) => setTimeout(r, 700));
          print(TRANSIT_ART, "accent");
          break;
        }
        case /collapse_star/.test(head): {
          print("WARNING: initiating gravitational collapse...", "warn");
          await new Promise((r) => setTimeout(r, 600));
          print("Chandrasekhar limit exceeded. forming event horizon.");
          window.dispatchEvent(new CustomEvent("spawn-blackhole"));
          await new Promise((r) => setTimeout(r, 400));
          print("black hole active for 7s. watch the stars behind this window.", "accent");
          print("(tip: you can also summon one by holding your mouse down on empty space)", "out");
          setTimeout(() => setOpen(false), 1800);
          break;
        }
        case head === "cite": {
          try {
            await navigator.clipboard.writeText(BIBTEX_EXOVEIL);
            print(BIBTEX_EXOVEIL);
            print("copied to clipboard ✓", "ok");
          } catch {
            print(BIBTEX_EXOVEIL);
          }
          break;
        }
        case head === "open": {
          const map: Record<string, string> = {
            projects: "projects",
            papers: "publications",
            publications: "publications",
            about: "about",
            skills: "skills",
            contact: "contact",
            blog: "blog",
          };
          const id = map[arg.toLowerCase()];
          if (id) {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            print(`navigating to ${id}...`, "ok");
            setTimeout(() => setOpen(false), 600);
          } else {
            print(`unknown section: ${arg}. try: projects, papers, contact`);
          }
          break;
        }
        case head === "whoami":
          print("a curious visitor with excellent taste in portfolios", "ok");
          break;
        case head === "clear":
          setLines([]);
          break;
        case head === "exit":
          setOpen(false);
          break;
        case head === "sudo":
          print("nice try. this incident will be reported to the PI.", "warn");
          break;
        default:
          print(`command not found: ${head}. try \`help\``);
      }
    },
    [print]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input;
    setInput("");
    void run(v);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="fixed top-0 inset-x-0 z-[60] border-b border-border-light bg-background/95 backdrop-blur-xl shadow-2xl"
          role="dialog"
          aria-label="Research terminal"
        >
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div
              ref={scrollRef}
              className="h-72 overflow-y-auto font-mono text-[12.5px] leading-relaxed pr-2"
            >
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={
                    l.kind === "in"
                      ? "text-text-primary"
                      : l.kind === "ok"
                        ? "text-accent-green"
                        : l.kind === "warn"
                          ? "text-accent-yellow"
                          : l.kind === "accent"
                            ? "text-accent-blue-light"
                            : "text-text-secondary"
                  }
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {l.text}
                </div>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex items-center gap-2 mt-2 border-t border-border/50 pt-2">
              <span className="font-mono text-accent-yellow text-sm select-none">
                $
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none font-mono text-sm text-text-primary placeholder:text-text-muted/50"
                placeholder="try: ./detect_transit"
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
              />
              <span className="text-[10px] font-mono text-text-muted/60 select-none">
                ESC to close
              </span>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
