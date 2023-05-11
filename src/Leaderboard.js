import React, { useState, useEffect, useContext } from 'react';
import PageTitle from './components/PageTitle';
import BasicTable from './components/BasicTable';
import { v4 as uuidv4 } from 'uuid';
import { getFromDB, getCurrHole } from "./firebaseUtils";
import { SnackbarContext } from './SnackbarContext';

const Leaderboard = () => {
  const [teamScores, setTeamScores] = useState([]);
  const [currCourseInfo, setCurrCourseInfo] = useState({});
  const [indScores, setIndScores] = useState([]);
  const [currHole, setCurrHole] = useState(0);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [course, setCourse] = useState([])
  const [scorecards, setScorecards] = useState([])

  const teamCols = ["Team", "Strokes", "Score"]
  const indCols = ["Name", "Strokes", "Score"]

  const showSnackbar = useContext(SnackbarContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    getFromDB('scorecards', setScorecards, showSnackbar, null, null, true)
    getFromDB('players', setPlayers, showSnackbar)
    getFromDB('course/holes', setCourse, showSnackbar)

    getCurrHole(setCurrHole, showSnackbar)
  };


  useEffect(() => {
    const summedPar = sumPar(course, currHole)
    console.log("COURSE", course)
    setCurrCourseInfo({hole: currHole, par: summedPar})

    console.log("SC BEFORE SENDING TO ROLLUP", scorecards)

    setIndScores(rollupIndData(scorecards, players, currHole, summedPar))
  }, [course, currHole, scorecards, players])

  const rollupIndData = (scorecardsData, playersData, currHole, summedPar) => {
    let indData = []
    playersData.forEach((player) => {
      const playerScorecards = Object.values(scorecardsData[player.id]);
        const activeScores = playerScorecards.filter(scorecard => parseInt(scorecard.hole) <= currHole);
      const totalStrokes = activeScores.reduce((accumulator, scorecard) => accumulator + parseInt(scorecard.strokes), 0);
      indData.push({'id': uuidv4(),'name': player.name, 'strokes': totalStrokes, score: totalStrokes-summedPar, 'team': player.team})
      console.log('ind Data', indData)
      
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
    return teamScoresArray;
  }
  
  

  return (
  <main>
    <PageTitle title="Leaderboard"/>
    <section id="course-info">
      {currCourseInfo.hole && currCourseInfo.hole > course.length && (<p><strong>Hole: FINAL</strong></p>)} 
      {currCourseInfo.hole && currCourseInfo.hole <= course.length && (<p><strong>Hole: {currCourseInfo.hole}</strong></p>)}      
    </section>
    <section id="team-leaderboard">
      <h2>Team Leaderboard {currCourseInfo.par && (<small>(Par: {currCourseInfo.par*2})</small>)}</h2>
      <BasicTable data={teamScores} columns={teamCols} showActions={false} gridHeight="34vh" showTotalFooter={false}/>
    </section>
    <section id="individual-leaderboard">
      <h2>Individual Leaderboard {currCourseInfo.par && (<small>(Par: {currCourseInfo.par})</small>)}</h2>
      <BasicTable data={indScores} columns={indCols} showActions={false} gridHeight="45vh" showTotalFooter={false}/>
    </section>
  </main>
  )
}

export default Leaderboard;
