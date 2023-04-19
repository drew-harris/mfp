import { cx } from "cva";

export interface ButtonProps extends React.ComponentPropsWithRef<"button"> {
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  const { className, ...rest } = props;

  const cn = cx("outset bg-mc-100 px-2", className);
  return <button className={cn} {...rest}></button>;
}
