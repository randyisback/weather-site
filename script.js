const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");
// Azadcoder.com
let api;

inputField.addEventListener("keyup", e =>{
    // kullanıcı enter btn'ye bastıysa ve giriş değeri boş değilse
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // tarayıcı coğrafi konum API'sini destekliyorsa
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Tarayıcınız coğrafi konum API'sini desteklemiyor");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_API_KEY`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; //Kullanıcı cihazının enlem ve boylamını koordinat nesnesinden alma
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=YOUR_API_KEY`;
    fetchData();
}

function onError(error){
    // Kullanıcı konumunu alırken herhangi bir hata oluşursa bunu infoText'te gösterecek
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Hava durumu ayrıntıları alınıyor...";
    infoTxt.classList.add("pending");
    // api yanıtı alıyoruz ve onu js obj'ye ve başka bir nesneye ayrıştırarak geri döndürüyoruz
    // daha sonra fonksiyon api sonucunu argüman olarak ileterek weatherDetails fonksiyonunu çağırıyor
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Bir şeyler ters gitti";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){ // Kullanıcının girdiği şehir adı geçerli değilse
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} geçerli bir şehir adı değil`;
    }else{
       // Tüm hava durumu bilgisinden gerekli özellik değerini alma
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

     // api'nin bize verdiği kimliğe göre özel hava durumu simgesini kullanma
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
      // belirli bir hava durumu bilgisini belirli bir elemente aktarma
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        // api çekilen siteden gelen verilerin türkçeye çevirilmesi
        if(description=="mist"){
            weatherPart.querySelector(".weather").innerText = "Sisli";
        }else if(description=="scattered clouds"){
            weatherPart.querySelector(".weather").innerText = "Az Bulutlu";
        }else if(description=="few clouds"){
            weatherPart.querySelector(".weather").innerText = "Az Bulutlu";
        }else if(description=="moderate rain"){
            weatherPart.querySelector(".weather").innerText = "Ilımlı Yağmur";
        }else if(description=="clear sky"){
            weatherPart.querySelector(".weather").innerText = "Açık";
        }else if(description=="broken clouds"){
            weatherPart.querySelector(".weather").innerText = "Parçalı Bulutlu";
        }else if(description=="overcast clouds"){
            weatherPart.querySelector(".weather").innerText = "Bulutlu";
        }
 // Azadcoder.com
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}
// Azadcoder.com
arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
