import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Calendar, User, FileText, Upload, X, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MedicalRecord() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Mock patient data
  const patient = {
    id: patientId || "P001",
    name: "Ahmad Rizki",
    age: 35,
    gender: "Laki-laki",
    bloodType: "A",
    allergies: "Penisilin",
  };

  // Mock medical history
  const medicalHistory = [
    {
      id: 1,
      date: "2024-01-10",
      complaint: "Demam dan batuk",
      diagnosis: "ISPA (Infeksi Saluran Pernapasan Akut)",
      prescription: "Paracetamol 500mg 3x1, Amoxicillin 500mg 3x1",
      doctor: "Dr. Sarah Amelia",
      photos: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400", "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400"]
    },
    {
      id: 2,
      date: "2023-12-15",
      complaint: "Sakit kepala",
      diagnosis: "Tension headache",
      prescription: "Paracetamol 500mg bila perlu",
      doctor: "Dr. Budi Santoso",
      photos: []
    },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === files.length) {
            setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Catatan medis berhasil disimpan!",
        description: "Data telah tersimpan dalam rekam medis pasien.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="doctor" userName="Dr. Sarah Amelia" />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pasien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID Pasien</p>
                  <p className="font-semibold text-primary">{patient.id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p className="font-semibold">{patient.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Usia</p>
                    <p className="font-semibold">{patient.age} tahun</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                    <p className="font-semibold">{patient.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Golongan Darah</p>
                  <Badge variant="outline">{patient.bloodType}</Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Riwayat Alergi</p>
                  <Badge variant="destructive">{patient.allergies}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="new-record" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new-record">Catatan Baru</TabsTrigger>
                <TabsTrigger value="history">Riwayat Kunjungan</TabsTrigger>
              </TabsList>

              <TabsContent value="new-record" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Catatan Medis Baru (SOAP)
                    </CardTitle>
                    <CardDescription>
                      Dokumentasi menggunakan format SOAP: Subjective, Objective, Assessment, Plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="subjective" className="text-base font-semibold">
                        S - Subjective (Keluhan Pasien)
                      </Label>
                      <Textarea
                        id="subjective"
                        placeholder="Tulis keluhan yang disampaikan pasien..."
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Contoh: "Pasien mengeluh demam sejak 3 hari yang lalu, disertai batuk berdahak..."
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="objective" className="text-base font-semibold">
                        O - Objective (Hasil Pemeriksaan)
                      </Label>
                      <Textarea
                        id="objective"
                        placeholder="Tulis hasil pemeriksaan fisik dan vital signs..."
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Contoh: "TD: 120/80 mmHg, Nadi: 88x/menit, RR: 20x/menit, Suhu: 38.5°C, Tenggorokan hiperemis..."
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="assessment" className="text-base font-semibold">
                        A - Assessment (Diagnosis)
                      </Label>
                      <Input
                        id="assessment"
                        placeholder="Tulis diagnosis atau assessment..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Contoh: "ISPA (Infeksi Saluran Pernapasan Akut)"
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-base font-semibold">
                        P - Plan (Rencana & Resep)
                      </Label>
                      
                      <div className="space-y-2">
                        <Label htmlFor="treatment">Rencana Tindakan / Saran</Label>
                        <Textarea
                          id="treatment"
                          placeholder="Tulis rencana perawatan atau saran untuk pasien..."
                          rows={2}
                          className="resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prescription">Resep Obat</Label>
                        <Textarea
                          id="prescription"
                          placeholder="Tulis resep obat dengan dosis dan aturan pakai..."
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Contoh: "1. Paracetamol 500mg, 3x1 tablet sehari sesudah makan (5 hari)"
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Catatan lain yang perlu didokumentasikan..."
                        rows={2}
                        className="resize-none"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Foto Rujukan (Opsional)</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Upload foto kondisi pasien sebagai dokumentasi medis
                      </p>
                      
                      {uploadedPhotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          {uploadedPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={photo} 
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePhoto(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <label className="cursor-pointer">
                        <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Klik untuk upload foto (maks. 5 foto)
                          </p>
                        </div>
                        <Input
                          id="photos"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handlePhotoUpload}
                          disabled={uploadedPhotos.length >= 5}
                        />
                      </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(-1)}
                      >
                        Batal
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Menyimpan..." : "Simpan Catatan"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="space-y-4">
                  {medicalHistory.map((record) => (
                    <Card key={record.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {record.date}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Ditangani oleh: {record.doctor}
                            </CardDescription>
                          </div>
                          <Badge>Selesai</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Keluhan:</p>
                          <p className="text-sm">{record.complaint}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Diagnosis:</p>
                          <p className="text-sm font-medium">{record.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-1">Resep:</p>
                          <p className="text-sm">{record.prescription}</p>
                        </div>
                        {record.photos && record.photos.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <ImageIcon className="h-4 w-4" />
                              Foto Rujukan:
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {record.photos.map((photo, idx) => (
                                <img 
                                  key={idx}
                                  src={photo} 
                                  alt={`Rujukan ${idx + 1}`}
                                  className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(photo, '_blank')}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
