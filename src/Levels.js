import React from "react";

const levels = props => {
    const data = props.levelData;

    return (
        <div className="level-container" onClick={props.handleSelectLevelFn}>
            <div className="row">
                <div className="level">
                    {data['1'].locked ? <div className="locked"></div> : <p className={`playable${data['1'].star ? ' star' : ''}`}>{Object.keys(data)[0]}</p>}
                </div>
            </div>
            <div className="row">
                <div className="level">
                    {data['2'].locked ? <div className="locked"></div> : <p className={`playable${data['2'].star ? ' star' : ''}`}>{Object.keys(data)[1]}</p>}
                </div>
                <div className="level">
                    {data['3'].locked ? <div className="locked"></div> : <p className={`playable${data['3'].star ? ' star' : ''}`}>{Object.keys(data)[2]}</p>}
                </div>
            </div>
            <div className="row">
                <div className="level">
                    {data['4'].locked ? <div className="locked"></div> : <p className={`playable${data['4'].star ? ' star' : ''}`}>{Object.keys(data)[3]}</p>}
                </div>
                <div className="level">
                    {data['5'].locked ? <div className="locked"></div> : <p className={`playable${data['5'].star ? ' star' : ''}`}>{Object.keys(data)[4]}</p>}
                </div>
                <div className="level">
                    {data['6'].locked ? <div className="locked"></div> : <p className={`playable${data['6'].star ? ' star' : ''}`}>{Object.keys(data)[5]}</p>}
                </div>
            </div>
            <div className={`bonus-level${!data['bonus'].locked ? ' unlocked' : ''}`}>
                <p className={`${!data['bonus'].locked ? 'playable' : ''}${data['bonus'].star ? ' star' : ''}`}>{data['bonus'].locked && <span className="locked"></span>}Bonus Level</p>
            </div>
            <div className="difficulty" onClick={props.handleSetDifficultyFn}>
                <h2>Difficulty:</h2>
                <button type="button" {...(props.difficulty === 'easy' && {className: "selected"})} data-difficulty="easy">Easy</button>
                <button type="button" {...(props.difficulty === 'normal' && {className: "selected"})} data-difficulty="normal">Normal</button>
            </div>
        </div>
    );
};

export default levels;