"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth(); // Utilisation du contexte d'authentification

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      // Vérifier s'il y a une redirection à effectuer 
      const redirectPath = searchParams.get("redirect") || sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        // Rediriger vers la page d'accueil seulement s'il n'y a pas de redirection spécifiée
        router.push("/");
      }
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    // Récupérer le message de succès de l'URL
    const successMessage = searchParams.get("success");
    if (successMessage) {
      setSuccess(successMessage);
    }
    
    // Récupérer la redirection après connexion
    const redirect = searchParams.get("redirect");
    if (redirect) {
      // Stocker la redirection dans sessionStorage
      sessionStorage.setItem("redirectAfterLogin", redirect);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Utiliser la fonction login du contexte d'authentification
      await login(formData.email, formData.password);
      
      // Vérifier s'il y a une redirection à effectuer
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        // Rediriger vers la page d'accueil
        router.push("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="votre@email.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Votre mot de passe"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-red-600 text-black rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          Vous n'avez pas de compte?{" "}
          <Link href="/register" className="text-red-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}