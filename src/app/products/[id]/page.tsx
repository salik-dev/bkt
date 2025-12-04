"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Facebook, Twitter } from "lucide-react"
import { FaPinterest } from "react-icons/fa"

export default function ProductDetailPage() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [lampType, setLampType] = useState("complete")
  
  const prices = {
    complete: 3480.0,
    topOnly: 2500.0
  }

  const calculateTotal = () => {
    return prices[lampType as keyof typeof prices] * quantity
  }

  const handleAddToCart = () => {
    // Store cart data in localStorage
    const cartItem = {
      id: "1",
      name: lampType === 'complete' ? 'Complete Taxi Lamp' : 'Taxi Lamp Top Only',
      price: prices[lampType as keyof typeof prices],
      quantity,
      options: {
        lampType
      },
      total: calculateTotal()
    }
    
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    existingCart.push(cartItem)
    localStorage.setItem("cart", JSON.stringify(existingCart))
    
    router.push("/cart")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-[#4A5D7E]">Hjem</Link> / 
          <span> Click & Go (Komplett taxilampe)</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg">
          <div>
            <div className="relative aspect-square bg-white border rounded-lg overflow-hidden mb-4">
              <Image
                src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&h=800&fit=crop"
                alt="Click & Go (Komplett taxilampe)"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">
              {lampType === 'complete' ? 'Complete Taxi Lamp' : 'Taxi Lamp Top Only'}
            </h1>
            <p className="text-3xl font-bold text-gray-900 mb-6">
              KR {prices[lampType as keyof typeof prices].toFixed(2)}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Select Lamp Type*
              </label>
              <Select value={lampType} onValueChange={setLampType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lamp type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete Taxi Lamp - kr {prices.complete.toFixed(2)}</SelectItem>
                  <SelectItem value="topOnly">Top Part Only - kr {prices.topOnly.toFixed(2)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Magnetlist og beskyttelsesfolie er ikke lengre inkludert i dette produktet, men kan kjøpes som tilvalg.
            </p>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Produktpris kr {prices[lampType as keyof typeof prices].toFixed(2)} x {quantity}</span>
                <span className="font-semibold">kr {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>kr {calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full bg-[#4A5D7E] hover:bg-[#3d4d68] text-white py-6 text-lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart - kr {calculateTotal().toFixed(2)}
              </Button>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                onClick={() => {
                  handleAddToCart();
                  router.push('/checkout');
                }}
              >
                Checkout Now
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg mt-8">
          <div className="border-b mb-6">
            <button className="px-6 py-3 border-b-2 border-[#4A5D7E] font-semibold">
              INFORMASJON
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">CLICK & GO (KOMPLETT TAXILAMPE)</h2>
              <p className="text-gray-700 mb-4">
                Klikk og skyv, og toppen - akkurat mer frikobling og fjerning av sokkel når du skal i bilvasken. Bare «Click & Go»! Eksklusiv bærerem. Mer plass på toket, sikk et bærrem ikke på før i den.
              </p>
              <p className="text-gray-600 mb-6">
                {lampType === 'complete' 
                  ? 'Complete taxi lamp ready to use. Includes everything you need for installation.' 
                  : 'Taxi lamp top part only. Perfect if you already have the base.'}
              </p>
              <p className="text-sm text-gray-600 italic">
                <Link href="#" className="text-[#4A5D7E] underline">Magnetlist</Link> og{" "}
                <Link href="#" className="text-[#4A5D7E] underline">beskyttelsesfolie</Link> er ikke lengre inkludert i dette produktet, men kan kjøpes som tilvalg.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">DIMENSJONER</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Topp</td>
                    <td className="py-2 text-right">L x B x H<br/>45 x 10.4 x 14.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Bæremeile (Click & Go)</td>
                    <td className="py-2 text-right">45.5 x 10.9 x 2.2</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Magnetskokkel</td>
                    <td className="py-2 text-right">53.5 x 18.9 x 1.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm mb-2">DEL:</p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FaPinterest className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">DU LIKER KANSKJE OGSÅ...</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Beskyttelsesfolie", price: 150.0, image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop" },
              { name: "Magnetlist", price: 188.0, image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop" }
            ].map((product, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border">
                <div className="aspect-square relative mb-4">
                  <Image src={product.image} alt={product.name} fill className="object-cover rounded" />
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-lg font-bold mb-3">KR {product.price.toFixed(2)},-</p>
                <Button className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-white">
                  VIS PRODUKT
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">RELATERTE PRODUKTER</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "Lyspære 20W Halogen", price: 60.0 },
              { name: "Magnet (rund)", price: 330.0 },
              { name: "Click & Go Bunnplate (sett)", price: 1565.0 },
              { name: "Kabel til Click & Go", price: 395.0 },
              { name: "Toppblylst taxitopp NO-T", price: 1050.0 }
            ].map((product, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border">
                <div className="aspect-square bg-gray-100 mb-4 rounded"></div>
                <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                <p className="text-lg font-bold mb-3">KR {product.price.toFixed(2)},-</p>
                <Button className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-sm">
                  VIS PRODUKT
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}