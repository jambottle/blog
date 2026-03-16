/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  transpilePackages: ["@workspace/ui"],
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
