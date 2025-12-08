"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { ShippingForm, ShippingData } from '@/components/checkout/ShippingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import OrderConfirmationPage from '../order-confirmation/page';

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showToast, Toast } = useToast();
  
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
      router.push('/products/1');
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
    if (!agreeToTerms) {
      showToast('Please accept the terms of sale to continue', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random order ID
      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(newOrderId);
      
      // Calculate order totals
      const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
      const shipping = subtotal > 0 ? 0 : 0; // Free shipping for now
      const total = subtotal + shipping;
      
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
      
      // Show success toast
      showToast('Your order has been placed successfully!', 'success');
      
      // Show confirmation step after toast
      setTimeout(() => {
        setCurrentStep('confirmation');
      }, 2000);
      
    } catch (error) {
      console.error('Error processing order:', error);
      showToast('There was an error processing your order. Please try again.', 'error');
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      <Toast />
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

        <div>
          <div className={`mx-auto ${currentStep === 'confirmation' ? 'max-w-4xl' : 'max-w-3xl'}`}>
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
                  totalAmount={total}
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
              <OrderConfirmationPage />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}