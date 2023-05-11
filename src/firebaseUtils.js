import db from "./firebase";
import { ref, remove, set, onValue } from "firebase/database";


export const removeFromDB = (endpoint, id, customFunction = () => {}, showSnackbar) => {
    // Remove the record from Firebase Realtime Database
    const formattedEndpoint = formatEndpoint(endpoint);
    const recordRef = ref(db, `${endpoint}/${id}`);
    remove(recordRef)
      .then(() => {
        customFunction();
        showSnackbar(`${formattedEndpoint} removed successfully`, 'success');
      })
      .catch((error) => {
        console.error("Error:", error);
        customFunction();
        showSnackbar(`Error removing ${formattedEndpoint}`, 'error');
      });
  };
  

export const updateDB = (endpoint, obj, customFunction = () => {}, showSnackbar) => {
  // Pass the id up to the parent component
  const formattedEndpoint = formatEndpoint(endpoint);
  const recordRef = ref(db, `${endpoint}/${obj.id}`);
  set(recordRef, obj)
    .then(() => {
      customFunction();
      showSnackbar(`${formattedEndpoint} updated successfully`, 'success');
    })
    .catch((error) => {
      console.error("Error:", error);
      customFunction();
      showSnackbar(`Error updating ${formattedEndpoint}`, 'error');
    });
};


export const getFromDB = async (endpoint, setDataState, showSnackbar, sortKey = null ) => {
    const formattedEndpoint = formatEndpoint(endpoint);
    const holesRef = ref(db, endpoint);
    onValue(holesRef, (snapshot) => {
      const data = snapshot.val();
      const orderedData = Object.values(data || {}).sort((a, b) => a[sortKey] - b[sortKey]);
      setDataState(orderedData ? Object.values(orderedData) : []);
    }, (error) => {
        console.log(error)
        showSnackbar(`Error getting ${formattedEndpoint}s`, 'error');
    });
  };


  const formatEndpoint = (endpoint) => {
    if (endpoint === 'course/holes') {
      return 'hole';
    } else if (endpoint.endsWith('s')) {
      return endpoint.slice(0, -1);
    } else {
      return endpoint;
    }
  };
  