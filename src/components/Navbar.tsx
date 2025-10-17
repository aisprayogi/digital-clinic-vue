import { Link, useLocation } from "react-router-dom";
import { Activity, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  userRole?: "admin" | "doctor";
  userName?: string;
}

export function Navbar({ userRole, userName = "User" }: NavbarProps) {
  const location = useLocation();

  const handleLogout = () => {
    // TODO: Implement logout logic
    window.location.href = "/";
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to={userRole === "admin" ? "/admin" : "/doctor"} className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
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
