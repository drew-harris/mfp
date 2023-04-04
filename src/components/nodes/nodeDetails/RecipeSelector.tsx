import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Recipe } from "../../../types/MCNodes";

interface RecipeSelectorProps {
  recipes: Recipe[];
  selectedRecipe: Recipe;
  setSelectedRecipe: (recipe: Recipe) => void;
}
export const RecipeSelector = ({
  recipes,
  selectedRecipe,
  setSelectedRecipe,
}: RecipeSelectorProps) => {
  const currentRecipeIndex = recipes.indexOf(selectedRecipe) + 1;

  const selectNextRecipe = () => {
    const nextRecipeIndex = currentRecipeIndex % recipes.length;
    setSelectedRecipe(recipes[nextRecipeIndex]);
  };

  const selectPreviousRecipe = () => {
    const previousRecipeIndex =
      currentRecipeIndex === 1 ? recipes.length : currentRecipeIndex - 1;
    setSelectedRecipe(recipes[previousRecipeIndex - 1]);
  };

  return (
    <div className="mb-4 flex w-full items-center justify-around gap-3">
      <div onClick={selectPreviousRecipe} className="p-1">
        <FontAwesomeIcon icon={faCaretLeft} />
      </div>
      <div className="text-center">
        {currentRecipeIndex} / {recipes.length}
      </div>
      <div className="p-1" onClick={selectNextRecipe}>
        <FontAwesomeIcon icon={faCaretRight} />
      </div>
    </div>
  );
};
