"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { useToast } from '../ui/toast';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
}

// Initialize Stripe with your publishable key
const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(pubKey!);

interface PaymentData {
  method: 'card' | 'vipps';
  paymentMethodId?: string;
}

interface StripePaymentFormProps {
  onSubmit: (data: PaymentData) => void;
  onError?: (error: any) => void;
  isLoading?: boolean;
  totalAmount: number;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
  initialData?: Partial<PaymentData>;
  isLoading?: boolean;
  totalAmount: number;
}

const StripePaymentForm = ({
  onSubmit,
  onError,
  isLoading = false,
  totalAmount
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleChange = async (event: any) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };
  const total_amount = localStorage.getItem('totalAmount');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        const errorMessage = `Payment failed: ${stripeError.message}`;
        setError(errorMessage);
        onError?.(stripeError);
        return;
      }

      if (!paymentMethod) {
        const errorMessage = 'Failed to create payment method';
        setError(errorMessage);
        onError?.(new Error(errorMessage));
        return;
      }

      // Call the parent's onSubmit with the payment method ID
      onSubmit({
        method: 'card',
        paymentMethodId: paymentMethod.id
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          }
        }}
        onChange={(event) => handleChange(event)}
      />

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      <Button
        type="submit"
        className="w-full bg-[#8bc34a] hover:bg-[#7cb342] text-white"
        disabled={!stripe || disabled || processing || isLoading}
      >
        {processing || isLoading
          ? 'Processing...'
          : `Pay`}
      </Button>
    </form>
  );
};

export function PaymentForm({ onSubmit, initialData, isLoading, totalAmount }: PaymentFormProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [clientSecret, setClientSecret] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'vipps'>(initialData?.method || 'card');
  const [processing, setProcessing] = useState(false);
  const [orderNotes, setOrderNotes] = useState("")

  const router = useRouter()
  const { showToast, Toast: ToastComponent } = useToast();

  const [billingData, setBillingData] = useState({
    country: "Norge",
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: ""
  })

 const calculateSubtotal = useCallback(() => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    console.log('No cart items or invalid cart items:', cartItems);
    return 0;
  }
  
  const subtotal = cartItems.reduce((sum, item) => {
    const itemTotal = parseFloat(item.total) || 0;
    return sum + itemTotal;
  }, 0);
  
  console.log('Calculated subtotal:', subtotal, 'from items:', cartItems);
  return subtotal;
}, [cartItems]);

const calculateFreight = useCallback(() => {
  const freight = 210.0;
  console.log('Freight:', freight);
  return freight;
}, []);

const calculateTotal = useCallback(() => {
  const subtotal = calculateSubtotal();
  const freight = calculateFreight();
  const total = subtotal + freight;
  console.log('Total calculation - subtotal:', subtotal, 'freight:', freight, 'total:', total);
  return total;
}, [calculateSubtotal, calculateFreight]);

 useEffect(() => {
  setIsClient(true);
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log('Loaded cart items:', cart); // Debug log
    setCartItems(cart);
  } catch (error) {
    console.error('Error loading cart:', error);
    setCartItems([]);
  }
}, []);

  const handlePayment = useCallback(async (paymentMethodId?: string) => {
    try {
      // Remove the terms check from here

      setProcessing(true);
      // Store order data
      const orderData = {
        billingData,
        paymentType: 'card',
        orderNotes,
        items: cartItems,
        subtotal: calculateSubtotal(),
        freight: calculateFreight(),
        total: calculateTotal(),
        orderDate: new Date().toISOString(),
        orderNumber: `#${Math.floor(Math.random() * 10000)}`,
        paymentMethodId,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage
      localStorage.setItem("lastOrder", JSON.stringify(orderData));
      localStorage.removeItem("cart");

      // Show success message
      showToast("Betalingen var vellykket! Omdirigerer...", "success");

    } catch (error) {
      console.error('Error processing payment:', error);
      showToast('Det oppsto en feil under behandling av betalingen. Vennligst prøv igjen.', 'error');
      setProcessing(false);
    }
  }, [billingData, cartItems, orderNotes, router, showToast]);

  const handleStripePayment = useCallback(async (paymentMethod: any) => {
    try {
      setProcessing(true);

      // Get the last item's price and quantity
const cartJson = localStorage.getItem('cart');
const cart = cartJson ? JSON.parse(cartJson) : [];
const lastItem = cart.length > 0 ? cart[cart.length - 1] : null;
localStorage.setItem('product', JSON.stringify(lastItem));
const totalPrice = lastItem ? 
  (parseFloat(lastItem.price) || 0) * (parseInt(lastItem.quantity) || 1) : 
  0;
  localStorage.setItem('totalAmount', totalPrice);

console.log('Last item price calculation:', { 
  price: lastItem?.price, 
  quantity: lastItem?.quantity, 
  total: totalPrice 
});

      // Here you would typically send the payment method ID to your server
      // to complete the payment. For example:
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: totalPrice * 100, // amount in øre
          currency: 'nok',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Get the Stripe instance from the promise
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
        return_url: window.location.origin + '/order-confirmation',
      });

      if (error) {
        throw error;
      }

      // If we get here, payment was successful
      await handlePayment(paymentMethod.id);
    } catch (err) {
      console.error('Payment failed:', err);
      showToast('Betalingen mislyktes. Vennligst prøv igjen.', 'error');
      setProcessing(false);
    }
  }, [handlePayment, showToast]);

  useEffect(() => {
    // Only create PaymentIntent if card payment is selected
    if (selectedMethod === 'card') {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: "checkout-total", amount: totalAmount * 100 }]
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(error => {
          console.error("Error creating payment intent:", error);
        });
    } else {
      setClientSecret('');
    }
  }, [totalAmount, selectedMethod]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value: 'card' | 'vipps') => setSelectedMethod(value)}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 p-4 border rounded-md">
          <RadioGroupItem value="card" id="card" checked />
          <Label htmlFor="card" className="flex-1 cursor-pointer">
            <div className="flex justify-between items-center">
              <span>Credit/Debit Card</span>
              <div className="flex space-x-2">
                <span className="text-sm">Visa</span>
                <span className="text-sm">Mastercard</span>
              </div>
            </div>
          </Label>
        </div>
        <div className='border border-gray-200 p-4 rounded-md'>
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              totalAmount={calculateTotal()}
              onSubmit={(data) => {
                // Call the parent's onSubmit when the form is submitted
                onSubmit(data);
                // Also call handleStripePayment with the payment method ID
                if (data.paymentMethodId) {
                  handleStripePayment({ id: data.paymentMethodId });
                }
              }}
              isLoading={isLoading || processing}
              onError={(error: any) => {
                console.error('Payment error:', error);
                setProcessing(false);
              }}
            />
          </Elements>
        </div>
      </RadioGroup>
    </div>
  );
}