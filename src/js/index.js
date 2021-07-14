import "../scss/gundam.scss";

//Preload spinner 
const loader = document.querySelector("#loader");

// let's handle the geolocation of user
const geoLocationInfo = document.querySelector("#geoLocationInfo");

if (window.navigator.geolocation) {
    const coordKeeper = window.navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        const endPoint = `feed/geo:${lat};${long}/?token=${process.env.API_TOKEN}`;

        fetch(process.env.API_URL+endPoint).then(response => response.json()).then(data => {
            let positionText = document.createElement("h3");
            positionText.innerText = "The monitor station near you is: ";
            let positionCity = document.createElement("span");
            positionCity.innerText = data.data.city.name;
            geoLocationInfo.appendChild(positionText);
            geoLocationInfo.appendChild(positionCity);
            let currentPolluteValue = document.createElement("h3");
            let good = false;
            let medium = false;
            let unhealty = false;
            if (data.data.aqi >= 0 && data.data.aqi < 45) {
                currentPolluteValue.setAttribute("class", "green");
                good = true;
            }
            else if (data.data.aqi >= 45 && data.data.aqi < 75) {
                currentPolluteValue.setAttribute("class", "orange");
                medium = true;
            }
            else {
                currentPolluteValue.setAttribute("class", "red");
                unhealty = true;
            }
            loader.style.display = "none"; 
            currentPolluteValue.innerText = `The air quality index is: ${data.data.aqi}`;
            let scanTime = data.data.time.s;
            let valueDescr = document.createElement("p");
            if (good) {
                valueDescr.innerText = `The air quality is good! Last scan on ${scanTime}`;
            }
            if (medium) {
                valueDescr.innerText = `The air quality is medium! Last scan on ${scanTime}`;
            }
            if (unhealty) {
                valueDescr.innerText = `The air quality is unhealty! Last scan on ${scanTime}`;
            }
            geoLocationInfo.appendChild(currentPolluteValue);
            geoLocationInfo.appendChild(valueDescr);
        })
    }, () => {
        loader.style.display = "none"; 
        let noCoordP = document.createElement("p");
        noCoordP.innerText = "Sorry we can't found your position!";
        geoLocationInfo.appendChild(noCoordP);
    });
}

//handle form submit

const cityForm = document.forms.foundCity;

cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let keyword = cityForm.city.value.toLowerCase();
    const searchEndPoint = `search/?keyword=${keyword}&token=${process.env.API_TOKEN}`;
    fetch(process.env.API_URL+searchEndPoint).then(response => response.json()).then(data => {
        const result = document.querySelector("#result");
        let aqiSum = 0;
        data.data.forEach(element => {
            if (element.aqi != '-' && typeof element.aqi === "string" ) {
                let toNum = parseInt(element.aqi);
                aqiSum += toNum;
            }
        });
        let average = Math.round(aqiSum / data.data.length);
        let good = false;
        let medium = false;
        let unhealty = false;
        if (average >= 0 && average < 45) {
            result.setAttribute("class", "green");
            good = true;
        }
        else if (average >= 45 && average < 75) {
            result.setAttribute("class", "orange");
            medium = true;
        }
        else {
            result.setAttribute("class", "red");
            unhealty = true;
        }
        if (isNaN(average)) {
            result.innerText = 'No info about this place. Make sure you have insert a valid place.'    
        }
        else {
            result.innerText = `The average air quality in ${cityForm.city.value.toUpperCase()} zone is ${average}, the air quality is ${good ? "good" : medium ? "medium" : "unhealty"}`;
        }
    });
})

   


