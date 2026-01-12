/** @type {import('next').NextConfig} */
export default {
	output: "standalone",
	serverExternalPackages: ["@prisma/client"],
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
				],
			},
		];
	},
};
