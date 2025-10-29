import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar as CalendarIcon, Download, TrendingUp, Wallet, Receipt } from "lucide-react";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, isToday, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  transactionNumber: string;
  sessionId: string;
  sessionNumber: string;
  cashierName: string;
  customerType: "patient" | "walk-in";
  customerName: string;
  items: { name: string; type: "service" | "medicine"; quantity: number; price: number; total: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer";
  timestamp: Date;
}

// Sample data
const sampleTransactions: Transaction[] = [
  {
    id: "trx1",
    transactionNumber: "TRX-20240429-001",
    sessionId: "sess1",
    sessionNumber: "SESS-001",
    cashierName: "Budi Santoso",
    customerType: "patient",
    customerName: "Ahmad Rizki",
    items: [
      { name: "Konsultasi Umum", type: "service", quantity: 1, price: 150000, total: 150000 },
      { name: "Paracetamol", type: "medicine", quantity: 2, price: 15000, total: 30000 },
    ],
    subtotal: 180000,
    tax: 18000,
    discount: 0,
    total: 198000,
    paymentMethod: "cash",
    timestamp: new Date(2024, 3, 29, 10, 30),
  },
  {
    id: "trx2",
    transactionNumber: "TRX-20240429-002",
    sessionId: "sess1",
    sessionNumber: "SESS-001",
    cashierName: "Budi Santoso",
    customerType: "walk-in",
    customerName: "Siti Aminah",
    items: [
      { name: "Vitamin C", type: "medicine", quantity: 1, price: 50000, total: 50000 },
    ],
    subtotal: 50000,
    tax: 5000,
    discount: 5000,
    total: 50000,
    paymentMethod: "card",
    timestamp: new Date(2024, 3, 29, 11, 15),
  },
  {
    id: "trx3",
    transactionNumber: "TRX-20240428-001",
    sessionId: "sess2",
    sessionNumber: "SESS-002",
    cashierName: "Siti Rahayu",
    customerType: "patient",
    customerName: "Dedi Kurniawan",
    items: [
      { name: "Medical Check-up", type: "service", quantity: 1, price: 500000, total: 500000 },
    ],
    subtotal: 500000,
    tax: 50000,
    discount: 50000,
    total: 500000,
    paymentMethod: "transfer",
    timestamp: new Date(2024, 3, 28, 14, 20),
  },
];

export default function TransactionHistory() {
  // TODO: Get userRole from auth context
  const [userRole] = useState<"admin" | "doctor" | "cashier">("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<"today" | "thisMonth" | "custom">("today");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "cash" | "card" | "transfer">("all");
  const [transactions] = useState<Transaction[]>(sampleTransactions);

  // Filter transactions based on user role
  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Role-based filtering: cashiers only see today's transactions
    if (userRole === "cashier") {
      filtered = filtered.filter(trx => isToday(trx.timestamp));
    } else {
      // Admin can filter by date range
      if (dateRange === "today" && selectedDate) {
        filtered = filtered.filter(trx => isSameDay(trx.timestamp, selectedDate));
      } else if (dateRange === "thisMonth" && selectedDate) {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        filtered = filtered.filter(trx => trx.timestamp >= monthStart && trx.timestamp <= monthEnd);
      }
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(trx =>
        trx.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.cashierName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Payment method filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(trx => trx.paymentMethod === paymentFilter);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate daily summary
  const getDailySummary = () => {
    const targetDate = userRole === "cashier" ? new Date() : (selectedDate || new Date());
    const dailyTransactions = transactions.filter(trx => isSameDay(trx.timestamp, targetDate));

    return {
      count: dailyTransactions.length,
      total: dailyTransactions.reduce((sum, trx) => sum + trx.total, 0),
      cash: dailyTransactions.filter(t => t.paymentMethod === "cash").reduce((sum, trx) => sum + trx.total, 0),
      card: dailyTransactions.filter(t => t.paymentMethod === "card").reduce((sum, trx) => sum + trx.total, 0),
      transfer: dailyTransactions.filter(t => t.paymentMethod === "transfer").reduce((sum, trx) => sum + trx.total, 0),
    };
  };

  // Calculate monthly summary
  const getMonthlySummary = () => {
    const targetDate = selectedDate || new Date();
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    const monthlyTransactions = transactions.filter(
      trx => trx.timestamp >= monthStart && trx.timestamp <= monthEnd
    );

    return {
      count: monthlyTransactions.length,
      total: monthlyTransactions.reduce((sum, trx) => sum + trx.total, 0),
      cash: monthlyTransactions.filter(t => t.paymentMethod === "cash").reduce((sum, trx) => sum + trx.total, 0),
      card: monthlyTransactions.filter(t => t.paymentMethod === "card").reduce((sum, trx) => sum + trx.total, 0),
      transfer: monthlyTransactions.filter(t => t.paymentMethod === "transfer").reduce((sum, trx) => sum + trx.total, 0),
    };
  };

  const dailySummary = getDailySummary();
  const monthlySummary = getMonthlySummary();

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      cash: "default",
      card: "secondary",
      transfer: "outline",
    } as const;
    return <Badge variant={variants[method as keyof typeof variants]}>{method.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={userRole} userName="Admin User" />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Riwayat Transaksi</h1>
            <p className="text-muted-foreground">
              {userRole === "cashier" 
                ? "Daftar transaksi hari ini"
                : "Kelola dan pantau semua transaksi kasir"}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaksi Hari Ini</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailySummary.count}</div>
              <p className="text-xs text-muted-foreground">
                Total: {formatRupiah(dailySummary.total)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaksi Bulan Ini</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlySummary.count}</div>
              <p className="text-xs text-muted-foreground">
                Total: {formatRupiah(monthlySummary.total)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Hari Ini</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(dailySummary.cash)}</div>
              <p className="text-xs text-muted-foreground">
                Bulan: {formatRupiah(monthlySummary.cash)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non-Cash Hari Ini</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatRupiah(dailySummary.card + dailySummary.transfer)}
              </div>
              <p className="text-xs text-muted-foreground">
                Bulan: {formatRupiah(monthlySummary.card + monthlySummary.transfer)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari transaksi, pelanggan, atau kasir..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {userRole !== "cashier" && (
                <>
                  <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Rentang Waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="thisMonth">Bulan Ini</SelectItem>
                      <SelectItem value="custom">Pilih Tanggal</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: id }) : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </>
              )}

              <Select value={paymentFilter} onValueChange={(value: any) => setPaymentFilter(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Metode Bayar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Transaksi</TableHead>
                  <TableHead>Tanggal & Waktu</TableHead>
                  <TableHead>Kasir</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Metode Bayar</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Tidak ada transaksi ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.transactionNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {format(transaction.timestamp, "dd MMM yyyy", { locale: id })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(transaction.timestamp, "HH:mm")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.cashierName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{transaction.customerName}</span>
                          <Badge variant="outline" className="w-fit text-xs">
                            {transaction.customerType === "patient" ? "Pasien" : "Walk-in"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {transaction.items.length} item(s)
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentMethodBadge(transaction.paymentMethod)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatRupiah(transaction.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detailed Summary Tabs */}
        {userRole !== "cashier" && (
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily">Rekapitulasi Harian</TabsTrigger>
              <TabsTrigger value="monthly">Rekapitulasi Bulanan</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Rekapitulasi Harian - {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: id }) : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Transaksi</p>
                      <p className="text-2xl font-bold">{dailySummary.count}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                      <p className="text-2xl font-bold">{formatRupiah(dailySummary.total)}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Cash</p>
                      <p className="text-xl font-semibold">{formatRupiah(dailySummary.cash)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Card</p>
                      <p className="text-xl font-semibold">{formatRupiah(dailySummary.card)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Transfer</p>
                      <p className="text-xl font-semibold">{formatRupiah(dailySummary.transfer)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Rekapitulasi Bulanan - {selectedDate ? format(selectedDate, "MMMM yyyy", { locale: id }) : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Transaksi</p>
                      <p className="text-2xl font-bold">{monthlySummary.count}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                      <p className="text-2xl font-bold">{formatRupiah(monthlySummary.total)}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Cash</p>
                      <p className="text-xl font-semibold">{formatRupiah(monthlySummary.cash)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Card</p>
                      <p className="text-xl font-semibold">{formatRupiah(monthlySummary.card)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Transfer</p>
                      <p className="text-xl font-semibold">{formatRupiah(monthlySummary.transfer)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
