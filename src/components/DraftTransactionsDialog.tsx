import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileEdit } from "lucide-react";
import type { DraftTransaction } from "@/types/cashier";

interface DraftTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drafts: DraftTransaction[];
  onLoadDraft: (draft: DraftTransaction) => void;
  onDeleteDraft: (draftId: string) => void;
}

export function DraftTransactionsDialog({ 
  open, 
  onOpenChange, 
  drafts,
  onLoadDraft,
  onDeleteDraft
}: DraftTransactionsDialogProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaksi Tersimpan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {drafts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada transaksi tersimpan
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Draft</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drafts.map((draft) => (
                  <TableRow key={draft.id}>
                    <TableCell className="font-medium">
                      {draft.draftNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{draft.customerName}</p>
                        <Badge variant="outline" className="text-xs">
                          {draft.customerType === 'patient' ? 'Pasien' : 'Umum'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {draft.items.length} item
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatRupiah(draft.total)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(draft.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onLoadDraft(draft);
                            onOpenChange(false);
                          }}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeleteDraft(draft.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
