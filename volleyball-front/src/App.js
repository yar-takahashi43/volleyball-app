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
import { useContext } from "react";
import { AuthContext } from "./state/AuthContext";
import MatchListByDate from "./pages/match/MatchListByDate";

/**
 * ログイン必須ルート。未認証なら /login へ送る。
 */
function ProtectedRoute({ children }) {
  const { user, token } = useContext(AuthContext)

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const { user, token } = useContext(AuthContext)
  const isLoggedIn = Boolean(user && token)

  return (
    <Router>
      <Routes>
        <Route path="/" element={ isLoggedIn ? <Menu /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" replace /> : <Register />}/>

        <Route path="/gamelist" element={<ProtectedRoute><MatchList /></ProtectedRoute>}/>
        <Route path="/matches/:date" element={<ProtectedRoute><MatchListByDate /></ProtectedRoute>}/>
        <Route path="/match/:id" element={<ProtectedRoute><Match /></ProtectedRoute>}/>

        <Route path="/playerlist" element={<ProtectedRoute><PlayerList /></ProtectedRoute>}/>
        <Route path="/playerRegister" element={<ProtectedRoute><RegisterPlayer /></ProtectedRoute>}/>

        <Route path="/opponentRegister" element={<ProtectedRoute><RegisterOpponent /></ProtectedRoute>}/>
        <Route path="/opponentlist" element={<ProtectedRoute><OpponentList /></ProtectedRoute>}/>
      </Routes>
    </Router>
  )
}

export default App;
