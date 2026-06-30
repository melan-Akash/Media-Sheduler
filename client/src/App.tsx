import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Accounts from "./pages/accounts";
import Scheduler from "./pages/scheduleuler";
import AIComposer from "./pages/AI composer";
import Layout from "./components/layout";
import { useApp } from "./context/appcontext";
import { Toaster } from "react-hot-toast";
import { TourProvider } from "./context/tourcontext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useApp();
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}

export default function App() {
    return (
        <TourProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/scheduler" element={<Scheduler />} />
                    <Route path="/ai-composer" element={<AIComposer />} />
                </Route>
            </Routes>
        </TourProvider>
    );
}
