import { getFirestore, getDoc, doc } from "firebase/firestore";

const db = getFirestore();

const getOrganisationDoc = async (orgId) => {
  const servicesRef = doc(db, `organisations/${orgId}`);

  const orgDoc = (await getDoc(servicesRef)).data();

  console.log(orgDoc, "orgDoc");

  return orgDoc;
};

export { getOrganisationDoc };
