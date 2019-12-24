/**
 * Tuya Property.
 */
'use strict';

const {Property} = require('gateway-addon');

class TuyaProperty extends Property {
    constructor(device, name, propertyDescription) {
        super(device, name, propertyDescription);
        let that = this;
        this.setCachedValue(propertyDescription.value);

        this.device.notifyPropertyChanged(this);

        this.setValuePromiseResolve = null;
        this.setValuePromiseReject = null;

        this.skipNextSetValueFromApi = false;

        this.device.client.on("data", data => {
            const status = data.dps["1"];
            if (that.setValuePromiseResolve == null) {
                console.log("TuyaApi: New status from device: " + status);
                return that.setValue(status);
            } else {
                console.log("TuyaApi: ACK of set command");
                that.setValuePromiseResolve(status);
                that.setValuePromiseResolve = null;
            }
        });

        this.device.client.on("connected",() => {
            that.skipNextSetValueFromApi = true;
        });
    }

    /**
     * Set the value of the property.
     *
     * @param {*} value The new value to set
     * @returns a promise which resolves to the updated value.
     *
     * @note it is possible that the updated value doesn't match
     * the value passed in.
     */
    setValue(value) {
        let that = this;
        return new Promise((resolve, reject) => {
            super.setValue(value).then((updatedValue) => {
                if (that.skipNextSetValueFromApi) {
                    that.skipNextSetValueFromApi = false;
                    return resolve(updatedValue);
                }
                this.device.notifyPropertyChanged(this);
                if (this.device.client.isConnected()) {
                    console.log("TuyaProperty: Set to TuyaApi: " + updatedValue);
                    this.device.client.set({set: updatedValue});

                    resolve(new Promise(function(resolve, reject){
                        that.setValuePromiseResolve = resolve;
                        that.setValuePromiseReject = reject;
                    }));
                } else {
                    reject("Device " + this.device + " is not connected");
                }

            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = TuyaProperty;