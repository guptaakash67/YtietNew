"use client";
import React, { useState, useEffect } from 'react';
import AnimatedElement from '@/components/Common/Animation/AnimatedElement';
import Head from 'next/head';

export default function PlacementPage() {
  const [PlacementData, setPlacementData] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(null);

  const fetchData = async () => {
    setLoader(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/data.json'); // Adjust to '/placement-data.json' if separate
      if (!res.ok) {
        throw new Error('Failed to fetch placement data');
      }
      const jsonData = await res.json();
      setPlacementData(jsonData.PlacementData);
    } catch (error) {
      console.error("Error fetching placement data:", error);
      setErrorMessage(error.message || "An error occurred while fetching the placement data. Please try again later.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>YTIET Placements - Top Companies & Packages</title>
        <meta
          name="description"
          content="Explore the latest placement records of Yadavrao Tasgaonkar Institute of Engineering and Technology (YTIET). Discover top companies, packages, and student success stories."
        />
      </Head>
      <section className="text-gray-600 body-font mb-12 bg-gradient-to-b from-white to-gray-50">
        <AnimatedElement>
          <h1 className="m-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl ">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-blue-400">
              | YTIET
            </span>{' '}
            PLACEMENTS
          </h1>
        </AnimatedElement>

        {/* Display a simple loading message */}
        {Loader && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-lg">Loading placement records...</p>
          </div>
        )}

        {/* Display error message if there's an error */}
        {ErrorMessage && (
          <div className="text-red-500 text-center my-4 p-4 bg-red-100 rounded-lg max-w-2xl mx-auto">
            {ErrorMessage}
          </div>
        )}

        {/* Placement data rendering */}
        {PlacementData && !Loader && !ErrorMessage && (
          <div className="lg:px-4 py-6 mx-auto max-w-7xl">
            {Array.isArray(PlacementData) && PlacementData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PlacementData.map((placement) => (
                  <div
                    key={placement.studentName}
                    className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800 truncate">
                        {placement.companyName}
                      </h2>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {placement.package}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium text-gray-800">Student:</span>{' '}
                      {placement.studentName}
                    </p>
                    {placement.role && (
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium text-gray-800">Role:</span>{' '}
                        {placement.role}
                      </p>
                    )}
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium text-gray-800">Year:</span>{' '}
                      {placement.year}
                    </p>
                    {placement.location && (
                      <p className="text-gray-600">
                        <span className="font-medium text-gray-800">Location:</span>{' '}
                        {placement.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">
                No placement data available at the moment.
              </div>
            )}
            {/* Call-to-action button */}
            <div className="text-center mt-8">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-800 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                View Full Placement Report
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}