export function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


export function getDay(dayNo) {
    var weekday = new Array(7);
    weekday[0] = "SUN";
    weekday[1] = "MON";
    weekday[2] = "TUE";
    weekday[3] = "WED";
    weekday[4] = "THU";
    weekday[5] = "FRI";
    weekday[6] = "SAT";
    return weekday[dayNo];
}


export function getWeatherUpdate(weather) {
    let tenMinutesInMs = 10 * 60 * 1000
    weather.fetch(tenMinutesInMs)
        .then(weather => console.log(JSON.stringify(weather)))
        .catch(error => weatherError(error));
    return (weather) ? weather : null;
}


export function getWeatherTemperature(weather) {
    return (weather && weather.get()['temperatureC']) ?
        (Math.round(weather.get()['temperatureC']) + "°") :
        "-°";
}

export function getWeatherConditionCode(weather) {
    return (weather && weather.get()['conditionCode']) ? weather.get()['conditionCode'] : 1;
}


function weatherError(error) {
    console.log(error);
}