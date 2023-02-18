export interface SpriteDisplayProps {
  url: string;
  size?: number;
  className?: string;
}

export const SpriteDisplay: React.FC<SpriteDisplayProps> = ({
  url,
  size = 42,
  className,
}) => {
  return (
    <img
      src={`/item_images/${url}`}
      style={{
        width: size,
        height: size,
      }}
      className={className}
    ></img>
  );
};
