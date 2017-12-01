module.exports = {
  respondResult: (res) => (err) => {
    res.status(err.status).send(err)
  },
  respondError: (res) => () => {
    res.status(200).send({message: 'success'})
  },
  respondSuccess: (res) => (result) => {
    res.status(200).send({
      message: 'success',
      result
    })  
}