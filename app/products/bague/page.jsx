'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

export default function BaguesPage() {
  const [bagues, setBagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchBagues() {
      setLoading(true);
      try {
        const response = await fetch('/api/products?category=bagues');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des bagues');
        }
        const data = await response.json();
        setBagues(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBagues();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.title} ajouté au panier`);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Bagues</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bagues.length > 0 ? (
              bagues.map(product => (
                <div key={product.id} className="bg-white border border-gray-200 p-4 flex flex-col items-center rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-80 object-cover mb-4 rounded-md"
                  />
                  <h4 className="text-red-700 text-lg font-semibold">{product.title}</h4>
                  <p className="text-gray-600 text-sm mt-2">{product.material}</p>
                  <p className="text-black font-bold text-lg mt-2">{product.price}</p>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Ajouter au Panier
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">Aucune bague disponible pour le moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}