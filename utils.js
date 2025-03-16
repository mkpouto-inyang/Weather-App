export const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
};

// Convert from Kelvin to Fahrenheit
export const kelvinToFahrenheit = (kelvin) => {
    return (kelvin - 273.15) * (9/5) + 32;
};