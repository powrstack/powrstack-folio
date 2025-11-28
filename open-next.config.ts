import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Use default caching - staticAssetsIncrementalCache causes read-only errors
  enableCacheInterception: false
});
