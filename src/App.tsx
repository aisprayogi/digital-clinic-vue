import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import PatientRegistration from "./pages/PatientRegistration";
import PatientList from "./pages/PatientList";
import MedicalRecord from "./pages/MedicalRecord";
import POS from "./pages/POS";
import StockManagement from "./pages/StockManagement";
import PromotionManagement from "./pages/PromotionManagement";
import VoucherManagement from "./pages/VoucherManagement";
import TransactionHistory from "./pages/TransactionHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patient-register" element={<PatientRegistration />} />
          <Route path="/medical-record/:patientId" element={<MedicalRecord />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/stock" element={<StockManagement />} />
          <Route path="/promotions" element={<PromotionManagement />} />
          <Route path="/vouchers" element={<VoucherManagement />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
