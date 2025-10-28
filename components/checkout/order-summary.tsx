"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartStore, useCartStore } from "@/lib/stores/cartStores";
import { CheckoutStore, useCheckoutStore } from "@/lib/stores/checkoutStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";

export function OrderSummary() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const items = useCartStore((state: CartStore) => state.items);
  const totalPrice = useCartStore((state: CartStore) => state.getTotalItems);
  const clearCart = useCartStore((state: CartStore) => state.clearCart);

  const shippingInfo = useCheckoutStore(
    (state: CheckoutStore) => state.shippingInfo,
  );
  const paymentInfo = useCheckoutStore(
    (state: CheckoutStore) => state.paymentInfo,
  );
  const setStep = useCheckoutStore((state: CheckoutStore) => state.setStep);
  // const reset = useCheckoutStore((state: CheckoutStore) => state.reset);

  const shipping = 10;
  const tax = totalPrice() * 0.1;
  const total = totalPrice() + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In real app, send order to backend here
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   body: JSON.stringify({ items, shippingInfo, paymentInfo, total })
    // })

    clearCart();
    setStep(4);
    setIsProcessing(false);
  };

  const handleBack = () => {
    setStep(2);
  };

  if (!shippingInfo || !paymentInfo) {
    router.push("/checkout");
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-medium">
              {shippingInfo.firstName} {shippingInfo.lastName}
            </p>
            <p>{shippingInfo.email}</p>
            <p>{shippingInfo.phone}</p>
            <p>{shippingInfo.address}</p>
            <p>
              {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
            </p>
            <p>{shippingInfo.country}</p>
          </div>
          <Button
            variant="link"
            className="px-0 mt-2"
            onClick={() => setStep(1)}
          >
            Edit
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
            <p>Name: {paymentInfo.cardName}</p>
            <p>Expires: {paymentInfo.expiryDate}</p>
          </div>
          <Button
            variant="link"
            className="px-0 mt-2"
            onClick={() => setStep(2)}
          >
            Edit
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Order Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Order Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isProcessing}
          className="flex-1"
          size="lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="flex-1"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </div>
  );
}
