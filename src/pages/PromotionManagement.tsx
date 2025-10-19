import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit2, Trash2, Tag, CalendarIcon, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface Promotion {
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

export default function PromotionManagement() {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([
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
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [serviceSearch, setServiceSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    startDate: new Date(),
    endDate: new Date(),
    applicableServices: [] as string[],
    applicableMedicines: [] as string[],
    minPurchase: "",
    maxDiscount: "",
    isActive: true,
  });

  // Sample data
  const services = [
    { id: "s1", name: "Konsultasi Umum" },
    { id: "s2", name: "Konsultasi Gigi" },
    { id: "s3", name: "Scaling Gigi" },
    { id: "s4", name: "Cabut Gigi" },
  ];

  const medicines = [
    { id: "m1", name: "Paracetamol 500mg" },
    { id: "m2", name: "Amoxicillin 500mg" },
    { id: "m3", name: "Vitamin C" },
    { id: "m4", name: "OBH Combi" },
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.code || !formData.discountValue) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    const promotionData: Promotion = {
      id: editingPromotion?.id || `promo${Date.now()}`,
      name: formData.name,
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      startDate: formData.startDate,
      endDate: formData.endDate,
      applicableServices: formData.applicableServices,
      applicableMedicines: formData.applicableMedicines,
      minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : undefined,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      isActive: formData.isActive,
    };

    if (editingPromotion) {
      setPromotions(promotions.map(p => p.id === editingPromotion.id ? promotionData : p));
      toast({
        title: "Promosi diperbarui",
        description: `${promotionData.name} berhasil diperbarui`,
      });
    } else {
      setPromotions([...promotions, promotionData]);
      toast({
        title: "Promosi ditambahkan",
        description: `${promotionData.name} berhasil ditambahkan`,
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      code: promotion.code,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue.toString(),
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      applicableServices: promotion.applicableServices,
      applicableMedicines: promotion.applicableMedicines,
      minPurchase: promotion.minPurchase?.toString() || "",
      maxDiscount: promotion.maxDiscount?.toString() || "",
      isActive: promotion.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
    toast({
      title: "Promosi dihapus",
      description: "Promosi berhasil dihapus",
    });
  };

  const toggleActive = (id: string) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: "",
      startDate: new Date(),
      endDate: new Date(),
      applicableServices: [],
      applicableMedicines: [],
      minPurchase: "",
      maxDiscount: "",
      isActive: true,
    });
    setEditingPromotion(null);
    setServiceSearch("");
    setMedicineSearch("");
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableServices: prev.applicableServices.includes(serviceId)
        ? prev.applicableServices.filter(id => id !== serviceId)
        : [...prev.applicableServices, serviceId]
    }));
  };

  const toggleMedicine = (medicineId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableMedicines: prev.applicableMedicines.includes(medicineId)
        ? prev.applicableMedicines.filter(id => id !== medicineId)
        : [...prev.applicableMedicines, medicineId]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" userName="Admin Klinik" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Management Promosi</h1>
            <p className="text-muted-foreground">
              Kelola promosi dan diskon untuk layanan dan obat
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Promosi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPromotion ? "Edit Promosi" : "Tambah Promosi Baru"}
                </DialogTitle>
                <DialogDescription>
                  Lengkapi informasi promosi di bawah ini
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Promosi *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Diskon Akhir Tahun"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Kode Promosi *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      placeholder="NEWYEAR2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Tipe Diskon *</Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value: "percentage" | "fixed") => 
                        setFormData({...formData, discountType: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Persentase (%)</SelectItem>
                        <SelectItem value="fixed">Potongan Harga (Rp)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">
                      Nilai Diskon * {formData.discountType === "percentage" ? "(%)" : "(Rp)"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      placeholder={formData.discountType === "percentage" ? "10" : "50000"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tanggal Mulai *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : <span>Pilih tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => date && setFormData({...formData, startDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Berakhir *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : <span>Pilih tanggal</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => date && setFormData({...formData, endDate: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPurchase">Minimal Pembelian (Rp)</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  {formData.discountType === "percentage" && (
                    <div className="space-y-2">
                      <Label htmlFor="maxDiscount">Maksimal Diskon (Rp)</Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Berlaku untuk Layanan</Label>
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari layanan..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="border rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
                    {services
                      .filter(service => 
                        service.name.toLowerCase().includes(serviceSearch.toLowerCase())
                      )
                      .map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service.id}`}
                            checked={formData.applicableServices.includes(service.id)}
                            onCheckedChange={() => toggleService(service.id)}
                          />
                          <label
                            htmlFor={`service-${service.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {service.name}
                          </label>
                        </div>
                      ))}
                    {services.filter(service => 
                      service.name.toLowerCase().includes(serviceSearch.toLowerCase())
                    ).length === 0 && (
                      <p className="text-sm text-muted-foreground">Tidak ada layanan ditemukan</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Berlaku untuk Obat</Label>
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari obat..."
                      value={medicineSearch}
                      onChange={(e) => setMedicineSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="border rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
                    {medicines
                      .filter(medicine => 
                        medicine.name.toLowerCase().includes(medicineSearch.toLowerCase())
                      )
                      .map((medicine) => (
                        <div key={medicine.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`medicine-${medicine.id}`}
                            checked={formData.applicableMedicines.includes(medicine.id)}
                            onCheckedChange={() => toggleMedicine(medicine.id)}
                          />
                          <label
                            htmlFor={`medicine-${medicine.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {medicine.name}
                          </label>
                        </div>
                      ))}
                    {medicines.filter(medicine => 
                      medicine.name.toLowerCase().includes(medicineSearch.toLowerCase())
                    ).length === 0 && (
                      <p className="text-sm text-muted-foreground">Tidak ada obat ditemukan</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked as boolean})}
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aktifkan promosi
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleSubmit}>
                  {editingPromotion ? "Simpan Perubahan" : "Tambah Promosi"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Daftar Promosi
            </CardTitle>
            <CardDescription>
              Kelola semua promosi dan diskon yang tersedia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Promosi</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Diskon</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Berlaku Untuk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Belum ada promosi
                    </TableCell>
                  </TableRow>
                ) : (
                  promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{promotion.code}</Badge>
                      </TableCell>
                      <TableCell>
                        {promotion.discountType === "percentage" 
                          ? `${promotion.discountValue}%`
                          : formatRupiah(promotion.discountValue)
                        }
                        {promotion.maxDiscount && (
                          <span className="text-xs text-muted-foreground block">
                            Max: {formatRupiah(promotion.maxDiscount)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(promotion.startDate, "dd/MM/yyyy")} - {format(promotion.endDate, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-sm">
                        {promotion.applicableServices.length > 0 && (
                          <Badge variant="outline" className="mr-1">
                            {promotion.applicableServices.length} Layanan
                          </Badge>
                        )}
                        {promotion.applicableMedicines.length > 0 && (
                          <Badge variant="outline">
                            {promotion.applicableMedicines.length} Obat
                          </Badge>
                        )}
                        {promotion.applicableServices.length === 0 && promotion.applicableMedicines.length === 0 && (
                          <span className="text-muted-foreground">Semua</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={promotion.isActive ? "default" : "secondary"}>
                          {promotion.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleActive(promotion.id)}
                          >
                            {promotion.isActive ? "Nonaktifkan" : "Aktifkan"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(promotion)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(promotion.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
