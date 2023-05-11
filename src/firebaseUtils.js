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
        if (formattedEndpoint === 'hole') {
          removeStaleHoleOnScorecard()
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


export const getFromDB = async (endpoint, setDataState, showSnackbar, sortKey = null, filterOptions = null, nonArrayValue = false) => {
  const formattedEndpoint = formatEndpoint(endpoint);
  const pathsRef = ref(db, endpoint);
  onValue(pathsRef, (snapshot) => {
    let data = snapshot.val();

    if (filterOptions) {
      const filterKey = Object.keys(filterOptions)[0];
      const filterValue = filterOptions[filterKey];
      data = nonArrayValue ? data : Object.values(data || {}).filter(item => item[filterKey] === filterValue);
    } else {
      data = nonArrayValue ? data : Object.values(data || {});
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
    console.error(error)
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
        if (formattedEndpoint === 'hole') {
          addNewHoleAllPlayersScorecards(newRecord.hole, showSnackbar)
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
      console.error(error)
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
      console.error(error);
    });
  }

  const addNewHoleAllPlayersScorecards = (holeNum, showSnackbar) => {
    // const scorecardRef = db.ref(`scorecards/${playerId}`);
  const playersRef = ref(db, `players`);

  get(playersRef)
    .then((playersSnapshot) => {
      const playersData = Object.values(playersSnapshot.val());
      
      playersData.forEach((player) => {
        const newHole = {
          id: uuidv4(),
          penalty: '',
          strokes: 0,
          hole: holeNum
        }
        insertDB(`scorecards/${player.id}`, newHole, showSnackbar, newHole.id, false)
      })
      
    })
    .catch((error) => {
      console.error(error);
    });
  }


  const removeStaleHoleOnScorecard = () => {
    const courseHolesRef = ref(db, `course/holes`);
    const scorecardsRef = ref(db, `scorecards`);

    get(courseHolesRef)
    .then((holesSnapshot) => {
      const holesData = holesSnapshot.val();
      
      // Collect unique 'hole' values using a Set
      const uniqueHoles = new Set();

      if(holesData) {
        Object.values(holesData).forEach((hole) => {
          uniqueHoles.add(hole.hole);
        });
      }


      // Convert Set to an array of unique 'hole' values
      const uniqueHolesArray = Array.from(uniqueHoles);

      get(scorecardsRef).then((scoreSnapshot) => {
        const scorecardsData = scoreSnapshot.val();

const invalidScorecardPaths = [];

Object.entries(scorecardsData).forEach(([scorecardId, scorecard]) => {
  Object.entries(scorecard).forEach(([holeId, hole]) => {
    if (!uniqueHolesArray.includes(hole.hole)) {
      const path = `${scorecardId}/${holeId}`;
      invalidScorecardPaths.push(path);
    }
  });
});

const invalidScorecards = invalidScorecardPaths.map((path) => {
  const [playerCard, holeScore] = path.split('/');
  return { playerCard, holeScore };
});
        
invalidScorecards.forEach((invalidCard) => {
          removeFromDB(`scorecards/${invalidCard.playerCard}`,invalidCard.holeScore, undefined, false)
        })
        
      })

    // insertDB(`scorecards/`, baseScorecard, undefined, playerId, false, () => ({}), false)
    })
  }

  