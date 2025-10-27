import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Ticket, Sparkles } from "lucide-react";
import type { PatientVoucher } from "@/pages/VoucherManagement";

interface VoucherSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vouchers: PatientVoucher[];
  selectedVoucher: string;
  onSelectVoucher: (voucherId: string) => void;
}

export function VoucherSelectionDialog({
  open,
  onOpenChange,
  vouchers,
  selectedVoucher,
  onSelectVoucher
}: VoucherSelectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Voucher Pasien
          </DialogTitle>
          <DialogDescription>
            Pilih voucher yang ingin digunakan untuk transaksi ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto py-4">
          {vouchers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada voucher tersedia untuk pasien ini
            </div>
          ) : (
            vouchers.map((voucher) => (
              <button
                key={voucher.id}
                onClick={() => {
                  onSelectVoucher(voucher.id === selectedVoucher ? "" : voucher.id);
                  if (voucher.id !== selectedVoucher) {
                    onOpenChange(false);
                  }
                }}
                className={`
                  w-full p-4 border rounded-lg text-left transition-all
                  ${selectedVoucher === voucher.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{voucher.packageName}</div>
                  <Badge variant={selectedVoucher === voucher.id ? "default" : "outline"}>
                    {selectedVoucher === voucher.id ? "Terpilih" : "Pilih"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Sisa: {voucher.remainingSessions} / {voucher.totalSessions} sesi
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Berlaku sampai: {new Date(voucher.expiryDate).toLocaleDateString('id-ID')}
                </div>
              </button>
            ))
          )}
          
          {selectedVoucher && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Voucher akan digunakan untuk layanan ini</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
