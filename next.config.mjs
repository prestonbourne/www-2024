/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.glsl/,
            use: ["raw-loader"],
        });

        return config;
    },
    images: {
        domains: ["*"],
    },
};

export default nextConfig;
