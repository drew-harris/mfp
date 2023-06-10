import { Recipe } from "../types/MCNodes";

import recipes from "./recipes.json";

const recipies = recipes as Recipe[];

export const allRecipes = recipies.filter((r) => r.inputs.length > 0);
