module.exports = function respondError(err) {
  return function(res) {
    res.status(err.status).send(err.message)
  }
}

module.exports = function respondSuccess() {
  return function(res) {
    res.status(200).send({message: 'success'})
  }
}

module.exports = function respondResult(data) {
  return function(res) {
    res.status(200).send({
      message: 'success',
      result: data
    })  
  }
}