import React from "react";
import StudentDiplomas from "../components/StudentDiplomas";

const HomePage = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <section className="mb-8">
        <StudentDiplomas />
      </section>
    </div>
  );
};

export default HomePage;
