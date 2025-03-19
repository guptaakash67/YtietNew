"use client";
import React, { useState, useEffect } from 'react';
import AnimatedElement from '@/components/Common/Animation/AnimatedElement';

export default function AlumniPage() {
  const [AlumniData, setAlumniData] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(null);

  const fetchData = async () => {
    setLoader(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/data.json');
      if (!res.ok) {
        throw new Error('Failed to fetch alumni data');
      }
      const jsonData = await res.json();
      setAlumniData(jsonData.AlumniData);
    } catch (error) {
      console.error("Error fetching alumni data:", error);
      setErrorMessage(error.message || "An error occurred while fetching the alumni data. Please try again later.");
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-blue-400">| YTIET </span>ALUMNI
        </h1>
      </AnimatedElement>

      {/* Display a simple loading message instead of skeleton loader */}
      {Loader && <p className="text-center text-gray-500">Loading...</p>}

      {/* Display error message if there's an error */}
      {ErrorMessage && (
        <div className="text-red-500 text-center my-4">
          {ErrorMessage}
        </div>
      )}

      {/* Alumni data rendering */}
      {AlumniData && !Loader && !ErrorMessage && (
        <div className="lg:px-2 py-4 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(AlumniData) && AlumniData.length > 0 ? (
            AlumniData.map((alumni) => (
              <div key={alumni.name} className="p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold text-gray-900">{alumni.name}</h2>
                <p className="text-gray-600">Graduation Year: {alumni.graduationYear}</p>
                <p className="text-gray-600">Course: {alumni.course}</p>
                <p className="text-gray-600">Location: {alumni.location}</p>
                {alumni.contact && (
                  <p className="text-blue-500 mt-2">
                    Contact: <a href={`mailto:${alumni.contact}`}>{alumni.contact}</a>
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No alumni data available at the moment.</div>
          )}
        </div>
      )}
    </section>
  );
}