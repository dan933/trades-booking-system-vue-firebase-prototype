import { getIdToken, getAuth } from "firebase/auth";
const apiUrl = import.meta.env.VITE_APIURL;

//get user
const user = getAuth().currentUser;
//get token
const token = await getIdToken(user);

const getCustomerDetails = async () => {
  console.log("token", token);

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };

  const response = await fetch(`${apiUrl}/customer/get-details`, config);
};

const createCustomer = async () => {
  console.log("token", token);

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };

  const response = await fetch(`${apiUrl}/customer/get-details`, config);
};

const updateCustomer = async () => {
  console.log("token", token);

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };

  const response = await fetch(`${apiUrl}/customer/get-details`, config);
};

export { getCustomerDetails, createCustomer, updateCustomer };
