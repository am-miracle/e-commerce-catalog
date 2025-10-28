"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckoutStore, useCheckoutStore } from "@/lib/stores/checkoutStore";
import { CartStore, useCartStore } from "@/lib/stores/cartStores";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { ShippingForm } from "@/components/checkout/shipping-form";
import { PaymentForm } from "@/components/checkout/payment-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state: CartStore) => state.items);
  const totalPrice = useCartStore((state: CartStore) => state.getTotalPrice);
  const currentStep = useCheckoutStore(
    (state: CheckoutStore) => state.currentStep,
  );

  useEffect(() => {
    if (items.length === 0 && currentStep !== 4) {
      router.push("/");
    }
  }, [items.length, currentStep, router]);

  if (items.length === 0 && currentStep !== 4) {
    return null;
  }

  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <CheckoutStepper />

          <div className="mt-20!">
            {currentStep === 1 && <ShippingForm />}
            {currentStep === 2 && <PaymentForm />}
            {currentStep === 3 && <OrderSummary />}
            {currentStep === 4 && <OrderConfirmation />}
          </div>
        </div>

        {currentStep !== 4 && (
          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-auto">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(totalPrice() * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>
                      ${(totalPrice() + 10 + totalPrice() * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
