"use client";
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import AnimatedElement from '@/components/Common/Animation/AnimatedElement';
import ParagraphSkeletonLoader from '../Common/SkeletonLoader/ParagraphSkeletonLoader';

export default function EventCardSection({ HorizontalScroll = true }) {
  const [EventsData, setEventsData] = useState(null);
  const [Loader, setLoader] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState(null);

  const fetchData = async () => {
    setLoader(true);
    setErrorMessage(null);

    try {
      // Fetching data from data.json (assuming it's in the public folder or an API endpoint)
      const res = await fetch('/data.json'); // Adjust the path if necessary
      if (!res.ok) {
        throw new Error('Failed to fetch event data');
      }
      const jsonData = await res.json();
      
      // Assuming the JSON structure matches your provided "EventsData" array
      const data = jsonData.EventsData.reverse(); // Reverse the array as in your original code
      setEventsData(data);
    } catch (error) {
      console.error("Error fetching event data:", error);
      setErrorMessage(error.message || "An error occurred while fetching the event data. Please check your connection and try again.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <section className="text-gray-600 body-font mb-12">
        <AnimatedElement>
          <h1 className="m-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-blue-400">| UPCOMING </span>EVENTS :
          </h1>
        </AnimatedElement>

        {/* Display loader while data is being fetched */}
        {Loader && <ParagraphSkeletonLoader />}

        {/* Display error message if there's an error */}
        {ErrorMessage && (
          <div className="text-red-500 text-center my-4">
            {ErrorMessage}
          </div>
        )}

        {/* Event data rendering */}
        {EventsData && !Loader && !ErrorMessage && (
          <div className={`lg:px-2 py-4 mx-auto ${HorizontalScroll ? "overflow-x-scroll" : "overflow-x-hidden"} overflow-x-scroll`}>
            {Array.isArray(EventsData) && EventsData.length > 0 && (
              <div className={`flex justify-center ${HorizontalScroll ? "w-fit flex-row" : "flex-wrap"}`}>
                {EventsData.map((data, index) => (
                  <div key={index} className={`p-2 my-4 mx-2 md:w-96 ${HorizontalScroll ? "w-96" : "w-full"}`}>
                    <EventCard data={data} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}