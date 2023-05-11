import db from "./firebase";
import { ref, remove, set, onValue } from "firebase/database";
import { uuidv4 } from "@firebase/util";


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


  export const insertDB = (endpoint, newRecord, customFunction = () => {}, showSnackbar) => {
    const formattedEndpoint = formatEndpoint(endpoint);
    const recId = uuidv4();
    newRecord.id = recId
    const newRecordRef = ref(db, `${endpoint}/${recId}`);
    newRecord = convertKeysToLower(newRecord);
    set(newRecordRef, { ...newRecord, id: recId })
      .then(() => {
        customFunction()
        showSnackbar(`${formattedEndpoint} inserted successfully`, 'success');
      })
      .catch((error) => {
        console.error(error)
        showSnackbar(`Error inserting ${formattedEndpoint}`, 'error');
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
  
  function convertKeysToLower(obj) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key.toLowerCase()] = value;
    }
    return newObj;
  }