function respondError(res) {
  return function(err) {
    res.status(err.status).send(err)
  }
}

function respondSuccess(res) {
  return function() {
    res.status(200).send({message: 'success'})
  }
}

function respondResult(res) {
  return function(result) {
    res.status(200).send({
      message: 'success',
      result
    })  
  }
}

module.exports = {
  respondResult,
  respondError,
  respondSuccess
}