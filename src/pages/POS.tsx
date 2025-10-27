import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, CreditCard, Banknote, Smartphone, ShoppingCart, Tag, Ticket, Save, FolderOpen, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DraftTransactionsDialog } from "@/components/DraftTransactionsDialog";
import { DiscountDialog } from "@/components/DiscountDialog";
import { ItemSelectionDialog } from "@/components/ItemSelectionDialog";
import { VoucherSelectionDialog } from "@/components/VoucherSelectionDialog";
import type { PatientVoucher } from "./VoucherManagement";
import type { DraftTransaction } from "@/types/cashier";

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
  const location = useLocation();
  const sessionId = location.state?.sessionId;
  
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [customerType, setCustomerType] = useState<"patient" | "walk-in">("patient");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [walkInName, setWalkInName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [discountType, setDiscountType] = useState<"none" | "percentage" | "fixed" | "promotion">("none");
  const [discountValue, setDiscountValue] = useState("");
  const [discountNote, setDiscountNote] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState<string>("");
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<string>("");
  const [patientVouchers, setPatientVouchers] = useState<PatientVoucher[]>([]);
  const [draftTransactions, setDraftTransactions] = useState<DraftTransaction[]>([]);
  const [showDraftsDialog, setShowDraftsDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showVoucherDialog, setShowVoucherDialog] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  // Sample promotions
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

  const allPatientVouchers: PatientVoucher[] = [
    {
      id: "pv1",
      patientId: "p1",
      patientName: "Budi Santoso",
      packageId: "pkg1",
      packageName: "Paket Scaling 5x",
      remainingSessions: 3,
      totalSessions: 5,
      purchaseDate: new Date(2024, 0, 15),
      expiryDate: new Date(2024, 6, 15),
      isActive: true,
    },
    {
      id: "pv2",
      patientId: "p2",
      patientName: "Siti Nurhaliza",
      packageId: "pkg2",
      packageName: "Paket Konsultasi Umum 10x",
      remainingSessions: 8,
      totalSessions: 10,
      purchaseDate: new Date(2024, 1, 1),
      expiryDate: new Date(2025, 1, 1),
      isActive: true,
    },
  ];

  // Update patient vouchers when patient changes
  useEffect(() => {
    if (selectedPatient) {
      const vouchers = allPatientVouchers.filter(v => 
        v.patientId === selectedPatient && 
        v.isActive && 
        v.remainingSessions > 0 &&
        new Date() <= v.expiryDate
      );
      setPatientVouchers(vouchers);
    } else {
      setPatientVouchers([]);
    }
    setSelectedVoucher("");
  }, [selectedPatient]);

  const addService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

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
    if (discountType === "promotion" && appliedPromotion) return;
    if (discountType !== "none") return;

    const now = new Date();
    const activePromotions = promotions.filter(promo => {
      if (!promo.isActive) return false;
      if (now < promo.startDate || now > promo.endDate) return false;
      
      const hasApplicableItems = billItems.some(item => {
        if (item.type === "service" && promo.applicableServices.length > 0) {
          const serviceId = services.find(s => s.name === item.name)?.id;
          return serviceId && promo.applicableServices.includes(serviceId);
        }
        if (item.type === "medicine" && promo.applicableMedicines.length > 0) {
          const medicineId = medicines.find(m => m.name === item.name)?.id;
          return medicineId && promo.applicableMedicines.includes(medicineId);
        }
        return promo.applicableServices.length === 0 && promo.applicableMedicines.length === 0;
      });

      if (!hasApplicableItems) return false;

      const currentSubtotal = billItems.reduce((sum, item) => sum + item.total, 0);
      if (promo.minPurchase && currentSubtotal < promo.minPurchase) return false;

      return true;
    });

    if (activePromotions.length > 0) {
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

  const handleSaveDraft = () => {
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
        description: "Belum ada item untuk disimpan",
        variant: "destructive"
      });
      return;
    }

    const draft: DraftTransaction = {
      id: currentDraftId || `draft-${Date.now()}`,
      draftNumber: currentDraftId 
        ? draftTransactions.find(d => d.id === currentDraftId)?.draftNumber || `D${Date.now()}`
        : `D${Date.now()}`,
      sessionId: sessionId || 'no-session',
      customerType,
      customerId: customerType === "patient" ? selectedPatient : undefined,
      customerName: customerType === "patient" 
        ? `Pasien - ${selectedPatient}` 
        : walkInName,
      items: billItems.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        price: item.price,
        quantity: item.quantity,
        total: item.total
      })),
      subtotal,
      tax,
      discount,
      discountType,
      discountNote,
      total,
      createdAt: currentDraftId 
        ? draftTransactions.find(d => d.id === currentDraftId)?.createdAt || new Date()
        : new Date(),
      updatedAt: new Date()
    };

    if (currentDraftId) {
      setDraftTransactions(drafts => 
        drafts.map(d => d.id === currentDraftId ? draft : d)
      );
    } else {
      setDraftTransactions(drafts => [...drafts, draft]);
    }

    toast({
      title: "Draft Disimpan",
      description: `Transaksi ${draft.draftNumber} berhasil disimpan`,
    });

    resetForm();
  };

  const handleLoadDraft = (draft: DraftTransaction) => {
    setCustomerType(draft.customerType);
    if (draft.customerType === "patient") {
      setSelectedPatient(draft.customerId || "");
    } else {
      setWalkInName(draft.customerName);
    }
    setBillItems(draft.items.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      price: item.price,
      quantity: item.quantity,
      total: item.total
    })));
    setDiscountType(draft.discountType || "none");
    setDiscountNote(draft.discountNote || "");
    setCurrentDraftId(draft.id);

    toast({
      title: "Draft Dimuat",
      description: `Transaksi ${draft.draftNumber} berhasil dimuat`,
    });
  };

  const handleDeleteDraft = (draftId: string) => {
    setDraftTransactions(drafts => drafts.filter(d => d.id !== draftId));
    if (currentDraftId === draftId) {
      resetForm();
    }
    toast({
      title: "Draft Dihapus",
      description: "Draft transaksi berhasil dihapus",
    });
  };

  const resetForm = () => {
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
    setSelectedVoucher("");
    setCurrentDraftId(null);
  };

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

    if (selectedVoucher) {
      const voucher = patientVouchers.find(v => v.id === selectedVoucher);
      if (voucher) {
        console.log(`Reducing voucher ${voucher.id} by 1 session`);
      }
    }

    if (currentDraftId) {
      setDraftTransactions(drafts => drafts.filter(d => d.id !== currentDraftId));
    }

    resetForm();
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const applyPromoCode = (code: string) => {
    const promo = promotions.find(p => 
      p.code.toUpperCase() === code.toUpperCase() && 
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

  const handleDiscountChange = (
    type: "none" | "percentage" | "fixed" | "promotion",
    value: string,
    note: string,
    promo?: Promotion
  ) => {
    setDiscountType(type);
    setDiscountValue(value);
    setDiscountNote(note);
    if (promo) {
      setAppliedPromotion(promo);
      setSelectedPromotion(promo.id);
    }
  };

  const availablePromotions = promotions.filter(promo => {
    if (!promo.isActive) return false;
    const now = new Date();
    if (now < promo.startDate || now > promo.endDate) return false;
    if (promo.minPurchase && subtotal < promo.minPurchase) return false;
    return true;
  });

  const voucherCount = patientVouchers.length;
  const hasDiscount = discount > 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar userRole="admin" userName="Admin Klinik" />
      
      {/* Fixed Single Page Layout - No Scroll */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header - Fixed */}
          <div className="border-b bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1>
                <p className="text-sm text-muted-foreground">Kasir</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDraftsDialog(true)}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Draft ({draftTransactions.length})
                </Button>
                {billItems.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {currentDraftId ? "Update" : "Simpan"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Grid Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
            {/* Left Section - Customer & Actions */}
            <div className="flex flex-col gap-4 overflow-hidden">
              {/* Customer Selection */}
              <Card className="shrink-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Pembeli
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={customerType === "patient" ? "default" : "outline"}
                      onClick={() => setCustomerType("patient")}
                    >
                      Pasien
                    </Button>
                    <Button
                      size="sm"
                      variant={customerType === "walk-in" ? "default" : "outline"}
                      onClick={() => setCustomerType("walk-in")}
                    >
                      Umum
                    </Button>
                  </div>

                  {customerType === "patient" ? (
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Pilih pasien" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p1">Ahmad Rizki - RM001</SelectItem>
                        <SelectItem value="p2">Siti Nurhaliza - RM002</SelectItem>
                        <SelectItem value="p3">Dewi Lestari - RM003</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      className="h-9"
                      placeholder="Nama pembeli"
                      value={walkInName}
                      onChange={(e) => setWalkInName(e.target.value)}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="pb-3 shrink-0">
                  <CardTitle className="text-sm">Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-2 overflow-auto">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => setShowItemDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Item
                  </Button>
                  
                  {customerType === "patient" && voucherCount > 0 && (
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => setShowVoucherDialog(true)}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      Voucher ({voucherCount})
                      {selectedVoucher && <Badge className="ml-auto" variant="default">Aktif</Badge>}
                    </Button>
                  )}

                  {billItems.length > 0 && (
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => setShowDiscountDialog(true)}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      Diskon & Promo
                      {hasDiscount && <Badge className="ml-auto" variant="default">Aktif</Badge>}
                    </Button>
                  )}

                  {appliedPromotion && discountType === "promotion" && !selectedPromotion && (
                    <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg text-xs">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">Promo Otomatis</div>
                          <div className="text-muted-foreground">{appliedPromotion.name}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Middle Section - Bill Items */}
            <div className="flex flex-col overflow-hidden">
              <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="pb-3 shrink-0">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Tagihan ({billItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                  {billItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center py-8 text-muted-foreground text-sm">
                      Belum ada item
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto px-6 pb-4">
                      <div className="space-y-2">
                        {billItems.map((item) => (
                          <div key={item.id} className="flex items-start gap-2 p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{item.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatRupiah(item.price)} × {item.quantity}
                              </div>
                            </div>
                            <div className="text-sm font-medium shrink-0">{formatRupiah(item.total)}</div>
                            {item.type === "medicine" && (
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-12 h-7 text-xs shrink-0"
                              />
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 shrink-0"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Section - Summary & Payment */}
            <div className="flex flex-col gap-4 overflow-hidden">
              {/* Summary */}
              <Card className="shrink-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Ringkasan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
                      <span>Diskon</span>
                      <span>-{formatRupiah(discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">{formatRupiah(total)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              {billItems.length > 0 && (
                <Card className="flex-1 flex flex-col overflow-hidden">
                  <CardHeader className="pb-3 shrink-0">
                    <CardTitle className="text-sm">Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3 overflow-auto">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        size="sm"
                        variant={paymentMethod === "cash" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("cash")}
                        className="flex-col h-auto py-2"
                      >
                        <Banknote className="h-4 w-4 mb-1" />
                        <span className="text-xs">Tunai</span>
                      </Button>
                      <Button
                        size="sm"
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("card")}
                        className="flex-col h-auto py-2"
                      >
                        <CreditCard className="h-4 w-4 mb-1" />
                        <span className="text-xs">Kartu</span>
                      </Button>
                      <Button
                        size="sm"
                        variant={paymentMethod === "transfer" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("transfer")}
                        className="flex-col h-auto py-2"
                      >
                        <Smartphone className="h-4 w-4 mb-1" />
                        <span className="text-xs">Transfer</span>
                      </Button>
                    </div>

                    {paymentMethod === "cash" && (
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Jumlah bayar"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                          className="h-9"
                        />
                        {change > 0 && (
                          <div className="p-2 bg-success/10 border border-success/20 rounded text-xs">
                            <div className="flex justify-between font-medium">
                              <span>Kembalian:</span>
                              <span className="text-success">{formatRupiah(change)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      className="w-full mt-auto"
                      onClick={handleProcessPayment}
                      disabled={billItems.length === 0}
                    >
                      Proses Pembayaran
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <DraftTransactionsDialog
        open={showDraftsDialog}
        onOpenChange={setShowDraftsDialog}
        drafts={draftTransactions}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
      />

      <DiscountDialog
        open={showDiscountDialog}
        onOpenChange={setShowDiscountDialog}
        discountType={discountType}
        discountValue={discountValue}
        discountNote={discountNote}
        promoCode={promoCode}
        selectedPromotion={selectedPromotion}
        appliedPromotion={appliedPromotion}
        availablePromotions={availablePromotions}
        subtotal={subtotal}
        onDiscountChange={handleDiscountChange}
        onPromoCodeApply={applyPromoCode}
        formatRupiah={formatRupiah}
      />

      <ItemSelectionDialog
        open={showItemDialog}
        onOpenChange={setShowItemDialog}
        services={services}
        medicines={medicines}
        customerType={customerType}
        onAddService={addService}
        onAddMedicine={addMedicine}
        formatRupiah={formatRupiah}
      />

      <VoucherSelectionDialog
        open={showVoucherDialog}
        onOpenChange={setShowVoucherDialog}
        vouchers={patientVouchers}
        selectedVoucher={selectedVoucher}
        onSelectVoucher={setSelectedVoucher}
      />
    </div>
  );
}
