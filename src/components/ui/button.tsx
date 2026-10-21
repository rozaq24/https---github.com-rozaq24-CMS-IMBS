type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" };

export function Button({ variant = "primary", className = "", ...rest }: Props) {
  const cls = variant === "primary" ? "btn-primary" : variant === "outline" ? "btn-outline" : "btn";
  return <button className={`${cls} ${className}`} {...rest} />;
}
