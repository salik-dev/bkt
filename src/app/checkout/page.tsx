"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("invoice")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [shippingToDifferentAddress, setShippingToDifferentAddress] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    organizationNumber: "",
    streetAddress: "",
    postalCode: "",
    postalAddress: "",
    phone: "",
    email: ""
  })

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    organizationNumber: "",
    streetAddress: "",
    postalCode: "",
    postalAddress: ""
  })

  const [orderNotes, setOrderNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
  }, [])

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateFreight = () => {
    return 210.0
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateFreight()
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!billingData.firstName) newErrors['billing-firstName'] = 'First name is required'
    if (!billingData.lastName) newErrors['billing-lastName'] = 'Last name is required'
    if (!billingData.streetAddress) newErrors['billing-address'] = 'Street address is required'
    if (!billingData.postalCode) newErrors['billing-postcode'] = 'Postcode is required'
    if (!billingData.postalAddress) newErrors['billing-city'] = 'City is required'
    if (!billingData.email) newErrors['billing-email'] = 'Email is required'
    if (!billingData.phone) newErrors['billing-phone'] = 'Phone is required'
    
    if (shippingToDifferentAddress) {
      if (!shippingData.firstName) newErrors['shipping-firstName'] = 'First name is required'
      if (!shippingData.lastName) newErrors['shipping-lastName'] = 'Last name is required'
      if (!shippingData.streetAddress) newErrors['shipping-address'] = 'Street address is required'
      if (!shippingData.postalCode) newErrors['shipping-postcode'] = 'Postcode is required'
      if (!shippingData.postalAddress) newErrors['shipping-city'] = 'City is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    
    if (!agreeToTerms) {
      alert("Please accept the terms of sale to continue")
      return
    }
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0]
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Store order data
    const orderData = {
      billingData,
      shippingData: shippingToDifferentAddress ? shippingData : billingData,
      paymentMethod,
      orderNotes,
      items: cartItems,
      subtotal: calculateSubtotal(),
      freight: calculateFreight(),
      total: calculateTotal(),
      orderDate: new Date().toISOString()
    }

    localStorage.setItem("lastOrder", JSON.stringify(orderData))
    
    if (paymentMethod === "invoice") {
      router.push("/order-confirmation")
    } else {
      router.push("/payment")
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <form onSubmit={handleConfirmOrder} className="container max-w-280 mx-auto px-4 py-8">
        <Button
          type="button"
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6 bg-[#8bc34a] hover:bg-[#7cb342] text-white hover:text-white"
        >
          ← Back
        </Button>

        {/* Error Messages */}
        {isSubmitted && Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            {Object.keys(errors).map((error, index) => (
              <p key={index} className="text-red-700 text-sm mb-2">
                <strong>{error.replace(/-/g, ' ').toUpperCase()}</strong> {errors[error]}
              </p>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">PAYMENT</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded mb-2">
                  <RadioGroupItem value="invoice" id="invoice" />
                  <Label htmlFor="invoice" className="font-semibold cursor-pointer">INVOICE</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Billing Details */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">BILLING DETAILS</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="billing-firstName" className="text-sm font-semibold">
                    First name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="billing-firstName"
                    value={billingData.firstName}
                    onChange={(e) => {
                      setBillingData({...billingData, firstName: e.target.value})
                      if (isSubmitted) validateForm()
                    }}
                    className={`mt-1 ${errors['billing-firstName'] ? 'border-red-500' : ''}`}
                  />
                  {errors['billing-firstName'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['billing-firstName']}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billing-lastName" className="text-sm font-semibold">
                    Last name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="billing-lastName"
                    value={billingData.lastName}
                    onChange={(e) => {
                      setBillingData({...billingData, lastName: e.target.value})
                      if (isSubmitted) validateForm()
                    }}
                    className={`mt-1 ${errors['billing-lastName'] ? 'border-red-500' : ''}`}
                  />
                  {errors['billing-lastName'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['billing-lastName']}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="billing-orgNumber" className="text-sm font-semibold">
                  Organization number
                </Label>
                <Input 
                  id="billing-orgNumber"
                  value={billingData.organizationNumber}
                  onChange={(e) => setBillingData({...billingData, organizationNumber: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div className="mb-4">
                <Label className="text-sm font-semibold">Country/Region</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded border">NORWAY</div>
              </div>

              <div className="mb-4">
                <Label htmlFor="billing-street" className="text-sm font-semibold">
                  Street address (optional)
                </Label>
                <Input 
                  id="billing-street"
                  placeholder="Address"
                  value={billingData.streetAddress}
                  onChange={(e) => setBillingData({...billingData, streetAddress: e.target.value})}
                  className="mt-1"
                />
                {errors['billing-address'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['billing-address']}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="billing-postalCode" className="text-sm font-semibold">
                    Postal code (optional)
                  </Label>
                  <Input 
                    id="billing-postalCode"
                    placeholder="Postal code"
                    value={billingData.postalCode}
                    onChange={(e) => setBillingData({...billingData, postalCode: e.target.value})}
                    className="mt-1"
                  />
                  {errors['billing-postcode'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['billing-postcode']}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billing-postalAddress" className="text-sm font-semibold">
                    Postal address (optional)
                  </Label>
                  <Input 
                    id="billing-postalAddress"
                    placeholder="Postal address"
                    value={billingData.postalAddress}
                    onChange={(e) => setBillingData({...billingData, postalAddress: e.target.value})}
                    className="mt-1"
                  />
                  {errors['billing-city'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['billing-city']}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="billing-phone" className="text-sm font-semibold">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="billing-phone"
                  value={billingData.phone}
                  onChange={(e) => setBillingData({...billingData, phone: e.target.value})}
                  className="mt-1"
                />
                {errors['billing-phone'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['billing-phone']}</p>
                )}
              </div>

              <div className="mb-4">
                <Label htmlFor="billing-email" className="text-sm font-semibold">
                  Email address <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="billing-email"
                  type="email"
                  value={billingData.email}
                  onChange={(e) => setBillingData({...billingData, email: e.target.value})}
                  className="mt-1"
                />
                {errors['billing-email'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['billing-email']}</p>
                )}
              </div>

              <div className="mt-4">
                <Label htmlFor="order-notes" className="text-sm font-semibold">Order notes</Label>
                <Textarea
                  id="order-notes"
                  placeholder="Notes for your order, such as special delivery requests."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox 
                  id="different-address"
                  checked={shippingToDifferentAddress}
                  onCheckedChange={(checked) => setShippingToDifferentAddress(checked as boolean)}
                />
                <Label htmlFor="different-address" className="text-lg font-bold cursor-pointer">
                  SEND TO ANOTHER ADDRESS?
                </Label>
              </div>

              {shippingToDifferentAddress && (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="shipping-firstName" className="text-sm font-semibold">
                        First name <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="shipping-firstName"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                        className="mt-1"
                      />
                      {errors['shipping-firstName'] && (
                        <p className="text-red-500 text-xs mt-1">{errors['shipping-firstName']}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shipping-lastName" className="text-sm font-semibold">
                        Last name <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="shipping-lastName"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        className="mt-1"
                      />
                      {errors['shipping-lastName'] && (
                        <p className="text-red-500 text-xs mt-1">{errors['shipping-lastName']}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="shipping-orgNumber" className="text-sm font-semibold">
                      Organization number
                    </Label>
                    <Input 
                      id="shipping-orgNumber"
                      value={shippingData.organizationNumber}
                      onChange={(e) => setShippingData({...shippingData, organizationNumber: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <Label className="text-sm font-semibold">Country/Region</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border">NORWAY</div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="shipping-street" className="text-sm font-semibold">
                      Street address (optional)
                    </Label>
                    <Input 
                      id="shipping-street"
                      placeholder="Address"
                      value={shippingData.streetAddress}
                      onChange={(e) => setShippingData({...shippingData, streetAddress: e.target.value})}
                      className="mt-1"
                    />
                    {errors['shipping-address'] && (
                      <p className="text-red-500 text-xs mt-1">{errors['shipping-address']}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shipping-postalCode" className="text-sm font-semibold">
                        Postal code <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="shipping-postalCode"
                        placeholder="Postal code"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                        className="mt-1"
                      />
                      {errors['shipping-postcode'] && (
                        <p className="text-red-500 text-xs mt-1">{errors['shipping-postcode']}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shipping-postalAddress" className="text-sm font-semibold">
                        Postal address (optional)
                      </Label>
                      <Input 
                        id="shipping-postalAddress"
                        placeholder="Postal address"
                        value={shippingData.postalAddress}
                        onChange={(e) => setShippingData({...shippingData, postalAddress: e.target.value})}
                        className="mt-1"
                      />
                      {errors['shipping-city'] && (
                        <p className="text-red-500 text-xs mt-1">{errors['shipping-city']}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 rounded-lg shadow-lg">
            <div className="bg-white p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold mb-6">YOUR ORDER</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">NOK {item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-semibold">kr {calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="font-bold mb-3">FREIGHT</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Fill in your address to view shipping options.
                </p>
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    KR {calculateTotal().toFixed(2)} 
                    <span className="text-xs text-gray-500 ml-1">(incl. NOK. {(calculateFreight() * 0.2).toFixed(2)} VAT)</span>
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I have read and accept the{" "}
                    <Link href="/terms" className="text-[#8bc34a] underline">
                      terms of sale
                    </Link>{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                </div>
                {!agreeToTerms && (
                  <p className="text-red-500 text-xs mt-2">
                    Read and accept the terms of sale to continue with your order.
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#8bc34a] hover:bg-[#7cb342] text-white py-6 text-lg"
              >
                Confirm order
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
