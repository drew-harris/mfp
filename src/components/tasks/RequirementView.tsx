import { useFullItem } from "../../hooks/useFullItem";
import { ItemRequirement } from "../../types/tasks";
import { SpriteDisplay } from "../SpriteDisplay";

export function RequirementView({
  requirement,
  className,
}: {
  requirement: ItemRequirement;
  className?: string;
}) {
  const item = useFullItem(requirement.itemId);
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-4">
        <SpriteDisplay url={item.imageUrl} />
        <div>x {requirement.perHour}</div>
      </div>
    </div>
  );
}
