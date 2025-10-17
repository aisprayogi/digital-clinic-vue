import { Users, UserPlus, DollarSign, Package, Calendar, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const todayAppointments = [
    { id: 1, time: "09:00", patient: "Ahmad Rizki", doctor: "Dr. Sarah Amelia", status: "completed" },
    { id: 2, time: "10:00", patient: "Siti Nurhaliza", doctor: "Dr. Budi Santoso", status: "in-progress" },
    { id: 3, time: "11:00", patient: "Dewi Lestari", doctor: "Dr. Sarah Amelia", status: "waiting" },
    { id: 4, time: "13:00", patient: "Andi Wijaya", doctor: "Dr. Budi Santoso", status: "waiting" },
  ];

  const statusColors = {
    completed: "success",
    "in-progress": "warning",
    waiting: "secondary",
  };

  const statusLabels = {
    completed: "Selesai",
    "in-progress": "Berlangsung",
    waiting: "Menunggu",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" userName="Admin Klinik" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Selamat datang! Berikut ringkasan aktivitas klinik hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Pasien Hari Ini"
            value={24}
            icon={Users}
            iconColor="primary"
            trend={{ value: "+12% dari kemarin", isPositive: true }}
          />
          <StatsCard
            title="Pasien Baru"
            value={6}
            icon={UserPlus}
            iconColor="success"
            trend={{ value: "+2 dari kemarin", isPositive: true }}
          />
          <StatsCard
            title="Pendapatan Hari Ini"
            value="Rp 4.5jt"
            icon={DollarSign}
            iconColor="success"
            trend={{ value: "+8% dari kemarin", isPositive: true }}
          />
          <StatsCard
            title="Stok Obat Kritis"
            value={3}
            icon={Package}
            iconColor="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Janji Temu Hari Ini</CardTitle>
                  <CardDescription>Daftar pasien yang terjadwal</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Pasien</TableHead>
                    <TableHead>Dokter</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">{apt.time}</TableCell>
                      <TableCell>{apt.patient}</TableCell>
                      <TableCell className="text-muted-foreground">{apt.doctor}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[apt.status] as any}>
                          {statusLabels[apt.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pendapatan Minggu Ini</CardTitle>
                  <CardDescription>Grafik transaksi 7 hari terakhir</CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((day, idx) => {
                  const values = [3.2, 4.1, 3.8, 4.5, 5.2, 4.8, 4.5];
                  const percentage = (values[idx] / 5.5) * 100;
                  return (
                    <div key={day} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{day}</span>
                        <span className="font-medium">Rp {values[idx]}jt</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/patient-register" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Daftar Pasien Baru
                </Button>
              </Link>
              <Link to="/patients" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Lihat Semua Pasien
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Obat Stok Kritis</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center">
                  <span>Paracetamol 500mg</span>
                  <Badge variant="destructive" className="bg-destructive text-destructive-foreground">15 pcs</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>Amoxicillin 500mg</span>
                  <Badge variant="warning" className="bg-warning text-warning-foreground">28 pcs</Badge>
                </li>
                <li className="flex justify-between items-center">
                  <span>Vitamin C</span>
                  <Badge variant="warning" className="bg-warning text-warning-foreground">32 pcs</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dokter Aktif Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    SA
                  </div>
                  <div>
                    <p className="font-medium">Dr. Sarah Amelia</p>
                    <p className="text-xs text-muted-foreground">Umum</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-success font-semibold">
                    BS
                  </div>
                  <div>
                    <p className="font-medium">Dr. Budi Santoso</p>
                    <p className="text-xs text-muted-foreground">Gigi</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
