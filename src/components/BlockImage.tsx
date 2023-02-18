export interface BlockImageProps {
  url: string;
  size?: number;
  className?: string;
}

export const BlockImage: React.FC<BlockImageProps> = ({
  url,
  size = 32,
  className,
}) => {
  return (
    <div
      style={{
        background: `url(/${url})`,
        width: size,
        height: size,
      }}
      className={className}
    ></div>
  );
};
