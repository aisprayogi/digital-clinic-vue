import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  nik?: string;
  age: number;
  dob?: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  insurance?: string;
  allergies?: string;
  medicalHistory?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  photo?: string;
  lastVisit: string;
  status: string;
}

interface PatientEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onSave: (patient: Patient) => void;
}

export function PatientEditDialog({ open, onOpenChange, patient, onSave }: PatientEditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Patient>({
    id: "",
    name: "",
    age: 0,
    gender: "",
    phone: "",
    lastVisit: "",
    status: "active",
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
      setPhotoPreview(patient.photo || null);
    }
  }, [patient]);

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

    setTimeout(() => {
      setLoading(false);
      const updatedPatient = { ...formData, photo: photoPreview || undefined };
      onSave(updatedPatient);
      toast({
        title: "Data berhasil diperbarui!",
        description: "Informasi pasien telah diperbarui dalam sistem.",
      });
      onOpenChange(false);
    }, 1000);
  };

  const handleChange = (field: keyof Patient, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Data Pasien</DialogTitle>
          <DialogDescription>
            Perbarui informasi pasien {patient?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Foto Pasien</Label>
              <div className="flex items-start gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
                      onClick={removePhoto}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </div>
                    <Input
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

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap *</Label>
                <Input 
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-nik">NIK</Label>
                <Input 
                  id="edit-nik"
                  value={formData.nik || ""}
                  onChange={(e) => handleChange("nik", e.target.value)}
                  maxLength={16}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dob">Tanggal Lahir</Label>
                <Input 
                  id="edit-dob"
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gender">Jenis Kelamin *</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleChange("gender", value)}
                >
                  <SelectTrigger id="edit-gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Nomor Telepon *</Label>
                <Input 
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Alamat Lengkap</Label>
              <Textarea 
                id="edit-address"
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
              />
            </div>

            <Separator />

            {/* Medical Information */}
            <div>
              <h3 className="font-semibold mb-4">Informasi Medis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bloodType">Golongan Darah</Label>
                  <Select 
                    value={formData.bloodType || ""} 
                    onValueChange={(value) => handleChange("bloodType", value)}
                  >
                    <SelectTrigger id="edit-bloodType">
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
                  <Label htmlFor="edit-insurance">Jenis Asuransi</Label>
                  <Select 
                    value={formData.insurance || ""} 
                    onValueChange={(value) => handleChange("insurance", value)}
                  >
                    <SelectTrigger id="edit-insurance">
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
                <Label htmlFor="edit-allergies">Riwayat Alergi</Label>
                <Textarea 
                  id="edit-allergies"
                  value={formData.allergies || ""}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="edit-medicalHistory">Riwayat Penyakit</Label>
                <Textarea 
                  id="edit-medicalHistory"
                  value={formData.medicalHistory || ""}
                  onChange={(e) => handleChange("medicalHistory", e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Emergency Contact */}
            <div>
              <h3 className="font-semibold mb-4">Kontak Darurat</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-emergencyName">Nama Kontak Darurat</Label>
                  <Input 
                    id="edit-emergencyName"
                    value={formData.emergencyName || ""}
                    onChange={(e) => handleChange("emergencyName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-emergencyPhone">Nomor Telepon Darurat</Label>
                  <Input 
                    id="edit-emergencyPhone"
                    value={formData.emergencyPhone || ""}
                    onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-emergencyRelation">Hubungan</Label>
                  <Input 
                    id="edit-emergencyRelation"
                    value={formData.emergencyRelation || ""}
                    onChange={(e) => handleChange("emergencyRelation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
