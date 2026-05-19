import { Chat, Notifications, Search } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import React, { useState, useEffect } from 'react'
import "./Topbar.css"
import Select from 'react-select';
// import { Opponents } from '../../dummyData'
import { Link, useNavigate } from 'react-router-dom';
import api from '../../Api';

export default function Topbar({match, opponent, setOpponent, setId, setSetId}) {
    const [selectedOpponentId, setSelectedOpponentId] = useState(null)
    const navigate = useNavigate()
    const opponentOptions = opponent.map(o => ({
      value: o._id,
      label: o.label || "名前なし",
    }));

    useEffect(() => {
        const fetchOpponent = async () => {
            try {
                const res = await api.get(`/match/${match._id}`);
                const fetchedMatch = res.data;
                // const selectedOpponentId = opponent.find(opp => opp._id === fetchedMatch.opponentId);
                setSelectedOpponentId(fetchedMatch.opponentId);
            } catch (err) {
                console.error(err)
            }
        }
        fetchOpponent()
    }, []);

    // DBの更新
    useEffect(() => {
        if (selectedOpponentId) {
            const updateOpponent = async () => {
                try {
                    await api.put(`/match/${match._id}`, {
                         opponentId: selectedOpponentId 
                    });
                    console.log("対戦相手を選択しました。");
                    // setSelectedOpponent(null)
                } catch (err) {
                    console.log("対戦相手を選択できませんでした。", err);
                }
            };
            updateOpponent()
        }
    }, [selectedOpponentId])

    // const handleOpponentChange = (selectedOption) => {
    //     if (selectedOption !== selectedOpponent) {
    //         setSelectedOpponent(selectedOption);
    //     }
    // }

    useEffect(() => {
      const fetchMatch = async () => {
      const res = await api.get(`/match/${match._id}`);
        setSetId(res.data.currentSetId);
     };
     fetchMatch();
    }, []);

    const addSet = async() => {
        try{
            const res = await api.post(`/set/match/${match._id}`)
            return res.data
        } catch (err){
            console.error(err)
        }
    }

    const handleNextPage = async() => {
        const newSet = await addSet()
        if (!newSet) {
            console.log("エラーが発生しました。")
            return
        }
        // 新しいセットをcurrentSetIdに保存
        await api.put(`/match/${match._id}`,{
            currentSetId: newSet._id
        })
            // setNewSetId(newSet._id)
            navigate(`/match/${match._id}/set/${newSet._id}`)
         {
        }
    }

    // 現在のセット数を出力する
    const index = match.sets.findIndex(s => s.toString() === setId);
    const currentSetNumber = index >= 0 ? index + 1 : 1;

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
                {/* セット番号は自動的につくようにする */}
                {/* <Select 
                    name="set" 
                    options={option}
                    defaultValue={null}
                    placeholder="セット選択"
                    value={option.find(option => option.value === setId)}
                    onChange={handleSetChange}
                    /> */}
                <span className='currentSetText'> 第{currentSetNumber}セット</span>
            </div>
            <span className='vs'>VS</span>
            <div className='searchbar'>
                <Search className='searchIcon'/>
                <Select
                    className="searchInput" 
                    options={opponentOptions}
                    openMenuOnClick={true}
                    value={opponentOptions.find(o => o.value === selectedOpponentId)}
                    // onChange={handleOpponentChange}
                    onChange={(opt) => setSelectedOpponentId(opt.value)}
                    placeholder={"対戦相手選択"}
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
            <div className='forward' onClick={handleNextPage} style={{textDecoration: 'none', color: 'white', display: 'flex'}}>
                    <span className='forwardIcon'>次ページ</span>
                    <ArrowForwardIcon />
            </div>
        </div>
    </div>
  )
}
