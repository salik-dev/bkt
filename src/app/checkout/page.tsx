"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { ShippingForm, ShippingData } from '@/components/checkout/ShippingForm';
import { PaymentForm, PaymentData } from '@/components/checkout/PaymentForm';

type Step = 'shipping' | 'payment' | 'confirmation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface BillingData {
  firstName: string;
  lastName: string;
  streetAddress: string;
  postalCode: string;
  postalAddress: string;
  email: string;
  phone: string;
  companyName?: string;
  organizationNumber?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [shippingToDifferentAddress, setShippingToDifferentAddress] = useState(false);
  
  // Form data states
  const [billingData, setBillingData] = useState<BillingData>({
    firstName: '',
    lastName: '',
    streetAddress: '',
    postalCode: '',
    postalAddress: '',
    email: '',
    phone: '',
    companyName: '',
    organizationNumber: ''
  });

  const [shippingData, setShippingData] = useState<BillingData>({
    firstName: '',
    lastName: '',
    streetAddress: '',
    postalCode: '',
    postalAddress: '',
    email: '',
    phone: ''
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load cart items on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else if (currentStep !== 'confirmation') {
      router.push('/cart');
    }
  }, [router, currentStep]);

  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = 0; // Free shipping for now
  const total = subtotal + shipping;

  const calculateFreight = () => {
    return 210.0;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!billingData.firstName) newErrors['billing-firstName'] = 'First name is required';
    if (!billingData.lastName) newErrors['billing-lastName'] = 'Last name is required';
    if (!billingData.streetAddress) newErrors['billing-address'] = 'Street address is required';
    if (!billingData.postalCode) newErrors['billing-postcode'] = 'Postcode is required';
    if (!billingData.postalAddress) newErrors['billing-city'] = 'City is required';
    if (!billingData.email) newErrors['billing-email'] = 'Email is required';
    if (!billingData.phone) newErrors['billing-phone'] = 'Phone is required';
    
    if (shippingToDifferentAddress) {
      if (!shippingData.firstName) newErrors['shipping-firstName'] = 'First name is required';
      if (!shippingData.lastName) newErrors['shipping-lastName'] = 'Last name is required';
      if (!shippingData.streetAddress) newErrors['shipping-address'] = 'Street address is required';
      if (!shippingData.postalCode) newErrors['shipping-postcode'] = 'Postcode is required';
      if (!shippingData.postalAddress) newErrors['shipping-city'] = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (data: BillingData) => {
    setBillingData(data);
    if (shippingToDifferentAddress) {
      setShippingData(data);
    }
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (data: PaymentData) => {
    setIsLoading(true);
    
    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate order ID
      const newOrderId = `ORD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      setOrderId(newOrderId);
      
      // Save order to localStorage
      const order = {
        id: newOrderId,
        date: new Date().toISOString(),
        items: cartItems,
        billing: billingData,
        shipping: shippingToDifferentAddress ? shippingData : billingData,
        payment: data,
        status: 'processing',
        subtotal,
        shipping,
        total
      };
      
      localStorage.setItem('currentOrder', JSON.stringify(order));
      localStorage.removeItem('cart');
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      alert("Please accept the terms of sale to continue");
      return;
    }
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // This will be handled by the payment form submission
    handlePaymentSubmit(paymentData);
  };

  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button 
            onClick={() => router.push('/')}
            className="bg-[#8bc34a] hover:bg-[#7cb342] text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {currentStep !== 'shipping' && (
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep('shipping')}
            className="mb-6 bg-[#8bc34a] hover:bg-[#7cb342] text-white hover:text-white"
          >
            ← Back to Shipping
          </Button>
        )}

        <CheckoutProgress currentStep={currentStep} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 'shipping' && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">SHIPPING INFORMATION</h2>
                <ShippingForm 
                  onSubmit={handleShippingSubmit} 
                  initialData={billingData}
                  setShippingToDifferentAddress={setShippingToDifferentAddress}
                  shippingToDifferentAddress={shippingToDifferentAddress}
                  shippingData={shippingData}
                  setShippingData={setShippingData}
                  errors={errors}
                />
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">PAYMENT METHOD</h2>
                <PaymentForm 
                  onSubmit={handlePaymentSubmit} 
                  initialData={paymentData}
                  isLoading={isLoading}
                />
                <div className="mt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      I have read and accept the{" "}
                      <a href="/terms" className="text-[#8bc34a] underline">
                        terms of sale
                      </a>
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'confirmation' && orderId && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg 
                      className="w-8 h-8 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order number is: 
                    <span className="font-semibold"> {orderId}</span>
                  </p>
                  <p className="text-gray-600 mb-8">
                    A confirmation email has been sent to {billingData.email}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => router.push('/')}
                      className="bg-[#8bc34a] hover:bg-[#7cb342] text-white"
                    >
                      Continue Shopping
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // In a real app, this would navigate to order details
                        alert('Order details would be shown here');
                      }}
                    >
                      View Order Details
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-4">
              <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">NOK {item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>NOK {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `NOK ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>NOK {total.toFixed(2)}</span>
                </div>
              </div>

              {currentStep === 'shipping' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600">
                    Contact our customer support for any questions about your order.
                  </p>
                </div>
              )}

              {currentStep === 'payment' && (
                <div className="mt-6 text-sm text-gray-600">
                  <p className="mb-2">We accept:</p>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-gray-100 rounded">Visa</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Mastercard</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Vipps</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}