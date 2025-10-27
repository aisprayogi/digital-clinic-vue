import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PatientEditDialog } from "@/components/PatientEditDialog";
import { PatientDeleteDialog } from "@/components/PatientDeleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function PatientList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([

    {
      id: "P001",
      name: "Ahmad Rizki",
      nik: "3201234567890123",
      age: 35,
      dob: "1989-05-15",
      gender: "L",
      phone: "081234567890",
      email: "ahmad.rizki@email.com",
      address: "Jl. Merdeka No. 123, RT 01/RW 05, Kelurahan Menteng, Kecamatan Menteng, Jakarta Pusat",
      bloodType: "A",
      insurance: "bpjs",
      allergies: "Tidak ada alergi yang diketahui",
      medicalHistory: "Riwayat hipertensi",
      emergencyName: "Siti Fatimah",
      emergencyPhone: "081234567899",
      emergencyRelation: "Istri",
      lastVisit: "2024-01-15",
      status: "active"
    },
    {
      id: "P002",
      name: "Siti Nurhaliza",
      nik: "3201234567890124",
      age: 42,
      dob: "1982-03-20",
      gender: "P",
      phone: "081234567891",
      email: "siti.nur@email.com",
      address: "Jl. Sudirman No. 45, RT 02/RW 03, Kelurahan Kebayoran, Kecamatan Kebayoran Baru, Jakarta Selatan",
      bloodType: "B",
      insurance: "private",
      lastVisit: "2024-01-14",
      status: "active"
    },
    {
      id: "P003",
      name: "Dewi Lestari",
      nik: "3201234567890125",
      age: 28,
      dob: "1996-08-10",
      gender: "P",
      phone: "081234567892",
      address: "Jl. Gatot Subroto No. 78, RT 03/RW 04, Kelurahan Kuningan, Jakarta Selatan",
      lastVisit: "2024-01-10",
      status: "active"
    },
    {
      id: "P004",
      name: "Andi Wijaya",
      nik: "3201234567890126",
      age: 51,
      dob: "1973-11-25",
      gender: "L",
      phone: "081234567893",
      bloodType: "O",
      lastVisit: "2023-12-20",
      status: "inactive"
    },
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditDialogOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatients(prev =>
      prev.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
  };

  const handleConfirmDelete = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" userName="Admin Klinik" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Data Pasien</h1>
            <p className="text-muted-foreground">
              Kelola dan lihat informasi semua pasien terdaftar
            </p>
          </div>
          <Link to="/patient-register">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Daftar Pasien Baru
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Pasien</CardTitle>
                <CardDescription>{filteredPatients.length} pasien ditemukan</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau ID pasien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pasien</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Usia</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Kunjungan Terakhir</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">{patient.id}</TableCell>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age} th</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell className="text-muted-foreground">{patient.phone}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                        {patient.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            Aksi
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/medical-record/${patient.id}`} className="w-full cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Data
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeletePatient(patient)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <PatientEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          patient={selectedPatient}
          onSave={handleSavePatient}
        />

        <PatientDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          patient={selectedPatient}
          onDelete={handleConfirmDelete}
        />
      </main>
    </div>
  );
}
