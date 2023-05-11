import db from "./firebase";
import { ref, remove, set, onValue, get } from "firebase/database";
import { uuidv4 } from "@firebase/util";


export const removeFromDB = (endpoint, id, showSnackbar, displayToast = true, customFunction = () => {}  ) => {
    // Remove the record from Firebase Realtime Database
    const formattedEndpoint = formatEndpoint(endpoint);
    const recordRef = ref(db, `${endpoint}/${id}`);
    remove(recordRef)
      .then(() => {
        if(formattedEndpoint === 'player'){
            customFunction(id)
        }
        else{
            customFunction();
        }
        if (displayToast){
            showSnackbar(`${formattedEndpoint} removed successfully`, 'success');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        customFunction();
        showSnackbar(`Error removing ${formattedEndpoint}`, 'error');
      });
  };
  

export const updateDB = (endpoint, obj, showSnackbar, displayToast = true, customFunction = () => {}) => {
  // Pass the id up to the parent component
  const formattedEndpoint = formatEndpoint(endpoint);
  const recordRef = ref(db, `${endpoint}/${obj.id}`);
  set(recordRef, obj)
    .then(() => {
      customFunction();
      if(displayToast) {
          showSnackbar(`${formattedEndpoint} updated successfully`, 'success');
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      customFunction();
      showSnackbar(`Error updating ${formattedEndpoint}`, 'error');
    });
};


export const getFromDB = async (endpoint, setDataState, showSnackbar, sortKey = null) => {
    const formattedEndpoint = formatEndpoint(endpoint);
    const holesRef = ref(db, endpoint);
    onValue(holesRef, (snapshot) => {
      const data = snapshot.val();
      const dataArray = Object.values(data || {});
  
      if (sortKey) {
        dataArray.sort((a, b) => {
          if (sortKey === 'hole') {
            return parseInt(a[sortKey], 10) - parseInt(b[sortKey], 10);
          }
          if (typeof a[sortKey] === 'string' && typeof b[sortKey] === 'string') {
            return a[sortKey].localeCompare(b[sortKey]);
          }
          return a[sortKey] - b[sortKey];
        });
      }
  
      setDataState(dataArray);
    }, (error) => {
      console.log(error)
      showSnackbar(`Error getting ${formattedEndpoint}s`, 'error');
    });
  };
  
  


  export const insertDB = (endpoint, newRecord, showSnackbar, idToUse = undefined, displayToast = true, customFunction = () => {} ) => {
    const formattedEndpoint = formatEndpoint(endpoint);
    const recId = idToUse ? idToUse : uuidv4();
    newRecord.id = recId
    const newRecordRef = ref(db, `${endpoint}/${recId}`);
    newRecord = convertKeysToLower(newRecord);
    set(newRecordRef, { ...newRecord, id: recId })
      .then(() => {
        customFunction()
        if(displayToast) {
            showSnackbar(`${formattedEndpoint} inserted successfully`, 'success');
        }
        if (formattedEndpoint === 'player'){
            createBaseScorecard(recId, showSnackbar)
        }
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
  
  const convertKeysToLower = (obj) => {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key.toLowerCase()] = value;
    }
    return newObj;
  }

  const createBaseScorecard = (playerId) => {
    // const scorecardRef = db.ref(`scorecards/${playerId}`);
  const courseHolesRef = ref(db, `course/holes`);

  get(courseHolesRef)
    .then((holesSnapshot) => {
      const holesData = holesSnapshot.val();
      
      // Create the base scorecard object
      const baseScorecard = {};
      Object.keys(holesData).forEach((holeId) => {
        baseScorecard[holeId] = {
          hole: holesData[holeId].hole,
          strokes: 0,
          penalty: ''
        };
      });

    insertDB(`scorecards/`, baseScorecard, undefined, playerId, false)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  