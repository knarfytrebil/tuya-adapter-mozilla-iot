/**
 * Tuya adapter.
 */
'use strict';

const {Adapter} = require('gateway-addon');
const TuyaDevice = require('./tuya-device');


class TuyaAdapter extends Adapter {
    constructor(addonManager, manifest) {
        super(addonManager, "TuyaAdapter", manifest.name);
        addonManager.addAdapter(this);
        this.config = manifest.moziot.config;

        this.addKnownDevices();
    }


    addKnownDevices() {
        let devicesDescription = this.config.devices;
        if (!devicesDescription) {
            console.error("No devicesDescription specified in config");
            return;
        }
        if (!Array.isArray(devicesDescription)) {
            devicesDescription = [devicesDescription];
        }
        for (const deviceDescription of devicesDescription) {
            console.log("Adding Device:", deviceDescription, " (via config)");
            try {
                let device = new TuyaDevice(this, "tuya-plug-" + deviceDescription.id, deviceDescription);
                this.handleDeviceAdded(device);
            } catch (e) {
                console.error("Unable to create Tuya Device: " + e);
            }
        }

    }

    /**
     * Example process to add a new device to the adapter.
     *
     * The important part is to call: `this.handleDeviceAdded(device)`
     *
     * @param {String} deviceId ID of the device to add.
     * @param {String} deviceDescription Description of the device to add.
     * @return {Promise} which resolves to the device added.
     */
    addDevice(deviceId, deviceDescription) {
        return new Promise((resolve, reject) => {
            console.log(deviceId);
            if (deviceId in this.devices) {
                reject("Device: ${deviceId} already exists.");
            } else {
                const device = new TuyaDevice(this, deviceId, deviceDescription);
                this.handleDeviceAdded(device);
                resolve(device);
            }
        });
    }

    /**
     * @param {TuyaDevice} device
     */
    handleDeviceAdded(device) {
        super.handleDeviceAdded(device);
        console.log("TuyaAdapter: handleDeviceAdded");
        device.connect();
    }

    /**
     * Example process ro remove a device from the adapter.
     *
     * The important part is to call: `this.handleDeviceRemoved(device)`
     *
     * @param {String} deviceId ID of the device to remove.
     * @return {Promise} which resolves to the device removed.
     */
    removeDevice(deviceId) {
        return new Promise((resolve, reject) => {
            const device = this.devices[deviceId];
            if (device) {
                this.handleDeviceRemoved(device);
                resolve(device);
            } else {
                reject("Device: ${deviceId} not found.");
            }
        });
    }

    /**
     * Start the pairing/discovery process.
     *
     * @param {Number} timeoutSeconds Number of seconds to run before timeout
     */
    startPairing(_timeoutSeconds) {
        console.log('TuyaAdapter:', this.name,
            'id', this.id, 'pairing started');
    }

    /**
     * Cancel the pairing/discovery process.
     */
    cancelPairing() {
        console.log('TuyaAdapter:', this.name, 'id', this.id,
            'pairing cancelled');
    }

    /**
     * Unpair the provided the device from the adapter.
     *
     * @param {Object} device Device to unpair with
     */
    removeThing(device) {
        console.log("TuyaAdapter:", this.name, "id", this.id,
            "removeThing(", device.id, ") started");

        device.disconnect();
        this.removeDevice(device.id).then(() => {
            console.log("TuyaAdapter: device: ", device.id, " was unpaired.");
        }).catch((err) => {
            console.error("TuyaAdapter: unpairing", device.id, "failed");
            console.error(err);
        });
    }

    /**
     * Cancel unpairing process.
     *
     * @override
     * @param {Object} device Device that is currently being paired
     */
    cancelRemoveThing(device) {
        console.log('TuyaAdapter:', this.name, 'id', this.id,
            'cancelRemoveThing(', device.id, ')');
    }


    unload() {
        console.log("TuyaAdapter: unload");
        let promise = null;
        for (const deviceId of Object.keys(this.devices)) {
            let p = this.devices[deviceId].disconnect();
            if (promise == null) {
                promise = p;
            } else {
                promise = promise.then(p);
            }
        }

        return promise;
    }
}

module.exports = TuyaAdapter;