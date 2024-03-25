import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/playerList/RegisterPlayer";
import PlayerList from "./pages/playerList/PlayerList";
import RegisterOpponent from "./pages/opponent/RegisterOpponent";
import OpponentList from "./pages/opponent/OpponentList";
import "./App.css"
import Match from "./pages/match/Match";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Menu from "./pages/menu/Menu";
import MatchList from "./pages/match/MatchList";
import PlayerDetails from "./pages/playerList/PlayerDetails";
import OpponentDetails from "./pages/opponent/OpponentDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gamelist" element={<MatchList />}/>
        <Route path="/newgame" element={<Match />}/>
        <Route path="/playerlist" element={<PlayerList />}/>
        <Route path="/playerlist/sawamura" element={<PlayerDetails />}/>
        <Route path="/playerRegister" element={<Register />}/>
        <Route path="/opponentRegister" element={<RegisterOpponent/>}/>
        <Route path="/opponentlist" element={<OpponentList/>}/>
        <Route path="/opponentlist/karasuno" element={<OpponentDetails />}/>
      </Routes>
    </Router>
  )
}

export default App;
