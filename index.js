const suncalc = require('suncalc')
const express = require('express')
const helmet = require('helmet')

const app = express()
const port = process.env.PORT || 3001
const PITTSBURGH_LAT = 40.440624
const PITTSBURGH_LON = -79.995888

app.use(helmet())

// my moon light only has 6 leds so I need to figure out how many
// to light up despite there being 8 moon phases instead of 6
function getLedCount(phase) {
  const led2 = 1/6*2
  const led3 = 1/6*3
  const led4 = 1/6*4
  const led5 = 1/6*5

  if (phase <= 0) return 0
  if (phase < led2) return 1
  if (phase < led3) return 2
  if (phase < led4) return 3
  if (phase < led5) return 4
  if (phase < 1) return 5
  return 6
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/moon', (req, res) => {
  const { phase } = suncalc.getMoonIllumination(new Date())
  res.send(`${getLedCount(phase)}`)
})

app.get('/moon/phase', (req, res) => {
  const { phase } = suncalc.getMoonIllumination(new Date())
  res.send(`${phase}`)
})

app.get('/moon/up', (req, res) => {
  const now = new Date()
  const { rise } = suncalc.getMoonTimes(now, PITTSBURGH_LAT, PITTSBURGH_LON)
  const up = rise ? rise < now : false
  res.send(`${up}`)
})

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Moon Phase API listening on port ${port}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => process.exit(0))
})

module.exports = { app, getLedCount }
