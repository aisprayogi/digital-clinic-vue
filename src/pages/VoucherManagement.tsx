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
import { Plus, Edit2, Trash2, Ticket, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface VoucherPackage {
  id: string;
  name: string;
  description: string;
  services: string[]; // service IDs
  totalSessions: number;
  price: number;
  validityDays: number; // masa berlaku dalam hari
  isActive: boolean;
}

export interface PatientVoucher {
  id: string;
  patientId: string;
  patientName: string;
  packageId: string;
  packageName: string;
  remainingSessions: number;
  totalSessions: number;
  purchaseDate: Date;
  expiryDate: Date;
  isActive: boolean;
}

export default function VoucherManagement() {
  const { toast } = useToast();
  
  const [packages, setPackages] = useState<VoucherPackage[]>([
    {
      id: "pkg1",
      name: "Paket Scaling 5x",
      description: "Paket scaling gigi 5 kali kunjungan",
      services: ["s3"],
      totalSessions: 5,
      price: 400000,
      validityDays: 180,
      isActive: true,
    },
    {
      id: "pkg2",
      name: "Paket Konsultasi Umum 10x",
      description: "Paket konsultasi umum 10 kali kunjungan",
      services: ["s1"],
      totalSessions: 10,
      price: 350000,
      validityDays: 365,
      isActive: true,
    },
  ]);

  const [patientVouchers, setPatientVouchers] = useState<PatientVoucher[]>([
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
  ]);

  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<VoucherPackage | null>(null);
  const [serviceSearch, setServiceSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  const [packageFormData, setPackageFormData] = useState({
    name: "",
    description: "",
    services: [] as string[],
    totalSessions: "",
    price: "",
    validityDays: "",
    isActive: true,
  });

  const [voucherFormData, setVoucherFormData] = useState({
    patientId: "",
    patientName: "",
    packageId: "",
  });

  // Sample data
  const services = [
    { id: "s1", name: "Konsultasi Umum", price: 50000 },
    { id: "s2", name: "Konsultasi Gigi", price: 75000 },
    { id: "s3", name: "Scaling Gigi", price: 100000 },
    { id: "s4", name: "Cabut Gigi", price: 150000 },
  ];

  const patients = [
    { id: "p1", name: "Budi Santoso" },
    { id: "p2", name: "Siti Nurhaliza" },
    { id: "p3", name: "Ahmad Yani" },
    { id: "p4", name: "Dewi Sartika" },
  ];

  const handleSubmitPackage = () => {
    if (!packageFormData.name || !packageFormData.totalSessions || !packageFormData.price) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    if (packageFormData.services.length === 0) {
      toast({
        title: "Error",
        description: "Pilih minimal satu layanan untuk paket",
        variant: "destructive",
      });
      return;
    }

    const packageData: VoucherPackage = {
      id: editingPackage?.id || `pkg${Date.now()}`,
      name: packageFormData.name,
      description: packageFormData.description,
      services: packageFormData.services,
      totalSessions: parseInt(packageFormData.totalSessions),
      price: parseFloat(packageFormData.price),
      validityDays: packageFormData.validityDays ? parseInt(packageFormData.validityDays) : 365,
      isActive: packageFormData.isActive,
    };

    if (editingPackage) {
      setPackages(packages.map(p => p.id === editingPackage.id ? packageData : p));
      toast({
        title: "Paket diperbarui",
        description: `${packageData.name} berhasil diperbarui`,
      });
    } else {
      setPackages([...packages, packageData]);
      toast({
        title: "Paket ditambahkan",
        description: `${packageData.name} berhasil ditambahkan`,
      });
    }

    resetPackageForm();
    setIsPackageDialogOpen(false);
  };

  const handleSubmitVoucher = () => {
    if (!voucherFormData.patientId || !voucherFormData.packageId) {
      toast({
        title: "Error",
        description: "Pilih pasien dan paket voucher",
        variant: "destructive",
      });
      return;
    }

    const selectedPackage = packages.find(p => p.id === voucherFormData.packageId);
    const selectedPatient = patients.find(p => p.id === voucherFormData.patientId);

    if (!selectedPackage || !selectedPatient) return;

    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + selectedPackage.validityDays);

    const voucherData: PatientVoucher = {
      id: `pv${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      remainingSessions: selectedPackage.totalSessions,
      totalSessions: selectedPackage.totalSessions,
      purchaseDate,
      expiryDate,
      isActive: true,
    };

    setPatientVouchers([...patientVouchers, voucherData]);
    toast({
      title: "Voucher diterbitkan",
      description: `Voucher ${selectedPackage.name} untuk ${selectedPatient.name} berhasil diterbitkan`,
    });

    resetVoucherForm();
    setIsVoucherDialogOpen(false);
  };

  const handleEditPackage = (pkg: VoucherPackage) => {
    setEditingPackage(pkg);
    setPackageFormData({
      name: pkg.name,
      description: pkg.description,
      services: pkg.services,
      totalSessions: pkg.totalSessions.toString(),
      price: pkg.price.toString(),
      validityDays: pkg.validityDays.toString(),
      isActive: pkg.isActive,
    });
    setIsPackageDialogOpen(true);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
    toast({
      title: "Paket dihapus",
      description: "Paket berhasil dihapus",
    });
  };

  const togglePackageActive = (id: string) => {
    setPackages(packages.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const toggleVoucherActive = (id: string) => {
    setPatientVouchers(patientVouchers.map(v => 
      v.id === id ? { ...v, isActive: !v.isActive } : v
    ));
  };

  const resetPackageForm = () => {
    setPackageFormData({
      name: "",
      description: "",
      services: [],
      totalSessions: "",
      price: "",
      validityDays: "",
      isActive: true,
    });
    setEditingPackage(null);
    setServiceSearch("");
  };

  const resetVoucherForm = () => {
    setVoucherFormData({
      patientId: "",
      patientName: "",
      packageId: "",
    });
    setPatientSearch("");
  };

  const toggleService = (serviceId: string) => {
    setPackageFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" userName="Admin Klinik" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Management Paket Voucher</h1>
          <p className="text-muted-foreground">
            Kelola paket layanan voucher untuk pasien
          </p>
        </div>

        {/* Package Management Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Daftar Paket Voucher
              </CardTitle>
              <CardDescription>Kelola paket layanan yang tersedia</CardDescription>
            </div>
            <Dialog open={isPackageDialogOpen} onOpenChange={(open) => {
              setIsPackageDialogOpen(open);
              if (!open) resetPackageForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Paket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPackage ? "Edit Paket Voucher" : "Tambah Paket Voucher Baru"}
                  </DialogTitle>
                  <DialogDescription>
                    Lengkapi informasi paket voucher di bawah ini
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageName">Nama Paket *</Label>
                    <Input
                      id="packageName"
                      value={packageFormData.name}
                      onChange={(e) => setPackageFormData({...packageFormData, name: e.target.value})}
                      placeholder="Paket Scaling 5x"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packageDescription">Deskripsi</Label>
                    <Input
                      id="packageDescription"
                      value={packageFormData.description}
                      onChange={(e) => setPackageFormData({...packageFormData, description: e.target.value})}
                      placeholder="Deskripsi paket"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalSessions">Jumlah Sesi *</Label>
                      <Input
                        id="totalSessions"
                        type="number"
                        value={packageFormData.totalSessions}
                        onChange={(e) => setPackageFormData({...packageFormData, totalSessions: e.target.value})}
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packagePrice">Harga Paket (Rp) *</Label>
                      <Input
                        id="packagePrice"
                        type="number"
                        value={packageFormData.price}
                        onChange={(e) => setPackageFormData({...packageFormData, price: e.target.value})}
                        placeholder="500000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validityDays">Masa Berlaku (Hari)</Label>
                    <Input
                      id="validityDays"
                      type="number"
                      value={packageFormData.validityDays}
                      onChange={(e) => setPackageFormData({...packageFormData, validityDays: e.target.value})}
                      placeholder="365"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Layanan yang Termasuk *</Label>
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
                          <div key={service.id} className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`pkg-service-${service.id}`}
                                checked={packageFormData.services.includes(service.id)}
                                onCheckedChange={() => toggleService(service.id)}
                              />
                              <label
                                htmlFor={`pkg-service-${service.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {service.name}
                              </label>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatRupiah(service.price)}
                            </span>
                          </div>
                        ))}
                      {services.filter(service => 
                        service.name.toLowerCase().includes(serviceSearch.toLowerCase())
                      ).length === 0 && (
                        <p className="text-sm text-muted-foreground">Tidak ada layanan ditemukan</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="packageActive"
                      checked={packageFormData.isActive}
                      onCheckedChange={(checked) => setPackageFormData({...packageFormData, isActive: checked as boolean})}
                    />
                    <label
                      htmlFor="packageActive"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Aktifkan paket
                    </label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPackageDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmitPackage}>
                    {editingPackage ? "Simpan Perubahan" : "Tambah Paket"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Jumlah Sesi</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Masa Berlaku</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pkg.services.map(sId => {
                          const service = services.find(s => s.id === sId);
                          return service ? (
                            <Badge key={sId} variant="outline" className="text-xs">
                              {service.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>{pkg.totalSessions}x</TableCell>
                    <TableCell>{formatRupiah(pkg.price)}</TableCell>
                    <TableCell>{pkg.validityDays} hari</TableCell>
                    <TableCell>
                      <Badge 
                        variant={pkg.isActive ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => togglePackageActive(pkg.id)}
                      >
                        {pkg.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPackage(pkg)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Patient Vouchers Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Voucher Pasien</CardTitle>
              <CardDescription>Daftar voucher yang dimiliki pasien</CardDescription>
            </div>
            <Dialog open={isVoucherDialogOpen} onOpenChange={(open) => {
              setIsVoucherDialogOpen(open);
              if (!open) resetVoucherForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Terbitkan Voucher
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Terbitkan Voucher Baru</DialogTitle>
                  <DialogDescription>
                    Pilih pasien dan paket voucher
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Pilih Pasien *</Label>
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari pasien..."
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select
                      value={voucherFormData.patientId}
                      onValueChange={(value) => {
                        const patient = patients.find(p => p.id === value);
                        setVoucherFormData({
                          ...voucherFormData,
                          patientId: value,
                          patientName: patient?.name || ""
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pasien" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients
                          .filter(patient => 
                            patient.name.toLowerCase().includes(patientSearch.toLowerCase())
                          )
                          .map(patient => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Pilih Paket *</Label>
                    <Select
                      value={voucherFormData.packageId}
                      onValueChange={(value) => setVoucherFormData({...voucherFormData, packageId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih paket" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.filter(p => p.isActive).map(pkg => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            <div className="flex flex-col">
                              <span>{pkg.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {pkg.totalSessions}x sesi - {formatRupiah(pkg.price)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsVoucherDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmitVoucher}>
                    Terbitkan Voucher
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Sisa Sesi</TableHead>
                  <TableHead>Tanggal Beli</TableHead>
                  <TableHead>Masa Berlaku</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell className="font-medium">{voucher.patientName}</TableCell>
                    <TableCell>{voucher.packageName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{voucher.remainingSessions}</span>
                        <span className="text-muted-foreground">/ {voucher.totalSessions}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(voucher.purchaseDate)}</TableCell>
                    <TableCell>
                      <span className={
                        new Date() > voucher.expiryDate 
                          ? "text-destructive" 
                          : "text-foreground"
                      }>
                        {formatDate(voucher.expiryDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={voucher.isActive && new Date() <= voucher.expiryDate ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleVoucherActive(voucher.id)}
                      >
                        {voucher.isActive && new Date() <= voucher.expiryDate ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPatientVouchers(patientVouchers.filter(v => v.id !== voucher.id));
                          toast({
                            title: "Voucher dihapus",
                            description: "Voucher berhasil dihapus",
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
