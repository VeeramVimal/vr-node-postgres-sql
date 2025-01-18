
objSize = (obj) =>  {
    // console.log(obj, 'obj')
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


module.exports = {
    objSize 
}