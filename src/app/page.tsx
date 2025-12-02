"use client"

import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4A5D7E] to-[#5B6D8E] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Velkommen til BKT
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Din leverandør av taxiutstyr, bil elektrisk og kommunikasjonsteknologi
          </p>
          <Button 
            asChild
            className="bg-[#8BC34A] hover:bg-[#7CB342] text-white text-lg px-8 py-6"
          >
            <Link href="/products/1">
              Se våre produkter
            </Link>
          </Button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Våre Produkter</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Featured Product */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-64 bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&h=800&fit=crop"
                alt="Click & Go (Komplett taxilampe)"
                fill
                className="object-contain p-8"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Click & Go (Komplett taxilampe)</h3>
              <p className="text-gray-600 mb-4">
                Komplett taxilampe med glass, LED felt og magnetfeste. Enkel montering!
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#4A5D7E]">KR 3,480.00</span>
                <Button 
                  asChild
                  className="bg-[#8BC34A] hover:bg-[#7CB342] text-white"
                >
                  <Link href="/products/1">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Se produkt
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* More Products */}
          {[
            { name: "Beskyttelsesfolie", price: 150.0 },
            { name: "Magnetlist", price: 188.0 }
          ].map((product, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-100">
                <Image
                  src={`https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&h=800&fit=crop&q=80&seed=${idx}`}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">
                  Høykvalitets tilbehør for taxilamper
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#4A5D7E]">KR {product.price.toFixed(2)}</span>
                  <Button 
                    asChild
                    className="bg-[#8BC34A] hover:bg-[#7CB342] text-white"
                  >
                    <Link href="/products/1">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Se produkt
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Hvorfor velge BKT?</h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="bg-[#4A5D7E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <h3 className="font-bold mb-2">Høy kvalitet</h3>
              <p className="text-sm text-gray-600">
                Kun de beste produktene for våre kunder
              </p>
            </div>
            
            <div>
              <div className="bg-[#4A5D7E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🚚
              </div>
              <h3 className="font-bold mb-2">Rask levering</h3>
              <p className="text-sm text-gray-600">
                Vi sender raskt over hele Norge
              </p>
            </div>
            
            <div>
              <div className="bg-[#4A5D7E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                💬
              </div>
              <h3 className="font-bold mb-2">Ekspertråd</h3>
              <p className="text-sm text-gray-600">
                Våre eksperter står klare til å hjelpe
              </p>
            </div>
            
            <div>
              <div className="bg-[#4A5D7E] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🛡️
              </div>
              <h3 className="font-bold mb-2">Sikker betaling</h3>
              <p className="text-sm text-gray-600">
                Flere betalingsalternativer tilgjengelig
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#8BC34A] py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Klar til å handle?</h2>
          <p className="text-xl mb-8">
            Utforsk vårt komplette sortiment av produkter
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-white text-[#8BC34A] hover:bg-gray-100 text-lg px-8 py-6"
          >
            <Link href="/products/1">
              Start shopping nå
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}