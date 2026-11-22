import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import "../home/Top.css"
import { Link } from 'react-router-dom';

/**
 * 日付別試合一覧のヘッダー。試合一覧へ戻れる。
 */
export default function MatchByDateTop({ date }) {
    return (
        <div className="top" id="match-by-date-top">
            <div className='topLeft'>
                <Link
                  to="/gamelist"
                  id="match-by-date-back"
                  style={{textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center'}}
                >
                    <ArrowBackIcon className='backIcon'/>
                    <span className="iconName">試合一覧へ</span>
                </Link>
            </div>
            <div className="topName">
                <span className="name" id="match-by-date-title">{date || "試合"}</span>
            </div>
            <div className='topRight'>
                <div className='topForward'>
                    <Link to="/" id="match-by-date-home" style={{textDecoration: 'none', color: 'white'}}>
                        <HomeIcon />
                        <span className='iconName'>TOPへ</span>
                    </Link>
                </div>
            </div>
        </div>
      )
    }
