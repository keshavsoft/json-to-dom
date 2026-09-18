import dispatchSpec from "./buildSpec/index.js";

const construct = ({ raka, inShowLog, poka }) => {
    const localShowLog = inShowLog;

    return dispatchSpec({ raka, inShowLog: localShowLog, poka });
};

export default construct;