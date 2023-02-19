export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  return (
    <button
      style={{ borderStyle: "inset" }}
      className="mc-background border-2 border-mc-700 px-2"
      {...props}
    ></button>
  );
}
