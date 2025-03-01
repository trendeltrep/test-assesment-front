import axios from "axios";

const API_URL = "http://localhost:5000";

export async function getRecipes() {
  const res = await axios.get(`${API_URL}/recipes`);
  return res.data;
}

export async function getRecipe(id: string) {
  const res = await axios.get(`${API_URL}/recipes/${id}`);
  return res.data;
}

export async function getRecipesByCategory(category: string) {
  const res = await axios.get(`${API_URL}/recipes/filter?type=category&value=${category}`);
  return res.data

}

export async function getRecipesByIngredient(ingredient: string) {
  const res = await axios.get(`${API_URL}/recipes/filter?type=ingredient&value=${ingredient}`);
  return res.data
}

