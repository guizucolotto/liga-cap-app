import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext"; // ✅ Import do contexto

import MainLayout from "./components/MainLayout";
const Index = lazy(() => import("./pages/Index"));
const TeamsPage = lazy(() => import("./pages/TeamsPage"));
const TeamDetailPage = lazy(() => import("./pages/TeamDetailPage"));
const PlayersPage = lazy(() => import("./pages/PlayersPage"));
const SchedulePage = lazy(() => import("./pages/SchedulePage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProfilePage = lazy(() => import("./pages/ProfilePage")); // ✅ Se já existir

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider> {/* ✅ Wrap com o AuthProvider */}
          <Suspense fallback={<div>Loading page…</div>}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} /> {/* ✅ Adicione esta rota */}
                <Route path="/" element={<Index />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/teams/:teamId" element={<TeamDetailPage />} />
                <Route path="/players" element={<PlayersPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/stats" element={<StatsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

