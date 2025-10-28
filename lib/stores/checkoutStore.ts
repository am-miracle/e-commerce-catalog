import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface CheckoutStore {
  currentStep: number;
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;
  setStep: (step: number) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      shippingInfo: null,
      paymentInfo: null,
      setStep: (step) => {
        set({ currentStep: step });
      },
      setShippingInfo: (info) => {
        set({ shippingInfo: info });
      },
      setPaymentInfo: (info) => {
        set({ paymentInfo: info });
      },
      reset: () => {
        set({
          currentStep: 1,
          shippingInfo: null,
          paymentInfo: null,
        });
      },
    }),
    { name: "checkout-storage" },
  ),
);
