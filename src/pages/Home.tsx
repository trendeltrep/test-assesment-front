import React, { useState, useEffect } from "react";
import RecipeItem from "../components/RecipeItem";
import { getRecipes } from "../api";
import '../styles/Home.css';

interface Recipe {
  idMeal: string; 
  strMeal: string; 
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipes()
      .then((data) => {
        if (data.meals) {
          setRecipes(data.meals);
        } else {
          setRecipes([]);
        }
      })
      .catch((error) => {
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-container">
      <h1>Recipe list</h1>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : recipes.length > 0 ? (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeItem key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="no-recipes">There is no recipes.</p>
      )}
    </div>
  );
}
