import type { InputHTMLAttributes } from "react";

type AuthCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode;
};

export function AuthCheckbox({ label, id, ...props }: AuthCheckboxProps) {
  const checkboxId = id ?? "auth-checkbox";

  return (
    <label htmlFor={checkboxId} className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
      <input
        id={checkboxId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/8 accent-emerald-500"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
