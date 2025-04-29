/* MagicMirror²
 * Module: MMM-EarthquakeAlerts
 *
 * By dathbe
 * MIT Licensed.
 */

Module.register('MMM-EarthquakeAlerts', {

  // Default config.
  defaults: {
    locations: [
      { latitude: 39.1, longitude: -94.6, name: 'nowhere specific' },
    ],
    updateInterval: 30 * 60, // 30 minutes
    magnitude1: 2.5,
    distance1: 10 * 1609,
    magnitude2: 4.0,
    distance2: 60 * 1609,
    magnitude3: 5.5,
    distance3: 300 * 1609,
    magnitude4: 7.0,
    animationSpeed: 2 * 1000, // 2 seconds
  },

  // Define required scripts.
  getStyles() {
    return ['MMM-EarthquakeAlerts.css']
  },

  // Define start sequence.
  start() {
    Log.info('Starting module: ' + this.name)

    this.messageText = ''

    this.sendSocketNotification('EARTHQUAKE_REQUEST', this.config)

    this.scheduleUpdate()
  },

  scheduleUpdate: function (delay) {
    var nextLoad = this.config.updateInterval * 1000
    if (typeof delay !== 'undefined' && delay >= 0) {
      nextLoad = delay
    }

    var self = this
    setInterval(function () {
      Log.debug('[MMM-EarthquakeAlerts] Sending notification now')
      self.sendSocketNotification('EARTHQUAKE_REQUEST', self.config)
    }, nextLoad)
  },

  // dom generator.
  getDom() {
    const self = this
    // create html
    const wrapper = document.createElement('div')
    wrapper.className = 'EarthquakeAlertsDiv'
    wrapper.innerHTML = self.messageText
    if (self.messageText == '') {
      wrapper.style.display = 'none'
    }
    return wrapper
  },

  // Deal with received notification
  socketNotificationReceived(notification, payload) {
    if (notification === 'EARTHQUAKE_ALERT') {
      Log.debug('[MMM-EarthquakeAlerts] Earthquake message received!')
      if (payload.quakeMessages.length > 0) {
        this.messageText = payload.quakeMessages.join('<br>')
      }
      else {
        this.messageText = ''
      }
      this.updateDom(this.config.animationSpeed)
    }
  },

  // NOW NEED TO HAVE IT REFRESH THE FEED PERIODICALLY
  // Maybe set it so that it will display location 1 if loc1 hits any of the criteria, then 2, then 3 (with a boolean on whether any given thing hits?)

})
