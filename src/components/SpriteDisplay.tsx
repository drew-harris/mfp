export interface SpriteDisplayProps
  extends React.ComponentPropsWithoutRef<"img"> {
  url: string;
  size?: number;
  className?: string;
  label?: string;
}

export const SpriteDisplay: React.FC<SpriteDisplayProps> = ({
  url,
  size = 42,
  className,
  label,
  ...props
}: SpriteDisplayProps) => {
  return (
    <div className="flex flex-col items-center">
      <img
        {...props}
        src={`https://humin-mc-mfp-images.s3.amazonaws.com/${url}`}
        style={{
          width: size,
          height: size,
        }}
        className={className}
      ></img>
      {label && <div className="mb-2 text-xs">{label}</div>}
    </div>
  );
};
