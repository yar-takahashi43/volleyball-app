import React, { useState } from 'react';
import './ScoreDetail.css';
import Select from 'react-select';

export default function ScoreDetail({
    setSetData, playerMap, currentScores,
    // 以下は新規で追加した部分。
    myScore, 
    incrementScore, decrementScore, myScoreChange,
    currentMyScores, currentOpponentScores
}) {

  const optionAttack =[
    {value: 0, label: ""},
    {value: 1, label: "スパイク"},
    {value: 2, label: "ブロック"},
    {value: 3, label: "アタック"},
  ]
  const optionLose =[
    {value: 0, label: ""},
    {value: 1, label: "レシーブ"},
    {value: 2, label: "トス等"},
    {value: 3, label: "スパイク"},
    {value: 4, label: "ブロック"},
  ]

  // // サーブに関して
  const [isAce, setIsAce] = useState(false);
  const [isMiss, setIsMiss] = useState(false);
  const [selectedServePlayer, setSelectedServePlayer] = useState(null); // 選択された選手の状態を管理するためのstateを作成

const handleServeMemberChange = (selectedOption) => {
  setSelectedServePlayer(selectedOption ? playerMap[selectedOption.value] : null);
  // 選手が選択されていない場合、エースとミスの選択をリセット
  if (!selectedOption) {
    setIsAce(false);
    setIsMiss(false);
  }
};

// 　const handleAceChange = (e) => {
//     setIsAce(e.target.checked); // エースのチェックボックスの状態を更新
//     if (e.target.checked) {
//       incrementScore("my");
//     } else {
//       decrementScore("my");
//     }
//     if (e.target.checked && isMiss) {
//       decrementScore("opponent");
//       setIsMiss(false); // エースが選択されていて、ミスも選択されている場合、ミスの選択を解除
//     }
//   };
  
//   const handleMissChange = (e) => {
//     setIsMiss(e.target.checked); // ミスのチェックボックスの状態を更新
//     if (e.target.checked) {
//       incrementScore("opponent");
//     } else {
//       decrementScore("opponent");
//     }
//     if (e.target.checked && isAce) {
//       decrementScore("my");
//       setIsAce(false); // ミスが選択されていて、エースも選択されている場合、エースの選択を解除
//     }
//   };
  
const handleAceChange = (e) => {
    setIsAce(e.target.checked); // エースのチェックボックスの状態を更新
    if (e.target.checked) {
      incrementScore("my");
      if (isMiss) {
        myScoreChange("opponent", "my")
        setIsAce(false)
      } 
    } else if (!e.target.checked) {
        decrementScore("my")
    }
  };
  
  const handleMissChange = (e) => {
    setIsMiss(e.target.checked); // ミスのチェックボックスの状態を更新
    if (e.target.checked) {
      incrementScore("opponent");
    } else if (!e.target.checked) {
        decrementScore("opponent")
    }
  };
  

  // サーブ以外の実装
  const [selectedPlayer, setSelectedPlayer] = useState(null); // 選択された選手の状態を管理するためのstateを作成
  const [attackSelected, setAttackSelected] = useState(optionAttack)
  const [loseSelected, setLoseSelected] = useState(optionLose)

  const handleAttackChange = (selectedOption) => {
    if (selectedOption && !scoreUpdated) {
      setPrevMyTeamScore(myTeamScore)
      setMyTeamScore(myTeamScore + 1);
      setScoreUpdated(true); // スコアが更新されたことを記録
    }
    setAttackSelected(selectedOption);
    if (selectedOption) {
      setLoseSelected(null); // 得点が選択されたら失点の選択を解除
    } else {
      setAttackSelected(null);
      setLoseSelected(null); // 得点の選択が解除されたら失点の選択も解除
      if (scoreUpdated) {
        setMyTeamScore(prevMyTeamScore); // 選択が解除されたらスコアをデクリメント
        setScoreUpdated(false); // スコアの更新状態をリセット
      }
    }
  };

  const handleLoseChange = (selectedOption) => {
    if (selectedOption && !scoreUpdated) {
      setPrevOpponentScore(opponentScore)
      setOpponentScore(opponentScore + 1);
      setScoreUpdated(true); // スコアが更新されたことを記録
    }
    setLoseSelected(selectedOption);
    if (selectedOption) {
      setAttackSelected(null); // 失点が選択されたら得点の選択を解除
    } else {
      setLoseSelected(null);
      setAttackSelected(null); // 失点の選択が解除されたら得点の選択も解除
      if (scoreUpdated) {
        setOpponentScore(prevOpponentScore); // 選択が解除されたらスコアをデクリメント
        setScoreUpdated(false); // スコアの更新状態をリセット
      }
    }
  };

  // スコアに関して処理
  const [myTeamScore, setMyTeamScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [scoreUpdated, setScoreUpdated] = useState(false);
  const [prevMyTeamScore, setPrevMyTeamScore] = useState(0);
  const [prevOpponentScore, setPrevOpponentScore] = useState(0);

   // playerIdの配列を作成し、それをSelectコンポーネントのoptionsに適用
  const playerOptions = Object.keys(playerMap).map(id => ({ value: id, label: playerMap[id].nickname }));

  const handleScoreMemberChange = (selectedOption) => {
    const selectedPlayer = selectedOption ? playerMap[selectedOption.value] : null;
    setSelectedPlayer(selectedPlayer);
  }

  return (
    <div className='detailContainer'>
        <div className="detailComponents">
            <table>
                <tbody>
                    <tr className='detailComponentsBottom'>
                        <th className="serve2">
                            <td className='first'>
                              <Select 
                                className='serve'
                                onChange={handleServeMemberChange}
                                options={playerOptions}
                                placeholder={null}
                                isDisabled={selectedPlayer}
                              />
                            </td>
                            <td>
                              <input 
                                className='serve'
                                type="checkbox" 
                                checked={isAce}
                                onChange={handleAceChange}
                                disabled={!selectedServePlayer} />
                            </td>
                            <td>
                            <input 
                                className='serve'
                                type="checkbox" 
                                checked={isMiss}
                                onChange={handleMissChange}
                                disabled={!selectedServePlayer} />
                            </td>
                        </th>
                        <th className="reason2">
                            <td className='first'>
                              <Select 
                                className='score'
                                onChange={handleScoreMemberChange}
                                options={playerOptions}
                                placeholder={null}
                                isDisabled={selectedServePlayer}
                              />
                            </td>
                            <td>
                              <Select
                                className='score'
                                onChange={handleAttackChange}
                                options={optionAttack}
                                placeholder={null}
                                isDisabled={!selectedPlayer}
                                isClearable
                              />
                            </td>
                            <td>
                              <Select
                                className='score'
                                onChange={handleLoseChange}
                                options={optionLose}
                                placeholder={null}
                                isDisabled={!selectedPlayer}
                                isClearable
                              />
                            </td>
                        </th>
                        <th className="score2">
                            <td className='first'>
                              {currentMyScores}
                            </td>
                            <td>
                              {currentOpponentScores}
                            </td>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  )
}
