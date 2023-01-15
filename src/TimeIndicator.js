import React from "react";

const timeIndicator = props => <progress className={`time-indicator${props.timeClass}`} max="100" value={props.value}></progress>;

export default timeIndicator;