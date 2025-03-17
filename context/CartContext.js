'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  // Récupérer le panier au chargement, mais seulement après que l'authentification soit chargée
  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [isAuthenticated, authLoading]);

  // Fonction pour récupérer le panier
  const fetchCart = async () => {
    setLoading(true);
    try {
      // Si l'utilisateur est connecté, récupérer son panier depuis le serveur
      if (isAuthenticated) {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          setCart({
            items: data.items || [],
            totalItems: calculateTotalItems(data.items || [])
          });
        } else {
          console.error('Erreur lors de la récupération du panier:', response.statusText);
          // Fallback à un panier vide si l'API échoue
          setCart({ items: [], totalItems: 0 });
        }
      } else {
        // Sinon, récupérer le panier depuis le localStorage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const parsedCart = JSON.parse(localCart);
            setCart({
              items: parsedCart.items || [],
              totalItems: calculateTotalItems(parsedCart.items || [])
            });
          } catch (error) {
            console.error('Erreur lors de la lecture du panier local:', error);
            localStorage.removeItem('cart');
            setCart({ items: [], totalItems: 0 });
          }
        } else {
          // Initialiser un panier vide
          setCart({ items: [], totalItems: 0 });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      setCart({ items: [], totalItems: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Calculer le nombre total d'articles
  const calculateTotalItems = (items) => {
    return Array.isArray(items) ? items.reduce((total, item) => total + (item.quantity || 0), 0) : 0;
  };

  // Ajouter un produit au panier
  const addToCart = async (product, quantity = 1) => {
    try {
      // Si l'utilisateur est connecté, ajouter au panier serveur
      if (isAuthenticated) {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            quantity
          }),
        });

        if (response.ok) {
          // Rafraîchir le panier après l'ajout
          fetchCart();
        } else {
          console.error('Erreur lors de l\'ajout au panier:', response.statusText);
          throw new Error('Erreur lors de l\'ajout au panier');
        }
      } else {
        // Sinon, ajouter au panier local
        const updatedItems = [...cart.items];
        const existingItemIndex = updatedItems.findIndex(item => item.productId === product.id);

        if (existingItemIndex !== -1) {
          // Si le produit existe déjà, augmenter la quantité
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          // Sinon, ajouter un nouvel élément
          updatedItems.push({
            productId: product.id,
            product, // Stocker les informations du produit
            quantity
          });
        }

        const updatedCart = {
          items: updatedItems,
          totalItems: calculateTotalItems(updatedItems)
        };

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  // Mettre à jour la quantité d'un article
  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      if (isAuthenticated) {
        const response = await fetch('/api/cart/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity
          }),
        });

        if (response.ok) {
          fetchCart();
        } else {
          throw new Error('Erreur lors de la mise à jour du panier');
        }
      } else {
        const updatedItems = [...cart.items];
        const itemIndex = updatedItems.findIndex(item => item.productId === productId);

        if (itemIndex !== -1) {
          if (quantity <= 0) {
            // Supprimer l'article si la quantité est 0 ou moins
            updatedItems.splice(itemIndex, 1);
          } else {
            // Mettre à jour la quantité
            updatedItems[itemIndex].quantity = quantity;
          }

          const updatedCart = {
            items: updatedItems,
            totalItems: calculateTotalItems(updatedItems)
          };

          setCart(updatedCart);
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du panier:', error);
    }
  };

  // Supprimer un article du panier
  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        const response = await fetch('/api/cart/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId
          }),
        });

        if (response.ok) {
          fetchCart();
        } else {
          throw new Error('Erreur lors de la suppression de l\'article');
        }
      } else {
        const updatedItems = cart.items.filter(item => item.productId !== productId);
        const updatedCart = {
          items: updatedItems,
          totalItems: calculateTotalItems(updatedItems)
        };

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
    }
  };

  // Vider le panier
  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        const response = await fetch('/api/cart/clear', {
          method: 'POST',
        });

        if (response.ok) {
          setCart({ items: [], totalItems: 0 });
        } else {
          throw new Error('Erreur lors de la vidange du panier');
        }
      } else {
        setCart({ items: [], totalItems: 0 });
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Erreur lors de la vidange du panier:', error);
    }
  };

  // Calculer le total du panier
  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      // Convertir le prix en nombre (enlever le "euros" et convertir)
      const price = parseFloat(item.product.price.replace(/[^\d.]/g, ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  // Fusionner les paniers lors de la connexion
  const mergeCarts = async () => {
    if (isAuthenticated && cart.items.length > 0) {
      try {
        const response = await fetch('/api/cart/merge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cart.items
          }),
        });

        if (response.ok) {
          localStorage.removeItem('cart');
          fetchCart();
        }
      } catch (error) {
        console.error('Erreur lors de la fusion des paniers:', error);
      }
    }
  };

  // Valeurs exposées par le contexte
  const value = {
    cart,
    loading,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    fetchCart,
    mergeCarts
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}