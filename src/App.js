import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Course from './Course';
import Leaderboard from './Leaderboard';
import Rules from './Rules';
import Management from './Management';
import Header from './Header';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes className="routes">
          <Route path="/" element={<Leaderboard />} />
          <Route path="/course" element={<Course />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/management" element={<Management />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;