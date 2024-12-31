// import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import RegisterPlayer from "./pages/playerList/RegisterPlayer";
import PlayerList from "./pages/playerList/PlayerList";
import RegisterOpponent from "./pages/opponent/RegisterOpponent";
import OpponentList from "./pages/opponent/OpponentList";
import "./App.css"
import Match from "./pages/match/Match";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Menu from "./pages/menu/Menu";
import MatchList from "./pages/match/MatchList";
import PlayerDetails from "./pages/playerList/PlayerDetails";
import OpponentDetails from "./pages/opponent/OpponentDetails";
import { useContext } from "react";
import { AuthContext } from "./state/AuthContext";
import MatchListByDate from "./pages/match/MatchListByDate";

function App() {
  const {user} = useContext(AuthContext)

  // 全体的にRouteのurlはバックエンドと合わせる。
  return (
    <Router>
      <Routes>
        <Route path="/" element={ user ? <Menu /> : <Register/>} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/"/> : <Register/>}/>

        <Route path="/gamelist" element={<MatchList />}/>
        <Route path="/gamelist/date" element={<MatchListByDate />}/>
        <Route path="/match/:id" element={<Match />}/>

        <Route path="/playerlist" element={<PlayerList />}/>
        <Route path="/playerRegister" element={<RegisterPlayer />}/>

        <Route path="/opponentRegister" element={<RegisterOpponent/>}/>
        <Route path="/opponentlist" element={<OpponentList/>}/>
        {/* <Route path="/playerlist/sawamura" element={<PlayerDetails />}/> */}
        {/* <Route path="/opponentlist/karasuno" element={<OpponentDetails />}/> */}
      </Routes>
    </Router>
  )
}

export default App;
