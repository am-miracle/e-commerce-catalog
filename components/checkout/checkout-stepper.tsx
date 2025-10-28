"use client";

import { CheckoutStore, useCheckoutStore } from "@/lib/stores/checkoutStore";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Shipping", description: "Delivery information" },
  { id: 2, name: "Payment", description: "Payment details" },
  { id: 3, name: "Review", description: "Review your order" },
];

export function CheckoutStepper() {
  const currentStep = useCheckoutStore(
    (state: CheckoutStore) => state.currentStep,
  );

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              "relative",
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20 flex-1" : "",
            )}
          >
            {stepIdx !== steps.length - 1 && (
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div
                  className={cn(
                    "h-0.5 w-full",
                    step.id < currentStep ? "bg-primary" : "bg-gray-200",
                  )}
                />
              </div>
            )}

            <div className="relative flex items-center justify-center">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  step.id < currentStep
                    ? "border-primary bg-primary text-white"
                    : step.id === currentStep
                      ? "border-primary bg-white text-primary"
                      : "border-gray-300 bg-white text-gray-500",
                )}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </span>

              <span className="absolute -bottom-10 w-max text-center">
                <span
                  className={cn(
                    "block text-sm font-medium",
                    step.id <= currentStep ? "text-primary" : "text-gray-500",
                  )}
                >
                  {step.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {step.description}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
