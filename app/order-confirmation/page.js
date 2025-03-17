'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function OrderConfirmationPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Rediriger vers la page d'accueil si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Merci pour votre commande !</h2>
          <p className="text-lg text-gray-600 mb-8">
            Votre commande a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-md mb-8 max-w-md mx-auto">
            <h3 className="text-black font-semibold mb-4 text-left">Détails de la commande</h3>
            <div className="text-left mb-4">
              <p className="text-sm text-black">Numéro de commande</p>
              <p className="text-gray-600 font-medium">#{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
            </div>
            <div className="text-left mb-4">
              <p className="text-sm text-black">Date</p>
              <p className="text-gray-600 font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-left mb-4">
              <p className="text-sm text-black">Méthode de paiement</p>
              <p className="text-gray-600 font-medium">Carte bancaire</p>
            </div>
            <div className="text-left">
              <p className="text-sm text-black">Livraison estimée</p>
              <p className="text-gray-600 font-medium">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/"
              className="inline-block bg-red-600 text-black px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Retour à la boutique
            </Link>
            <Link 
              href="/account"
              className="inline-block bg-white border border-black text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50"
            >
              Voir mes commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}