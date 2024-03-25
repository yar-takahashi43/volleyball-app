import { Person, Search,} from '@mui/icons-material'
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import AddCommentIcon from '@mui/icons-material/AddComment';
import React from 'react'
import "./Menu.css"
import { Link } from 'react-router-dom'

export default function Menu() {
  return (
    <div className='menubar'>
        <h2 className="title">メニュー</h2>
        <hr className="menubarHr1" />
        <div className="menubarWrapper">
            <ul className="menubarList">
                <li className="menubarListItem">
                    <SportsVolleyballIcon className='menubarIcon'/>
                    <Link to="/newgame" style={{textDecoration: 'none', color: 'black'}}>
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
            </ul>
        </div>
        {/** 横線を入れる */}
        <hr className="menubarHr2" />
    </div>
  )
}
