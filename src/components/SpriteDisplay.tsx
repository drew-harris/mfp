export interface SpriteDisplayProps
  extends React.ComponentPropsWithoutRef<"img"> {
  url: string | string[];
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
  let urls;
  if (Array.isArray(url)) {
    urls = url;
    if (urls.length > 4)
      urls.length = 4;
  } else {
    urls = [url];
  }
  return (
    <div className="flex flex-row items-center gap-x-3">
      {
        urls.map((u) => {
          return ( 
            <img
              {...props}
              key={`${u}-image`}
              src={`https://humin-mc-mfp-images.s3.amazonaws.com/${u}`}
              style={{
                width: size,
                height: size,
              }}
              className={className}
              alt={`${u}-block-image`}
            ></img>
          )
        })
      }
      {label && <div className="mb-2 text-xs">{label}</div>}
    </div>
  );
};
