import { faCaretLeft, faCaretRight, faCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Recipe } from "../../../types/MCNodes";
//import { SideHandle } from "./SideHandle";


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

  const hollowCircleStyle = {
    color: 'transparent',
    borderRadius: '50%',
    boxShadow: '0 0 0 0.2em #111 inset',
    marginLeft: '0.5px',
    marginRight: '0.5px',
  };

  const filledCircleStyle = {
    color: 'transparent',
    borderRadius: '50%',
    boxShadow: '0 0 0 1em #111 inset', // very hacky but it works
    marginLeft: '0.5px',
    marginRight: '0.5px',
  };

  return (
    recipes.length === 1 ? null : (
      <div className="mb-0 flex w-full items-center justify-around gap-3">
        <div onClick={selectPreviousRecipe} className="p-1">
          <FontAwesomeIcon icon={faCaretLeft} />
        </div>
        <div className="text-center">
          {recipes.map((_, index) => {
            return (
              index === currentRecipeIndex - 1 ?
                <FontAwesomeIcon icon={faCircle} size={'2xs'} style={filledCircleStyle}/> :
                <FontAwesomeIcon icon={faCircle} size={'2xs'} style={hollowCircleStyle}/>
            );
          })}
          {/*{currentRecipeIndex} / {recipes.length}*/}
        </div>
        <div className="p-1" onClick={selectNextRecipe}>
          <FontAwesomeIcon icon={faCaretRight} />
        </div>
      </div>
    )
  );
};
