import { Chat, Notifications, Search } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import React, { useState, useEffect } from 'react'
import "./Topbar.css"
import Select from 'react-select';
import { render } from '@testing-library/react';
// import { Opponents } from '../../dummyData'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Topbar({match, opponent, setOpponent, setId, setSetId}) {
    const[updateOpponent, setUpdatedOpponent] = useState(false)
    const option =[
        {value: 1, label: "第1セット"},
        {value: 2, label: "第2セット"},
        {value: 3, label: "第3セット"},
        {value: 4, label: "第4セット"},
        {value: 5, label: "第5セット"},
        {value: 6, label: "第6セット"},
    ]
    const [selectedOpponent, setSelectedOpponent] = useState(null)
    const [newSetId, setNewSetId] = useState(null)
    const [newSet, setNewSet] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOpponent = async () => {
            try {
                const res = await axios.get(`/match/${match._id}`);
                const fetchedMatch = res.data;
                const selectedOpponentId = opponent.find(opp => opp._id === fetchedMatch.opponentId);
                setSelectedOpponent(selectedOpponentId);
            } catch (err) {
                console.error(err)
            }
        }
        fetchOpponent()
    }, []);

    useEffect(() => {
        if (selectedOpponent) {
            const updateOpponent = async () => {
                try {
                    await axios.put(`/match/${match._id}`, { opponentId: selectedOpponent._id });
                    console.log("対戦相手を選択しました。");
                    // setSelectedOpponent(null)
                } catch (err) {
                    console.log("対戦相手を選択できませんでした。", err);
                }
            };
            updateOpponent()
        }
    }, [selectedOpponent])

    const handleOpponentChange = (selectedOption) => {
        if (selectedOption !== selectedOpponent) {
            setSelectedOpponent(selectedOption);
        }
    }    

    //新規セット作成に関して
    useEffect(() => {
        const fetchNewSet = async () => {
          try {
            const res = await axios.get(`/set/match/${match._id}/set/${setId}`);
            setNewSet(res.data);
          } catch (err) {
            console.error(err);
          }
        };
    
        fetchNewSet();
      }, [match._id, setId]);

    const handleSetChange = (selectedOption) => {
        setSetId(match.sets[selectedOption.value - 1]._id)
    }

    console.log(match)
    const addSet = async() => {
        try{
            const res = await axios.post(`/set/match/${match._id}`)
            return res.data
        } catch (err){
            console.error(err)
        }
    }

    const handleNextPage = async() => {
        const newSet = await addSet()
        if (newSet) {
            setNewSetId(newSet._id)
            navigate(`/match/${match._id}/set/${newSet._id}`)
        } else {
            console.log("エラーが発生しました。")
        }
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
                    value={option.find(option => option.value === setId)}
                    onChange={handleSetChange}
                />
            </div>
            <span className='vs'>VS</span>
            <div className='searchbar'>
                <Search className='searchIcon'/>
                <Select
                    className="searchInput" 
                    options={opponent || []}
                    openMenuOnClick={true}
                    onChange={handleOpponentChange}
                    placeholder={"対戦相手選択"}
                    value={selectedOpponent}
                />
            </div>
        </div>

        <div className='topbarRight'>
            <div className='toTop'>
                <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
                    <HomeIcon />
                    <span className='topIcon'>TOPへ</span>
                </Link>
            </div>
            <div className='forward' onClick={handleNextPage}>
                <Link
                    to={newSetId ? `/match/${match._id}/set/${newSetId}` : '#'}
                    onClick={handleNextPage}
                    style={{textDecoration: 'none', color: 'white', display: 'flex'}}
                >
                    <span className='forwardIcon'>次ページ</span>
                    <ArrowForwardIcon />
                </Link>
            </div>
        </div>
    </div>
  )
}
