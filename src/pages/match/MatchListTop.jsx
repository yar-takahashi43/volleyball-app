import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import "../home/Top.css"
import { Link } from 'react-router-dom';

export default function MatchListTop() {
    return (
        <div className="top">
            <div className='topLeft'>
                <div className="topBack">
                    <ArrowBackIcon className='backIcon'/>
                <span className="iconName">前ページ</span>
                </div>
            </div>
            <div className="topName">
                <span className="name">試合一覧</span>
            </div>
            <div className='topRight'>
                <div className='topForward'>
                    <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
                        <HomeIcon />
                        <span className='iconName'>TOPへ</span>
                    </Link>
                </div>
            </div>
        </div>
      )
    }
    