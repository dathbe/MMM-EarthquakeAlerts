const NodeHelper = require('node_helper')

module.exports = NodeHelper.create({
  start: function () {
    console.log('Starting node_helper for: ' + this.name)
  },

  async getData(payload) {
    try {
      const url = 
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      this.sendSocketNotification("EARTHQUAKE_RESULTS", {
        result: data
      })
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
