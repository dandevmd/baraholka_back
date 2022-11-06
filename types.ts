export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string; // 679px × 829px
  price: number;
  countInStock: number;
  brand: string;
  rating: number;
  numReviews: number;
  description: string;
}

export interface CartItem extends Product {
  qty: number;
}

