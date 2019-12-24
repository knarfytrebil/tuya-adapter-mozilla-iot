/**
 * Tuya Device.
 */
'use strict';

const {Device} = require("gateway-addon");
const TuyAPI = require("tuyapi");
const TuyaProperty = require("./tuya-property");

class TuyaDevice extends Device {
    constructor(adapter, id, deviceDescription) {
        super(adapter, id);

        this.name = deviceDescription.name;
        this.type = "onOffSwitch";
        this["@type"] = ["OnOffSwitch"];
        this.description = "Tuya Device";


        this.tuya_ip = deviceDescription.ip;
        this.tuya_id = deviceDescription.id;
        this.tuya_key = deviceDescription.key;


        this.client = new TuyAPI({
                ip: this.tuya_ip,
                id: this.tuya_id,
                key: this.tuya_key,
                persistentConnection: true
            }
        );


        this.client.on("disconnected", () => {
            console.log("TuyaApi: Disconnected from device.");
        });
        this.client.on("connected",() => {
            console.log("TuyaApi: Connected to device.");
        });

        this.properties.set("on", new TuyaProperty(this, "on", {
                "@type": "OnOffProperty",
                label: "On/Off",
                name: "on",
                type: "boolean",
                value: false,
            }
        ));
    }


    /**
     * Todo
     *
     * @return {Promise}
     */
    connect() {
        return new Promise((resolve, reject) => {
            if (!this.client.isConnected()) {
                console.log("TuyaDevice: TuyaApi connecting.");
                resolve(this.client.connect());
            } else {
                resolve("TuyaDevice: TuyaApi already connected.");
            }
        });
    }

    /**
     * Todo
     *
     * @returns {Promise<Boolean>}
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.client.isConnected()) {
                console.log("TuyaDevice: TuyaApi disconnecting.");
                resolve(this.client.disconnect());
            } else {
                resolve("TuyaDevice: TuyaApi already disconnected.");
            }
        });

    }
}

module.exports = TuyaDevice;