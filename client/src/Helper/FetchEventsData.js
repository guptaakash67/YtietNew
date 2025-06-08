// const FetchEventsData = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await fetch(process.env.NEXT_PUBLIC_SERVERURL + '/api/v1/event/all');
           
//             const data = await response.json();
//             resolve({
//                 data: data.events,
//                 success: true
//             });
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             reject({
//                 message: error.message,
//                 success: false
//             });
//         }
//     })
// }

// export default FetchEventsData;

import axios from 'axios';

const FetchEventsData = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/v1/events/getevents');
    console.log('API Response:', response.data); // Log the response for debugging
    return response.data;
  } catch (err) {
    console.error('Error fetching events data:', err);

    // Provide more detailed error information
    if (err.response) {
      // The request was made, but the server responded with a status code outside the 2xx range
      console.error('Server responded with an error:', err.response.status, err.response.data);
      throw new Error(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
    } else if (err.request) {
      // The request was made, but no response was received
      console.error('No response received from the server:', err.request);
      throw new Error('No response received from the server. Please check your network connection.');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up the request:', err.message);
      throw new Error('Error setting up the request. Please try again.');
    }
  }
};

export default FetchEventsData;