import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    experimental: {
        proxyClientMaxBodySize: '70mb',
    },
};

export default nextConfig;
