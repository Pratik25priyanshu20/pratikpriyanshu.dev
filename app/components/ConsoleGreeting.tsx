"use client";

import { useEffect } from "react";

export default function ConsoleGreeting() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line no-console
    console.log(
      "%cflux\n%c" +
        "  ─╮ ╭─────╮ ╭────╮  ╭──────────╮ ╭───╮   ╭────\n" +
        "   ╰─╯     ╰─╯    ╰──╯          ╰─╯   ╰───╯    \n" +
        "                        ╰─ transit? ─╯          \n",
      "color:#facc15;font-weight:bold;font-size:14px",
      "color:#60a5fa;font-family:monospace"
    );
    // eslint-disable-next-line no-console
    console.log(
      "%cYou inspect element? We should talk.\n%cpriyanshupriyam123vv@gmail.com — PhD applications welcome.\n%cPsst: press ` (backtick) on the page.",
      "color:#fff;font-size:13px;font-weight:600",
      "color:#a0a0a0;font-size:12px",
      "color:#facc15;font-size:11px"
    );
  }, []);

  return null;
}
