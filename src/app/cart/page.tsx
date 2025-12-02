"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ShippingDisclaimerDialog } from "@/components/ShippingDisclaimerDialog"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  options?: {
    magnetlist?: boolean
    beskyttelsesfolie?: boolean
    lampType?: 'complete' | 'topOnly'
  }
  total: number
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)
  const [showShippingDisclaimer, setShowShippingDisclaimer] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
  }, [])

  const handleKortEllerVipps = () => {
    const hideDisclaimer = localStorage.getItem("hideShippingDisclaimer")
    if (hideDisclaimer === "true") {
      router.push("/payment")
    } else {
      setShowShippingDisclaimer(true)
    }
  }

  const handleDisclaimerConfirm = () => {
    setShowShippingDisclaimer(false)
    router.push("/payment")
  }

  const updateQuantity = (index: number, delta: number) => {
    const updatedCart = [...cartItems]
    updatedCart[index].quantity = Math.max(1, updatedCart[index].quantity + delta)
    updatedCart[index].total = updatedCart[index].price * updatedCart[index].quantity
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0)
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-[#4A5D7E] hover:underline">← Back to Products</Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Your Order</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center shadow-sm">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Button 
              onClick={() => router.push("/products/1")}
              className="bg-[#4A5D7E] hover:bg-[#3d4d68] text-white px-8 py-6 text-lg"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <Button variant="outline" className="text-gray-700">
                  Fortsett å handle
                </Button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center py-4 border-b">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-4 shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&h=200&fit=crop"
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {item.options?.lampType === 'complete' 
                              ? 'Complete Taxi Lamp' 
                              : 'Top Part Only'}
                          </p>
                        </div>
                        <p className="font-medium">
                          kr {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={() => updateQuantity(index, -1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-10 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(index, 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(index)}
                          className="ml-4 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span>kr {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-3">
                    <span>Total</span>
                    <span>kr {calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6 bg-[#4A5D7E] hover:bg-[#3d4d68] text-white py-6 text-lg"
                  onClick={handleKortEllerVipps}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-center">
                  <Link 
                    href="/products/1" 
                    className="text-[#4A5D7E] hover:underline text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ShippingDisclaimerDialog
        open={showShippingDisclaimer}
        onOpenChange={setShowShippingDisclaimer}
        onConfirm={handleDisclaimerConfirm}
      />

      <Footer />
    </div>
  )
}