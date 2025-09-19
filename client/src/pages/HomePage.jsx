import React, { useState } from "react";
import LoginModal from "../components/LoginModal";
import StudentDiplomas from "../components/StudentDiplomas";
import useAuthStore from "../store/useAuthStore";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Navbar />
      {!user ? (
        <>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Iniciar sesión
          </button>

          <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
      ) : (
        <div>

          <section className="mb-8">
            <StudentDiplomas document={user.document} />
          </section>
        </div>
      )}
    </div>
  );
};

export default HomePage;
