import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Minus, Package, AlertTriangle, History, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  expiryDate: string;
  supplier: string;
}

interface StockHistory {
  id: string;
  medicineId: string;
  medicineName: string;
  type: "in" | "out";
  quantity: number;
  date: string;
  note: string;
  user: string;
}

export default function StockManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [stockAction, setStockAction] = useState<"in" | "out">("in");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockNote, setStockNote] = useState("");

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "Analgesik",
      stock: 150,
      minStock: 50,
      unit: "Strip",
      price: 5000,
      expiryDate: "2025-12-31",
      supplier: "PT Kimia Farma"
    },
    {
      id: "2",
      name: "Amoxicillin 500mg",
      category: "Antibiotik",
      stock: 28,
      minStock: 30,
      unit: "Strip",
      price: 8000,
      expiryDate: "2025-08-15",
      supplier: "PT Kalbe Farma"
    },
    {
      id: "3",
      name: "Vitamin C 1000mg",
      category: "Suplemen",
      stock: 32,
      minStock: 25,
      unit: "Botol",
      price: 15000,
      expiryDate: "2026-03-20",
      supplier: "PT Darya-Varia"
    },
    {
      id: "4",
      name: "OBH Combi Batuk",
      category: "Obat Batuk",
      stock: 45,
      minStock: 20,
      unit: "Botol",
      price: 25000,
      expiryDate: "2025-10-10",
      supplier: "PT Combiphar"
    },
    {
      id: "5",
      name: "Antasida DOEN",
      category: "Obat Maag",
      stock: 12,
      minStock: 15,
      unit: "Strip",
      price: 3000,
      expiryDate: "2025-06-30",
      supplier: "PT Tempo Scan"
    },
  ]);

  const [stockHistory, setStockHistory] = useState<StockHistory[]>([
    {
      id: "1",
      medicineId: "1",
      medicineName: "Paracetamol 500mg",
      type: "in",
      quantity: 100,
      date: "2025-01-15",
      note: "Pembelian rutin",
      user: "Admin Klinik"
    },
    {
      id: "2",
      medicineId: "2",
      medicineName: "Amoxicillin 500mg",
      type: "out",
      quantity: 10,
      date: "2025-01-16",
      note: "Penjualan ke pasien",
      user: "Admin Klinik"
    },
  ]);

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const criticalStock = medicines.filter(med => med.stock <= med.minStock);

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Habis", variant: "destructive" as const };
    if (stock <= minStock) return { label: "Kritis", variant: "warning" as const };
    return { label: "Normal", variant: "success" as const };
  };

  const handleStockUpdate = () => {
    if (!selectedMedicine || !stockQuantity) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua data",
        variant: "destructive"
      });
      return;
    }

    const qty = parseInt(stockQuantity);
    const newStock = stockAction === "in" 
      ? selectedMedicine.stock + qty 
      : selectedMedicine.stock - qty;

    if (newStock < 0) {
      toast({
        title: "Error",
        description: "Stok tidak mencukupi",
        variant: "destructive"
      });
      return;
    }

    // Update stock
    setMedicines(medicines.map(med => 
      med.id === selectedMedicine.id 
        ? { ...med, stock: newStock }
        : med
    ));

    // Add to history
    const newHistory: StockHistory = {
      id: Date.now().toString(),
      medicineId: selectedMedicine.id,
      medicineName: selectedMedicine.name,
      type: stockAction,
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      note: stockNote || (stockAction === "in" ? "Penambahan stok" : "Pengurangan stok"),
      user: "Admin Klinik"
    };

    setStockHistory([newHistory, ...stockHistory]);

    toast({
      title: "Berhasil",
      description: `Stok ${selectedMedicine.name} telah diperbarui`,
    });

    // Reset form
    setShowStockDialog(false);
    setStockQuantity("");
    setStockNote("");
    setSelectedMedicine(null);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" userName="Admin Klinik" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Manajemen Stok Obat</h1>
            <p className="text-muted-foreground">
              Kelola inventori dan stok obat klinik
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Obat Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Obat Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi obat yang akan ditambahkan ke inventori
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nama Obat</Label>
                  <Input placeholder="Contoh: Paracetamol 500mg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="analgesik">Analgesik</SelectItem>
                        <SelectItem value="antibiotik">Antibiotik</SelectItem>
                        <SelectItem value="suplemen">Suplemen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Satuan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strip">Strip</SelectItem>
                        <SelectItem value="botol">Botol</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stok Awal</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stok Minimum</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Harga Satuan</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tanggal Kadaluarsa</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Input placeholder="Nama supplier" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Batal</Button>
                <Button onClick={() => {
                  toast({
                    title: "Berhasil",
                    description: "Obat baru telah ditambahkan",
                  });
                  setShowAddDialog(false);
                }}>
                  Simpan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Critical Stock Alert */}
        {criticalStock.length > 0 && (
          <Card className="mb-6 border-warning bg-warning/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Stok Kritis ({criticalStock.length} item)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {criticalStock.map(med => (
                  <Badge key={med.id} variant="warning">
                    {med.name}: {med.stock} {med.unit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Daftar Obat</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari obat..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Obat</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-center">Stok</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines.map((medicine) => {
                      const status = getStockStatus(medicine.stock, medicine.minStock);
                      return (
                        <TableRow key={medicine.id}>
                          <TableCell>
                            <div className="font-medium">{medicine.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Exp: {formatDate(medicine.expiryDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{medicine.category}</TableCell>
                          <TableCell className="text-center font-medium">
                            {medicine.stock} {medicine.unit}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>{formatRupiah(medicine.price)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedMedicine(medicine);
                                  setStockAction("in");
                                  setShowStockDialog(true);
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedMedicine(medicine);
                                  setStockAction("out");
                                  setShowStockDialog(true);
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Stock History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Riwayat Stok
                </CardTitle>
                <CardDescription>Aktivitas stok terbaru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {stockHistory.map((history) => (
                    <div key={history.id} className="border-l-2 border-primary pl-3 pb-3">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {history.type === "in" ? (
                            <Badge variant="success" className="h-5">
                              <Plus className="h-3 w-3 mr-1" />
                              Masuk
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="h-5">
                              <Minus className="h-3 w-3 mr-1" />
                              Keluar
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(history.date)}
                        </span>
                      </div>
                      <div className="font-medium text-sm">{history.medicineName}</div>
                      <div className="text-sm text-muted-foreground">
                        {history.quantity} unit - {history.note}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        oleh {history.user}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stock Update Dialog */}
        <Dialog open={showStockDialog} onOpenChange={setShowStockDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {stockAction === "in" ? "Tambah" : "Kurangi"} Stok
              </DialogTitle>
              <DialogDescription>
                {selectedMedicine?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Stok Saat Ini</div>
                <div className="text-2xl font-bold">
                  {selectedMedicine?.stock} {selectedMedicine?.unit}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Jumlah</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Masukkan jumlah"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Catatan (Opsional)</Label>
                <Input
                  placeholder="Contoh: Pembelian dari supplier"
                  value={stockNote}
                  onChange={(e) => setStockNote(e.target.value)}
                />
              </div>
              {stockQuantity && selectedMedicine && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="text-sm text-muted-foreground">Stok Setelah Update</div>
                  <div className="text-2xl font-bold text-primary">
                    {stockAction === "in" 
                      ? selectedMedicine.stock + parseInt(stockQuantity)
                      : selectedMedicine.stock - parseInt(stockQuantity)
                    } {selectedMedicine.unit}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStockDialog(false)}>
                Batal
              </Button>
              <Button onClick={handleStockUpdate}>
                {stockAction === "in" ? "Tambah" : "Kurangi"} Stok
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
