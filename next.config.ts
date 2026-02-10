import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 	output: 'standalone',
	turbopack: {root: __dirname},
	trailingSlash: true,
	assetPrefix: process.env.NODE_ENV === 'production' ? '/' : undefined,
	productionBrowserSourceMaps: process.env.NODE_ENV === 'production' ? false : true,
	images: {
		unoptimized: true,
	},
	reactStrictMode: false,
	async rewrites() {
		return [
			{
				source: '/chat/GeoGebra/:path*',
				destination: '/GeoGebra/:path*',
			},
			{
				source: '/agent/GeoGebra/:path*',
				destination: '/GeoGebra/:path*',
			},
		];
	},
};

export default nextConfig;
