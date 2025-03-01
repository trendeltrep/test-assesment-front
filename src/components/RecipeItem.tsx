import { Link } from "react-router-dom";

export default function RecipeItem({ recipe }: { recipe: any }) {
  return (
    <div className="recipe-card">
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <h2>{recipe.strMeal}</h2>
      <Link to={`/recipe/${recipe.idMeal}`}>Details</Link>
    </div>
  );
}
