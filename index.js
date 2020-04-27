const suncalc = require('suncalc')
const moment = require('moment')
const express = require('express')
const app = express()
const port = process.env.PORT

// my moon light only has 6 leds so I need to figure out how many
// to light up despite there being 8 moon phases instead of 6
var led1 = 1/6
var led2 = 1/6*2
var led3 = 1/6*3
var led4 = 1/6*4
var led5 = 1/6*5
var led6 = 1

app.get('/', (req, res) => {
    var phase = suncalc.getMoonIllumination(moment()).phase
    var led = 0
    if (phase >= 0 && phase < led2) {
        led = 1
    }
    if (phase > led2 && phase <= led3) {
        led = 2
    }
    if (phase > led3 && phase <= led4) {
        led = 3
    }
    if (phase > led4 && phase <= led5) {
        led = 4
    }
    if (phase > led5 && phase <= led6) {
        led = 5
    }
    if (phase == led6) {
        led = 6
    }
    res.send(`${led}`)
})
app.get('/phase', (req, res) => {
    var phase = suncalc.getMoonIllumination(moment()).phase
    res.send(`${phase}`)
})
app.get('/up', (req, res) => {
    var date = moment()
    var up = moment(suncalc.getMoonTimes(date, '40.440624', '-79.995888').rise).isBefore(moment())
    res.send(`${up}`)
})
app.listen(port, () => console.log(`Example app listening...`))