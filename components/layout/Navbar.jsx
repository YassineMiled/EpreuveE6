'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Header({ searchTerm, setSearchTerm }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else if (currentScrollY === 0) {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login?success=Vous avez été déconnecté avec succès');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-transform duration-300 ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>  
      <div className="w-full px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-red-700 text-3xl font-bold">Dalouaa</Link>
        <nav>
          <ul className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <li><Link href="/products/bracelet" className="text-gray-700 hover:text-red-700 transition-colors">Bracelets</Link></li>
            <li><Link href="/products/collier" className="text-gray-700 hover:text-red-700 transition-colors">Colliers</Link></li>
            <li><Link href="/products/bague" className="text-gray-700 hover:text-red-700 transition-colors">Bagues</Link></li>
            <li><Link href="/products/boucles-oreilles" className="text-gray-700 hover:text-red-700 transition-colors">Boucles d'oreilles</Link></li>
            
            {/* Icône du panier avec badge */}
            <li>
              <Link href="/cart" className="text-gray-700 hover:text-red-700 transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cart.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <span className="text-gray-700">
                    Bonjour, {user?.name || user?.email}
                  </span>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="text-red-700 hover:text-red-900 transition-colors"
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="text-gray-700 hover:text-red-700 transition-colors">
                  Se Connecter
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}