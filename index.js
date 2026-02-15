const suncalc = require('suncalc')
const express = require('express')
const helmet = require('helmet')

const app = express()
const port = process.env.PORT || 3001
const PITTSBURGH_LAT = 40.440624
const PITTSBURGH_LON = -79.995888

app.use(helmet())

// Map illumination fraction (0.0-1.0) to 6 LEDs
function getLedCount(fraction) {
  if (fraction <= 0) return 0
  return Math.min(Math.ceil(fraction * 6), 6)
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/moon', (req, res) => {
  const { fraction } = suncalc.getMoonIllumination(new Date())
  res.send(`${getLedCount(fraction)}`)
})

app.get('/moon/phase', (req, res) => {
  const { phase } = suncalc.getMoonIllumination(new Date())
  res.send(`${phase}`)
})

app.get('/moon/up', (req, res) => {
  const now = new Date()
  const times = suncalc.getMoonTimes(now, PITTSBURGH_LAT, PITTSBURGH_LON)
  let up = false
  if (times.alwaysUp) {
    up = true
  } else if (times.alwaysDown) {
    up = false
  } else if (times.rise && times.set) {
    up = times.rise < times.set ? (now >= times.rise && now < times.set) : (now >= times.rise || now < times.set)
  } else if (times.rise) {
    up = now >= times.rise
  } else if (times.set) {
    up = now < times.set
  }
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
