import { getIdToken, getAuth } from "firebase/auth";
const apiUrl = import.meta.env.VITE_APIURL;

//get user
const user = getAuth().currentUser;
//get token
const token = await getIdToken(user);

const getCustomerDetails = async (orgId) => {
  console.log("token", token);

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    mode: "cors",
  };

  let response = await fetch(
    `${apiUrl}/customer/${orgId}/get-customer-details`,
    config
  );

  response = await response.json();
  console.log(response);

  return response;
};

const createCustomerDetails = async () => {
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

const updateCustomerDetails = async (requestBody, orgId) => {
  console.log("token", token);

  console.log(JSON.stringify(requestBody));

  const config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
    mode: "cors",
  };

  let response = await fetch(
    `${apiUrl}/customer/${orgId}/update-customer-details`,
    config
  );

  response = await response.json();

  console.log("response", response);
};

export { getCustomerDetails, createCustomerDetails, updateCustomerDetails };
