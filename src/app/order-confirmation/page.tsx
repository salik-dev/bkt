"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Printer } from "lucide-react"

interface OrderData {
  billingData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    streetAddress: string
    postalCode: string
    postalAddress: string
    organizationNumber?: string
  }
  shippingData?: {
    firstName: string
    lastName: string
    streetAddress: string
    postalCode: string
    postalAddress: string
  }
  paymentMethod: string
  orderNotes: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    total: number
  }>
  subtotal: number
  freight: number
  total: number
  orderDate: string
  orderNumber: string
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const lastOrder = localStorage.getItem("lastOrder")
    if (lastOrder) {
      const order = JSON.parse(lastOrder)
      // Generate order number if not exists
      if (!order.orderNumber) {
        order.orderNumber = `#${Math.floor(Math.random() * 10000)}`
      }
      setOrderData(order)
    } else {
      // If no order data, redirect to home
      router.push("/")
    }
  }, [router])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    // In a real app, this would generate a PDF
    alert("Invoice download would start here")
  }

  if (!isClient || !orderData) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("no-NO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Takk for din bestilling!
          </h1>
          <p className="text-gray-700 mb-4">
            Din bestilling er mottatt og behandles nå. Du vil motta en bekreftelse på e-post.
          </p>
          <p className="text-lg font-semibold">
            Bestillingsnummer: <span className="text-[#4A5D7E]">{orderData.orderNumber}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 print:hidden">
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Skriv ut
          </Button>
          <Button 
            onClick={handleDownloadInvoice}
            className="bg-[#4A5D7E] hover:bg-[#3d4d68] text-white gap-2"
          >
            <Download className="h-4 w-4" />
            Last ned faktura
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b">Ordredetaljer</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Bestillingsinformasjon</h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Ordrenummer:</span> {orderData.orderNumber}</p>
                  <p><span className="font-medium">Dato:</span> {formatDate(orderData.orderDate)}</p>
                  <p><span className="font-medium">Betalingsmetode:</span> {
                    orderData.paymentMethod === "invoice" ? "Faktura" : 
                    orderData.paymentMethod === "short-or-flip" ? "Short or Flip" : 
                    "Kort/Vipps"
                  }</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Fakturaadresse</h3>
                <div className="text-sm">
                  <p className="font-medium">
                    {orderData.billingData.firstName} {orderData.billingData.lastName}
                  </p>
                  {orderData.billingData.organizationNumber && (
                    <p className="text-gray-600">Org.nr: {orderData.billingData.organizationNumber}</p>
                  )}
                  {orderData.billingData.streetAddress && (
                    <p className="text-gray-600">{orderData.billingData.streetAddress}</p>
                  )}
                  {orderData.billingData.postalCode && orderData.billingData.postalAddress && (
                    <p className="text-gray-600">
                      {orderData.billingData.postalCode} {orderData.billingData.postalAddress}
                    </p>
                  )}
                  <p className="text-gray-600">Norge</p>
                  <p className="text-gray-600 mt-2">
                    📞 {orderData.billingData.phone}
                  </p>
                  <p className="text-gray-600">
                    📧 {orderData.billingData.email}
                  </p>
                </div>
              </div>

              {orderData.shippingData && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Leveringsadresse</h3>
                  <div className="text-sm">
                    <p className="font-medium">
                      {orderData.shippingData.firstName} {orderData.shippingData.lastName}
                    </p>
                    {orderData.shippingData.streetAddress && (
                      <p className="text-gray-600">{orderData.shippingData.streetAddress}</p>
                    )}
                    {orderData.shippingData.postalCode && orderData.shippingData.postalAddress && (
                      <p className="text-gray-600">
                        {orderData.shippingData.postalCode} {orderData.shippingData.postalAddress}
                      </p>
                    )}
                    <p className="text-gray-600">Norge</p>
                  </div>
                </div>
              )}

              {orderData.orderNotes && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Ordrenotater</h3>
                  <p className="text-sm text-gray-600">{orderData.orderNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b">Ordresammendrag</h2>
            
            <div className="space-y-4">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm font-semibold">
                    <th className="pb-3">Produkt</th>
                    <th className="pb-3 text-center">Antall</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orderData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{item.name}</td>
                      <td className="py-3 text-center">× {item.quantity}</td>
                      <td className="py-3 text-right font-semibold">
                        kr {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Delsum:</span>
                  <span className="font-semibold">kr {orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frakt:</span>
                  <span className="font-semibold">kr {orderData.freight.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>MVA (inkludert):</span>
                  <span>kr {((orderData.total * 0.2) / 1.2).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold pt-4 border-t-2">
                <span>Total:</span>
                <span className="text-[#4A5D7E]">kr {orderData.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Hva skjer nå?</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Du vil motta en bekreftelse på e-post</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Vi behandler din bestilling innen 1-2 virkedager</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Du vil få sporingsinfo når pakken sendes</span>
                </li>
                {orderData.paymentMethod === "invoice" && (
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>Faktura sendes separat på e-post</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-6">
              <Button 
                onClick={() => router.push("/")}
                className="w-full bg-[#4A5D7E] hover:bg-[#3d4d68] text-white"
              >
                Tilbake til forsiden
              </Button>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white p-6 rounded-lg mt-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-[#4A5D7E] px-3 py-1 rounded">
                  <span className="text-white font-bold text-xl">BKT</span>
                </div>
                <span className="font-bold">BERGEN KOMMUNIKASJONSTEKNISK AS</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Telefon: 55229001</p>
                <p>E-post: bkt@bkt.no</p>
                <p>Org. nr: 960432835</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Har du spørsmål om din bestilling?</p>
              <p>Kontakt kundeservice:</p>
              <p className="font-semibold">Hverdager 07:30 - 15:30</p>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center mt-8 print:hidden">
          <p className="text-sm text-gray-600 mb-4">
            Trenger du hjelp? <Link href="/contact" className="text-[#4A5D7E] hover:underline">Kontakt oss</Link>
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/betingelser" className="text-[#4A5D7E] hover:underline">Betingelser</Link>
            <Link href="/angrerettskjema" className="text-[#4A5D7E] hover:underline">Angrerettskjema</Link>
            <Link href="/personvern" className="text-[#4A5D7E] hover:underline">Personvern</Link>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @media print {
          header, footer, button, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
