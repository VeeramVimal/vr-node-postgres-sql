const { objSize } = require('./objects.functions');

const paginate = (filter, options) => {

  const obj = {}

  const where = objSize(filter) > 0 ? filter : null;
  if(where){
    obj.where = where;
  }

  const offset = options.limit && options.page ? (parseInt(options.page) - 1) * parseInt(options.limit) : null
  if(offset){
    obj.offset = offset
  }
  
  const limit  = options.limit ? options.limit : null
  if(limit){
    obj.limit = limit
  }

  return obj
}

module.exports = paginate;