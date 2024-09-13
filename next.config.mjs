/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	trailingSlash: false,
	generateEtags: true,
	poweredByHeader: false,
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false
			config.resolve.fallback.path = false
			config.resolve.fallback.os = false
		}
		return config
	},
}

export default nextConfig
