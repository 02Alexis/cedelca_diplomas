import React, { useState } from "react";
import useAuthStore from "./store/useAuthStore";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginModal from "./components/LoginModal";
import CreateStudent from "./components/CreateStudent";
import UploadDiploma from "./components/UploadDiploma";

export default function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={<LoginModal />} />
        <Route path="/estudiantes" element={<CreateStudent />} />
        <Route path="/diplomas" element={<UploadDiploma />} />

      </Routes>
    </>
  );
}
