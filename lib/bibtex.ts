import type { Publication } from "./publications";

export function toBibtex(pub: Publication): string {
  const key = `priyanshu${pub.year}${pub.id.split("-")[0]}`;
  const isArxiv = pub.venue.toLowerCase().includes("arxiv");
  const url = pub.links[0]?.url;

  const fields: [string, string][] = [
    ["author", "Priyanshu, Pratik"],
    ["title", pub.title],
    ["year", String(pub.year)],
  ];

  if (isArxiv) {
    const idMatch = pub.venue.match(/(\d{4}\.\d{4,5})/);
    if (idMatch) {
      fields.push(["eprint", idMatch[1]]);
      fields.push(["archivePrefix", "arXiv"]);
    }
  } else {
    fields.push(["howpublished", pub.venue]);
  }
  if (url) fields.push(["url", url]);
  if (pub.status !== "published") fields.push(["note", pub.status === "preprint" ? "Preprint" : "Under review"]);

  const body = fields.map(([k, v]) => `  ${k} = {${v}}`).join(",\n");
  return `@misc{${key},\n${body}\n}`;
}
