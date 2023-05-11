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


export const getFromDB = async (endpoint, setDataState, showSnackbar, sortKey = null, filterOptions = null) => {
  const formattedEndpoint = formatEndpoint(endpoint);
  const pathsRef = ref(db, endpoint);
  onValue(pathsRef, (snapshot) => {
    let data = snapshot.val();
    
    if (filterOptions) {
      const filterKey = Object.keys(filterOptions)[0];
      const filterValue = filterOptions[filterKey];
      console.log('filter options', filterOptions, filterKey, filterValue, data)
      data = Object.values(data || {}).filter(item => item[filterKey] === filterValue);
      console.log('data after', data)
    } else {
      data = Object.values(data || {});
    }

    if (sortKey) {
      data.sort((a, b) => {
        if (sortKey === 'hole') {
          return parseInt(a[sortKey], 10) - parseInt(b[sortKey], 10);
        }
        if (typeof a[sortKey] === 'string' && typeof b[sortKey] === 'string') {
          return a[sortKey].localeCompare(b[sortKey]);
        }
        return a[sortKey] - b[sortKey];
      });
    }

    setDataState(data);
  }, (error) => {
    console.log(error)
    showSnackbar(`Error getting ${formattedEndpoint}s`, 'error');
  });
};
  
  


  export const insertDB = (endpoint, newRecord, showSnackbar, idToUse = undefined, displayToast = true, customFunction = () => {}, includeIdOnRecord = true) => {
    const formattedEndpoint = formatEndpoint(endpoint);
    const recId = idToUse ? idToUse : uuidv4();
    if(includeIdOnRecord){
      newRecord.id = recId
    }
    const newRecordRef = ref(db, `${endpoint}/${recId}`);
    newRecord = convertKeysToLower(newRecord);
    set(newRecordRef, includeIdOnRecord ? { ...newRecord, id: recId } : newRecord)
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


  export const getCurrHole = async (setState, showSnackbar) => {
    const currHoleRef = ref(db, 'current_hole');
    onValue(currHoleRef, (snapshot) => {
      const holeNumber = snapshot.val();
      setState(holeNumber);
    }, (error) => {
      console.log(error)
      showSnackbar(`Error getting current hole`, 'error');
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
        const id = uuidv4()
        baseScorecard[id] = {
          id: id,
          hole: holesData[holeId].hole,
          strokes: 0,
          penalty: ''
        };
      });

    insertDB(`scorecards/`, baseScorecard, undefined, playerId, false, () => ({}), false)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  