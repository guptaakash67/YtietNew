// 

import axios from "axios";

export const CreateEvent = async (title, details, posterURL) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/event`,
      { title, details, posterURL },
      { withCredentials: true }
    );
    return response.data; // Expect { success: true, message: "Event created successfully" }
  } catch (error) {
    console.error("Error creating event:", error);
    throw error.response ? error.response.data : { message: error.message, success: false };
  }
};