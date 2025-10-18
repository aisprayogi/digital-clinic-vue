import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

export default function PatientRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Pasien berhasil didaftarkan!",
        description: "Data pasien telah tersimpan dalam sistem.",
      });
      navigate("/patients");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" userName="Admin Klinik" />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Registrasi Pasien Baru</h1>
          <p className="text-muted-foreground">
            Lengkapi formulir di bawah untuk mendaftarkan pasien baru
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Data Pasien</CardTitle>
              <CardDescription>Informasi identitas dan kontak pasien</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo Upload Section */}
              <div className="space-y-2">
                <Label htmlFor="photo">Foto Pasien (Opsional)</Label>
                <div className="flex items-start gap-4">
                  {photoPreview ? (
                    <div className="relative">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removePhoto}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Upload Foto</span>
                      </div>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input 
                    id="fullName" 
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik">NIK *</Label>
                  <Input 
                    id="nik" 
                    placeholder="Nomor Induk Kependudukan"
                    maxLength={16}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Tanggal Lahir *</Label>
                  <Input 
                    id="dob" 
                    type="date"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin *</Label>
                  <Select required>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="08xx xxxx xxxx"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea 
                  id="address"
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                  rows={3}
                  required
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-4">Informasi Medis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Golongan Darah</Label>
                    <Select>
                      <SelectTrigger id="bloodType">
                        <SelectValue placeholder="Pilih golongan darah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurance">Jenis Asuransi</Label>
                    <Select>
                      <SelectTrigger id="insurance">
                        <SelectValue placeholder="Pilih jenis asuransi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak ada</SelectItem>
                        <SelectItem value="bpjs">BPJS Kesehatan</SelectItem>
                        <SelectItem value="private">Asuransi Swasta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="allergies">Riwayat Alergi</Label>
                  <Textarea 
                    id="allergies"
                    placeholder="Tulis riwayat alergi pasien (obat, makanan, dll.)"
                    rows={2}
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="medicalHistory">Riwayat Penyakit</Label>
                  <Textarea 
                    id="medicalHistory"
                    placeholder="Tulis riwayat penyakit yang pernah diderita"
                    rows={2}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-4">Kontak Darurat</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Nama Kontak Darurat</Label>
                    <Input 
                      id="emergencyName" 
                      placeholder="Nama keluarga/kerabat"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Nomor Telepon Darurat</Label>
                    <Input 
                      id="emergencyPhone" 
                      type="tel"
                      placeholder="08xx xxxx xxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelation">Hubungan</Label>
                    <Input 
                      id="emergencyRelation" 
                      placeholder="Contoh: Istri, Anak, Saudara"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Menyimpan..." : "Simpan Data Pasien"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
