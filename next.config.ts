import type { NextConfig } from "next";

// `STATIC_EXPORT=1 npm run build` produces a plain static site in /out
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isExport ? { output: "export", images: { unoptimized: true } } : {};

export default nextConfig;
