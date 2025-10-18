import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";

export default function CashierDashboard() {
  const navigate = useNavigate();

  const todayStats = [
    {
      title: "Transaksi Hari Ini",
      value: "28",
      icon: ShoppingCart,
      trend: { value: "+12%", isPositive: true }
    },
    {
      title: "Total Penjualan",
      value: "Rp 4.250.000",
      icon: DollarSign,
      trend: { value: "+8%", isPositive: true }
    },
    {
      title: "Rata-rata Transaksi",
      value: "Rp 151.785",
      icon: TrendingUp,
    },
  ];

  const recentTransactions = [
    { id: "TRX001", customer: "Ahmad Rizki", amount: 125000, time: "10:30", items: 3 },
    { id: "TRX002", customer: "Pembeli Umum", amount: 45000, time: "11:15", items: 2 },
    { id: "TRX003", customer: "Siti Nurhaliza", amount: 200000, time: "11:45", items: 5 },
    { id: "TRX004", customer: "Pembeli Umum", amount: 85000, time: "12:20", items: 4 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="cashier" userName="Kasir Klinik" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Kasir</h1>
          <p className="text-muted-foreground">
            Kelola transaksi dan stok obat
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {todayStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start h-auto py-4"
                onClick={() => navigate("/pos")}
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Buat Transaksi Baru</div>
                  <div className="text-xs opacity-90">Mulai transaksi kasir</div>
                </div>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-start h-auto py-4"
                onClick={() => navigate("/stock")}
              >
                <Package className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Kelola Stok</div>
                  <div className="text-xs text-muted-foreground">Cek dan update stok obat</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Transaksi Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((trx) => (
                  <div key={trx.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{trx.customer}</div>
                      <div className="text-xs text-muted-foreground">
                        {trx.id} • {trx.items} item • {trx.time}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      Rp {trx.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
