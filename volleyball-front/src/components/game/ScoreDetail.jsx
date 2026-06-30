import React, { useState } from 'react';
import './ScoreDetail.css';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

export default function ScoreDetail({ action, index, actionsLength, start, bench, updateAction, toggleAce, toggleMiss, addNewAction }) {

//   const optionAttack =[
//     {value: 0, label: ""},
//     {value: 1, label: "スパイク"},
//     {value: 2, label: "ブロック"},
//     {value: 3, label: "アタック"},
//   ]
//   const optionLose =[
//     {value: 0, label: ""},
//     {value: 1, label: "レシーブ"},
//     {value: 2, label: "トス等"},
//     {value: 3, label: "スパイク"},
//     {value: 4, label: "ブロック"},
//   ]

//   // // サーブに関して
//   const [isAce, setIsAce] = useState(false);
//   const [isMiss, setIsMiss] = useState(false);
//   const [selectedServePlayer, setSelectedServePlayer] = useState(null); // 選択された選手の状態を管理するためのstateを作成

// const handleServeMemberChange = (selectedOption) => {
//   setSelectedServePlayer(selectedOption ? playerMap[selectedOption.value] : null);
//   // 選手が選択されていない場合、エースとミスの選択をリセット
//   if (!selectedOption) {
//     setIsAce(false);
//     setIsMiss(false);
//   }
// };

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

//   // サーブ以外の実装
//   const [selectedPlayer, setSelectedPlayer] = useState(null); // 選択された選手の状態を管理するためのstateを作成
//   const [attackSelected, setAttackSelected] = useState(optionAttack)
//   const [loseSelected, setLoseSelected] = useState(optionLose)

//   const handleAttackChange = (selectedOption) => {
//     if (selectedOption && !scoreUpdated) {
//       incrementScore('my'); // incrementScore関数を使用
//       setScoreUpdated(true);
//     }
//     setAttackSelected(selectedOption);
//     if (selectedOption) {
//       setLoseSelected(null);
//     } else {
//       setAttackSelected(null);
//       setLoseSelected(null);
//       if (scoreUpdated) {
//         decrementScore('my'); // decrementScore関数を使用
//         setScoreUpdated(false);
//       }
//     }
//   };
  
//   const handleLoseChange = (selectedOption) => {
//     if (selectedOption && !scoreUpdated) {
//       incrementScore('opponent'); // incrementScore関数を使用
//       setScoreUpdated(true);
//     }
//     setLoseSelected(selectedOption);
//     if (selectedOption) {
//       setAttackSelected(null);
//     } else {
//       setLoseSelected(null);
//       setAttackSelected(null);
//       if (scoreUpdated) {
//         decrementScore('opponent'); // decrementScore関数を使用
//         setScoreUpdated(false);
//       }
//     }
//   };

//   // スコアに関して処理
//   const [myTeamScore, setMyTeamScore] = useState(0)
//   const [opponentScore, setOpponentScore] = useState(0)
//   const [scoreUpdated, setScoreUpdated] = useState(false);
//   const [prevMyTeamScore, setPrevMyTeamScore] = useState(0);
//   const [prevOpponentScore, setPrevOpponentScore] = useState(0);

//    // playerIdの配列を作成し、それをSelectコンポーネントのoptionsに適用
//   const playerOptions = Object.keys(playerMap).map(id => ({ value: id, label: playerMap[id].nickname }));

//   const handleScoreMemberChange = (selectedOption) => {
//     const selectedPlayer = selectedOption ? playerMap[selectedOption.value] : null;
//     setSelectedPlayer(selectedPlayer);
//   }
// console.log("ScoreDetail props:", {
//   currentMyScores,
//   currentOpponentScores,
//   playerMap
// });

  const players = [...start, ...bench];

  // react-select 用 option
  const playerOptions = players.map(p => ({
    value: p._id,
    label: p.nickname
  }));

  // 理由（仮の固定値）
  const optionAttack = [
    { value: "spike", label: "スパイク" },
    { value: "block", label: "ブロック" },
    { value: "attack", label: "アタック" }
  ];

  const optionLose = [
    { value: "receive", label: "レシーブ" },
    { value: "toss", label: "トス等" },
    { value: "spike", label: "スパイク" },
    { value: "block", label: "ブロック" }
  ];

  return (
    // <div className='detailContainer'>
    //     <div className="detailComponents">
    //         <table>
    //             <tbody>
    //                 <tr className='detailComponentsBottom'>
    //                     <th className="serve2">
    //                         <td className='first'>
    //                           <Select 
    //                             className='serve'
    //                             onChange={handleServeMemberChange}
    //                             options={playerOptions}
    //                             placeholder={null}
    //                             isDisabled={selectedPlayer}
    //                           />
    //                         </td>
    //                         <td>
    //                           <input 
    //                             className='serve'
    //                             type="checkbox" 
    //                             checked={isAce}
    //                             onChange={handleAceChange}
    //                             disabled={!selectedServePlayer} />
    //                         </td>
    //                         <td>
    //                         <input 
    //                             className='serve'
    //                             type="checkbox" 
    //                             checked={isMiss}
    //                             onChange={handleMissChange}
    //                             disabled={!selectedServePlayer} />
    //                         </td>
    //                     </th>
    //                     <th className="reason2">
    //                         <td className='first'>
    //                           <Select 
    //                             className='score'
    //                             onChange={handleScoreMemberChange}
    //                             options={playerOptions}
    //                             placeholder={null}
    //                             isDisabled={selectedServePlayer}
    //                           />
    //                         </td>
    //                         <td>
    //                           <Select
    //                             className='score'
    //                             onChange={handleAttackChange}
    //                             options={optionAttack}
    //                             placeholder={null}
    //                             isDisabled={!selectedPlayer}
    //                             isClearable
    //                           />
    //                         </td>
    //                         <td>
    //                           <Select
    //                             className='score'
    //                             onChange={handleLoseChange}
    //                             options={optionLose}
    //                             placeholder={null}
    //                             isDisabled={!selectedPlayer}
    //                             isClearable
    //                           />
    //                         </td>
    //                     </th>
    //                     <th className="score2">
    //                         <td className='first'>
    //                           {currentMyScores}
    //                         </td>
    //                         <td>
    //                           {currentOpponentScores}
    //                         </td>
    //                     </th>
    //                 </tr>
    //             </tbody>
    //         </table>
    //     </div>
    // </div>
     <div className="row detailRow">
    
      <div className="cell serveCell">
        <Select
          className="serveSelect selectPlayer"
          options={playerOptions}
          isClearable={true}
          onChange={(opt) => {
            updateAction(action._id, { servePlayer: opt ? opt.value : null })
              // 最後の行に入力が入った時だけ追加
              if (opt && index === actionsLength - 1) {
                addNewAction()
              }
            }
          }
        />

        <input
          type="checkbox"
          className="bigCheckbox"
          checked={action.isAce}
          onChange={() => toggleAce(action._id)}
        />

        <input
          type="checkbox"
          className="bigCheckbox"
          checked={action.isMiss}
          onChange={() => toggleMiss(action._id)}
        />
      </div>
        
      <div className="cell reasonCell">
        <Select
          className="scoreSelect selectPlayer"
          options={playerOptions}
          isClearable={true}
          onChange={(opt) => {
            updateAction(action._id, { scorePlayer: opt ? opt.value : null })
              // 最後の行に入力が入った時だけ追加
              if (opt && index === actionsLength - 1) {
                addNewAction()
              }
            }
          }
        />

        <Select
          className="scoreSelect selectAttack"
          options={optionAttack}
          isClearable
          onChange={(opt) =>
            updateAction(action._id, { attack: opt ? opt.value : null })
          }
        />

        <Select
          className="scoreSelect selectAttack"
          options={optionLose}
          isClearable
          onChange={(opt) =>
            updateAction(action._id, { lose: opt ? opt.value : null })
          }
        />
      </div>
        
      <div className="cell scoreCell">
        <div>{action.myScore ?? 0}</div>
        <div>{action.opponentScore ?? 0}</div>
      </div>
        
    </div>

  )
}
