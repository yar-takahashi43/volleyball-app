import { Chat, Notifications, Search } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import React, { useState } from 'react'
import "./Topbar.css"
import Select from 'react-select';
import { render } from '@testing-library/react';
// import { Opponents } from '../../dummyData'
import { Link } from 'react-router-dom';

export default function Topbar({opponent, setOpponent}) {

    const option =[
        {value: 1, label: "第1セット"},
        {value: 2, label: "第2セット"},
        {value: 3, label: "第3セット"},
        {value: 4, label: "第4セット"},
        {value: 5, label: "第5セット"},
        {value: 6, label: "第6セット"},
    ]

    const handleOpponentChange = (selectedOption) => {
        setOpponent(selectedOption.value)
    }

  return (
    <div className='topbarContainer'>
        <div className='topbarLeft'>
            <div className="back">
                <ArrowBackIcon className='backIcon'/>
                <span className="iconName">前ページ</span>
            </div>
        </div>

        <div className='topbarCenter'>
            <div className="sheetName">
                <span className='logo'>スコアシート</span>
            </div>
            <div className="setCount">
                <Select 
                    name="set" 
                    options={option}
                    defaultValue={null}
                    placeholder="セット選択"
                />
            </div>
            <span className='vs'>VS</span>
            <div className='searchbar'>
                <Search className='searchIcon'/>
                <Select
                    className="searchInput" 
                    options={opponent}
                    onChange={handleOpponentChange}
                    placeholder="対戦相手選択"
                />
            </div>
        </div>

        <div className='topbarRight'>
            {/* <div className='topbarIconItem'> */}
            <div className='toTop'>
                <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
                    <HomeIcon />
                    <span className='topIcon'>TOPへ</span>
                </Link>
            </div>
            <div className='forward'>
                <span className='forwardIcon'>次ページ</span>
                <ArrowForwardIcon />
            </div>
        </div>
    </div>
  )
}
