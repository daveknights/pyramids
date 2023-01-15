import React from "react";
import './BonusLevel.css';
import { ReactSortable } from "react-sortablejs";

const bonusLevel = props => (
    <div className="bonus-container">
        <ReactSortable className="block-stack" list={props.parts} setList={props.setBonusParts}>
            {props.parts.map(part => <div key={part} className={`strip part-${part}`}></div>)}
        </ReactSortable>
    </div>
);

export default bonusLevel;