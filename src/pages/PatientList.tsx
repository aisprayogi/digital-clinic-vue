import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientList() {
  const [searchQuery, setSearchQuery] = useState("");

  const patients = [
    { 
      id: "P001", 
      name: "Ahmad Rizki", 
      age: 35, 
      gender: "L",
      phone: "081234567890",
      lastVisit: "2024-01-15",
      status: "active"
    },
    { 
      id: "P002", 
      name: "Siti Nurhaliza", 
      age: 42, 
      gender: "P",
      phone: "081234567891",
      lastVisit: "2024-01-14",
      status: "active"
    },
    { 
      id: "P003", 
      name: "Dewi Lestari", 
      age: 28, 
      gender: "P",
      phone: "081234567892",
      lastVisit: "2024-01-10",
      status: "active"
    },
    { 
      id: "P004", 
      name: "Andi Wijaya", 
      age: 51, 
      gender: "L",
      phone: "081234567893",
      lastVisit: "2023-12-20",
      status: "inactive"
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                      <Link to={`/medical-record/${patient.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Detail
                        </Button>
                      </Link>
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
