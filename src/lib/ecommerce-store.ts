/**
 * Store en mémoire pour la démo E-commerce (sans Prisma/DB).
 * Données de seed alignées sur le legacy sebstarsionextjs (scripts/seed-ecommerce.ts).
 */

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
  category: StoreCategory;
  createdAt: string;
  updatedAt: string;
}

export interface StoreCartItem {
  id: string;
  userId: string | null;
  productId: string;
  product: StoreProduct;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreWishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: StoreProduct;
  createdAt: string;
}

let categoryIdCounter = 1;
let productIdCounter = 1;
let cartItemIdCounter = 1;
let wishlistIdCounter = 1;

const categories: StoreCategory[] = [
  { id: 'cat-1', name: 'Déco', slug: 'deco' },
  { id: 'cat-2', name: 'Instruments', slug: 'instruments' },
  { id: 'cat-3', name: 'Accessoires', slug: 'accessoires' },
  { id: 'cat-4', name: 'Livres', slug: 'livres' },
];

const products: StoreProduct[] = [
  {
    id: 'prod-1',
    name: 'Étoile Lumineuse',
    slug: 'etoile-lumineuse',
    description: 'Étoile décorative avec effet lumineux',
    price: 29.99,
    image: '⭐',
    stock: 10,
    categoryId: 'cat-1',
    category: categories[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Télescope Portable',
    slug: 'telescope-portable',
    description: 'Télescope compact pour observer les étoiles',
    price: 199.99,
    image: '🔭',
    stock: 5,
    categoryId: 'cat-2',
    category: categories[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Carte du Ciel',
    slug: 'carte-du-ciel',
    description: 'Carte interactive du ciel étoilé',
    price: 15.99,
    image: '🗺️',
    stock: 20,
    categoryId: 'cat-3',
    category: categories[2],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: "Livre d'Astronomie",
    slug: 'livre-astronomie',
    description: "Guide complet de l'astronomie",
    price: 24.99,
    image: '📚',
    stock: 15,
    categoryId: 'cat-4',
    category: categories[3],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Lunettes Astronomiques',
    slug: 'lunettes-astronomiques',
    description: 'Lunettes spéciales pour observation',
    price: 49.99,
    image: '👓',
    stock: 8,
    categoryId: 'cat-3',
    category: categories[2],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Planétarium Mini',
    slug: 'planetarium-mini',
    description: 'Planétarium de bureau interactif',
    price: 79.99,
    image: '🌍',
    stock: 12,
    categoryId: 'cat-1',
    category: categories[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const cartItems: StoreCartItem[] = [];
const wishlistItems: StoreWishlistItem[] = [];

function getProductById(id: string): StoreProduct | undefined {
  return products.find((p) => p.id === id);
}

function getProductWithCategory(product: StoreProduct): StoreProduct {
  const cat = categories.find((c) => c.id === product.categoryId);
  return { ...product, category: cat ?? product.category };
}

export function getCategories(): StoreCategory[] {
  return [...categories];
}

export function getProducts(categorySlug?: string): StoreProduct[] {
  if (!categorySlug || categorySlug === 'tous') {
    return products.map(getProductWithCategory);
  }
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return products.map(getProductWithCategory);
  return products
    .filter((p) => p.categoryId === cat.id)
    .map(getProductWithCategory);
}

export function getProductByIdFromStore(id: string): StoreProduct | undefined {
  const p = getProductById(id);
  return p ? getProductWithCategory(p) : undefined;
}

function getCartUserId(sessionUserId: string | null): string | null {
  return sessionUserId ?? null;
}

export function getCart(sessionUserId: string | null): StoreCartItem[] {
  const uid = getCartUserId(sessionUserId);
  return cartItems
    .filter((item) => item.userId === uid)
    .map((item) => ({
      ...item,
      product: getProductWithCategory(item.product),
    }));
}

export function addToCart(
  sessionUserId: string | null,
  productId: string,
  quantity: number
): StoreCartItem | { error: string } {
  const product = getProductById(productId);
  if (!product) return { error: 'Product not found' };
  if (product.stock < quantity) return { error: 'Insufficient stock' };

  const uid = getCartUserId(sessionUserId);
  const existing = cartItems.find(
    (i) => i.userId === uid && i.productId === productId
  );

  const now = new Date().toISOString();
  if (existing) {
    const newQty = existing.quantity + quantity;
    if (product.stock < newQty) return { error: 'Insufficient stock' };
    existing.quantity = newQty;
    existing.updatedAt = now;
    product.stock -= quantity;
    return { ...existing, product: getProductWithCategory(product) };
  }

  const newItem: StoreCartItem = {
    id: `cart-${++cartItemIdCounter}`,
    userId: uid,
    productId,
    product: getProductWithCategory(product),
    quantity,
    createdAt: now,
    updatedAt: now,
  };
  cartItems.push(newItem);
  product.stock -= quantity;
  return newItem;
}

export function updateCartItemQuantity(
  sessionUserId: string | null,
  cartItemId: string,
  quantity: number
): StoreCartItem | { error: string } {
  const uid = getCartUserId(sessionUserId);
  const item = cartItems.find((i) => i.id === cartItemId);
  if (!item) return { error: 'Cart item not found' };
  if (item.userId !== uid) return { error: 'Unauthorized' };

  if (quantity <= 0) {
    const product = getProductById(item.productId);
    if (product) product.stock += item.quantity;
    const idx = cartItems.indexOf(item);
    cartItems.splice(idx, 1);
    return item as StoreCartItem;
  }

  const product = getProductById(item.productId);
  if (!product) return { error: 'Product not found' };
  const delta = quantity - item.quantity;
  if (product.stock + item.quantity < quantity) return { error: 'Insufficient stock' };
  product.stock -= delta;
  item.quantity = quantity;
  item.updatedAt = new Date().toISOString();
  return { ...item, product: getProductWithCategory(product) };
}

export function removeFromCart(
  sessionUserId: string | null,
  cartItemId: string
): boolean {
  const uid = getCartUserId(sessionUserId);
  const item = cartItems.find((i) => i.id === cartItemId);
  if (!item || item.userId !== uid) return false;
  const product = getProductById(item.productId);
  if (product) product.stock += item.quantity;
  const idx = cartItems.indexOf(item);
  cartItems.splice(idx, 1);
  return true;
}

export function getWishlist(sessionUserId: string): StoreWishlistItem[] {
  return wishlistItems
    .filter((i) => i.userId === sessionUserId)
    .map((i) => ({ ...i, product: getProductWithCategory(i.product) }));
}

export function addToWishlist(
  sessionUserId: string,
  productId: string
): StoreWishlistItem | { error: string } {
  const product = getProductById(productId);
  if (!product) return { error: 'Product not found' };
  const existing = wishlistItems.find(
    (i) => i.userId === sessionUserId && i.productId === productId
  );
  if (existing) return { error: 'Product already in wishlist' };
  const newItem: StoreWishlistItem = {
    id: `wish-${++wishlistIdCounter}`,
    userId: sessionUserId,
    productId,
    product: getProductWithCategory(product),
    createdAt: new Date().toISOString(),
  };
  wishlistItems.push(newItem);
  return newItem;
}

export function removeFromWishlist(
  sessionUserId: string,
  productId: string
): boolean {
  const idx = wishlistItems.findIndex(
    (i) => i.userId === sessionUserId && i.productId === productId
  );
  if (idx === -1) return false;
  wishlistItems.splice(idx, 1);
  return true;
}

export function getRecommendations(
  _sessionUserId: string | null,
  limit: number = 6
): StoreProduct[] {
  return products.slice(0, limit).map(getProductWithCategory);
}

export function checkout(sessionUserId: string | null): { success: boolean; error?: string } {
  const uid = getCartUserId(sessionUserId);
  const items = cartItems.filter((i) => i.userId === uid);
  if (items.length === 0) return { success: false, error: 'Cart is empty' };
  for (const item of items) {
    const idx = cartItems.indexOf(item);
    cartItems.splice(idx, 1);
  }
  return { success: true };
}
