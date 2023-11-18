// Importing env files here to validate on build
import "./src/env.mjs";

// import withBundleAnalyzer from "@next/bundle-analyzer";

// const bundleAnalyzer = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// });

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@ameleco/api", "@ameleco/db"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [{ hostname: "uiduwuwbecwtnkohclvi.supabase.co" }],
  },
};

export default config;
