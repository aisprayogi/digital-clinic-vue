import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Trash2, CreditCard, Banknote, Smartphone, Printer, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BillItem {
  id: string;
  name: string;
  type: "service" | "medicine";
  price: number;
  quantity: number;
  total: number;
}

export default function POS() {
  const { toast } = useToast();
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");

  // Sample data
  const services = [
    { id: "s1", name: "Konsultasi Umum", price: 50000 },
    { id: "s2", name: "Konsultasi Gigi", price: 75000 },
    { id: "s3", name: "Scaling Gigi", price: 200000 },
    { id: "s4", name: "Cabut Gigi", price: 150000 },
  ];

  const medicines = [
    { id: "m1", name: "Paracetamol 500mg", price: 5000, stock: 150 },
    { id: "m2", name: "Amoxicillin 500mg", price: 8000, stock: 28 },
    { id: "m3", name: "Vitamin C", price: 15000, stock: 32 },
    { id: "m4", name: "OBH Combi", price: 25000, stock: 45 },
  ];

  const addService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    setBillItems([...billItems, {
      id: `item-${Date.now()}-${Math.random()}`,
      name: service.name,
      type: "service",
      price: service.price,
      quantity: 1,
      total: service.price
    }]);

    toast({
      title: "Item ditambahkan",
      description: `${service.name} ditambahkan ke keranjang`,
    });
  };

  const addMedicine = (medicineId: string, qty: number = 1) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;

    if (qty > medicine.stock) {
      toast({
        title: "Stok tidak cukup",
        description: `Stok ${medicine.name} hanya tersedia ${medicine.stock}`,
        variant: "destructive"
      });
      return;
    }

    setBillItems([...billItems, {
      id: `item-${Date.now()}-${Math.random()}`,
      name: medicine.name,
      type: "medicine",
      price: medicine.price,
      quantity: qty,
      total: medicine.price * qty
    }]);

    toast({
      title: "Item ditambahkan",
      description: `${medicine.name} (${qty}x) ditambahkan ke keranjang`,
    });
  };

  const removeItem = (itemId: string) => {
    setBillItems(billItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setBillItems(billItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQty, total: item.price * newQty }
        : item
    ));
  };

  const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const change = amountPaid ? parseFloat(amountPaid) - total : 0;

  const handleProcessPayment = () => {
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Silakan pilih pasien terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    if (billItems.length === 0) {
      toast({
        title: "Error",
        description: "Belum ada item dalam tagihan",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === "cash" && parseFloat(amountPaid) < total) {
      toast({
        title: "Error",
        description: "Jumlah bayar kurang dari total tagihan",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pembayaran Berhasil",
      description: `Tagihan sebesar ${formatRupiah(total)} telah diproses`,
    });

    // Reset form
    setBillItems([]);
    setSelectedPatient("");
    setAmountPaid("");
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" userName="Admin Klinik" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Point of Sale (Kasir)</h1>
          <p className="text-muted-foreground">
            Proses pembayaran dan tagihan pasien
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Pilih Pasien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cari nama atau nomor rekam medis pasien" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">Ahmad Rizki - RM001</SelectItem>
                    <SelectItem value="p2">Siti Nurhaliza - RM002</SelectItem>
                    <SelectItem value="p3">Dewi Lestari - RM003</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Add Service */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tambah Layanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari layanan..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                  {filteredServices.map((service) => (
                    <Button
                      key={service.id}
                      variant="outline"
                      className="justify-start h-auto p-4 hover:bg-primary/10 active:scale-95 transition-all touch-manipulation"
                      onClick={() => addService(service.id)}
                    >
                      <div className="text-left w-full">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{formatRupiah(service.price)}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add Medicine */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tambah Obat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari obat..."
                    value={medicineSearch}
                    onChange={(e) => setMedicineSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {filteredMedicines.map((medicine) => (
                    <div key={medicine.id} className="flex items-center gap-2 p-3 border rounded-lg hover:border-primary transition-colors">
                      <button
                        type="button"
                        className="flex-1 text-left touch-manipulation active:scale-98 transition-transform"
                        onClick={() => addMedicine(medicine.id, 1)}
                      >
                        <div className="font-medium">{medicine.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatRupiah(medicine.price)} • Stok: {medicine.stock}
                        </div>
                      </button>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max={medicine.stock}
                          placeholder="Qty"
                          className="w-16 h-9 text-center touch-manipulation"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const qty = parseInt((e.target as HTMLInputElement).value);
                              if (qty > 0) {
                                addMedicine(medicine.id, qty);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="h-9 touch-manipulation active:scale-95 transition-transform"
                          onClick={(e) => {
                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                            const qty = parseInt(input.value);
                            if (qty > 0) {
                              addMedicine(medicine.id, qty);
                              input.value = '';
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bill & Payment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Tagihan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {billItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada item dalam tagihan
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {billItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-2 p-2 border rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatRupiah(item.price)} x {item.quantity}
                            </div>
                          </div>
                          <div className="text-sm font-medium">{formatRupiah(item.total)}</div>
                          {item.type === "medicine" && (
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-14 h-8 text-xs"
                            />
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatRupiah(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">PPN (10%)</span>
                        <span>{formatRupiah(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">{formatRupiah(total)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {billItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pilih Metode</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={paymentMethod === "cash" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("cash")}
                        className="flex-col h-auto py-3"
                      >
                        <Banknote className="h-5 w-5 mb-1" />
                        <span className="text-xs">Tunai</span>
                      </Button>
                      <Button
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("card")}
                        className="flex-col h-auto py-3"
                      >
                        <CreditCard className="h-5 w-5 mb-1" />
                        <span className="text-xs">Kartu</span>
                      </Button>
                      <Button
                        variant={paymentMethod === "transfer" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("transfer")}
                        className="flex-col h-auto py-3"
                      >
                        <Smartphone className="h-5 w-5 mb-1" />
                        <span className="text-xs">Transfer</span>
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === "cash" && (
                    <>
                      <div className="space-y-2">
                        <Label>Jumlah Bayar</Label>
                        <Input
                          type="number"
                          placeholder="Masukkan jumlah bayar"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                        />
                      </div>
                      {amountPaid && parseFloat(amountPaid) >= total && (
                        <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                          <div className="text-sm text-muted-foreground">Kembalian</div>
                          <div className="text-xl font-bold text-success">{formatRupiah(change)}</div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-2 pt-4">
                    <Button className="w-full" size="lg" onClick={handleProcessPayment}>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proses Pembayaran
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Printer className="mr-2 h-4 w-4" />
                      Cetak Struk
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
