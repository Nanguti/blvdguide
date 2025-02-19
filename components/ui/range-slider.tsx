"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface RangeSliderProps
  extends Omit<
    SliderPrimitive.SliderProps,
    "value" | "onValueChange" | "onChange"
  > {
  formatLabel?: (value: number) => string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ className, formatLabel, value, onChange, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    value={value}
    onValueChange={(value) => onChange(value as [number, number])}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {value.map((val, i) => (
      <React.Fragment key={i}>
        <SliderPrimitive.Thumb
          className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:border-primary"
          aria-label={i === 0 ? "Minimum value" : "Maximum value"}
        >
          {formatLabel && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-primary px-2 py-1 text-xs text-white">
              {formatLabel(val)}
            </div>
          )}
        </SliderPrimitive.Thumb>
      </React.Fragment>
    ))}
  </SliderPrimitive.Root>
));
RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
