"use client";
import React, { useState, useEffect } from 'react';
import AnimatedElement from '@/components/Common/Animation/AnimatedElement';

export default function NaacPage() {
  const [NaacData, setNaacData] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(null);

  // Simulating a fetch for NAAC data (hardcoded for now)
  const fetchData = async () => {
    setLoader(true);
    setErrorMessage(null);

    try {
      // Hardcoded NAAC data for YTIET
      const data = {
        grade: "B",
        cgpa: "2.40", // Placeholder; update with actual CGPA if available
        accreditationCycle: "Cycle 1", // Placeholder; update with actual cycle
        accreditationDate: "2021", // Placeholder; update with actual date
        validUntil: "2026", // Typically valid for 5 years
      };
      setNaacData(data);
    } catch (error) {
      console.error("Error setting NAAC data:", error);
      setErrorMessage("An error occurred while loading the NAAC data. Please try again later.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="text-gray-600 body-font mb-12">
      <AnimatedElement>
        <h1 className="m-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-blue-400">| YTIET </span>NAAC ACCREDITATION
        </h1>
      </AnimatedElement>

      {/* Display a simple loading message */}
      {Loader && <p className="text-center text-gray-500">Loading...</p>}

      {/* Display error message if there's an error */}
      {ErrorMessage && (
        <div className="text-red-500 text-center my-4">
          {ErrorMessage}
        </div>
      )}

      {/* NAAC data rendering */}
      {NaacData && !Loader && !ErrorMessage && (
        <div className="lg:px-2 py-4 mx-auto">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">NAAC Accreditation Details</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Grade:</span> {NaacData.grade}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">CGPA:</span> {NaacData.cgpa} (on a scale of 4.0)
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Accreditation Cycle:</span> {NaacData.accreditationCycle}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Accredited In:</span> {NaacData.accreditationDate}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Valid Until:</span> {NaacData.validUntil}
            </p>
            <p className="text-gray-600 mt-4">
              The National Assessment and Accreditation Council (NAAC) evaluates higher education institutions in India on various parameters such as curriculum, teaching-learning processes, research, infrastructure, and governance. YTIET’s B grade reflects a satisfactory performance, ensuring quality education and facilities for our students.
            </p>
            <a
              href="https://www.naac.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Learn more about NAAC
            </a>
          </div>
        </div>
      )}
    </section>
  );
}