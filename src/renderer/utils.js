export function cmp(object1, object2, properties) {
    let same = true;

    for (let property of properties) {
        if (object1[property] !== object2[property]) {
            same = false;
            break;
        }
    }

    return same;
}

export function deepEql(object1, object2) {
    const type1 = typeof object1;
    const type2 = typeof object2;
    if (type1 !== type2) return false;

    if (type1 !== "object") return object1 === object2;
    else {
        let equal = true;
        for (let key in object1) {
            if (!deepEql(object1[key], object2[key])) {
                equal = false;
                break;
            }
        }
        return equal;
    }
}
