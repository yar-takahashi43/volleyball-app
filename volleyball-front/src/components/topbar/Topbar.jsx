import { Search } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import React, { useState, useEffect } from 'react'
import "./Topbar.css"
import Select from 'react-select';
import { Link } from 'react-router-dom';
import api from '../../Api';

export default function Topbar({
    match,
    opponent,
    setId,
    onSelectNextSet,
    onSelectPreviousSet
}) {
    const [selectedOpponentId, setSelectedOpponentId] = useState(null)
    const opponentOptions = opponent.map(o => ({
      value: o._id,
      label: o.label || "名前なし",
    }));

    useEffect(() => {
        const fetchOpponent = async () => {
            try {
                const res = await api.get(`/match/${match._id}`);
                const fetchedMatch = res.data;
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
                } catch (err) {
                    console.log("対戦相手を選択できませんでした。", err);
                }
            };
            updateOpponent()
        }
    }, [selectedOpponentId])

    /**
     * 次のセットへ移動する。最終セットなら新規作成する（URL は変えない）。
     */
    const handleNextPage = async () => {
        if (!onSelectNextSet) {
            return;
        }

        await onSelectNextSet();
    }

    /**
     * 前のセットへ移動する（URL は変えない）。
     */
    const handlePreviousPage = async () => {
        if (!onSelectPreviousSet) {
            return;
        }

        await onSelectPreviousSet();
    }

    // 現在のセット数を出力する
    const index = match.sets.findIndex(function (setItem) {
        return String(setItem._id) === String(setId);
    });
    const currentSetNumber = index >= 0 ? index + 1 : 1;

  return (
    <div className='topbarContainer' id="match-topbar">
        <div className='topbarLeft'>
            <div
              className="back"
              id="topbar-previous-set"
              onClick={handlePreviousPage}
              style={{ cursor: 'pointer' }}
            >
                <ArrowBackIcon className='backIcon'/>
                <span className="iconName">前ページ</span>
            </div>
        </div>

        <div className='topbarCenter'>
            <div className="sheetName">
                <span className='logo'>スコアシート</span>
            </div>
            <div className="setCount">
                <span className='currentSetText' id="topbar-current-set"> 第{currentSetNumber}セット</span>
            </div>
            <span className='vs'>VS</span>
            <div className='searchbar'>
                <Search className='searchIcon'/>
                <Select
                    className="searchInput"
                    id="topbar-opponent-select"
                    options={opponentOptions}
                    openMenuOnClick={true}
                    value={opponentOptions.find(o => o.value === selectedOpponentId)}
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
            <div
              className='forward'
              id="topbar-next-set"
              onClick={handleNextPage}
              style={{textDecoration: 'none', color: 'white', display: 'flex', cursor: 'pointer'}}
            >
                    <span className='forwardIcon'>次ページ</span>
                    <ArrowForwardIcon />
            </div>
        </div>
    </div>
  )
}
