const Log = require('logger')
const NodeHelper = require('node_helper')
const moment = require('moment-timezone')
const geolib = require('geolib')

module.exports = NodeHelper.create({
  start: function () {
    Log.log('Starting node_helper for: ' + this.name)
  },

  async getData(payload) {
    // Fetch earthquake data for the last day (with at least magnitude1 magnitude)
    try {
      const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=' + moment().subtract(1, 'day').format() + '&minmagnitude=' + payload.magnitude1
      const response = await fetch(url)
      Log.debug(`[MMM-EarthquakeAlerts] ${url} fetched`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      var quakes = await response.json()
      quakes = quakes['features']

      // Parse quake information
      var quakeMessages = []
      for (var quakeNo in quakes) {
        var closeTo = -1
        var distances = []
        for (var locNo in payload.locations) {
          var currDistance = geolib.getPreciseDistance(
            { latitude: payload.locations[locNo]['latitude'], longitude: payload.locations[locNo]['longitude'] },
            { latitude: quakes[quakeNo]['geometry']['coordinates'][1], longitude: quakes[quakeNo]['geometry']['coordinates'][0] },
          )
          distances.push(currDistance)
          if (((currDistance <= payload.distance1 && quakes[quakeNo]['properties']['mag'] >= payload.magnitude1)
            || (currDistance <= payload.distance2 && quakes[quakeNo]['properties']['mag'] >= payload.magnitude2)
            || (currDistance <= payload.distance3 && quakes[quakeNo]['properties']['mag'] >= payload.magnitude3)
            || (quakes[quakeNo]['properties']['mag'] >= payload.magnitude4))
          && closeTo < 0) {
            closeTo = locNo
          }
        }

        // If the earthquake is not at the first-listed (primary) location:
        if (config.units === 'metric') {
          var primaryDistance = `${Math.round(distances[0] / 1000)} km`
        }
        else {
          primaryDistance = `${Math.round(distances[0] / 1609)} miles`
        }
        if (closeTo == 0) {
          quakeMessages.push(`${parseFloat(quakes[quakeNo]['properties']['mag']).toFixed(1)} earthquake ${primaryDistance} away near ${quakes[quakeNo]['properties']['place'].split('of ')[quakes[quakeNo]['properties']['place'].split('of ').length - 1]} ${hoursAgo} hours ago`)
        }
        else if (closeTo > 0) {
          if (config.units === 'metric') {
            var messageDistance = `${Math.round(distances[closeTo] / 1000)} km`
          }
          else {
            messageDistance = `${Math.round(distances[closeTo] / 1609)} miles`
          }
          var hoursAgo = Math.floor((new Date() - quakes[quakeNo]['properties']['time']) / 1000 / 60 / 60)
          quakeMessages.push(`${parseFloat(quakes[quakeNo]['properties']['mag']).toFixed(1)} earthquake ${primaryDistance} away (${messageDistance} from ${payload.locations[closeTo]['name']}) near ${quakes[quakeNo]['properties']['place'].split('of ')[quakes[quakeNo]['properties']['place'].split('of ').length - 1]} ${hoursAgo} hours ago`)
          // quakeMessages.push(`${parseFloat(quakes[quakeNo]['properties']['mag']).toFixed(1)} earthquake ${messageDistance} from ${payload.locations[closeTo]['name']} near ${quakes[quakeNo]['properties']['place'].split('of ')[quakes[quakeNo]['properties']['place'].split('of ').length - 1]} ${hoursAgo} hours ago`)
        }
      }
      // Send message
      Log.debug(quakeMessages)
      this.sendSocketNotification('EARTHQUAKE_ALERT', {
        quakeMessages: quakeMessages,
      })
    }
    catch (error) {
      Log.error('[MMM-EarthquakeAlerts] Could not load data.', error)
    }
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function (notification, payload) {
    if (notification.startsWith('EARTHQUAKE_REQUEST')) {
      this.getData(payload)
    }
  },
})
