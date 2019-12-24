# Tuya-adapter

Tuya adapter is an interface of [TuyAPI](https://github.com/codetheweb/tuyapi) for the [Mozilla IoT gateway](https://iot.mozilla.org).

## Usage
To manage your Tuya device, click into `Configure` below `Tuya adapter` into `Add-ons`
 
### Configuration
To add a new device you need to have these `id` and `key`, to find these fields you have to follow this setup instructions.

### Find `id` and `key`
* Be sure your devices is already added to you `Smart-Life` application.
* Install npm (version 8)
* Install tuyapi/cli `npm i @tuyapi/cli -g` 
* Install AnyProxy `npm i anyproxy -g` 
* Generate certificate: `anyproxy-ca`
* Make sure your computer and your phone is on the same network. 
* Run app: `tuya-cli list-app`
* Flash the QR-Code into your phone
* It's will download you the certificate of the proxy
* Install certificate
  * After download the certificate (`rootCa.crt`) install this one.
    * [Android](https://support.google.com/nexus/answer/2844832)
    * [iPhone](https://support.apple.com/en-en/HT204477)
* Configure proxy
  * Configure your wifi network connection to use the proxy created by the command executed above.
    * [Android](https://support.google.com/nexus/answer/2844832)
    * [iPhone](https://support.apple.com/en-en/HT202693)
* **For iPhone Only**: Enable full trust of certificate by going to Settings > General > About > Certificate Trust Settings
* Open Tuya Smart application and refresh the list of devices by `pulling/swiping down`.
* A list of ID and key pairs should appear in the console.
* It's recommended to untrust/remove the root certificate after you're done for security purposes.

## Tested on
* Yuanguo KS-501

## Projects built with
* [Mozilla IoT](https://github.com/mozilla-iot)
* [TuyAPI](https://github.com/codetheweb/tuyapi)
* [tuyapi/cli](https://github.com/TuyaAPI/cli)

## Authors
* **Quentin LEPRAT** - [CrabeMan](https://github.com/CrabeMan)

## License
This project is licensed under the Mozilla Public License 2.0 - see the [LICENSE](LICENSE) file for details
