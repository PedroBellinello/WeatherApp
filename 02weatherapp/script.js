
//select html
const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = wrapper.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

let api;


inputField.addEventListener("keyup", e =>{
    // if user press enter btn and input value is not empty 
    if(e.key == "Enter" && inputField.value != ""){
      //console.log("it works")
      requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
     //if browser support geolocation
    if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert ("your browser not support geolocation api");
    }
})

function onSuccess(position){
  // get lat and lon of user device from coords obj 
  const {latitude, longitude} = position.coords; 
   api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=45c3f74cee728245fb79c190d7678c28`;
  fetchData();
}


function onError(error){
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}


function requestApi(city){
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=45c3f74cee728245fb79c190d7678c28`;
  fetchData();
}

function fetchData(){
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  //get api response and return um parsing into js obj 
   fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
     infoTxt.classList.replace("pending", "error");
  if(info.cod == "404"){
      infoTxt.innerText = `${inputField.value} ins't a valid city name`;
  } else {
    //get required properties value from info object 
    const city =  info.name;
    const country = info.sys.country;
    const{description, id} = info.weather[0];
    const{feels_like, humidity, temp} = info.main;


    //using custom icon according to the id of weather in api
    if(id == 800){
        wIcon.src = "icons/clear.svg"
    } else if (id >= 200 && id <= 232){
      wIcon.src = "icons/storm.svg"
    } else if (id >= 600 && id <= 622){
      wIcon.src = "icons/snow.svg"
    } else if (id >= 700 && id <= 781){
      wIcon.src = "icons/haze.svg"
    } else if (id >= 801 && id <= 804){
      wIcon.src = "icons/cloud.svg"
    } else if((id >= 300 && id <= 321) || (id >= 500 && id <=531)){
      wIcon.src = "icons/rain.svg"
    }




    //pass the values to html 
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    inputField.value = "";
    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
 
}

arrowBack.addEventListener("click", ()=>{
   wrapper.classList.remove("active");
})