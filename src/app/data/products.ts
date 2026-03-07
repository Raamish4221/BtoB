export interface Product {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string;
  imageGradient: string;
}

export const products: Product[] = [
  {
    id: "amazon-gift-card",
    name: "Amazon Gift Card",
    category: "Gift Cards",
    shortDescription: "Instant digital delivery with flexible denominations.",
    description:
      "Amazon Gift Card codes are delivered instantly and can be redeemed across millions of products. Ideal for customer rewards, reseller inventory, and recurring campaign payouts.",
    price: 50,
    rating: 4.8,
    reviews: 1240,
    badge: "Best Seller",
    imageGradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  },
  {
    id: "netflix-premium",
    name: "Netflix Premium",
    category: "Subscriptions",
    shortDescription: "High-demand shared plan for monthly fulfillment.",
    description:
      "Netflix Premium subscription package for seamless entertainment access. Built for reliable digital delivery with strong repeat purchase behavior from end users.",
    price: 70,
    rating: 4.7,
    reviews: 910,
    badge: "Hot",
    imageGradient: "linear-gradient(135deg, #dc2626 0%, #111827 100%)",
  },
  {
    id: "google-play-voucher",
    name: "Google Play Voucher",
    category: "Gift Cards",
    shortDescription: "Fast moving voucher for Android and app credits.",
    description:
      "Google Play Voucher enables direct top-up for apps, games, and subscriptions. Strong conversion for gaming and mobile-first customers with instant code fulfillment.",
    price: 40,
    rating: 4.6,
    reviews: 730,
    badge: "Trending",
    imageGradient: "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
  },
  {
    id: "spotify-annual",
    name: "Spotify Annual",
    category: "Subscriptions",
    shortDescription: "Yearly music subscription with stable reorder demand.",
    description:
      "Spotify Annual plan with premium listening features. A dependable digital product for subscription bundles, loyalty gifts, and upsell campaigns.",
    price: 60,
    rating: 4.5,
    reviews: 560,
    badge: "Value Pack",
    imageGradient: "linear-gradient(135deg, #10b981 0%, #1d4ed8 100%)",
  },
  {
    id: "steam-wallet-code",
    name: "Steam Wallet Code",
    category: "Gaming",
    shortDescription: "Top gaming wallet code for high-frequency purchases.",
    description:
      "Steam Wallet Code for global PC gamers. Great for gaming communities, event promotions, and frequent digital top-up use cases.",
    price: 35,
    rating: 4.9,
    reviews: 680,
    badge: "Top Rated",
    imageGradient: "linear-gradient(135deg, #0f172a 0%, #38bdf8 100%)",
  },
  {
    id: "canva-pro",
    name: "Canva Pro",
    category: "Productivity",
    shortDescription: "Creative suite access for teams and creators.",
    description:
      "Canva Pro access for advanced templates, premium assets, and team collaboration. Useful for agencies, freelancers, and design-heavy business operations.",
    price: 45,
    rating: 4.4,
    reviews: 350,
    badge: "Editor Pick",
    imageGradient: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}
