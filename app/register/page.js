"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation simple
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      console.log("Envoi des données d'inscription...");
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      console.log("Statut de la réponse:", response.status);
      
      // Si la réponse n'est pas OK, nous devons vérifier le format de l'erreur
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.message || "Erreur lors de l'inscription");
        } else {
          throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log("Inscription réussie:", data);

      // Rediriger vers la page de connexion après inscription réussie
      router.push("/login?success=Compte créé avec succès, veuillez vous connecter");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setError(error.message || "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="text-black w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Votre nom"
          />
        </div>
        
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
        
        <div className="mb-4">
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
            placeholder="Mot de passe (min. 6 caractères)"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="text-black w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Confirmez votre mot de passe"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-red-600 text-white  rounded hover:bg-red-700 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Création en cours..." : "Créer un compte"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          Vous avez déjà un compte?{" "}
          <Link href="/login" className="text-black hover:underline ">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}