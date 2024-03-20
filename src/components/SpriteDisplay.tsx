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
  let flex = "col";
  if (Array.isArray(url)) {
    urls = url;
    flex = "row";
    if (urls.length > 4) {
      urls.length = 4;
    }
  } else {
    urls = [url];
  }
  return (
    <div className={`flex flex-${flex} items-center gap-x-3`}>
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
