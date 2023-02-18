export interface SpriteDisplayProps {
  spriteIndex?: number;
  size?: number;
  className?: string;
}

export const SpriteDisplay: React.FC<SpriteDisplayProps> = ({
  spriteIndex,
  size = 32,
  className,
}) => {
  return (
    <div
      style={{
        background: "url(/inventory_sprites.png)",
        backgroundSize: "1600%", // No clue how that works for any size
        backgroundPositionX: -size * (spriteIndex || 0),
        backgroundPositionY: -size * Math.floor((spriteIndex || 0) / 16),
        width: size,
        height: size,
      }}
      className={className}
    ></div>
  );
};
