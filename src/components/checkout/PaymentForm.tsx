"use client";

import { useState, useEffect } from 'react';
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

// updations
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PaymentData {
  method: 'card' | 'vipps';
  paymentMethodId?: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
  initialData?: Partial<PaymentData>;
  isLoading?: boolean;
  totalAmount: number;
}

const StripePaymentForm = ({ 
  onSubmit, 
  isLoading, 
  totalAmount 
}: { 
  onSubmit: (data: PaymentData) => void, 
  isLoading?: boolean,
  totalAmount: number
}) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (error) {
      setError(`Payment failed: ${error.message}`);
      setProcessing(false);
      return;
    }

    // Call the parent's onSubmit with the payment method ID
    onSubmit({
      method: 'card',
      paymentMethodId: paymentMethod.id
    });
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
          : `Pay $${totalAmount.toFixed(2)}`}
      </Button>
    </form>
  );
};

export function PaymentForm({ onSubmit, initialData, isLoading, totalAmount }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'vipps'>(initialData?.method || 'card');

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
          <RadioGroupItem value="card" id="card" />
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

        <div className="flex items-center space-x-2 p-4 border rounded-md">
          <RadioGroupItem value="vipps" id="vipps" />
          <Label htmlFor="vipps" className="flex-1 cursor-pointer">
            <div className="flex justify-between items-center">
              <span>Vipps</span>
              <span className="text-sm text-gray-500">Fast and secure</span>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {selectedMethod === 'card' && clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm 
            onSubmit={onSubmit} 
            isLoading={isLoading} 
            totalAmount={totalAmount} 
          />
        </Elements>
      ) : selectedMethod === 'vipps' ? (
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-sm text-gray-600">You will be redirected to Vipps to complete your payment.</p>
        </div>
      ) : null}
    </div>
  );
}