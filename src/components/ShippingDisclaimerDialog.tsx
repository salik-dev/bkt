"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ShippingDisclaimerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ShippingDisclaimerDialog({
  open,
  onOpenChange,
  onConfirm,
}: ShippingDisclaimerDialogProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideShippingDisclaimer", "true")
    }
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <div className="py-6">
          <p className="text-gray-700 leading-relaxed">
            Fraktberegningen fra PostNord er dessverre så kompleks at det ikke alltid er mulig å
            vise korrekt pris i nettbutikken. I noen tilfeller kan fraktbeløpet som vises derfor være
            høyere enn den faktiske kostnaden. Vi justerer da portoen ned til riktig beløp før vi
            belaster deg – aldri opp. Har du spørsmål, er du selvfølgelig velkommen til å kontakte
            oss på 55 22 90 01 eller norskBilTeknikk@norskbilteknikk.no
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-4">
          <div className="flex items-center space-x-2 justify-center">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label
              htmlFor="dont-show"
              className="text-sm font-normal cursor-pointer"
            >
              Ikke vis igjen
            </Label>
          </div>

          <Button
            onClick={handleConfirm}
            className="bg-[#00A6E8] hover:bg-[#0095d1] text-white px-12"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
