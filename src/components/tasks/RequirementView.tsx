import { useFullItem } from "../../hooks/useFullItem";
import { ItemRequirement } from "../../types/tasks";
import { SpriteDisplay } from "../SpriteDisplay";


export function RequirementView({
    requirement, className,
}: {
    requirement: ItemRequirement;
    className?: string;
}) {
    const item = useFullItem(requirement.itemId);
    return (
        <div className={`flex ${className}`}>
            <div className="flex gap-4 items-center">
                <SpriteDisplay spriteIndex={item?.spriteIndex} />
                <div>x {requirement.perHour}</div>
            </div>
        </div>
    );
}

