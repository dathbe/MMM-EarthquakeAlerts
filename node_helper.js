const NodeHelper = require('node_helper')
const moment = require('moment-timezone')
// const pd = require('node-pandas')
const geolib = require('geolib')

module.exports = NodeHelper.create({
  start: function () {
    console.log('Starting node_helper for: ' + this.name)
  },

  async getData(payload) {

    // Fetch earthquake data for the last day (with at least magnitude1 magnitude)
    var data = []
    try {
      const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=' + moment().subtract(1, 'day').format() + '&minmagnitude=' + payload.magnitude1
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      var quakes = await response.json()
      quakes = quakes['features']

      // Parse quake information
      var quakeMessages = []
      for (var quakeNo in quakes) {
        var distances = []
        for (var locNo in payload.locations) {
          distances.push(
            geolib.getPreciseDistance(
              { latitude: payload.locations[locNo]['latitude'], longitude: payload.locations[locNo]['longitude'] },
              { latitude: quakes[quakeNo]['geometry']['coordinates'][1], longitude: quakes[quakeNo]['geometry']['coordinates'][0] },
            ),
          )
        }
        var hoursAgo = (new Date() - quakes[quakeNo]['properties']['time']) / 1000 / 60 / 60
        // if ((Math.min(distances) <= payload.distance1 && quake['properties']['mag'] >= payload.magnitude1)
        //  || (Math.min(distances) <= payload.distance2 && quake['properties']['mag'] >= payload.magnitude2)
        //  || (quake['properties']['mag'] >= payload.magnitude3)) {
          quakeMessages.push(`${parseFloat(quakes[quakeNo]['properties']['mag']).toFixed(1)} earthquake ${Math.round(Math.min(...distances) / 1609)} miles from ${payload.locations[distances.indexOf(Math.min(...distances))]['name']} near ${quakes[quakeNo]['properties']['place'].split('of ')[1]} ${Math.floor(hoursAgo)} hours ago`)
        // }
      }
      // Send message
      if (quakeMessages.length > 0) {
        this.sendSocketNotification('EARTHQUAKE_ALERT', {
          quakeMessages: quakeMessages,
        })
      }
    }
    catch (error) {
      console.error('[MMM-EarthquakeAlerts] Could not load data.', error)
    }
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    if (notification.startsWith('EARTHQUAKE_REQUEST')) {
      this.getData(payload)
    }
  },
})