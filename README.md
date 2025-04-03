# Module: MMM-EarthquakeAlerts

`MMM-EarthquakeAlerts` is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror). It posts alert messages to your MagicMirror regarding recent earthquakes based on USGS data.

![Example Screenshot](screenshot.png)

Suggestions are welcome.

## Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/dathbe/MMM-EarthquakeAlerts
```

No dependencies need to be installed, **but** you likely want [MMM-Remote-Control](https://github.com/Jopyth/MMM-Remote-Control) installed to allow posting of messages via API.

## Updating

```sh
cd ~/MagicMirror/modules/MMM-EarthquakeAlerts
git pull
```

## Usage

### Example Config

To use this module, add it to the modules array in your `~/MagicMirror/config/config.js` file:

````js
{
  module: 'MMM-EarthquakeAlerts',
  position: 'top_bar',
  config: {
    animationSpeed: 1000 * 2
  }
}
````

### Configuration options

The following properties can be configured:

| Option                | Description
|-----------------------|------------
|`animationSpeed`	|*Optional* The speed of animated transitions from one message to another in milliseconds<br>**Type:** `int`<br>**Default:** `2000` (2 seconds)

## Contributing

If you find any problems, bugs or have questions, please [open a GitHub issue](https://github.com/dathbe/MMM-EarthquakeAlerts/issues) in this repository.

Pull requests are of course also very welcome 🙂

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

### Developer commands

- `npm run lint` - Run linting checks.
- `npm run lint:fix` - Fix automatically fixable linting errors.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
