import React, { useState, useEffect }  from 'react';
import BasicTable from './components/BasicTable';
import PlayersDropdown from './components/inputs/PlayersDropdown';
import PageTitle from './components/PageTitle';

function mergeCourseData(scorecards, courses) {
    return scorecards.map((scorecard) => {
      const { hole, ...rest } = scorecard;
      const courseData = courses.find((course) => course.id === hole);
      const par = courseData ? courseData.par : '';
  
      return { ...rest, hole, par };
    });
  }
  

const Scorecard = () => {
const [data, setData] = useState([]);
const [currHole, setCurrHole] = useState([]);
const [players, setPlayers] = useState([]);
const [selectedPlayerId, setSelectedPlayerId] = useState('');
const cols = ["Hole", "Par", "Strokes", "Penalty"]

const handleDelete = (id) => {
    // console.log('delete', id)
}

const handleEdit = (obj) => {
    // console.log('delete', obj.id)
}

const getData = async (playerId) => {
    const courseResponse = await fetch('http://localhost:3001/courses');
    const courseData = await courseResponse.json();

    const scoreResponse = await fetch(`http://localhost:3001/scorecards?playerId=${playerId}`);
    const scoreData = await scoreResponse.json();

    const filteredScoreData = scoreData.filter((score) => score.hole <= currHole);

    const mergedData = mergeCourseData(filteredScoreData, courseData);

    setData(mergedData);
  };

  const getPlayers = async () => {
    const response = await fetch('http://localhost:3001/players');
    const data = await response.json();
    setPlayers(data);
  };

  const getCurrHole = async () => {
    const response = await fetch('http://localhost:3001/currentHoles');
    const data = await response.json();
    setCurrHole(data['currentHole']);
  };

  const handlePlayerChange = (event) => {
    setSelectedPlayerId(event.target.value);
  };

useEffect(() => {
    getData(selectedPlayerId)
}, [selectedPlayerId])

useEffect(() => {
    getPlayers()
    getCurrHole()
  }, []);

  return (<main>
    <section id="scorecard">
    <PageTitle title="Scorecard"/>
      <h2>Scorecard</h2>
      <PlayersDropdown
        players={players}
        value={selectedPlayerId}
        onChange={handlePlayerChange}
      />
      <BasicTable data={data} columns={cols} onDelete={handleDelete} onEdit={handleEdit}></BasicTable>
    </section>
  </main>)
};

export default Scorecard;
