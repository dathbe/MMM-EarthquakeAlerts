/* MagicMirror²
 * Module: MMM-EarthquakeAlerts
 *
 * By dathbe
 * MIT Licensed.
 */

Module.register('MMM-EarthquakeAlerts', {

  // Default config.
  defaults: {
    latitude: 39.1,
    longitude: 94.6,
    animationSpeed: 2 * 1000,
  },

  // Define required scripts.
  getStyles() {
    return ['MMM-EarthquakeAlerts.css']
  },

  // Define start sequence.
  start() {
    this.notification = false
    this.messageText = this.config.initialMessage
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

  notificationReceived(notification, payload, sender) {
    if (notification === 'EARTHQUAKEALERTS_UPDATE' && (payload.uniqueID == this.config.uniqueID || !this.config.uniqueID)) {
      Log.debug(`Received notification: ${notification} with payload.message: ${payload.message} from sender: ${sender}`)
      this.messageText = payload.message
      this.notification = true
      this.updateDom(this.config.animationSpeed)
    }
  },

})
