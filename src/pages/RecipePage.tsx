import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getRecipe, getRecipesByCategory, getRecipesByIngredient } from "../api";
import "../styles/RecipePage.css";


interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea: string;
  strInstructions: string;
  strCategory: string;
  ingredients: string[];
}

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe>({
    idMeal: "",
    strMeal: "",
    strMealThumb: "",
    strArea: "",
    strInstructions: "",
    strCategory: "",
    ingredients: [],
  });
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [ingredientRecipes, setIngredientRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedIngredient = queryParams.get("ingredient") as unknown as string;

  useEffect(() => {
    if (!id) return;
  
    async function fetchRecipe() {
      try {
        const data = await getRecipe(id as unknown as string);
  
        const ingredients = Object.keys(data)
          .filter((key) => key.startsWith("strIngredient") && data[key])
          .map((key) => data[key]);
  
        const recipeData: Recipe = {
          idMeal: data.idMeal,
          strMeal: data.strMeal,
          strMealThumb: data.strMealThumb,
          strArea: data.strArea,
          strInstructions: data.strInstructions,
          strCategory: data.strCategory,
          ingredients,
        };
  
        setRecipe(recipeData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  
    fetchRecipe();
  }, [id]);
  
  useEffect(() => {
    if (!recipe.strCategory) return; 
  
    async function loadRelatedRecipes() {
      try {
 
        const relatedData = await getRecipesByCategory(recipe.strCategory);

        if (Array.isArray(relatedData)) {
          setRelatedRecipes(relatedData);
        } else {
          setRelatedRecipes([]); 
        }

      } catch (error) {
        console.error("Recipe category failed:", error);
      }
    }
  
    loadRelatedRecipes();
  }, [recipe.strCategory]); 
  
  useEffect(() => {
    if (!selectedIngredient) return;

    async function fetchRecipesByIngredient() {
      try {
        const recipes = await getRecipesByIngredient(selectedIngredient);
        setIngredientRecipes(Array.isArray(recipes) ? recipes : []);
      } catch (error) {
        console.error("Failed to load ingridient into recipe:", error);
      }
    }

    fetchRecipesByIngredient();
  }, [selectedIngredient]);
  
  return (
    <div className="recipe-page-container">
      <div className="recipe-content">
        <h1>{recipe.strMeal}</h1>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        <p><b>Country:</b> {recipe.strArea}</p>
        <p><b>Category:</b> {recipe.strCategory}</p>
        <p>{recipe.strInstructions}</p>

        <h3>Ingridients:</h3>
        <ul>
          {recipe.ingredients.map((ing, index) => (
            <li key={index}>
              <Link to={`?ingredient=${ing}`}>{ing}</Link>
            </li>
          ))}
        </ul>
      </div>

      <aside className="sidebar">
        {selectedIngredient && (
          <>
            <h3>Recipes with "{selectedIngredient}"</h3>
            <ul>
              {ingredientRecipes.length > 0 ? (
                ingredientRecipes.map((rec) => (
                  <li key={rec.idMeal}>
                    <img src={rec.strMealThumb} alt={rec.strMeal} width="50" />
                    <Link to={`/recipe/${rec.idMeal}`}>{rec.strMeal}</Link>
                  </li>
                ))
              ) : (
                <p>Recipes not found</p>
              )}
            </ul>
          </>
        )}

        <h3>Other recips in category "{recipe.strCategory}"</h3>
        <ul>
          {relatedRecipes.length > 0 ? (
            relatedRecipes.map((rec) => (
              <li key={rec.idMeal}>
                <img src={rec.strMealThumb} alt={rec.strMeal} width="50" />
                <Link to={`/recipe/${rec.idMeal}`}>{rec.strMeal}</Link>
              </li>
            ))
          ) : (
            <p>Recipes not found</p>
          )}
        </ul>
      </aside>
    </div>
  );
}
