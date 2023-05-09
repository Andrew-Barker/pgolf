import React, { useState, useEffect } from 'react';
import PageTitle from './components/PageTitle';
import BasicTable from './components/BasicTable';
import { v4 as uuidv4 } from 'uuid';

const Leaderboard = () => {
  const [teamScores, setTeamScores] = useState([]);
  const teamCols = ["Team", "Strokes", "Score"]

  const [indScores, setIndScores] = useState([]);
  const indCols = ["Name", "Strokes", "Score"]

  const [currCourseInfo, setCurrCourseInfo] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch('http://localhost:3001/scorecards');
    const scorecardsData = await response.json();

    const playersResponse = await fetch('http://localhost:3001/players');
    const playersData = await playersResponse.json();

    const currHoleResponse = await fetch('http://localhost:3001/currentHoles');
    const currHole = await currHoleResponse.json();

    const courseResponse = await fetch('http://localhost:3001/courses');
    const courseData = await courseResponse.json();

    const summedPar = sumPar(courseData, currHole.currentHole)
    console.log('summed par', summedPar)

    setCurrCourseInfo({hole: currHole.currentHole, par: summedPar})

    setIndScores(rollupIndData(scorecardsData, playersData, currHole.currentHole, summedPar))
  };

  const rollupIndData = (scorecardsData, playersData, currHole, summedPar) => {
    let indData = []
    playersData.forEach((player, index) => {
      const playerScorecards = scorecardsData.filter(scorecard => scorecard.playerId === player.id && scorecard.hole <= currHole);
      const totalStrokes = playerScorecards.reduce((accumulator, scorecard) => accumulator + scorecard.strokes, 0);
      indData.push({'id': index,'name': player.name, 'strokes': totalStrokes, score: totalStrokes-summedPar, 'team': player.team})
    })

    indData.sort((a, b) => a.score - b.score);
    setTeamScores(getTeamScores(indData, summedPar))
    return indData
  }

  const sumPar = (courses, currHole) => {
    return courses.reduce((acc, course) => {
      if (course.hole <= currHole) {
        return acc + parseInt(course.par);
      }
      return acc;
    }, 0);
  };
  

  function getTeamScores(data, summedPar) {
    const teamScores = {};
  
    // Iterate through each scorecard
    for (const scorecard of data) {
      // If the team does not exist in the teamScores object, add it
      if (!teamScores[scorecard.team]) {
        teamScores[scorecard.team] = 0;
      }
  
      // Add the score to the team's total
      teamScores[scorecard.team] += scorecard.strokes;
    }
  
    // Convert the teamScores object to an array of {id, team, score} objects
    const teamScoresArray = Object.entries(teamScores).map(([team, strokes]) => ({
      id: uuidv4(),
      team,
      strokes,
      score: strokes - (summedPar*2),
    }));

    teamScoresArray.sort((a, b) => a.score - b.score);
    console.log('team scores', teamScoresArray)
    return teamScoresArray;
  }
  
  

  return (
  <main>
    <PageTitle title="Leaderboard"/>
    <section id="course-info">
      {currCourseInfo.hole && (<p><strong>Hole: {currCourseInfo.hole}</strong></p>)}
      {currCourseInfo.par && (<p><strong>Par: {currCourseInfo.par}</strong></p>)}
    </section>
    <section id="team-leaderboard">
      <h2>Team Leaderboard</h2>
      <BasicTable data={teamScores} columns={teamCols} showActions={false} gridHeight="34vh" showTotalFooter={false}/>
    </section>
    <section id="individual-leaderboard">
      <h2>Individual Leaderboard</h2>
      <BasicTable data={indScores} columns={indCols} showActions={false} gridHeight="45vh" showTotalFooter={false}/>
    </section>
  </main>
  )
}

export default Leaderboard;
