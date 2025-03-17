"use client";
import { useState, useEffect } from 'react';

const slides = [
  {
    
    
    image: "/images/fond1.jpeg",
    title: "L'élégance à votre portée"
  },
  
  {
    image: "/images/fond3.jpeg",
    title: "L'art de la joaillerie"
  }
];

const categories = [
  {
    title: "Nos Bracelets",
    image: "/images/braceletOr.jpeg",
    link: "/products/bracelet"
  },
  {
    title: "Nos Bagues",
    image: "/images/bagueArgenteAvecDiamant.jpeg",
    link: "/products/bague"
  },
  {
    title: "Nos Colliers",
    image: "/images/collierOr.jpeg",
    link: "/products/collier"
  },
  {
    title: "Nos Boucles D'oreilles",
    image: "/images/bouclesOreillesArgent.jpeg",
    link: "/products/boucles-oreilles"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (


    <div className="min-h-screen bg-white">
        {/* <Header/> */}
        
      {/* Slider */}
      <div className="relative h-screen">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-30" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold shadow-lg">
                {slide.title}
              </h2>
            </div>
          </div>
        ))}
        
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
          <button
            onClick={prevSlide}
            className="bg-black bg-opacity-50 text-white p-4 hover:bg-opacity-80 transition-colors"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="bg-black bg-opacity-50 text-white p-4 hover:bg-opacity-80 transition-colors"
          >
            ❯
          </button>
        </div>
      </div>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl text-red-700 text-center mb-8">Nos Accessoires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <a
                key={category.link}
                href={category.link}
                className="group bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:-translate-y-2"
              >
                <div className="relative h-64">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-red-700 text-center text-xl py-4">
                  {category.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
    
    </div>
  );
}