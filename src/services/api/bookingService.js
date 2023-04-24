import { getIdToken, getAuth } from "firebase/auth";
const apiUrl = import.meta.env.VITE_APIURL;

const getBookingAvailability = async () => {
  //get user
  const user = getAuth().currentUser;
  //get token
  const token = await getIdToken(user);
  console.log("token", token);

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };

  const response = await fetch(`${apiUrl}/booking/get-availability`, config);
};

export { getBookingAvailability };
