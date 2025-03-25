import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: 'standalone',
    images: {
        domains: [
            'media.istockphoto.com', 
            'www.croquonslavie.fr', 
            'cache.marieclaire.fr', 
            'www.valderance.com', 
            'cuisine-addict.com', 
            'img.cuisineaz.com', 
            'chefcuisto.com', 
            'static.750g.com'
        ],
    },
};
export default nextConfig;
