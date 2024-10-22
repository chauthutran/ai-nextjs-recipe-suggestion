/** @type {import('next').NextConfig} */
const nextConfig = {  
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
    },
    images: {
        // domains: ['res.cloudinary.com'], // Add Cloudinary as an allowed domain
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com', // Replace with your domain
              port: '', // Leave empty if not using a specific port
              pathname: '/**', // Specify the pathname as needed
            }
          ],
      
    }
};

export default nextConfig;
