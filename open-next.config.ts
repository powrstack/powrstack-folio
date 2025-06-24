import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
  // Configure default function for Cloudflare Workers
  default: {
    // Use edge runtime for better performance on Cloudflare Workers
    runtime: 'edge',
  },
};

export default config;
