
export const getKeysFromValue = (object, value) => {
    if(!value) return;
    console.log(object,"object")
    return Object.keys(object).find(key => object[key].toLowerCase() === value.toLowerCase()) || null;
}