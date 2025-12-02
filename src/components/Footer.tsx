"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#4A5D7E] px-3 py-1 rounded">
                <span className="text-white font-bold text-xl">BKT</span>
              </div>
            </div>
            <h3 className="font-bold mb-4">BERGEN KOMMUNIKASJONSTEKNISK AS</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 55229001</p>
              <p>📧 bkt@bkt.no</p>
              <p>📱 Org. nr: 960432835</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">NYHETSBREV</h3>
            <p className="text-sm text-gray-600 mb-4">
              Hold deg oppdatert på nyheter, teknisk informasjon og innovative løsninger. Meld deg på vårt nyhetsbrev!
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Epost adresse" />
              <Button className="bg-[#4A5D7E] hover:bg-[#3d4d68]">Registrer</Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Sendt med Sign Ups</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">KUNDESERVICE</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vår kundeservice hjelper deg, uansett hva du lurer på. Du kan kontakte oss på tlf. eller e-mail. Du treffer oss på telefon hverdager fra kl. 07:30 - 15:30.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-600 hover:text-[#4A5D7E]">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#4A5D7E]">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#4A5D7E]">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/outlet" className="hover:text-[#4A5D7E]">Outlet</Link>
            <Link href="/betingelser" className="hover:text-[#4A5D7E]">Betingelser</Link>
            <Link href="/personvern" className="hover:text-[#4A5D7E]">Personvern</Link>
            <Link href="/angrerettskjema" className="hover:text-[#4A5D7E]">Angrerettskjema ⟶</Link>
            <Link href="/word" className="hover:text-[#4A5D7E]">Word</Link>
            <Link href="/pdf" className="hover:text-[#4A5D7E]">PDF</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}