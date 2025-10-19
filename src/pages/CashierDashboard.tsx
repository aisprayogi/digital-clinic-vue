import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DollarSign, Package, ShoppingCart, TrendingUp, Power, PowerOff, FileText } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { SessionReportDialog } from "@/components/SessionReportDialog";
import { useToast } from "@/hooks/use-toast";
import type { CashierSession, SessionReport } from "@/types/cashier";

export default function CashierDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentSession, setCurrentSession] = useState<CashierSession | null>(null);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [closeSessionDialog, setCloseSessionDialog] = useState(false);
  const [openingBalance, setOpeningBalance] = useState("");
  const [closingBalance, setClosingBalance] = useState("");
  const [sessionReport, setSessionReport] = useState<SessionReport | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);

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

  // Sample transactions (would come from database)
  const recentTransactions = [
    { id: "TRX001", customer: "Ahmad Rizki", amount: 125000, time: "10:30", items: 3, paymentMethod: "cash" },
    { id: "TRX002", customer: "Pembeli Umum", amount: 45000, time: "11:15", items: 2, paymentMethod: "card" },
    { id: "TRX003", customer: "Siti Nurhaliza", amount: 200000, time: "11:45", items: 5, paymentMethod: "transfer" },
    { id: "TRX004", customer: "Pembeli Umum", amount: 85000, time: "12:20", items: 4, paymentMethod: "cash" },
  ];

  const handleOpenSession = () => {
    if (!openingBalance || parseFloat(openingBalance) < 0) {
      toast({
        title: "Error",
        description: "Masukkan modal awal yang valid",
        variant: "destructive"
      });
      return;
    }

    const newSession: CashierSession = {
      id: `session-${Date.now()}`,
      sessionNumber: `S${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      cashierId: "cashier-1",
      cashierName: "Kasir Klinik",
      openedAt: new Date(),
      openingBalance: parseFloat(openingBalance),
      status: 'open'
    };

    setCurrentSession(newSession);
    setOpenSessionDialog(false);
    setOpeningBalance("");
    
    toast({
      title: "Sesi Dibuka",
      description: `Sesi ${newSession.sessionNumber} telah dibuka`,
    });
  };

  const handleCloseSession = () => {
    if (!currentSession) return;

    if (!closingBalance || parseFloat(closingBalance) < 0) {
      toast({
        title: "Error",
        description: "Masukkan saldo akhir yang valid",
        variant: "destructive"
      });
      return;
    }

    const closedSession: CashierSession = {
      ...currentSession,
      closedAt: new Date(),
      closingBalance: parseFloat(closingBalance),
      totalTransactions: recentTransactions.length,
      totalRevenue: recentTransactions.reduce((sum, t) => sum + t.amount, 0),
      status: 'closed'
    };

    // Generate report
    const report: SessionReport = {
      session: closedSession,
      transactions: recentTransactions.map(t => ({
        id: t.id,
        transactionNumber: t.id,
        customerName: t.customer,
        total: t.amount,
        paymentMethod: t.paymentMethod,
        timestamp: new Date()
      })),
      summary: {
        totalTransactions: recentTransactions.length,
        totalRevenue: recentTransactions.reduce((sum, t) => sum + t.amount, 0),
        paymentMethods: {
          cash: recentTransactions.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.amount, 0),
          card: recentTransactions.filter(t => t.paymentMethod === 'card').reduce((sum, t) => sum + t.amount, 0),
          transfer: recentTransactions.filter(t => t.paymentMethod === 'transfer').reduce((sum, t) => sum + t.amount, 0),
        }
      }
    };

    setSessionReport(report);
    setShowReportDialog(true);
    setCurrentSession(null);
    setCloseSessionDialog(false);
    setClosingBalance("");
    
    toast({
      title: "Sesi Ditutup",
      description: "Laporan sesi telah dibuat",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="cashier" userName="Kasir Klinik" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Kasir</h1>
              <p className="text-muted-foreground">
                Kelola transaksi dan stok obat
              </p>
            </div>
            <div>
              {currentSession ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Sesi Aktif</p>
                    <p className="font-semibold">{currentSession.sessionNumber}</p>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={() => setCloseSessionDialog(true)}
                  >
                    <PowerOff className="mr-2 h-4 w-4" />
                    Tutup Kasir
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setOpenSessionDialog(true)}>
                  <Power className="mr-2 h-4 w-4" />
                  Buka Kasir
                </Button>
              )}
            </div>
          </div>
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
                onClick={() => {
                  if (!currentSession) {
                    toast({
                      title: "Sesi Belum Dibuka",
                      description: "Silakan buka kasir terlebih dahulu",
                      variant: "destructive"
                    });
                    return;
                  }
                  navigate("/pos", { state: { sessionId: currentSession.id } });
                }}
                disabled={!currentSession}
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

        {/* Open Session Dialog */}
        <Dialog open={openSessionDialog} onOpenChange={setOpenSessionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buka Kasir</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="opening-balance">Modal Awal</Label>
                <Input
                  id="opening-balance"
                  type="number"
                  placeholder="Masukkan modal awal"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenSessionDialog(false)}>
                Batal
              </Button>
              <Button onClick={handleOpenSession}>
                <Power className="mr-2 h-4 w-4" />
                Buka Kasir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Close Session Dialog */}
        <Dialog open={closeSessionDialog} onOpenChange={setCloseSessionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tutup Kasir</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="closing-balance">Saldo Akhir</Label>
                <Input
                  id="closing-balance"
                  type="number"
                  placeholder="Masukkan saldo akhir"
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Laporan sesi akan dibuat setelah kasir ditutup
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCloseSessionDialog(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleCloseSession}>
                <PowerOff className="mr-2 h-4 w-4" />
                Tutup Kasir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Session Report Dialog */}
        <SessionReportDialog
          open={showReportDialog}
          onOpenChange={setShowReportDialog}
          report={sessionReport}
        />
      </main>
    </div>
  );
}
