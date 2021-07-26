"use strict";

const axios = require("axios");

const setup = (homebridge) => {
  homebridge.registerAccessory(
    "homebridge-esp8266-dht22",
    "ESP8266DHT22",
    ESP8266DHT22
  );
};

class ESP8266DHT22 {
  constructor(log, config, api) {
    log("ESP8266DHT22 Start!");
    this.log = log;
    this.config = config;
    this.api = api;

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    this.name = config.name;
    this.ip = config.ip;
    this.log(`Name : ${this.name}, IP : ${this.ip}`);

    this.sensorData = {
      temperature: 26,
      humidity: 50
    }

    this.temperatureService = new this.Service.TemperatureSensor(this.name);

    this.temperatureService
      .getCharacteristic(this.Characteristic.CurrentTemperature)
      .onGet(this.handleCurrentTemperatureGet.bind(this));
  }

  async handleCurrentTemperatureGet() {
    this.log("Triggered GET CurrentTemperature");
    this.getSensorData();

    return this.sensorData.temperature;
  }

  async getSensorData() {
    this.log("Axios", this.ip);
    const axios = require("axios");

    const refineData = (data) => {
      return JSON.parse(data.replace(/&quot;/g, '"'));
    };

    try {
      const { data } = await axios.get(`http://${this.ip}`);
      this.log(data);

      this.sensorData = refineData(data);
      this.log(this.sensorData);
    } catch (error) {
      this.log(error);
    }
  }

  getServices() {
    return [this.temperatureService];
  }
}

module.exports = setup;
