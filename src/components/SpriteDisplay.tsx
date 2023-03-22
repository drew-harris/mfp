export interface SpriteDisplayProps
  extends React.ComponentPropsWithoutRef<"img"> {
  url: string;
  size?: number;
  className?: string;
}

export const SpriteDisplay: React.FC<SpriteDisplayProps> = ({
  url,
  size = 42,
  className,
  ...props
}: SpriteDisplayProps) => {
  return (
    <img
      {...props}
      src={`https://storage.googleapis.com/mfp-item-images/${url}`}
      style={{
        width: size,
        height: size,
      }}
      className={className}
    ></img>
  );
};
