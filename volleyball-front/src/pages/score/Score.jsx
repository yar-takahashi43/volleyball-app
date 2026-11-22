import React from 'react'
import "./Score.css"
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Scorebar from '../../components/game/Scorebar'

/**
 * 試合スコア画面のレイアウトを組み立てる。
 */
export default function Score({
    selectedSetId,
    match,
    start,
    setStart,
    bench,
    setBench,
    opponent,
    pushScore,
    onSelectNextSet,
    onSelectPreviousSet
}) {
    const currentSet = match.sets.find(function (setItem) {
        return String(setItem._id) === String(selectedSetId);
    });

    if (!currentSet) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Topbar
                match={match}
                opponent={opponent}
                key={opponent ? opponent.id : 'default-key'}
                setId={selectedSetId}
                onSelectNextSet={onSelectNextSet}
                onSelectPreviousSet={onSelectPreviousSet}
            />
            <div className="scoreContainer">
                <Sidebar
                    matchId={match ? match._id : 'default-key'}
                    setId={selectedSetId}
                    starPlayer={start}
                    setStarPlayer={setStart}
                    benchMem={bench}
                    setBenchMem={setBench}
                    actions={currentSet.actions}
                    pushScore={pushScore}
                />
                <Scorebar
                    match={match}
                    setId={selectedSetId}
                    start={start}
                    bench={bench}
                    pushScore={pushScore}
                />
            </div>
        </>
    )
}
