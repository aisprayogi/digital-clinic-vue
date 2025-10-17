import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role: "admin" | "doctor") => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate(role === "admin" ? "/admin" : "/doctor");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Activity className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">MediClinic</h1>
          </div>
          <p className="text-muted-foreground">Sistem Manajemen Klinik Terpadu</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Selamat Datang</CardTitle>
            <CardDescription>Silakan login untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="doctor">Dokter</TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@klinik.com"
                    defaultValue="admin@klinik.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="password"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleLogin("admin")}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login sebagai Admin"}
                </Button>
              </TabsContent>

              <TabsContent value="doctor" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email</Label>
                  <Input
                    id="doctor-email"
                    type="email"
                    placeholder="dokter@klinik.com"
                    defaultValue="dokter@klinik.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-password">Password</Label>
                  <Input
                    id="doctor-password"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="password"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleLogin("doctor")}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login sebagai Dokter"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo: Gunakan kredensial yang sudah terisi untuk login
        </p>
      </div>
    </div>
  );
}
