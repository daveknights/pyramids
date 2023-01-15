import React from "react";

const navigation = props => (
    <div className="button-nav" onClick={props.handleNavBtnClickFn}>
        <button type="button" data-action="to levels"><span className="return-span">&#9664;</span>Return</button>
        <button type="button" data-action="try again">Try again</button>
        {props.showNext && <button type="button"  data-action="next level">Next<span className="next-span">&#9654;</span></button>}
    </div>
);

export default navigation;