module.exports = {
  respondResult: (res) => (result) => {
    res.status(200).send({
      message: 'success',
      result
    })  
  },
  respondError: (res) => (err) => {
    res.status(err.status).send(err)
  }
  ,
  respondSuccess: (res) => () => {
    res.status(200).send({message: 'success'})
  }
}
