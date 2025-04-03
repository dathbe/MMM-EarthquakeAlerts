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

/*
import requests
import datetime
import json
import pandas as pd
import geopy.distance
import sys

message = []

### Add earthquakes
today = datetime.datetime.now()
yesterday = today - datetime.timedelta(days=1)
quakeurl = f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime={yesterday.strftime('%Y-%m-%dT%H:%M')}-0800&minmagnitude=2.5"
sunnysideloc = (33.7629, -118.3254)
poppyloc = (33.7601,-116.3347)
nploc = (33.7629, -118.3254)

response = json.loads(requests.get(quakeurl).content)
quakedata = pd.DataFrame(columns=["mag", "time", "place", "lat", "lon", "sunnysideDistance", "poppyDistance", "npDistance"])
for quake in response['features']:
	sunnysideDist = round(geopy.distance.geodesic(f"{quake['geometry']['coordinates'][1]}, {quake['geometry']['coordinates'][0]}", sunnysideloc).miles,0)
	poppyDist = round(geopy.distance.geodesic(f"{quake['geometry']['coordinates'][1]}, {quake['geometry']['coordinates'][0]}", poppyloc).miles,0)
	npDist = round(geopy.distance.geodesic(f"{quake['geometry']['coordinates'][1]}, {quake['geometry']['coordinates'][0]}", nploc).miles,0)
	addit = False
	if quake['properties']['mag'] >= 7.0:
		addit = True
	elif quake['properties']['mag'] >= 5.5 and (sunnysideDist <= 300 or poppyDist <= 300 or npDist <= 300):
		addit = True
	elif quake['properties']['mag'] >= 4.0 and (sunnysideDist <= 60 or poppyDist <= 60 or npDist <= 60):
		addit = True
	elif sunnysideDist <= 10 or poppyDist <= 10 or npDist <= 10:
		addit = True
	if addit or '-d' in sys.argv:
		quakedata.loc[quake['id']] = [quake['properties']['mag'], quake['properties']['time'], quake['properties']['place'].split(" of ")[-1], quake['geometry']['coordinates'][1], quake['geometry']['coordinates'][0], sunnysideDist, poppyDist, npDist]

if '-d' in sys.argv:
	quakedata = quakedata.head(2)
for i, quake in quakedata.iterrows():
	hoursAgo = (today.timestamp() - quake['time']/1000)/60/60
	quakeDescrip = f"{quake['mag']} earthquake {int(quake['sunnysideDistance'])} miles away "
	if quake['poppyDistance'] < quake['sunnysideDistance'] and quake['poppyDistance'] <= quake['npDistance']:
		quakeDescrip += f"({int(quake['poppyDistance'])} miles from Poppy) "
	elif quake['npDistance'] < quake['sunnysideDistance']:
		quakeDescrip += f"({int(quake['npDistance'])} miles from Normandy Park) "
	quakeDescrip += f"near {quake['place']} {int(hoursAgo)} hours ago"
	message += [quakeDescrip]

### Combine and post message
if len(message) > 0:
	message = '<br>'.join(message)
	message = f"{prefix}{message}{suffix}"
else:
	message = ''

print(message)
json = {
	"uniqueID": "earthquakes",
	"message": message
}

x = requests.post('http://192.168.1.107:8080/api/notification/CUSTOMTEXT_UPDATE', json=json)
*/
