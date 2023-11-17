import { cx } from "cva";

export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  const { className, ...rest } = props;

  const cn = cx(
    "outset bg-mc-100 px-2",
    className,
    props.disabled && "bg-mc-200 text-mc-600"
  );
  return <button className={cn} {...rest}></button>;
}
