import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ItemSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  medicines: Medicine[];
  customerType: "patient" | "walk-in";
  initialTab?: "services" | "medicines";
  onAddService: (serviceId: string) => void;
  onAddMedicine: (medicineId: string, qty: number) => void;
  formatRupiah: (amount: number) => string;
}

export function ItemSelectionDialog({
  open,
  onOpenChange,
  services,
  medicines,
  customerType,
  initialTab = "services",
  onAddService,
  onAddMedicine,
  formatRupiah
}: ItemSelectionDialogProps) {
  const [serviceSearch, setServiceSearch] = useState("");
  const [medicineSearch, setMedicineSearch] = useState("");

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  const handleAddService = (serviceId: string) => {
    onAddService(serviceId);
  };

  const handleAddMedicine = (medicineId: string, inputElement?: HTMLInputElement) => {
    const qty = inputElement ? parseInt(inputElement.value) || 1 : 1;
    onAddMedicine(medicineId, qty);
    if (inputElement) inputElement.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Tambah Item</DialogTitle>
          <DialogDescription>
            Pilih layanan atau obat untuk ditambahkan ke tagihan
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {customerType === "patient" && <TabsTrigger value="services">Layanan</TabsTrigger>}
            <TabsTrigger value="medicines" className={customerType === "walk-in" ? "col-span-2" : ""}>
              Obat
            </TabsTrigger>
          </TabsList>

          {customerType === "patient" && (
            <TabsContent value="services" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari layanan..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {filteredServices.map((service) => (
                  <Button
                    key={service.id}
                    variant="outline"
                    className="justify-start h-auto p-4 hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => {
                      handleAddService(service.id);
                      onOpenChange(false);
                    }}
                  >
                    <div className="text-left w-full">
                      <div className="font-medium text-sm">{service.name}</div>
                      <div className="text-xs text-muted-foreground">{formatRupiah(service.price)}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="medicines" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari obat..."
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredMedicines.map((medicine) => (
                <div key={medicine.id} className="flex items-center gap-2 p-3 border rounded-lg hover:border-primary transition-colors">
                  <button
                    type="button"
                    className="flex-1 text-left"
                    onClick={() => {
                      handleAddMedicine(medicine.id);
                      onOpenChange(false);
                    }}
                  >
                    <div className="font-medium text-sm">{medicine.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatRupiah(medicine.price)} • Stok: {medicine.stock}
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max={medicine.stock}
                      placeholder="Qty"
                      className="w-16 h-9 text-center"
                      id={`qty-${medicine.id}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddMedicine(medicine.id, e.currentTarget);
                          onOpenChange(false);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      className="h-9"
                      onClick={(e) => {
                        const input = document.getElementById(`qty-${medicine.id}`) as HTMLInputElement;
                        handleAddMedicine(medicine.id, input);
                        onOpenChange(false);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
