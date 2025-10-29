import { Link, useLocation } from "react-router-dom";
import { LogOut, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface NavbarProps {
  userRole?: "admin" | "doctor" | "cashier";
  userName?: string;
}

export function Navbar({ userRole, userName = "User" }: NavbarProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    window.location.href = "/";
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {userRole === "admin" && (
                    <>
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/admin" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/patients" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/patients" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Pasien
                        </Button>
                      </Link>
                      <Link to="/patient-register" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/patient-register" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Registrasi
                        </Button>
                      </Link>
                      <Link to="/pos" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/pos" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Kasir
                        </Button>
                      </Link>
                      <Link to="/stock" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/stock" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Stok Obat
                        </Button>
                      </Link>
                      <Link to="/promotions" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/promotions" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Promosi
                        </Button>
                      </Link>
                      <Link to="/vouchers" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/vouchers" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Paket Voucher
                        </Button>
                      </Link>
                      <Link to="/transactions" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/transactions" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Riwayat Transaksi
                        </Button>
                      </Link>
                    </>
                  )}
                  {userRole === "doctor" && (
                    <Link to="/doctor" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={location.pathname === "/doctor" ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  {userRole === "cashier" && (
                    <>
                      <Link to="/cashier" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/cashier" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/pos" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/pos" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Kasir
                        </Button>
                      </Link>
                      <Link to="/stock" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/stock" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Stok Obat
                        </Button>
                      </Link>
                      <Link to="/transactions" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant={location.pathname === "/transactions" ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          Riwayat Transaksi
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link to={userRole === "admin" ? "/admin" : userRole === "cashier" ? "/cashier" : "/doctor"} className="flex items-center gap-2">
              <img src={logo} alt="MediClinic Logo" className="h-8 w-8" />
              <span className="font-semibold text-lg text-foreground">MediClinic</span>
            </Link>

            {userRole === "admin" && (
              <div className="hidden md:flex gap-1">
                <Link to="/admin">
                  <Button
                    variant={location.pathname === "/admin" ? "default" : "ghost"}
                    size="sm"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/patients">
                  <Button
                    variant={location.pathname === "/patients" ? "default" : "ghost"}
                    size="sm"
                  >
                    Pasien
                  </Button>
                </Link>
                <Link to="/patient-register">
                  <Button
                    variant={location.pathname === "/patient-register" ? "default" : "ghost"}
                    size="sm"
                  >
                    Registrasi
                  </Button>
                </Link>
                <Link to="/pos">
                  <Button
                    variant={location.pathname === "/pos" ? "default" : "ghost"}
                    size="sm"
                  >
                    Kasir
                  </Button>
                </Link>
                <Link to="/stock">
                  <Button
                    variant={location.pathname === "/stock" ? "default" : "ghost"}
                    size="sm"
                  >
                    Stok Obat
                  </Button>
                </Link>
                <Link to="/promotions">
                  <Button
                    variant={location.pathname === "/promotions" ? "default" : "ghost"}
                    size="sm"
                  >
                    Promosi
                  </Button>
                </Link>
                <Link to="/vouchers">
                  <Button
                    variant={location.pathname === "/vouchers" ? "default" : "ghost"}
                    size="sm"
                  >
                    Paket Voucher
                  </Button>
                </Link>
                <Link to="/transactions">
                  <Button
                    variant={location.pathname === "/transactions" ? "default" : "ghost"}
                    size="sm"
                  >
                    Riwayat Transaksi
                  </Button>
                </Link>
              </div>
            )}

            {userRole === "doctor" && (
              <div className="hidden md:flex gap-1">
                <Link to="/doctor">
                  <Button
                    variant={location.pathname === "/doctor" ? "default" : "ghost"}
                    size="sm"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
            )}

            {userRole === "cashier" && (
              <div className="hidden md:flex gap-1">
                <Link to="/cashier">
                  <Button
                    variant={location.pathname === "/cashier" ? "default" : "ghost"}
                    size="sm"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/pos">
                  <Button
                    variant={location.pathname === "/pos" ? "default" : "ghost"}
                    size="sm"
                  >
                    Kasir
                  </Button>
                </Link>
                <Link to="/stock">
                  <Button
                    variant={location.pathname === "/stock" ? "default" : "ghost"}
                    size="sm"
                  >
                    Stok Obat
                  </Button>
                </Link>
                <Link to="/transactions">
                  <Button
                    variant={location.pathname === "/transactions" ? "default" : "ghost"}
                    size="sm"
                  >
                    Riwayat Transaksi
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
