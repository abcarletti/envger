/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['avatars.githubusercontent.com', 'placehold.co'],
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
