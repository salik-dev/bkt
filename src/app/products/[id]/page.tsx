"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart, X, ZoomIn, Facebook, Twitter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaPinterest } from "react-icons/fa"

export default function ProductDetailPage() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [lampType, setLampType] = useState<'complete' | 'top'>('complete')
  const [isZoomed, setIsZoomed] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      setCursorPosition({ x, y })
    }
  }

  const prices = {
    complete: 3480.0,
    topOnly: 2500.0
  }

  const calculateTotal = () => {
    return prices[lampType as keyof typeof prices] * quantity
  }

  const handleCheckout = async () => {
    const cartItem = {
      id: "1",
      name: lampType === 'complete' ? 'Complete Taxi Lamp' : 'Top Part Only',
      price: prices[lampType as keyof typeof prices],
      quantity,
      options: { lampType }
    };

    // Save to localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify([...currentCart, cartItem]));
    
    // Redirect to checkout
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setShowModal(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setShowModal(false)
            }}
          >
            <X size={32} />
          </button>
          <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
            <Image
              src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&h=1200&fit=crop"
              alt="Click & Go (Komplett taxilampe)"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
      {/* Image Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setShowModal(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setShowModal(false)
            }}
          >
            <X size={32} />
          </button>
          <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
            <Image
              src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&h=1200&fit=crop"
              alt="Click & Go (Komplett taxilampe)"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-[#8bc34a]">Hjem</Link> / 
          <span> Click & Go (Komplett taxilampe)</span>
        </div>

        <div className="max-w-[80rem] grid md:grid-cols-2 gap-12 mx-auto bg-white p-8 rounded-lg">
          <div>
            <div className="relative aspect-square bg-white border rounded-lg overflow-hidden mb-4">
              <div 
                className="relative w-full h-full cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowModal(true)
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&h=1200&fit=crop"
                  alt="Click & Go (Komplett taxilampe)"
                  fill
                  className={`object-contain p-4 transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                  style={{
                    transformOrigin: isZoomed ? `${cursorPosition.x}% ${cursorPosition.y}%` : 'center',
                  }}
                  priority
                />
                <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full shadow-md">
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </div>
              </div>
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
              <Select value={lampType} onValueChange={(value: 'complete' | 'top') => setLampType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lamp type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete Taxi Lamp - kr {prices.complete.toFixed(2)}</SelectItem>
                  <SelectItem value="topOnly">Top Part Only - kr {prices.topOnly.toFixed(2)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Magnetlist og beskyttelsesfolie er ikke lenger inkludert i dette produktet, men kan kjøpes som tilvalg.
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <div className="flex items-center border rounded-md w-32 bg-[#8bc34a] hover:bg-[#7cb342] text-white">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center font-bold hover:bg-white/20"
                >
                  -
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold hover:bg-white/20"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Product Price</span>
                <span>kr {prices[lampType as keyof typeof prices].toFixed(2)} x {quantity}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>kr {calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-2">
              <Button 
                className="w-full bg-[#8bc34a] hover:bg-[#7cb342] text-white py-6 text-lg hover:cursor-pointer"
                onClick={handleCheckout}
              >
                Checkout Now - kr {calculateTotal().toFixed(2)}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg mt-8">
          <div className="border-b mb-6">
            <button className="px-6 py-3 border-b-2 border-[#8bc34a] font-semibold">
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
                <Link href="#" className="text-[#8bc34a] underline">Magnetlist</Link> og{" "}
                <Link href="#" className="text-[#8bc34a] underline">beskyttelsesfolie</Link> er ikke lengre inkludert i dette produktet, men kan kjøpes som tilvalg.
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
                <Button className="w-full bg-[#8bc34a] hover:bg-[#7CB342] text-white">
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
                <Button className="w-full bg-[#8bc34a] hover:bg-[#7CB342] text-white text-sm">
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