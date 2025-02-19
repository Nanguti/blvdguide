"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  value?: string[];
  onChange: (value: string[]) => void;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  label,
  value = [],
  onChange,
  options = [],
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <div className="flex flex-wrap gap-2 min-h-[2.25rem] p-1 rounded-md border border-input bg-transparent">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-1 bg-primary/10 text-primary rounded-md px-2 py-1 text-sm"
            >
              {option.label}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => handleRemove(option.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <SelectPrimitive.Root>
          <SelectPrimitive.Trigger className="absolute inset-0 opacity-0">
            <SelectPrimitive.Value />
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value.includes(option.value) && "bg-accent/50"
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {value.includes(option.value) && (
                        <Check className="h-4 w-4" />
                      )}
                    </span>
                    {option.label}
                  </div>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>
    </div>
  );
}
