export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  return <button className="outset bg-mc-100 px-2" {...props}></button>;
}
