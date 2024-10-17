/** @type {import('next').NextConfig} */
const nextConfig = {  
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
    images: {
        domains: ['res.cloudinary.com'], // Add Cloudinary as an allowed domain
    }
};

export default nextConfig;
