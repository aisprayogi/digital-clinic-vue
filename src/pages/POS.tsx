import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Trash2, CreditCard, Banknote, Smartphone, Printer, ShoppingCart, Tag, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [customerType, setCustomerType] = useState<"patient" | "walk-in">("patient");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [walkInName, setWalkInName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [discountType, setDiscountType] = useState<"none" | "percentage" | "fixed" | "promotion">("none");
  const [discountValue, setDiscountValue] = useState("");
  const [discountNote, setDiscountNote] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState<string>("");
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);
  const [promoCode, setPromoCode] = useState("");

  // Sample promotions - same as in PromotionManagement
  const promotions: Promotion[] = [
    {
      id: "promo1",
      name: "Diskon Lebaran",
      code: "LEBARAN2024",
      discountType: "percentage",
      discountValue: 15,
      startDate: new Date(2024, 3, 1),
      endDate: new Date(2024, 3, 30),
      applicableServices: ["s1", "s2"],
      applicableMedicines: [],
      minPurchase: 100000,
      maxDiscount: 50000,
      isActive: true,
    },
    {
      id: "promo2",
      name: "Diskon Obat",
      code: "OBAT50",
      discountType: "fixed",
      discountValue: 50000,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      applicableServices: [],
      applicableMedicines: ["m1", "m2", "m3"],
      minPurchase: 200000,
      isActive: true,
    },
  ];

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

    // Check if item already exists
    const existingItem = billItems.find(item => item.name === service.name && item.type === "service");
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
      toast({
        title: "Jumlah diperbarui",
        description: `${service.name} (${existingItem.quantity + 1}x)`,
      });
      return;
    }

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

    // Check if item already exists
    const existingItem = billItems.find(item => item.name === medicine.name && item.type === "medicine");
    const newQty = existingItem ? existingItem.quantity + qty : qty;

    if (newQty > medicine.stock) {
      toast({
        title: "Stok tidak cukup",
        description: `Stok ${medicine.name} hanya tersedia ${medicine.stock}`,
        variant: "destructive"
      });
      return;
    }

    if (existingItem) {
      updateQuantity(existingItem.id, newQty);
      toast({
        title: "Jumlah diperbarui",
        description: `${medicine.name} (${newQty}x)`,
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

  // Check for applicable automatic promotions
  useEffect(() => {
    if (discountType === "promotion" && appliedPromotion) return; // Don't auto-apply if manually selected
    if (discountType !== "none") return; // Don't auto-apply if manual discount is set

    const now = new Date();
    const activePromotions = promotions.filter(promo => {
      if (!promo.isActive) return false;
      if (now < promo.startDate || now > promo.endDate) return false;
      
      // Check if promo applies to current items
      const hasApplicableItems = billItems.some(item => {
        if (item.type === "service" && promo.applicableServices.length > 0) {
          const serviceId = services.find(s => s.name === item.name)?.id;
          return serviceId && promo.applicableServices.includes(serviceId);
        }
        if (item.type === "medicine" && promo.applicableMedicines.length > 0) {
          const medicineId = medicines.find(m => m.name === item.name)?.id;
          return medicineId && promo.applicableMedicines.includes(medicineId);
        }
        // If promo has no specific items, it applies to all
        return promo.applicableServices.length === 0 && promo.applicableMedicines.length === 0;
      });

      if (!hasApplicableItems) return false;

      // Check minimum purchase
      const currentSubtotal = billItems.reduce((sum, item) => sum + item.total, 0);
      if (promo.minPurchase && currentSubtotal < promo.minPurchase) return false;

      return true;
    });

    // Apply the best promotion automatically
    if (activePromotions.length > 0) {
      // Sort by highest discount value
      const bestPromo = activePromotions.sort((a, b) => {
        const aDiscount = a.discountType === "percentage" 
          ? subtotal * (a.discountValue / 100) 
          : a.discountValue;
        const bDiscount = b.discountType === "percentage" 
          ? subtotal * (b.discountValue / 100) 
          : b.discountValue;
        return bDiscount - aDiscount;
      })[0];

      setAppliedPromotion(bestPromo);
      setDiscountType("promotion");
      setDiscountNote(`${bestPromo.name} (Otomatis)`);
    } else {
      setAppliedPromotion(null);
    }
  }, [billItems, discountType]);

  const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1;
  
  let discount = 0;
  if (discountType === "promotion" && appliedPromotion) {
    if (appliedPromotion.discountType === "percentage") {
      discount = subtotal * (appliedPromotion.discountValue / 100);
      if (appliedPromotion.maxDiscount && discount > appliedPromotion.maxDiscount) {
        discount = appliedPromotion.maxDiscount;
      }
    } else {
      discount = appliedPromotion.discountValue;
    }
  } else if (discountType === "percentage" && discountValue) {
    discount = subtotal * (parseFloat(discountValue) / 100);
  } else if (discountType === "fixed" && discountValue) {
    discount = parseFloat(discountValue);
  }
  
  const total = subtotal + tax - discount;
  const change = amountPaid ? parseFloat(amountPaid) - total : 0;

  const handleProcessPayment = () => {
    if (customerType === "patient" && !selectedPatient) {
      toast({
        title: "Error",
        description: "Silakan pilih pasien terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    if (customerType === "walk-in" && !walkInName.trim()) {
      toast({
        title: "Error",
        description: "Silakan masukkan nama pembeli",
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
    setWalkInName("");
    setAmountPaid("");
    setDiscountType("none");
    setDiscountValue("");
    setDiscountNote("");
    setAppliedPromotion(null);
    setSelectedPromotion("");
    setPromoCode("");
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

  const applyPromoCode = () => {
    const promo = promotions.find(p => 
      p.code.toUpperCase() === promoCode.toUpperCase() && 
      p.isActive &&
      new Date() >= p.startDate &&
      new Date() <= p.endDate
    );

    if (!promo) {
      toast({
        title: "Kode promo tidak valid",
        description: "Kode promo tidak ditemukan atau sudah tidak berlaku",
        variant: "destructive",
      });
      return;
    }

    // Check minimum purchase
    if (promo.minPurchase && subtotal < promo.minPurchase) {
      toast({
        title: "Minimum pembelian belum terpenuhi",
        description: `Minimum pembelian untuk promo ini adalah ${formatRupiah(promo.minPurchase)}`,
        variant: "destructive",
      });
      return;
    }

    setAppliedPromotion(promo);
    setDiscountType("promotion");
    setDiscountNote(`${promo.name} (${promo.code})`);
    setPromoCode("");
    
    toast({
      title: "Promo diterapkan",
      description: `${promo.name} berhasil diterapkan`,
    });
  };

  const availablePromotions = promotions.filter(promo => {
    if (!promo.isActive) return false;
    const now = new Date();
    if (now < promo.startDate || now > promo.endDate) return false;
    if (promo.minPurchase && subtotal < promo.minPurchase) return false;
    return true;
  });

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
            {/* Customer Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Data Pembeli
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={customerType === "patient" ? "default" : "outline"}
                    onClick={() => setCustomerType("patient")}
                    className="touch-manipulation"
                  >
                    Pasien
                  </Button>
                  <Button
                    variant={customerType === "walk-in" ? "default" : "outline"}
                    onClick={() => setCustomerType("walk-in")}
                    className="touch-manipulation"
                  >
                    Pembeli Umum
                  </Button>
                </div>

                {customerType === "patient" ? (
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
                ) : (
                  <Input
                    placeholder="Nama pembeli"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Add Service - Only for patients */}
            {customerType === "patient" && (
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
            )}

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
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-success">
                          <span>Diskon {discountNote && `(${discountNote})`}</span>
                          <span>-{formatRupiah(discount)}</span>
                        </div>
                      )}
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
              <>
                {/* Discount Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Diskon & Promo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Auto-applied promotion notice */}
                    {appliedPromotion && discountType === "promotion" && !selectedPromotion && (
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-2">
                        <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">Promo Otomatis Diterapkan!</div>
                          <div className="text-xs text-muted-foreground">{appliedPromotion.name}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setDiscountType("none");
                            setAppliedPromotion(null);
                            setDiscountNote("");
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Tipe Diskon</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={discountType === "none" ? "default" : "outline"}
                          onClick={() => {
                            setDiscountType("none");
                            setDiscountValue("");
                            setDiscountNote("");
                            setAppliedPromotion(null);
                          }}
                          className="touch-manipulation"
                          size="sm"
                        >
                          Tidak Ada
                        </Button>
                        <Button
                          variant={discountType === "promotion" ? "default" : "outline"}
                          onClick={() => {
                            setDiscountType("promotion");
                            setDiscountValue("");
                          }}
                          className="touch-manipulation"
                          size="sm"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          Promo
                        </Button>
                        <Button
                          variant={discountType === "percentage" ? "default" : "outline"}
                          onClick={() => {
                            setDiscountType("percentage");
                            setAppliedPromotion(null);
                          }}
                          className="touch-manipulation"
                          size="sm"
                        >
                          Persentase
                        </Button>
                        <Button
                          variant={discountType === "fixed" ? "default" : "outline"}
                          onClick={() => {
                            setDiscountType("fixed");
                            setAppliedPromotion(null);
                          }}
                          className="touch-manipulation"
                          size="sm"
                        >
                          Nominal
                        </Button>
                      </div>
                    </div>

                    {discountType === "promotion" && (
                      <>
                        <div className="space-y-2">
                          <Label>Pilih Promo</Label>
                          <Select
                            value={selectedPromotion}
                            onValueChange={(value) => {
                              setSelectedPromotion(value);
                              const promo = promotions.find(p => p.id === value);
                              if (promo) {
                                setAppliedPromotion(promo);
                                setDiscountNote(`${promo.name} (${promo.code})`);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih promo yang tersedia" />
                            </SelectTrigger>
                            <SelectContent>
                              {availablePromotions.map((promo) => (
                                <SelectItem key={promo.id} value={promo.id}>
                                  {promo.name} - {promo.discountType === "percentage" 
                                    ? `${promo.discountValue}%` 
                                    : formatRupiah(promo.discountValue)
                                  }
                                </SelectItem>
                              ))}
                              {availablePromotions.length === 0 && (
                                <SelectItem value="none" disabled>Tidak ada promo tersedia</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="relative">
                          <Label>Atau Masukkan Kode Promo</Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              placeholder="Masukkan kode promo"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  applyPromoCode();
                                }
                              }}
                            />
                            <Button onClick={applyPromoCode} className="touch-manipulation">
                              Terapkan
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {(discountType === "percentage" || discountType === "fixed") && (
                      <>
                        <div className="space-y-2">
                          <Label>
                            Nilai Diskon {discountType === "percentage" ? "(%)" : "(Rp)"}
                          </Label>
                          <Input
                            type="number"
                            placeholder={discountType === "percentage" ? "0-100" : "Nominal"}
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            max={discountType === "percentage" ? "100" : undefined}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Catatan Diskon (Opsional)</Label>
                          <Input
                            placeholder="Contoh: Promo Hari Raya, Member VIP"
                            value={discountNote}
                            onChange={(e) => setDiscountNote(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {discount > 0 && (
                      <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Diskon</div>
                        <div className="text-xl font-bold text-success">{formatRupiah(discount)}</div>
                        {appliedPromotion && appliedPromotion.maxDiscount && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Maks. {formatRupiah(appliedPromotion.maxDiscount)}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
