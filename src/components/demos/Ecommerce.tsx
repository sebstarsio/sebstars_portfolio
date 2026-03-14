'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import '../../styles/demos/ecommerce.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface WishlistItem {
  id: string;
  product: Product;
}

export default function Ecommerce() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Charger les produits et catégories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCart();
    fetchRecommendations();
    if (session) {
      fetchWishlist();
    }
  }, []);

  // Recharger les produits quand la catégorie change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // Recharger le panier et wishlist quand la session change
  useEffect(() => {
    fetchCart();
    if (session) {
      fetchWishlist();
      fetchRecommendations();
    } else {
      setWishlist([]);
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'tous'
        ? '/api/products'
        : `/api/products?category=${selectedCategory}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to cart');
      }

      await fetchCart();
      await fetchProducts(); // Recharger pour mettre à jour le stock
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      alert(err.message || 'Erreur lors de l\'ajout au panier');
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove from cart');
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItemId,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update quantity');
      }

      await fetchCart();
      await fetchProducts(); // Recharger pour mettre à jour le stock
    } catch (err: any) {
      console.error('Error updating quantity:', err);
      alert(err.message || 'Erreur lors de la mise à jour de la quantité');
    }
  };

  const fetchWishlist = async () => {
    if (!session) {
      setWishlist([]);
      return;
    }

    try {
      const response = await fetch('/api/wishlist');
      if (!response.ok) {
        if (response.status === 401) {
          // Non authentifié, pas d'erreur
          setWishlist([]);
          return;
        }
        throw new Error('Failed to fetch wishlist');
      }
      const data = await response.json();
      setWishlist(data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setWishlist([]);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/products/recommendations');
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setRecommendations([]);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.product.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    if (!session) {
      alert('Veuillez vous connecter pour ajouter des produits à votre liste de souhaits.');
      return;
    }

    const inWishlist = isInWishlist(product.id);

    try {
      if (inWishlist) {
        // Retirer de la wishlist
        const response = await fetch(`/api/wishlist?productId=${product.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to remove from wishlist');
        }
      } else {
        // Ajouter à la wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add to wishlist');
        }
      }

      // Recharger la wishlist
      await fetchWishlist();
    } catch (err: any) {
      console.error('Error toggling wishlist:', err);
      alert(err.message || 'Erreur lors de la modification de la liste de souhaits');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Vérifier que l'utilisateur est connecté
    if (!session) {
      alert('Veuillez vous connecter pour passer une commande.');
      return;
    }

    try {
      setProcessingPayment(true);
      setShowCheckout(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();

      // Si Stripe est configuré, rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Paiement simulé (Stripe non configuré)
        await fetchCart();
        await fetchProducts();
        setShowCheckout(false);
        setIsCartOpen(false);
        alert('Commande passée avec succès ! Merci pour votre achat.');
      }
    } catch (err: any) {
      console.error('Error during checkout:', err);
      setShowCheckout(false);
      alert(err.message || 'Erreur lors de la commande');
    } finally {
      setProcessingPayment(false);
    }
  };

  const allCategories = [{ id: 'tous', name: 'Tous', slug: 'tous' }, ...categories];

  return (
    <>
      <section className="wf-section wf-hero">
        <div className="wf-hero-bg">
          <div className="wf-starfield-layer"></div>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="curve-glow curve-glow-1"></div>
          <div className="curve-glow curve-glow-2"></div>
        </div>
        <div className="wf-inner hero-inner">
          <div className="wf-hero-content">
            <div className="wf-hero-text">
              <p className="eyebrow">Boutique en Ligne</p>
              <h1 className="wf-hero-title">
                E-commerce<br />
                <span className="underline-wave">Full Stack</span>
              </h1>
              <p className="lead">
                Application e-commerce complète avec base de données PostgreSQL, catalogue de produits,
                panier d&apos;achat, gestion des stocks et système de commandes.
              </p>
            </div>
          </div>
        </div>
        <div className="wf-wave-divider wf-wave-bottom">
          <svg viewBox="0 0 1440 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveHeroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#050716" />
                <stop offset="40%" stopColor="#10163B" />
                <stop offset="75%" stopColor="#1B355A" />
                <stop offset="100%" stopColor="#050716" />
              </linearGradient>
            </defs>
            <path fill="url(#waveHeroGrad)" d="M0,160 C260,220 420,80 720,140 C1040,200 1180,260 1440,200 L1440,240 L0,240 Z" />
          </svg>
        </div>
      </section>

      <section className="wf-section wf-projects">
        <div className="wf-wave-divider wf-wave-top ecommerce-wave-parasite">
          <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveControlsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#050716" />
                <stop offset="30%" stopColor="#10163B" />
                <stop offset="70%" stopColor="#241848" />
                <stop offset="100%" stopColor="#050716" />
              </linearGradient>
            </defs>
            <path fill="url(#waveControlsGrad)" d="M0,40 C260,-10 420,140 720,90 C1040,40 1180,-40 1440,10 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <div className="wf-inner">
          <div className="ecommerce-wrapper">
            <div className="ecommerce-header">
              <h2 className="section-title">Catalogue de Produits</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {session ? (
                  <>
                    <span style={{ color: '#fff' }}>👤 {session.user?.name || session.user?.email}</span>
                    <button
                      onClick={() => signOut()}
                      style={{ padding: '0.5rem 1rem', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => signIn()}
                    style={{ padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Se connecter
                  </button>
                )}
                <button className="cart-toggle" onClick={() => setIsCartOpen(true)}>
                  🛒 <span>{getCartItemCount()}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message" style={{ marginBottom: '1rem', padding: '1rem', background: '#ff4444', color: 'white', borderRadius: '4px' }}>
                {error}
              </div>
            )}

            <div className="category-filters">
              {allCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.slug ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Chargement des produits...</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.length === 0 ? (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                    Aucun produit disponible
                  </p>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="product-card">
                      <div style={{ position: 'relative' }}>
                        <div className="product-image">{product.image}</div>
                        {session && (
                          <button
                            onClick={() => toggleWishlist(product)}
                            style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              background: isInWishlist(product.id) ? '#ff4444' : 'rgba(0,0,0,0.5)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              cursor: 'pointer',
                              fontSize: '1.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                            }}
                            title={isInWishlist(product.id) ? 'Retirer de la liste' : 'Ajouter à la liste'}
                          >
                            {isInWishlist(product.id) ? '❤️' : '🤍'}
                          </button>
                        )}
                      </div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-footer">
                        <span className="product-price">{product.price.toFixed(2)} €</span>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock > 0 ? (
                            <>
                              Ajouter<br />au panier
                            </>
                          ) : (
                            'Rupture de stock'
                          )}
                        </button>
                        {product.stock > 0 && (
                          <small style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', width: '100%' }}>
                            Stock: {product.stock}
                          </small>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {recommendations.length > 0 && (
              <div style={{ marginTop: '4rem' }}>
                <h2 className="section-title" style={{ marginBottom: '2rem' }}>
                  ⭐ Recommandations pour vous
                </h2>
                <div className="products-grid">
                  {recommendations.map(product => (
                    <div key={product.id} className="product-card">
                      <div style={{ position: 'relative' }}>
                        <div className="product-image">{product.image}</div>
                        {session && (
                          <button
                            onClick={() => toggleWishlist(product)}
                            style={{
                              position: 'absolute',
                              top: '0.5rem',
                              right: '0.5rem',
                              background: isInWishlist(product.id) ? '#ff4444' : 'rgba(0,0,0,0.5)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              cursor: 'pointer',
                              fontSize: '1.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                            }}
                            title={isInWishlist(product.id) ? 'Retirer de la liste' : 'Ajouter à la liste'}
                          >
                            {isInWishlist(product.id) ? '❤️' : '🤍'}
                          </button>
                        )}
                      </div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-footer">
                        <span className="product-price">{product.price.toFixed(2)} €</span>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock > 0 ? (
                            <>
                              Ajouter<br />au panier
                            </>
                          ) : (
                            'Rupture de stock'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Panier</h2>
              <button className="cart-close" onClick={() => setIsCartOpen(false)}>&times;</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="cart-empty">Votre panier est vide</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">{item.product.image}</div>
                    <div className="cart-item-details">
                      <h4>{item.product.name}</h4>
                      <p>{item.product.price.toFixed(2)} €</p>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total :</span>
                  <span>{getCartTotal().toFixed(2)} €</span>
                </div>
                {!session && (
                  <p style={{ color: '#ffa500', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                    ⚠️ Connectez-vous pour passer une commande
                  </p>
                )}
                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={!session || processingPayment}
                >
                  {processingPayment ? 'Traitement...' : session ? '💳 Payer avec Stripe' : 'Se connecter'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
