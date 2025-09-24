import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import LoginModal from "./components/LoginModal";
import CreateStudent from "./components/CreateStudent";
import UploadDiploma from "./components/UploadDiploma";
import Navbar from "./components/Navbar";
import ListEstudents from "./components/ListEstudents";
export default function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
    <Toaster />
    {user && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route path="/auth" element={<LoginModal />} />
        <Route path="/estudiantes" element={user ? <CreateStudent /> : <Navigate to="/auth" />} />
        <Route path="/diplomas" element={user ? <UploadDiploma /> : <Navigate to="/auth" />} />
        <Route path="/list-estudiantes" element={user ? <ListEstudents /> : <Navigate to="/auth" />} />

      </Routes>
    </>
  );
}
