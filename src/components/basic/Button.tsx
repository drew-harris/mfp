export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  return <button className="mc-background outset  px-2" {...props}></button>;
}
