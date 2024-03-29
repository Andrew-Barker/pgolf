import React from 'react';
import PageTitle from './components/PageTitle';

const Rules = () => (
  <main className="container mx-auto px-4 py-8">
    <PageTitle title="Rules" />
    <section id="rules" className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4">Pub Golf Rules</h2>
      <ol className="list-decimal pl-6 mb-6">
        <li className="mb-2">Each team must complete all nine holes (bars) on the course.</li>
        <li className="mb-2">Each hole has a designated par, which represents the number of sips required to finish the drink at that hole.</li>
        <li className="mb-2">Players must consume the specified drink for each hole. Substitutions are allowed but must be agreed upon by all participants.</li>
        <li className="mb-2">Players record their score (number of sips) for each hole on their scorecard.</li>
        <li className="mb-2">The team with the lowest total score at the end of the course wins.</li>
        <li className="mb-2">At each hole, the player with the lowest score on the previous hole (as long as there is no tie for lowest) can assign a "water hazard" to another player.</li>
        <li className="mb-2">Penalty strokes may be assigned for various infractions, such as spilling a drink, not finishing a hole, puking, or breaking any of the game's specific rules.</li>
        <li className="mb-2">Designate one hole as the "long drive" hole. At this hole, the player must finish their drink in the fewest number of sips. The winner of the long drive hole gets a one-stroke reduction in their overall score.</li>
        <li className="mb-2">If a player skips a hole, their team receives a three-stroke penalty for that hole.</li>
      </ol>

      <h2 className="text-3xl font-bold mb-4">Side Contests</h2>
      <ol className="list-decimal pl-6 mb-6">
        <li className="mb-2">
          <strong>Best Dressed:</strong> The team with the attire which is voted as "Best" by other players get a "Mulligan," allowing them to redo one hole during the game, keeping the lower of the two scores.
        </li>
        <li className="mb-2">
          <strong>Closest to the Pin:</strong> Designate one hole where players must attempt to finish their drink in the exact number of sips equal to par. The player who comes closest without going under earns a one-stroke reduction in their overall score.
        </li>
        <li className="mb-2">
          <strong>Longest Drive:</strong> In addition to the "long drive" hole mentioned in the rules, you can have a separate contest where players compete to see who can chug a specific drink the fastest. The winner gets to assign a one-stroke penalty to another player of their choice.
        </li>
      </ol>

      <h2 className="text-3xl font-bold mb-4">Hazards</h2>
      <ol className="list-decimal pl-6 mb-6">
        <li className="mb-2">
          <strong>Windy Conditions:</strong> At a designated hole, players must spin around in a circle three times before taking each sip. Failure to do so results in a one-stroke penalty.
        </li>
        <li className="mb-2">
          <strong>Bunker:</strong> Choose a hole where players must sit on the floor or a low surface while drinking. Players who do not remain seated during the entire hole incur a one-stroke penalty.
        </li>
        <li className="mb-2">
          <strong>Out of Bounds:</strong> At a specific hole, players must consume their drink with a designated hand (e.g., left for right-handed players, right for left-handed players). Failure to comply results in a one-stroke penalty.
        </li>
        <li className="mb-2">
          <strong>Water Hazard:</strong> At a designated hole, players must drink a drink assigned to them before consuming their hole-specific drink. Failing to drink the additional drink first results in a one-stroke penalty.
        </li>
        <li className="mb-2">
          <strong>Rough:</strong> At a specific hole, players must drink while standing on one leg. Losing balance and putting the other foot down results in a one-stroke penalty.
        </li>
        <li className="mb-2">
          <strong>Blind Shot:</strong> At a chosen hole, players must drink with their eyes closed as their designated drink is changed. If a player is caught peeking, they incur a one-stroke penalty.
        </li>
      </ol>

      <h2 className="text-3xl font-bold mb-4">Worst Dressed Team</h2>
      <p>The team that is deemed to have the worst attire will be subjected to the following rules</p>
      <ol className="list-decimal pl-6 mb-6">
        <li className="mb-2">
          <strong>Mismatched Socks Rule:</strong> For the remainder of the game, each member of the worst-dressed team must swap one of their shoes with their teammate, resulting in mismatched footwear.
        </li>
        <li className="mb-2">
          <strong>Golf Bag Rule:</strong> The worst-dressed team must carry a small "golf bag" (a backpack or tote bag) filled with amusing items (e.g., inflatable toys, colorful hats) and must use these items as props in their team photos taken throughout the event.
        </li>
        <li className="mb-2">
          <strong>Designated Caddies Rule:</strong> The worst-dressed team must act as "caddies" for another team of their choosing for one hole, fetching drinks and offering comical advice on how to play the hole.
        </li>
        <li className="mb-2">
          <strong>Boogie and Belt Rule:</strong> At each hole, the worst-dressed team must either perform a short, spontaneous dance routine or sing a karaoke song on stage at the bar to entertain the other teams. The team can choose between dancing or singing, but they must complete one of these performances before they can move on to the next hole.
        </li>
      </ol>

      <h2 className="text-3xl font-bold mb-4">Individual Reward</h2>
      <p>The player with the lowest individual score at the end of the game receives a special prize or reward, which is to be discussed prior to starting the competition</p>
    </section>
  </main>
);

export default Rules;
