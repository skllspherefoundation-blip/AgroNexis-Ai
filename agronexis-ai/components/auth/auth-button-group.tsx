type AuthButtonGroupProps = {
  children: React.ReactNode;
};

export function AuthButtonGroup({ children }: AuthButtonGroupProps) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}
