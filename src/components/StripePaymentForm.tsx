// src/components/StripePaymentForm.tsx
'use client'

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface StripePaymentFormProps {
  onSuccess: (paymentMethod: any) => void
  onError: (error: any) => void
  processing: boolean
  setProcessing: (processing: boolean) => void
  totalAmount: number | string
}

export function StripePaymentForm({ onSuccess, onError, processing, setProcessing, totalAmount }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!stripe || !elements) {
    return;
  }

  setProcessing(true);
  setError('');

  try {
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (stripeError) {
      throw stripeError;
    }

    if (onSuccess && paymentMethod) {
      await onSuccess(paymentMethod);
    }
  } catch (err: any) {
    setError(err.message || 'Noe gikk galt med betalingen');
    if (onError) {
      onError(err);
    }
  } finally {
    // Don't set processing to false here - let the parent component handle that
    // This is important to keep the loading state during the entire payment flow
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-md p-4">
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
            },
          }}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
<Button
  type="button"
  onClick={handleSubmit}
  disabled={processing}
  className={`w-full bg-[#8bc34a] hover:bg-[#7cb342] ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {processing ? 'Behandler betaling...' : `Betal ${totalAmount} kr`}
</Button>
    </form> 
  )
}