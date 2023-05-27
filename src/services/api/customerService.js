import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";

//get user
const user = getAuth().currentUser;

let userId = user?.uid;

const db = getFirestore();

const getCustomerDetails = async (orgId) => {
  let userDocRef = doc(db, `organisations/${orgId}/users/${userId}`);

  let userDoc = await getDoc(userDocRef);

  return userDoc.data();
};

const updateCustomerDetails = async (requestBody, orgId) => {
  const userDocRef = doc(db, `organisations/${orgId}/users/${userId}`);

  await setDoc(userDocRef, requestBody);
};

export { getCustomerDetails, updateCustomerDetails };
