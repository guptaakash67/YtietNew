"use client";
import React, { useState, useEffect } from 'react';
import AnimatedElement from '@/components/Common/Animation/AnimatedElement';
import Head from 'next/head';

export default function LibraryPage() {
  const [LibraryData, setLibraryData] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(null);

  const fetchData = async () => {
    setLoader(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/data.json');
      if (!res.ok) {
        throw new Error('Failed to fetch library data');
      }
      const jsonData = await res.json();
      setLibraryData(jsonData.LibraryData);
    } catch (error) {
      console.error("Error fetching library data:", error);
      setErrorMessage(error.message || "An error occurred while fetching the library data. Please try again later.");
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
        <title>YTIET Library - Resources & Facilities</title>
        <meta
          name="description"
          content="Explore the YTIET Central Library at Yadavrao Tasgaonkar Institute of Engineering and Technology. Access books, journals, e-resources, and more."
        />
      </Head>
      <section className="text-gray-600 body-font mb-12 bg-gradient-to-b from-white to-gray-50">
        <AnimatedElement>
          <h1 className="m-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl ">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-blue-400">
              | YTIET
            </span>{' '}
            LIBRARY
          </h1>
        </AnimatedElement>

        {/* Display a simple loading message */}
        {Loader && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-lg">Loading library details...</p>
          </div>
        )}

        {/* Display error message if there's an error */}
        {ErrorMessage && (
          <div className="text-red-500 text-center my-4 p-4 bg-red-100 rounded-lg max-w-2xl mx-auto">
            {ErrorMessage}
          </div>
        )}

        {/* Library data rendering */}
        {LibraryData && !Loader && !ErrorMessage && (
          <div className="lg:px-4 py-6 mx-auto max-w-5xl">
            {/* Library Overview */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{LibraryData.title}</h2>
              <p className="text-gray-600 leading-relaxed">{LibraryData.description}</p>
            </div>

            {/* Resources Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Our Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {LibraryData.resources.map((resource) => (
                  <div
                    key={resource.name}
                    className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-blue-200"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <img
                        src={resource.icon}
                        alt={resource.name}
                        className="w-12 h-12"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50?text=Icon'; // Fallback image
                        }}
                      />
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 text-center">{resource.name}</h4>
                    <p className="text-gray-600 text-center">{resource.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities Section */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Facilities</h3>
              <ul className="list-disc list-inside text-gray-600 max-w-2xl mx-auto">
                {LibraryData.facilities.map((facility, index) => (
                  <li key={index} className="mb-2">{facility}</li>
                ))}
              </ul>
            </div>

            {/* Operating Hours and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Operating Hours</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Weekdays:</span> {LibraryData.operatingHours.weekdays}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Weekends:</span> {LibraryData.operatingHours.weekends}
                </p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Contact Us</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{' '}
                  <a href={`mailto:${LibraryData.contact.email}`} className="text-blue-500 hover:underline">
                    {LibraryData.contact.email}
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {LibraryData.contact.phone}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}