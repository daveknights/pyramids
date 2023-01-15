import React from "react";
import { ReactSortable } from "react-sortablejs";
import BlockLine from "./BlockLine";
import Capstone from "./Capstone";

const pyramid = props => (
    <div className="pyramid-container">
        {props.isSolved && <Capstone />}
        <ReactSortable className="block-stack" list={props.blockWidths} setList={props.setBlockWidths}>
            {props.blockWidths.map(width => <BlockLine key={width} width={width} />)}
        </ReactSortable>
    </div>
);

export default pyramid;