const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

var input = document.getElementById("city-search")
var cityNameText = document.getElementById("city-name")
var windSpeedText = document.getElementById("windSpeed")
var descriptionText = document.getElementById("description")
var temperatureIcon = document.getElementById("temperatureIcon")
var temperatureText = document.getElementById("temperature")
var errorMessageText = document.getElementById("errorMessage")
var spinner = document.getElementById("spinner")

input.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        event.preventDefault();
        search(input.value)
    }
})

function getUserCityWeather(){
    renderUiForLoading()
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getUserLocationWeather)
    }else{
        hideUiForLoading()
    }

}

async function getUserLocationWeather(position){
    const searchUrl = `${url}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`
    try {
        const result = await fetch(searchUrl)
        const data = await result.json()
        if (result.ok) {
            renderUIForSuccess(data)
        } else {
            hideUiForLoading()
        }
    } catch (error) {
        hideUiForLoading()
    }
}

async function search(input) {
    renderUiForLoading()
    const searchUrl = `${url}?q=${input}&appid=${apiKey}&units=metric`;
    try {
        const result = await fetch(searchUrl);
        const data =  await result.json()
        if (result.ok) { 
            renderUIForSuccess(data)
        } else {
            renderUiForError(input)
        }
    } catch (error) {
        renderUiForError(input)
    }

}

function renderUiForError(inputText){
    cityNameText.style.visibility = "hidden"
    temperatureIcon.style.visibility = "hidden"
    descriptionText.style.visibility = "hidden"
    windSpeedText.style.visibility = "hidden" 
    spinner.style.display = "none"
    temperatureText.style.visibility = "hidden"
    errorMessageText.style.display = "block"
    errorMessageText.innerHTML = "We currently have no information for the city " + `${inputText}`
    input.disabled = false
}
function renderUiForLoading(){
    cityNameText.style.visibility = "hidden"
    temperatureIcon.style.visibility = "hidden"
    descriptionText.style.visibility = "hidden"
    windSpeedText.style.visibility = "hidden"
    spinner.style.display = "block"
    errorMessageText.style.display = "none"
    temperatureText.style.visibility = "hidden"
    input.disabled = true
}

function hideUiForLoading(){
    alert("This browser doesn't support geolocation")
    cityNameText.style.visibility = "hidden"
    temperatureIcon.style.visibility = "hidden"
    descriptionText.style.visibility = "hidden"
    windSpeedText.style.visibility = "hidden" 
    spinner.style.display = "none"
    temperatureText.style.visibility = "hidden"
    errorMessageText.style.display = "none"
    input.disabled = false 
}

function renderUIForSuccess(data) {
    cityNameText.style.visibility = "visible"
    temperatureIcon.style.visibility = "visible"
    temperatureText.style.visibility = "visible"
    descriptionText.style.visibility = "visible"
    windSpeedText.style.visibility = "visible"
    windSpeedText.style.visibility = "visible"
    spinner.style.display = "none"
    errorMessageText.style.display = "none"
    input.disabled = false

    cityNameText.innerHTML = data.name + `, ` + data.sys.country
    temperatureIcon.src = `https://openweathermap.org/img/wn/` + data.weather[0].icon +`@2x.png`
    temperatureText.innerHTML = data.main.temp + `°C`
    descriptionText.innerHTML = data.weather[0].description.toUpperCase()
    windSpeedText.innerHTML = `Wind Speed: ${data.wind.speed} m/s`
}

if (document.readyState !== 'loading') {
    getUserCityWeather()
} else {
    document.addEventListener('DOMContentLoaded', getUserCityWeather())
}

