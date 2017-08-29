function toArray(arraylike) {
    return Array.prototype.slice.call(arraylike);
}
function touches(e, pos) {
    if (typeof pos === 'undefined') {
       return toArray(e.touches); 
    }
    return toArray(e.touches)[pos];
    
}
function targetTouches(e, pos) {
    if (typeof pos === 'undefined') {
        return toArray(e.targetTouches);
    }
    return toArray(e.targetTouches)[pos];
}
function changedTouches(e, pos) {
    if (typeof pos === 'undefined') {
        return toArray(e.targetTouches);
    }
    return toArray(e.changedTouches)[pos];
}

function getTouchX (touch) {
    return touch.pageX;
}
function getTouchY (touch) {
    return touch.pageY;
}
function getTouchID (touch) {
    return touch.identifier;
}


// export
export default {
    touches: touches,
    changedTouches: changedTouches,
    targetTouches: changedTouches,
    x: getTouchX,
    y: getTouchY,
    id: getTouchID
}