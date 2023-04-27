import { getIdToken, getAuth } from "firebase/auth";
const apiUrl = import.meta.env.VITE_APIURL;

//get user
const user = getAuth().currentUser;
//get token
const token = await getIdToken(user);

const getBookingAvailability = async (orgId, selectedDate) => {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ selectedDate }),
    mode: "cors",
  };

  console.log("request", request);

  let response = await fetch(
    `${apiUrl}/booking/${orgId}/get-availability`,
    request
  );

  response = await response.json();

  console.log("response", response);

  return response;
};

export { getBookingAvailability };
