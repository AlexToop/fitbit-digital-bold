import clock from "clock";
import document from "document";
import {preferences} from "user-settings";
import * as util from "../common/utils";
import * as weather from '../fitbit-weather/app';
import {display} from "display";
import {battery} from "power";
import {today} from 'user-activity';
import {HeartRateSensor} from "heart-rate";
import * as messaging from "messaging";

const hoursElem = document.getElementById('hours');
const minutesElem = document.getElementById('minutes');
const vanityElem = document.getElementById('vanity');
const dateElem = document.getElementById("date");

const heartRate = document.getElementById("heart-rate");
const main = document.getElementById("main");
const batteryMeasure = document.getElementById("battery-measure");
const weatherElement = document.getElementById("weather");
const weatherIcon = document.getElementById("weather-icon");
const background = document.getElementById("background");
const steps = document.getElementById("steps");
const stepsImage = document.getElementById("steps-img");
const batteryImage = document.getElementById("charge-img");

var sensors = [];
setWeather(weather);
clock.granularity = "minutes";

clock.ontick = (evt) => {
    let date = evt.date;
    let hours = date.getHours();
    if (preferences.clockDisplay === "12h") {
        hours = hours % 12 || 12;
    } else {
        hours = util.zeroPad(hours);
    }
    let mins = util.zeroPad(date.getMinutes());
    hoursElem.text = hours;
    minutesElem.text = mins;

    var day = util.getDay(date.getDay());
    var dateNo = date.getDate();
    dateElem.text = day + " " + dateNo;
    updateBattery(battery);
    setWeather(weather);
    updateActivity(today);
};

if (HeartRateSensor) {
    const hrm = new HeartRateSensor({frequency: 1});
    heartRate.text = "NA";
    hrm.addEventListener("reading", () => {
        heartRate.text = hrm.heartRate + "";
    });
    sensors.push(hrm);
    hrm.start();
}

display.addEventListener("change", () => {
    if (display.on) {
        sensors.map(sensor => sensor.start());
        setWeather(weather);
        updateBattery(battery);
    } else {
        sensors.map(sensor => sensor.stop());
    }
});

messaging.peerSocket.onmessage = evt => {
    if (evt.data.key === "textColour" && evt.data.newValue) {
        let color = JSON.parse(evt.data.newValue);
        hoursElem.style.fill = color;
        minutesElem.style.fill = color;
        dateElem.style.fill = color;
        vanityElem.style.fill = color;
    }
    if (evt.data.key === "backgroundColour" && evt.data.newValue) {
        let color = JSON.parse(evt.data.newValue);
        background.style.fill = color;
    }
    if (evt.data.key === "generalTextColour" && evt.data.newValue) {
        let color = JSON.parse(evt.data.newValue);
        steps.style.fill = color;
        batteryMeasure.style.fill = color;
        weatherElement.style.fill = color;
        batteryImage.style.fill = color;
        stepsImage.style.fill = color;
        weatherIcon.style.fill = color;
        heartRate.style.fill = color;
    }
}

function setWeather(weather) {
    weather = util.getWeatherUpdate(weather);
    weatherElement.text = util.getWeatherTemperature(weather);
    weatherIcon.href = "images/weather-icon-" + util.getWeatherConditionCode(weather) + ".png";
}

function updateBattery(battery) {
    batteryMeasure.text = battery.chargeLevel;
}

function updateActivity(today) {
    steps.text = today.adjusted.steps;
}