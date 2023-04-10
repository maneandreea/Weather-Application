// Dark Mode Triggered by Click
const darkTheme = document.getElementById('night-mode');
darkTheme.addEventListener('click', darkToLight);

// Dark Mode Theme Change
function darkToLight() {
  document.querySelector('body').classList.toggle('dark');
  if (document.querySelector('body').classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

const temp = document.getElementById('temperature'),
  feelsLikeTemp = document.getElementById('feels-like'),
  description = document.getElementById('description'),
  mainIcon = document.getElementById('icon'),
  currentLocation = document.getElementById('location'),
  uvIndex = document.querySelector('.uv-index'),
  uvText = document.querySelector('.uv-text'),
  windSpeed = document.querySelector('.wind-speed'),
  sunRise = document.querySelector('.sun-rise'),
  sunSet = document.querySelector('.sun-set'),
  humidity = document.querySelector('.humidity'),
  visibility = document.querySelector('.visibility'),
  humidityStatus = document.querySelector('.humidity-status'),
  pressure = document.querySelector('.pressure'),
  visibilityStatus = document.querySelector('.visibility-status'),
  searchForm = document.querySelector('#search'),
  search = document.querySelector('#query'),
  celsiusBtn = document.querySelector('.celsius'),
  fahrenheitBtn = document.querySelector('.fahrenheit'),
  tempUnit = document.querySelectorAll('.temperatureUnit'),
  weatherCards = document.querySelector('#weather-cards');

let currentCity = '';
let currentUnit = 'c';

// function to get public ip address
function getPublicIp() {
  fetch('https://geolocation-db.com/json/', {
    method: 'GET',
    headers: {},
  })
    .then((response) => response.json())
    .then((data) => {
      currentCity = data.city;
      getWeatherData(data.city, currentUnit);
    })
    .catch((err) => {
      console.error(err);
    });
}

getPublicIp();

// function to get weather data
function getWeatherData(city, unit) {
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
    {
      method: 'GET',
      headers: {},
    }
  )
    .then((response) => response.json())
    .then((data) => {
      let today = data.currentConditions;
      if (unit === 'c') {
        temp.innerText = Math.round(today.temp);
        feelsLikeTemp.innerText =
          'Feels like' + ' ' + Math.round(today.feelslike);
      } else {
        temp.innerText = Math.round(celsiusToFahrenheit(today.temp));
        feelsLikeTemp.innerText =
          'Feels like' + ' ' + Math.round(celsiusToFahrenheit(today.feelslike));
      }
      currentLocation.innerText = data.resolvedAddress;
      description.innerText = data.description;
      uvIndex.innerText = today.uvindex;
      windSpeed.innerText = today.windspeed;
      measureUvIndex(today.uvindex);
      mainIcon.src = getIcon(today.icon);
      humidity.innerText = today.humidity + '%';
      updateHumidityStatus(today.humidity);
      visibility.innerText = today.visibility;
      updateVisibilityStatus(today.visibility);
      pressure.innerText = today.pressure;
      updateForecast(data.days, unit);
      sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
      sunSet.innerText = covertTimeTo12HourFormat(today.sunset);
    })
    .catch((err) => {
      alert('City not found☹️');
    });
}

//function to update Forecast
function updateForecast(data, unit) {
  weatherCards.innerHTML = '';
  let day = 0;
  let numCards = 5;
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement('div');
    card.classList.add('card');
    let dayName = getDayName(data[day].datetime);
    let dayTemp = Math.round(data[day].temp);
    if (unit === 'f') {
      dayTemp = Math.round(celsiusToFahrenheit(data[day].temp));
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = '°C';
    if (unit === 'f') {
      tempUnit = '°F';
    }
    card.innerHTML = `
                <div class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" class="day-icon" alt="" />
            </div>
            <div class="day-temp">
              <div class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
  `;
    weatherCards.appendChild(card);
    day++;
  }
}

// function to change weather icons
function getIcon(condition) {
  if (condition === 'partly-cloudy-day') {
    return 'https://i.ibb.co/PZQXH8V/27.png';
  } else if (condition === 'partly-cloudy-night') {
    return 'https://i.ibb.co/Kzkk59k/15.png';
  } else if (condition === 'rain') {
    return 'https://i.ibb.co/kBd2NTS/39.png';
  } else if (condition === 'clear-day') {
    return 'https://i.ibb.co/rb4rrJL/26.png';
  } else if (condition === 'clear-night') {
    return 'https://i.ibb.co/1nxNGHL/10.png';
  } else {
    return 'https://i.ibb.co/rb4rrJL/26.png';
  }
}

// convert time to 12 hour format
function covertTimeTo12HourFormat(time) {
  let hour = time.split(':')[0];
  let minute = time.split(':')[1];
  let ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  let strTime = hour + ':' + minute + ' ' + ampm;
  return strTime;
}

// function to get day name from date
function getDayName(date) {
  let day = new Date(date);
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[day.getDay()];
}

// function to get uv index status
function measureUvIndex(uvIndex) {
  if (uvIndex <= 2) {
    uvText.innerText = 'Low';
  } else if (uvIndex <= 5) {
    uvText.innerText = 'Moderate';
  } else if (uvIndex <= 7) {
    uvText.innerText = 'High';
  } else if (uvIndex <= 10) {
    uvText.innerText = 'Very High';
  } else {
    uvText.innerText = 'Extreme';
  }
}

// function to get humidity status
function updateHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = 'Low';
  } else if (humidity <= 60) {
    humidityStatus.innerText = 'Moderate';
  } else {
    humidityStatus.innerText = 'High';
  }
}

// function to get visibility status
function updateVisibilityStatus(visibility) {
  if (visibility <= 0.03) {
    visibilityStatus.innerText = 'Dense Fog';
  } else if (visibility <= 0.16) {
    visibilityStatus.innerText = 'Moderate Fog';
  } else if (visibility <= 0.35) {
    visibilityStatus.innerText = 'Light Fog';
  } else if (visibility <= 1.13) {
    visibilityStatus.innerText = 'Very Light Fog';
  } else if (visibility <= 2.16) {
    visibilityStatus.innerText = 'Light Mist';
  } else if (visibility <= 5.4) {
    visibilityStatus.innerText = 'Very Light Mist';
  } else if (visibility <= 10.8) {
    visibilityStatus.innerText = 'Clear Air';
  } else {
    visibilityStatus.innerText = 'Very Clear Air';
  }
}

// function to handle search form
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    currentCity = location;
    getWeatherData(location, currentUnit);
  }
});

// function to convert celsius to fahrenheit
function celsiusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}

fahrenheitBtn.addEventListener('click', () => {
  changeUnit('f');
});
celsiusBtn.addEventListener('click', () => {
  changeUnit('c');
});

// function to change unit
function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    tempUnit.forEach((elem) => {
      elem.innerText = `°${unit.toUpperCase()}`;
    });
    if (unit === 'c') {
      celsiusBtn.classList.add('active');
      fahrenheitBtn.classList.remove('active');
    } else {
      celsiusBtn.classList.remove('active');
      fahrenheitBtn.classList.add('active');
    }
    getWeatherData(currentCity, currentUnit);
  }
}
