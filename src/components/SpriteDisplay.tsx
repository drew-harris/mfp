export interface SpriteDisplayProps {
  spriteIndex: number;
}
export const SpriteDisplay: React.FC<SpriteDisplayProps> = ({
  spriteIndex,
}) => {
  return (
    <div
      style={{
        background: "url(/inventory_sprites.png)",
        backgroundPositionX: -32 * (spriteIndex % 16),
        backgroundPositionY: -32 * Math.round(spriteIndex / 16),
        width: 32,
        height: 32,
      }}
    ></div>
  );
};
