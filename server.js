const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const TRANSLINK_TOKEN = 'j2bXKzENILvyoxlZ399I'
const TRANSLINK_URL = 'http://api.translink.ca/rttiapi/v1/buses?apikey='

// API routes
app.get('/buses/location', async (req, res) => {
  const apiURL = `${TRANSLINK_URL}${TRANSLINK_TOKEN}`
  try {
    const response = await fetch(apiURL, { headers: { 'Accept': 'application/json' }})
    const jsonResponse = await response.json()
    res.send(jsonResponse)
  }
  catch (e){
    console.log(e)
  }
})



app.listen(port, () => console.log(`Listening on port ${port}`))