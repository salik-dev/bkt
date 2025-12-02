'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
}

export default function PaymentClient() {
  
    const router = useRouter()
    const searchParams = useSearchParams()

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [paymentType, setPaymentType] = useState<"card" | "vipps">("card")
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [isClient, setIsClient] = useState(false)
  
    const [cardData, setCardData] = useState({
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      saveCard: false
    })
  
    const [vippsData, setVippsData] = useState({
      landkode: "+47",
      mobilnummer: ""
    })
  
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
  
    const [customerType, setCustomerType] = useState<"privat" | "bedrift">("privat")
    const [orderNotes, setOrderNotes] = useState("")
  
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
  
    const handlePayment = () => {
      if (!agreeToTerms) {
        alert("Vennligst aksepter vilkårene for å fortsette")
        return
      }
  
      // Store order data
      const orderData = {
        billingData,
        paymentType,
        orderNotes,
        items: cartItems,
        subtotal: calculateSubtotal(),
        freight: calculateFreight(),
        total: calculateTotal(),
        orderDate: new Date().toISOString(),
        orderNumber: `#${Math.floor(Math.random() * 10000)}`
      }
  
      localStorage.setItem("lastOrder", JSON.stringify(orderData))
      localStorage.removeItem("cart")
      
      router.push("/order-confirmation")
    }
  
    if (!isClient) {
      return null
    }

    
    return (
       <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto max-w-[70rem] px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          ← Tilbake
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">BETALING</h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <div className="border rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-base">
                      ⚪ KORT ELLER VIPPS
                    </Label>
                  </div>
                </div>
              </div>

              {/* Customer Type Selection */}
              <div className="flex gap-4 mb-6">
                <Button 
                  variant={customerType === "privat" ? "default" : "outline"}
                  onClick={() => setCustomerType("privat")}
                  className={customerType === "privat" ? "flex-1 bg-[#4A5D7E] hover:bg-[#3d4d68]" : "flex-1"}
                >
                  Privat
                </Button>
                <Button 
                  variant={customerType === "bedrift" ? "default" : "outline"}
                  onClick={() => setCustomerType("bedrift")}
                  className={customerType === "bedrift" ? "flex-1 bg-[#4A5D7E] hover:bg-[#3d4d68]" : "flex-1"}
                >
                  Bedrift
                </Button>
              </div>

              {/* Google Pay Button */}
              <Button className="w-full bg-black hover:bg-gray-800 text-white py-6 mb-4 rounded-lg flex items-center justify-center gap-2">
                <svg className="h-6 w-auto" viewBox="0 0 41 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.526 8.568c0 2.456 1.888 4.208 4.288 4.208 1.552 0 2.8-.672 3.456-1.632v1.344h1.632V5.256h-1.632v1.344c-.656-.96-1.904-1.632-3.456-1.632-2.4 0-4.288 1.76-4.288 4.208v.392zm1.68 0c0-1.536 1.12-2.656 2.608-2.656s2.608 1.12 2.608 2.656-.112 2.656-2.608 2.656-2.608-1.12-2.608-2.656zm-6.72-3.36c-1.168 0-2.144.496-2.688 1.264l1.44.96c.32-.544.88-.88 1.536-.88.88 0 1.776.528 1.776 1.472v.112c-.304-.176-.96-.432-1.776-.432-1.632 0-3.296.896-3.296 2.576 0 1.536 1.344 2.528 2.848 2.528 1.152 0 1.792-.528 2.192-1.136v.896h1.568V7.416c0-1.936-1.456-3.216-3.6-3.216v.008zm-.32 7.392c-.56 0-1.344-.272-1.344-1.008 0-.912 1.008-1.264 1.872-1.264.784 0 1.152.176 1.632.4-.144 1.04-1.088 1.888-2.16 1.888v-.016zM8.558 5.4l-2.336 5.952L3.838 5.4H2.062l3.424 7.792-.432 1.184c-.272.736-.544.992-1.008.992-.304 0-.592-.08-.832-.192l-.352 1.632c.304.144.768.24 1.264.24 1.008 0 1.776-.384 2.432-1.92L10.35 5.4H8.558v.008z" fill="white"/>
                </svg>
                Pay
              </Button>

              <div className="text-center text-sm text-gray-500 my-4">Eller fortsett under</div>

              {/* Billing Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="country" className="text-sm">Land</Label>
                  <Input 
                    id="country"
                    value={billingData.country}
                    onChange={(e) => setBillingData({...billingData, country: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm">Fornavn</Label>
                    <Input 
                      id="firstName"
                      value={billingData.firstName}
                      onChange={(e) => setBillingData({...billingData, firstName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm">Etternavn</Label>
                    <Input 
                      id="lastName"
                      value={billingData.lastName}
                      onChange={(e) => setBillingData({...billingData, lastName: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm">Adresse</Label>
                  <Input 
                    id="address"
                    value={billingData.address}
                    onChange={(e) => setBillingData({...billingData, address: e.target.value})}
                    className="mt-1"
                  />
                  <Link href="#" className="text-xs text-[#4A5D7E] hover:underline">Legg til G/N</Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode" className="text-sm">Postnummer</Label>
                    <Input 
                      id="postalCode"
                      value={billingData.postalCode}
                      onChange={(e) => setBillingData({...billingData, postalCode: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-sm">By</Label>
                    <Input 
                      id="city"
                      value={billingData.city}
                      onChange={(e) => setBillingData({...billingData, city: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm">E-postadresse</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={billingData.email}
                    onChange={(e) => setBillingData({...billingData, email: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landkode" className="text-sm">Landkode</Label>
                    <Input 
                      id="landkode"
                      value={"+47"}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm">Mobilnummer</Label>
                    <Input 
                      id="phone"
                      value={billingData.phone}
                      onChange={(e) => setBillingData({...billingData, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Type Selection */}
              <div className="border-t pt-6 space-y-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${paymentType === "card" ? "border-blue-500 bg-blue-50" : ""}`}
                  onClick={() => setPaymentType("card")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === "card" ? "border-blue-500" : "border-gray-300"}`}>
                        {paymentType === "card" && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                      </div>
                      <Label className="font-semibold cursor-pointer">
                        Betal med kort
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={24} className="h-6 w-auto" />
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={40} height={24} className="h-6 w-auto" />
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Maestro" width={40} height={24} className="h-6 w-auto" />
                    </div>
                  </div>

                  {paymentType === "card" && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="cardNumber" className="text-sm">Kortnummer</Label>
                        <Input 
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry" className="text-sm">Utløper (mm/åå)</Label>
                          <Input 
                            id="expiry"
                            placeholder="MM/ÅÅ"
                            value={cardData.expiryDate}
                            onChange={(e) => setCardData({...cardData, expiryDate: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvc" className="text-sm">
                            CVC
                            <span className="ml-1 text-gray-400 cursor-help" title="3-digit security code">ⓘ</span>
                          </Label>
                          <Input 
                            id="cvc"
                            placeholder="CVC"
                            value={cardData.cvc}
                            onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="saveCard"
                          checked={cardData.saveCard}
                          onCheckedChange={(checked) => setCardData({...cardData, saveCard: checked as boolean})}
                        />
                        <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                          Lagre mitt kort
                        </Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vipps Option */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${paymentType === "vipps" ? "border-orange-500 bg-orange-50" : ""}`}
                  onClick={() => setPaymentType("vipps")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentType === "vipps" ? "border-orange-500" : "border-gray-300"}`}>
                        {paymentType === "vipps" && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                      </div>
                      <Label className="font-semibold cursor-pointer">
                        Vipps
                      </Label>
                    </div>
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Vipps_logo.svg" alt="Vipps" width={60} height={20} className="h-5 w-auto" />
                  </div>

                  {paymentType === "vipps" && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="vipps-landkode" className="text-sm">Landkode</Label>
                          <Input 
                            id="vipps-landkode"
                            value={vippsData.landkode}
                            readOnly
                            className="mt-1 bg-gray-50"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="vipps-mobilnummer" className="text-sm">Mobilnummer</Label>
                          <Input 
                            id="vipps-mobilnummer"
                            placeholder="12345678"
                            value={vippsData.mobilnummer}
                            onChange={(e) => setVippsData({...vippsData, mobilnummer: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and Pay Button */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms-payment"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms-payment" className="text-sm cursor-pointer">
                    Lagre mine detaljer - Dine kontakt- og betalingsopplysningene lagres trygt hos Nets Denmark A/S for raskere betaling, i henhold til Nets'{" "}
                    <Link href="/privacy" className="text-[#4A5D7E] underline">
                      personvernerklæring
                    </Link>. Du kan når som helst{" "}
                    <Link href="#" className="text-[#4A5D7E] underline">
                      trekke tilbake samtykket ditt
                    </Link>.
                  </Label>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={!agreeToTerms}
                  className="w-full bg-[#00A6E8] hover:bg-[#0095d1] text-white py-6 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Betal {calculateTotal().toFixed(0)} kr
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Ved å trykke på "Betal" aksepterer jeg også{" "}
                  <Link href="#" className="text-[#4A5D7E] underline">
                    vilkårene
                  </Link>{" "}
                  til Nets.no.
                </p>
              </div>

              {/* Nets Logo and Info */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={24} />
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Vipps_logo.svg" alt="Vipps" width={60} height={20} />
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={40} height={24} />
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={40} height={24} />
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Maestro" width={40} height={24} />
                </div>
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-[#00A6E8]">nets</span>
                  <span className="text-xs align-super">®</span>
                </div>
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Hvis du vil gjøre ditt enklare når du handler online, kan Nets lagre dine leveranse- og
                  betalingsopplysninger sikkert. Vi tar dine opplysninger på alvor og videresender dem kun
                  til den du handler med. Vi lagrer nå dine opplysninger, og bruker data og tilfredshetsmål
                  på en{" "}
                  <Link href="#" className="text-[#4A5D7E] underline">
                    personverregelse
                  </Link>. For opplysninger om tilgjengelighet og tilfredshetsmeldinger av
                  Nets'{" "}
                  <Link href="#" className="text-[#4A5D7E] underline">
                    tilgjengelighetsreglene
                  </Link>. Les mer i Nets sine{" "}
                  <Link href="#" className="text-[#4A5D7E] underline">
                    personvernreglene
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold mb-6">OPPSUMMERING</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">kr {item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Delsum</span>
                  <span>kr {calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="font-bold mb-3">FRAKT</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Fyll inn adressen din for å vise fraktalternativer.
                </p>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Totalt</span>
                  <span className="font-semibold">
                    KR {calculateTotal().toFixed(2)} 
                    <span className="text-xs text-gray-500 block text-right">(inkl. kr {(calculateFreight() * 0.2).toFixed(2)} MVA)</span>
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="order-notes-sidebar" className="text-sm font-semibold">Ordrenotater</Label>
                <Textarea
                  id="order-notes-sidebar"
                  placeholder="Notater til din ordre, f.eks. spesielle ønsker for levering."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    )

}