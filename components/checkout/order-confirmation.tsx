"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckoutStore, useCheckoutStore } from "@/lib/stores/checkoutStore";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function OrderConfirmation() {
  const router = useRouter();
  const shippingInfo = useCheckoutStore(
    (state: CheckoutStore) => state.shippingInfo,
  );
  const reset = useCheckoutStore((state: CheckoutStore) => state.reset);

  useEffect(() => {
    // Reset checkout after 10 seconds
    const timer = setTimeout(() => {
      reset();
      router.push("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [reset, router]);

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

      <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>

      <p className="text-muted-foreground mb-6">
        Thank you for your order. We&apos;ve sent a confirmation email to{" "}
        <strong>{shippingInfo?.email}</strong>
      </p>

      <div className="bg-card border rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-lg mb-2">What&apos;s Next?</h3>
        <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
          <li>✓ Order confirmation email sent</li>
          <li>✓ Processing your order</li>
          <li>✓ Estimated delivery: 3-5 business days</li>
          <li>✓ Tracking information will be sent once shipped</li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => {
            reset();
            router.push("/");
          }}
        >
          Continue Shopping
        </Button>
        <Button
          onClick={() => {
            reset();
            router.push("/orders");
          }}
        >
          View Orders
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        You will be redirected to the home page in 10 seconds...
      </p>
    </div>
  );
}
