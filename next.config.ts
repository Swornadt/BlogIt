import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:"plus.unsplash.com"
      },
      {
        protocol:'https',
        hostname:"res.cloudinary.com"
      },
      {
        protocol:'https',
        hostname:"www.shutterstock.com"
      }
    ]
  }
};

export default nextConfig;
