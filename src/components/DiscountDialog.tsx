import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Tag } from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: Date;
  endDate: Date;
  applicableServices: string[];
  applicableMedicines: string[];
  minPurchase?: number;
  maxDiscount?: number;
  isActive: boolean;
}

interface DiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discountType: "none" | "percentage" | "fixed" | "promotion";
  discountValue: string;
  discountNote: string;
  promoCode: string;
  selectedPromotion: string;
  appliedPromotion: Promotion | null;
  availablePromotions: Promotion[];
  subtotal: number;
  onDiscountChange: (type: "none" | "percentage" | "fixed" | "promotion", value: string, note: string, promo?: Promotion) => void;
  onPromoCodeApply: (code: string) => void;
  formatRupiah: (amount: number) => string;
}

export function DiscountDialog({
  open,
  onOpenChange,
  discountType,
  discountValue,
  discountNote,
  promoCode,
  selectedPromotion,
  appliedPromotion,
  availablePromotions,
  subtotal,
  onDiscountChange,
  onPromoCodeApply,
  formatRupiah
}: DiscountDialogProps) {
  const [localType, setLocalType] = useState(discountType);
  const [localValue, setLocalValue] = useState(discountValue);
  const [localNote, setLocalNote] = useState(discountNote);
  const [localPromoCode, setLocalPromoCode] = useState(promoCode);
  const [localSelectedPromo, setLocalSelectedPromo] = useState(selectedPromotion);

  const handleApply = () => {
    const promo = availablePromotions.find(p => p.id === localSelectedPromo);
    onDiscountChange(localType, localValue, localNote, promo);
    onOpenChange(false);
  };

  const handleApplyPromoCode = () => {
    onPromoCodeApply(localPromoCode);
    setLocalPromoCode("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Diskon & Promosi
          </DialogTitle>
          <DialogDescription>
            Terapkan diskon atau kode promosi untuk transaksi ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {appliedPromotion && localType === "promotion" && !localSelectedPromo && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-sm">Promo Otomatis Diterapkan!</div>
                <div className="text-xs text-muted-foreground">{appliedPromotion.name}</div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setLocalType("none");
                  onDiscountChange("none", "", "", undefined);
                }}
              >
                Hapus
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label>Tipe Diskon</Label>
            <Select value={localType} onValueChange={(value: any) => setLocalType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tanpa Diskon</SelectItem>
                <SelectItem value="percentage">Persentase (%)</SelectItem>
                <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                <SelectItem value="promotion">Gunakan Promosi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {localType === "percentage" && (
            <div className="space-y-2">
              <Label>Persentase Diskon (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder="Contoh: 10"
              />
              <div className="space-y-2">
                <Label>Catatan Diskon (Opsional)</Label>
                <Input
                  value={localNote}
                  onChange={(e) => setLocalNote(e.target.value)}
                  placeholder="Contoh: Diskon pelanggan setia"
                />
              </div>
            </div>
          )}

          {localType === "fixed" && (
            <div className="space-y-2">
              <Label>Nominal Diskon (Rp)</Label>
              <Input
                type="number"
                min="0"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder="Contoh: 50000"
              />
              <div className="space-y-2">
                <Label>Catatan Diskon (Opsional)</Label>
                <Input
                  value={localNote}
                  onChange={(e) => setLocalNote(e.target.value)}
                  placeholder="Contoh: Diskon khusus"
                />
              </div>
            </div>
          )}

          {localType === "promotion" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Masukkan Kode Promo</Label>
                <div className="flex gap-2">
                  <Input
                    value={localPromoCode}
                    onChange={(e) => setLocalPromoCode(e.target.value.toUpperCase())}
                    placeholder="Masukkan kode promo"
                  />
                  <Button onClick={handleApplyPromoCode}>Terapkan</Button>
                </div>
              </div>

              {availablePromotions.length > 0 && (
                <div className="space-y-2">
                  <Label>Atau Pilih Promosi Tersedia</Label>
                  <Select value={localSelectedPromo} onValueChange={setLocalSelectedPromo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih promosi" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePromotions.map((promo) => (
                        <SelectItem key={promo.id} value={promo.id}>
                          {promo.name} - {promo.discountType === "percentage" 
                            ? `${promo.discountValue}%` 
                            : formatRupiah(promo.discountValue)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {localSelectedPromo && (
                <div className="p-3 bg-muted rounded-lg">
                  {(() => {
                    const promo = availablePromotions.find(p => p.id === localSelectedPromo);
                    if (!promo) return null;
                    return (
                      <div className="space-y-1 text-sm">
                        <div className="font-medium">{promo.name}</div>
                        <div className="text-muted-foreground">
                          Kode: <Badge variant="outline">{promo.code}</Badge>
                        </div>
                        <div className="text-muted-foreground">
                          Diskon: {promo.discountType === "percentage" 
                            ? `${promo.discountValue}%` 
                            : formatRupiah(promo.discountValue)}
                        </div>
                        {promo.minPurchase && (
                          <div className="text-muted-foreground">
                            Min. pembelian: {formatRupiah(promo.minPurchase)}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleApply}>Terapkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
