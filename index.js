const express = require('express')
const app = express()
const port = 3000
const checkOpenPRs = require('./bin/pullRequestCron')

app.get('/pullRequestCron', (req, res) => {
  checkOpenPRs()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})