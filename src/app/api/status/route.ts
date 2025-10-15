import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const log = logger.child({
    method: req.method,
    path: req.nextUrl.pathname,
    search: req.nextUrl.search,
  });
  log.info("Status request received");
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    commit: process.env.GIT_COMMIT || "unknown",
  });
};
