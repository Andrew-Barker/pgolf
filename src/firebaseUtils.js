import db from "./firebase";
import { ref, remove, set, onValue } from "firebase/database";

export const removeFromDB = (endpoint, id, customFunction = () => {}) => {
    // Remove the record from Firebase Realtime Database
    const recordRef = ref(db, `${endpoint}/${id}`);
    remove(recordRef)
      .then(() => {
        customFunction();
      })
      .catch((error) => {
        console.error("Error:", error);
        customFunction();
      });
  };
  

export const updateDB = (endpoint, obj, customFunction = () => {}) => {
  // Pass the id up to the parent component
  const recordRef = ref(db, `${endpoint}/${obj.id}`);
  set(recordRef, obj)
    .then(() => {
      customFunction();
    })
    .catch((error) => {
      console.error("Error:", error);
      customFunction();
    });
};


export const getFromDB = async (endpoint, setDataState, sortKey = null) => {
    const holesRef = ref(db, endpoint);
    onValue(holesRef, (snapshot) => {
      const data = snapshot.val();
      const orderedData = Object.values(data || {}).sort((a, b) => a[sortKey] - b[sortKey]);
      setDataState(orderedData ? Object.values(orderedData) : []);
    });
  };
