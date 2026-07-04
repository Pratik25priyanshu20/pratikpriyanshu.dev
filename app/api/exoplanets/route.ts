import { NextResponse } from "next/server";

export const revalidate = 86400; // refresh daily

const TAP_URL =
  "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+count(*)+as+n+from+pscomppars&format=json";

export async function GET() {
  try {
    const res = await fetch(TAP_URL, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`TAP ${res.status}`);
    const data = (await res.json()) as { n: number }[];
    const count = data?.[0]?.n;
    if (typeof count !== "number") throw new Error("unexpected shape");
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: null }, { status: 200 });
  }
}
