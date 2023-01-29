import { Recipe } from "../types/MCNodes";

export function getFirstRecipe(itemId: number): Recipe {
  return {
    inputs: [
      {
        itemId: 3,
        amount: 3,
      },
    ],
    outputAmount: 5,
  };
}
