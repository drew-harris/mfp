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
        <div className="flex items-baseline gap-[2px]">
          <span>x {requirement.perHour}</span>
          <span className="text-xs text-black/40">/s</span>
        </div>
      </div>
    </div>
  );
}
