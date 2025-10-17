import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  const patientQueue = [
    { 
      id: 1, 
      queue: 1, 
      time: "09:00",
      name: "Ahmad Rizki", 
      age: 35, 
      complaint: "Demam dan batuk 3 hari",
      status: "completed" 
    },
    { 
      id: 2, 
      queue: 2,
      time: "09:30", 
      name: "Siti Nurhaliza", 
      age: 42, 
      complaint: "Sakit kepala berkepanjangan",
      status: "in-progress" 
    },
    { 
      id: 3, 
      queue: 3,
      time: "10:00", 
      name: "Dewi Lestari", 
      age: 28, 
      complaint: "Kontrol rutin diabetes",
      status: "waiting" 
    },
    { 
      id: 4, 
      queue: 4,
      time: "10:30", 
      name: "Andi Wijaya", 
      age: 51, 
      complaint: "Nyeri sendi lutut",
      status: "waiting" 
    },
  ];

  const statusColors = {
    completed: "success",
    "in-progress": "warning",
    waiting: "secondary",
  };

  const statusLabels = {
    completed: "Selesai",
    "in-progress": "Sedang Konsultasi",
    waiting: "Menunggu",
  };

  const completedCount = patientQueue.filter(p => p.status === "completed").length;
  const waitingCount = patientQueue.filter(p => p.status === "waiting").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="doctor" userName="Dr. Sarah Amelia" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Dokter</h1>
          <p className="text-muted-foreground">
            Selamat datang, Dr. Sarah! Berikut daftar pasien Anda hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Pasien Hari Ini"
            value={patientQueue.length}
            icon={Users}
            iconColor="primary"
          />
          <StatsCard
            title="Sedang Konsultasi"
            value={patientQueue.filter(p => p.status === "in-progress").length}
            icon={UserCheck}
            iconColor="warning"
          />
          <StatsCard
            title="Pasien Selesai"
            value={completedCount}
            icon={CheckCircle}
            iconColor="success"
          />
          <StatsCard
            title="Pasien Menunggu"
            value={waitingCount}
            icon={Clock}
            iconColor="primary"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Antrian Pasien Hari Ini</CardTitle>
            <CardDescription>Klik pada baris pasien untuk melihat detail atau memulai konsultasi</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">No.</TableHead>
                  <TableHead className="w-24">Waktu</TableHead>
                  <TableHead>Nama Pasien</TableHead>
                  <TableHead className="w-20">Usia</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-32">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientQueue.map((patient) => (
                  <TableRow 
                    key={patient.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPatient === patient.id ? "bg-accent" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <TableCell className="font-bold text-primary">{patient.queue}</TableCell>
                    <TableCell className="font-medium">{patient.time}</TableCell>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age} th</TableCell>
                    <TableCell className="text-muted-foreground">{patient.complaint}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[patient.status] as any}>
                        {statusLabels[patient.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {patient.status === "waiting" && (
                        <Link to={`/medical-record/${patient.id}`}>
                          <Button size="sm" variant="default">
                            Mulai
                          </Button>
                        </Link>
                      )}
                      {patient.status === "in-progress" && (
                        <Link to={`/medical-record/${patient.id}`}>
                          <Button size="sm" variant="outline">
                            Lanjutkan
                          </Button>
                        </Link>
                      )}
                      {patient.status === "completed" && (
                        <Link to={`/medical-record/${patient.id}`}>
                          <Button size="sm" variant="ghost">
                            Lihat
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Catatan Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gunakan template SOAP (Subjective, Objective, Assessment, Plan) untuk dokumentasi yang konsisten.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Jam Praktek Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sesi Pagi:</span>
                <span className="font-medium">09:00 - 12:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sesi Siang:</span>
                <span className="font-medium">13:00 - 16:00</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktivitas Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>{completedCount} konsultasi selesai</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                <span>{waitingCount} pasien menunggu</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
