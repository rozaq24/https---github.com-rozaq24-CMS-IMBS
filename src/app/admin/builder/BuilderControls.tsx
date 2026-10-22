"use client";

import { HardwareButton, type HardwareButtonProps } from "@/components/echo/hardware-button";

type WithoutVariant<T> = T extends unknown ? Omit<T, "variant"> : never;
type BuilderFlatButtonProps = WithoutVariant<HardwareButtonProps> & { selected?: boolean };

export function BuilderFlatButton({ selected, fullWidth, ...props }: BuilderFlatButtonProps) {
  return (
    <div className={`builder-flat-button${fullWidth ? " is-full-width" : ""}${selected ? " is-selected" : ""}`}>
      <HardwareButton {...props} variant="ghost" fullWidth={fullWidth} />
    </div>
  );
}

export function BuilderFlatChoice({ options, value, onValueChange, ariaLabel }: { options: string[]; value: number; onValueChange: (index: number) => void; ariaLabel: string }) {
  return (
    <div className="builder-choice-group" role="group" aria-label={ariaLabel}>
      {options.map((option, index) => (
        <BuilderFlatButton key={option} size="sm" fullWidth selected={value === index} aria-pressed={value === index} onClick={() => onValueChange(index)}>{option}</BuilderFlatButton>
      ))}
    </div>
  );
}
