import { Person, Search,} from '@mui/icons-material'
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import LogoutIcon from '@mui/icons-material/Logout';
import React, { useContext, useState } from 'react'
import "./Menu.css"
import { Link, useNavigate } from 'react-router-dom'
import api from '../../Api';
import { AuthContext } from '../../state/AuthContext';

export default function Menu() {
    // 新規試合がクリックされたら試合の雛形を作成する。
    const [newMatchId, setNewMatchId] = useState(null)
    const navigate = useNavigate()
    const { dispatch } = useContext(AuthContext)

    /**
     * 試合の雛形を API で作成する。
     */
    const registerMatch = async() => {
        try{
            const res = await api.post("/match/register")
            return res.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    /**
     * 新規試合を作成して試合画面へ遷移する。
     */
    const handleNewMatch = async() => {
        const newMatch = await registerMatch();
        if (newMatch) {
            setNewMatchId(newMatch._id);
            navigate(`/match/${newMatch._id}`)
        } else {
            console.error("エラーが発生しました。")
        }
    };

    /**
     * ログアウトしてログイン画面へ戻る。
     */
    const handleLogout = () => {
        dispatch({ type: "LOGOUT" })
        navigate("/login")
    };

  return (
    <div className='menubar' id="menuPage">
        <h2 className="title">メニュー</h2>
        <hr className="menubarHr1" />
        <div className="menubarWrapper">
            <ul className="menubarList">
                <li className="menubarListItem">
                    <SportsVolleyballIcon className='menubarIcon'/>
                    <Link
                        to={newMatchId ? `/match/${newMatchId}` : '#'}
                        onClick={handleNewMatch}
                        style={{textDecoration: 'none', color: 'black'}}>
                        <span className="menubarListItemText">新規試合</span>
                    </Link>
                </li>
                <li className="menubarListItem">
                    <Search className='menubarIcon'/>
                    <Link to="/gamelist" style={{textDecoration: 'none', color: 'black'}}>
                        <span className="menubarListItemText">試合一覧</span>
                    </Link>
                </li>
                <li className="menubarListItem">
                    <PersonAddIcon className='menubarIcon'/>
                    <Link to="playerRegister" style={{textDecoration: 'none', color: 'black'}}>
                        <span className="menubarListItemText">選手登録</span>
                    </Link>
                </li>
                <li className="menubarListItem">
                    <Person className='menubarIcon'/>
                    <Link to="playerlist" style={{textDecoration: 'none', color: 'black'}}>
                        <span className="menubarListItemText">選手一覧</span>
                    </Link>
                </li>
                <li className="menubarListItem">
                    <AddCommentIcon className='menubarIcon'/>
                    <Link to="opponentRegister" style={{textDecoration: 'none', color: 'black'}}>
                        <span className="menubarListItemText">対戦相手登録</span>
                    </Link>
                </li>
                <li className="menubarListItem">
                    <InsertCommentIcon className='menubarIcon'/>
                    <Link to="opponentlist" style={{textDecoration: 'none', color: 'black'}}>
                        <span className="menubarListItemText">対戦相手一覧</span>
                    </Link>
                </li>
                <li className="menubarListItem" id="menuLogoutItem">
                    <LogoutIcon className='menubarIcon'/>
                    <button
                        type="button"
                        id="menuLogoutButton"
                        className="menubarLogoutButton"
                        onClick={handleLogout}
                    >
                        <span className="menubarListItemText">ログアウト</span>
                    </button>
                </li>
            </ul>
        </div>
        {/** 横線を入れる */}
        <hr className="menubarHr2" />
    </div>
  )
}
