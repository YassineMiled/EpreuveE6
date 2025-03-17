'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateCartItemQuantity, removeFromCart, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Attendre que l'authentification et le panier soient chargés
  useEffect(() => {
    if (!authLoading && !cartLoading) {
      setPageLoading(false);
    }
  }, [authLoading, cartLoading]);

  // Rediriger vers la page de connexion si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true);
      sessionStorage.setItem("redirectAfterLogin", "/cart");
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router, hasRedirected]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productTitle) => {
    removeFromCart(productId);
    toast.success(`${productTitle} retiré du panier`);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour finaliser votre commande");
      sessionStorage.setItem("redirectAfterLogin", "/cart");
      router.push('/login');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulation d'un processus de paiement
      await new Promise(resolve => setTimeout(resolve, 1500));
      clearCart();
      toast.success("Commande validée avec succès !");
      router.push('/order-confirmation');
    } catch (error) {
      toast.error("Une erreur est survenue lors du traitement de votre commande");
    } finally {
      setIsProcessing(false);
    }
  };

  // Afficher un loader pendant le chargement
  if (pageLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, ne pas afficher le contenu
  if (!isAuthenticated) {
    return null; // Le useEffect s'occupera de la redirection
  }

  // Afficher un message lorsque le panier est vide
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-lg text-gray-600 mb-8">Découvrez nos magnifiques bijoux et ajoutez-les à votre panier</p>
          <Link 
            href="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Votre Panier</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* En-tête du tableau */}
        <div className="grid grid-cols-12 gap-2 p-4 border-b text-sm font-medium text-gray-700 bg-gray-50">
          <div className="col-span-6 md:col-span-6">Produit</div>
          <div className="col-span-2 md:col-span-2 text-center">Prix</div>
          <div className="col-span-2 md:col-span-2 text-center">Quantité</div>
          <div className="col-span-2 md:col-span-2 text-center">Total</div>
        </div>
        
        {/* Articles du panier */}
        {cart.items.map((item) => {
          const productPrice = parseFloat(item.product.price.replace(/[^\d.]/g, ''));
          const itemTotal = (productPrice * item.quantity).toFixed(2);
          
          return (
            <div key={item.productId} className="text-gray-800 grid grid-cols-12 gap-2 p-4 border-b items-center">
              <div className="col-span-6 md:col-span-6 flex items-center space-x-4">
                <img 
                  src={item.product.image} 
                  alt={item.product.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                  <p className="text-sm text-gray-500">{item.product.material}</p>
                  <button 
                    onClick={() => handleRemoveItem(item.productId, item.product.title)}
                    className="text-red-600 text-sm mt-2 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              
              <div className="col-span-2 md:col-span-2 text-center">
                {productPrice} €
              </div>
              
              <div className="col-span-2 md:col-span-2 flex justify-center">
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="mx-2 w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="col-span-2 md:col-span-2 text-center font-medium">
                {itemTotal} €
              </div>
            </div>
          );
        })}
        
        {/* Résumé et total */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between mb-4">
            <span className="font-medium text-gray-900">Sous-total</span>
            <span className="font-medium text-gray-900">{getCartTotal()} €</span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="font-medium text-gray-900">Frais de livraison</span>
            <span className="font-medium text-green-600">Gratuit</span>
          </div>
          <div className="flex justify-between mb-8">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{getCartTotal()} €</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Link 
              href="/"
              className="inline-block bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 text-center"
            >
              Continuer mes achats
            </Link>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement en cours...
                </span>
              ) : (
                "Valider ma commande"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}