import React from 'react';
import PageTitle from './components/PageTitle';

const Leaderboard = () => (
  <main>
    <PageTitle title="Leaderboard"/>
    <section id="individual-leaderboard">
      <h2>Individual Leaderboard</h2>
      {/* Your individual leaderboard table component here */}
    </section>
    <section id="team-leaderboard">
      <h2>Team Leaderboard</h2>
      {/* Your team leaderboard table component here */}
    </section>
  </main>
);

export default Leaderboard;
