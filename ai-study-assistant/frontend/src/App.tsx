import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./layout/AppShell";
import { useAuth } from "./auth/AuthContext";
import { ChatPage } from "./pages/ChatPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { LoginPage } from "./pages/LoginPage";
import { QuizzesPage } from "./pages/QuizzesPage";
import { SignupPage } from "./pages/SignupPage";
import { SummaryPage } from "./pages/SummaryPage";

function ProtectedApp() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedApp />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/summaries" element={<SummaryPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

