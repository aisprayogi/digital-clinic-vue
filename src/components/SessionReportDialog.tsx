import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import type { SessionReport } from "@/types/cashier";

interface SessionReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: SessionReport | null;
}

export function SessionReportDialog({ open, onOpenChange, report }: SessionReportDialogProps) {
  if (!report) return null;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>Laporan Sesi Kasir</DialogTitle>
        </DialogHeader>

        <div className="space-y-6" id="print-content">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Klinik XYZ</h2>
            <p className="text-muted-foreground">Laporan Sesi Kasir</p>
            <p className="font-medium">Sesi #{report.session.sessionNumber}</p>
          </div>

          <Separator />

          {/* Session Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Kasir</p>
              <p className="font-medium">{report.session.cashierName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dibuka</p>
              <p className="font-medium">{formatDateTime(report.session.openedAt)}</p>
            </div>
            {report.session.closedAt && (
              <>
                <div>
                  <p className="text-muted-foreground">Ditutup</p>
                  <p className="font-medium">{formatDateTime(report.session.closedAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Durasi</p>
                  <p className="font-medium">
                    {Math.round((report.session.closedAt.getTime() - report.session.openedAt.getTime()) / (1000 * 60))} menit
                  </p>
                </div>
              </>
            )}
            <div>
              <p className="text-muted-foreground">Modal Awal</p>
              <p className="font-medium">{formatRupiah(report.session.openingBalance)}</p>
            </div>
            {report.session.closingBalance !== undefined && (
              <div>
                <p className="text-muted-foreground">Saldo Akhir</p>
                <p className="font-medium">{formatRupiah(report.session.closingBalance)}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Ringkasan</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <p className="text-2xl font-bold">{report.summary.totalTransactions}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                <p className="text-2xl font-bold">{formatRupiah(report.summary.totalRevenue)}</p>
              </div>
              <div className="p-4 border rounded-lg col-span-2 md:col-span-1">
                <p className="text-sm text-muted-foreground mb-2">Metode Pembayaran</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Tunai:</span>
                    <span className="font-medium">{formatRupiah(report.summary.paymentMethods.cash)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kartu:</span>
                    <span className="font-medium">{formatRupiah(report.summary.paymentMethods.card)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer:</span>
                    <span className="font-medium">{formatRupiah(report.summary.paymentMethods.transfer)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transaction List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Detail Transaksi</h3>
            {report.transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Tidak ada transaksi</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Transaksi</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Pembayaran</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.transactions.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="font-medium">{trx.transactionNumber}</TableCell>
                      <TableCell>{formatDateTime(trx.timestamp)}</TableCell>
                      <TableCell>{trx.customerName}</TableCell>
                      <TableCell className="capitalize">{trx.paymentMethod}</TableCell>
                      <TableCell className="text-right font-medium">{formatRupiah(trx.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
