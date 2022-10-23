(function () {
    const APIKEY = "FjRQlEXNajt1EtjnhZa4byM1bnK9vhwwkahAhBpj";
    const LANDING_DATE = 0;
    const MAX_SOL = 1;
    const MAX_DATE = 2;
    let photoCounter = 1;
    let idList = new Array();
    const dataMap = new Map([
        ["Spirit", new Array()],
        ["Curiosity", new Array()],
        ["Opportunity", new Array()]
    ]);
    const validMap = new Map([
        ["Spirit", new Array("fhaz", "rhaz"
            , "navcam", "pancam", "minites")],
        ["Curiosity", new Array("fhaz", "rhaz", "mast",
            "chemcam", "mahli", "mardi", "navcam")],
        ["Opportunity", new Array("fhaz", "rhaz"
            , "navcam", "pancam", "minites")]
    ]);
//==================================================================
    const module = function () {
        //a function that validating the date/rover/camera form
        const validateForm = function (e) {
            e.preventDefault(); //dont submit if the form isn't validated
            let isValid = true;
            //take the values of the form
            let date = document.getElementById("Date").value.trim();
            let rover = document.getElementById("SelectRover").value;
            let camera = document.getElementById("SelectCamera").value;
            let errorElementrover = document.getElementById("SelectRover").nextElementSibling;
            let errorElementDate = document.getElementById("Date").nextElementSibling;
            let errorElementField = document.getElementById("SearchForImages").nextElementSibling;
            resetErrors();  //dont show the errors yet
            if (date == "" || rover == "0" || camera == "0") {
                //if all 3 areas are blank(default) then type again
                errorElementField.innerHTML = "All 3 areas must be filled out";
                return;
            }
            if (!validMap.get(rover).includes(camera)) {
                //if that rover doesnt have the selected camera
                errorElementrover.innerHTML = "Rover doesnt have selected camera"; // display the error message
                isValid = false;
            }
            //check if the date is in the right format (YYYY-MM-DD or SOL)
            if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date) || /^\d{1,4}$/.test(date)) {
                if (!(checkSol(date, rover) || checkDate(date, rover))) {
                    errorElementDate.innerHTML = `Select a valid date from ${dataMap.get(rover)[LANDING_DATE]} to ${dataMap.get(rover)[MAX_DATE]}`;
                    isValid = false;
                }
            } else {
                errorElementDate.innerHTML = `please enter a valid date or SOL`;
                isValid = false;
            }
            if (isValid) {
                searchImages();
                this.lastElementChild.click();
            }
            //==================================================================
            //The function check if the date given is a valid SOL format
            // and specificly for the rover given
            function checkSol(date, rover) {
                if (/^\d{1,4}$/.test(date)) {
                    if (date <= dataMap.get(rover)[MAX_SOL] && date > 0)
                        return true;
                }
                return false;
            }

            //==================================================================
            //The function check if the date given is a valid date for the selected rover
            function checkDate(date, rover) {
                //check if the date format match our YYYY-MM-DD
                if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
                    let parts = date.split("-");
                    let day = parseInt(parts[2], 10);
                    let month = parseInt(parts[1], 10);
                    let year = parseInt(parts[0], 10);

                    // Check the ranges of month and year
                    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
                        return false;
                    }
                    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    // Adjust for leap years
                    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                        monthLength[1] = 29;
                    //make sure the date is within range of landing and
                    //returning date of the chosen rover
                    if (day > 0 && day <= monthLength[month - 1]) {
                        let inputDate = new Date(year, month - 1, day);
                        if (inputDate <= new Date(dataMap.get(rover)[MAX_DATE]).setHours(0, 0)
                            && inputDate >= new Date(dataMap.get(rover)[LANDING_DATE]).setHours(0, 0))
                            return true;
                    }
                }
                return false;
            }
        }
        //==================================================================
        return {
            add: validateForm,
        }
    }();
//==================================================================
//the function save a picture
//meaning adding the details given to the list and to the carousel
    const savePic = (src, id, date, sol, camera) => {
        if (idList.includes(id)) {  //check if the picture is already inside
            alert("this photo already save");
            return;
        }

        fetch("/api/addImage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                //send the values for the DB in the body of the request
                "url": src,
                "id": id,
                "sol": sol,
                "earthDate": date,
                "camera": camera,
                "email": document.getElementById("email").value.toLowerCase()
            })
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data.emailLogged) {
                //before adding the new image to the list check if the user is logged in
                addToList(src, id, date, sol, camera);
                idList.push(id);
            } else alert("You are logged out, please log in to use the site");
        }).catch((err) => {
            console.log('*** error saving an image' + JSON.stringify(err));
        });
    }
//==================================================================
    //the class is in charge of the pictures below
    //an object of this class is a search result from the nasa API
    class NewPic {
        constructor(id, sol, camera, img_src, date, rover) {
            this.id = id;
            this.sol = sol;
            this.camera = camera;
            this.earthDate = date;
            this.img = img_src;
            this.rover = rover;
            //insert the picture to the right place in the code
            document.querySelector("#data").insertAdjacentHTML('beforeend', "<div class=\"card\" name='pic' style=\"width: 18rem;\">\n" +
                "  <div class=\"card-body\" col-4>\n" +
                `  <img class=\"card-img-top\" src=\"${this.img}\" alt=\"Card image cap\">\n` +
                `  <a>Earth date: ${this.earthDate}<br>Sol: ${this.sol}<br>Camera: ${this.camera}<br>Mission: ${this.rover}<br></a>\n` +
                `  <button  class=\"btn btn-primary\" id=\"${this.id}\">Save</button>\n` +
                `<a href=\"${this.img}\" class=\"btn btn-info\" target="_blank">Full size</a>\n` +
                "  </div>\n" +
                "</div>");
        }

        //add to the button of the picture that the image will be saved
        addListener() {
            let img = this.img, id = this.id, earthDate = this.earthDate, sol = this.sol, camera = this.camera;
            document.getElementById(this.id).addEventListener('click', function () {
                savePic(img, id, earthDate, sol, camera)
            });
        }
    }

//==================================================================
    const getDates = (rover) => {
        fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=` + APIKEY)
            .then(status)
            .then(res => res.json())
            .then(json => {
                dataMap.get(rover).push(json.photo_manifest.landing_date);
                dataMap.get(rover).push(json.photo_manifest.max_sol);
                dataMap.get(rover).push(json.photo_manifest.max_date);
                //add the data from the API to the map
            })
            .catch(function (err) {
                document.querySelector("#data").innerHTML = `<div class="card bg-danger text-white col-4">NASA servers are not available right now, please try again later</div>`;
            })
    }
//==================================================================
//delete all errors and search results from the screen
    const resetErrors = () => {
        document.getElementById("SelectRover").nextElementSibling.innerHTML = '';
        document.getElementById("Date").nextElementSibling.innerHTML = '';
        document.getElementById("SearchForImages").nextElementSibling.innerHTML = '';
        document.querySelector("#data").innerHTML = '';
    }
//==================================================================
//the function returns a promise - try to get a response from the server
    const status = (response) => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }
//==================================================================
    //the function searching for an image using the nasa API and data from the html
    const searchImages = () => {
        document.getElementById("gif").innerHTML = `<img src="images/loading-buffering.gif">`;
        // build the URL parameters string
        const params = new URLSearchParams()
        let date = document.getElementById("Date").value.trim().toLowerCase();
        let rover = document.getElementById("SelectRover").value.trim().toLowerCase();
        let camera = document.getElementById("SelectCamera").value.trim().toLowerCase();
        if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date))   //which kind of date we are searching by
            params.append('earth_date', date);
        else
            params.append('sol', date);

        params.append('camera', camera);
        params.append('api_key', APIKEY);

        //fetch the url using the parameters typed in the form
        fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${params.toString()}`)
            .then(status)
            .then(res => res.json())
            .then(json => {
                document.querySelector("#data").innerHTML = ``;
                if (!json.photos.length)    //if there's a json but its empty
                    document.querySelector("#data").innerHTML = `<div class="card bg-danger text-white col-4">image not found</div>`;
                for (let photo of json.photos) {    //for every image found make a new NewPic object
                    new NewPic(photo.id, photo.sol, camera, photo.img_src, photo.earth_date, rover).addListener();
                }
            })
            .catch(function (err) {
                document.querySelector("#data").innerHTML = `<div class="card bg-danger text-white col-4">NASA servers are not available right now, please try again later</div>`;
            }).finally(function () {    // always executed
            document.getElementById("gif").innerHTML = ``;  //stop the loading gif
        });
    }
    //==================================================================
    //a function that load the images that previously saved by the logged in user
    const printSavedImages = () => {
        document.getElementById("gif").innerHTML = `<img src="images/loading-buffering.gif">`;
        //we fetch our API and he uses the session to return only the active user's images
        fetch(`/api/getImages`)
            .then(status)
            .then(res => res.json())
            .then(json => {
                if (json)
                    //add every photo from the json to the list
                    for (let photo of json) {
                        addToList(photo.url, photo.imageID, photo.earthDate, photo.sol, photo.camera);
                    }
            })
            .catch(function (err) {
                console.log('*** error uploading saved pictures' + JSON.stringify(err));
            }).finally(function () {
            document.getElementById("gif").innerHTML = ``;
        });
    }
    //==================================================================
    //a function that add a new image to the list and to the carousel using
    //html insert to the main page
    const addToList = (src, id, date, sol, camera) => {
        idList.push(parseInt(id));
        //insert the picture html in the list
        document.getElementById("list").insertAdjacentHTML('beforeend',
            `<div><a href= "${src}" target=\"_blank\"> ${photoCounter++}.Image id: ${id}  </a><br><a>` +
            `Earth date: ${date}, Sol: ${sol}, Camera: ${camera}` + "</a>"
            + `<form action="/api/deleteImage/${id}" method="POST">\n` +
            `<button type="submit" value="delete" class="btn btn-success bg-dark text-white btn gradient-custom-4">delete</button>` +
            "</form>    </div>");

        //insert the picture html in the carousel
        //we need to type 'active' only on the first item in the carousel
        let temp = (photoCounter == 2) ? " active" : "";
        document.getElementById("carousel-inner").insertAdjacentHTML('beforeend',
            `<div class="carousel-item ${temp}">\n` +
            `    <img class=\"d-block w-100 mx-auto\" src="${src}" alt=\"...\">\n` +
            `<div class="carousel-caption d-none d-md-block">
        <h5>${camera}</h5>
        <h6>${date}</h6>
        <a href=\"${src}\" class=\"btn btn-primary\" target="_blank">Full size</a>
        </div>` +
            "</div>")
    }
// ==================================================================
    //when the DOM is fully loaded add eventListener for the form submit
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById("form").addEventListener("submit", module.add);
        document.getElementById("clear").addEventListener("click", resetErrors);
        //get data from API for every specific rover
        getDates("Curiosity");
        getDates("Spirit");
        getDates("Opportunity");
        printSavedImages(); //load the images that previously saved by the logged in user

        //hide or show the carousel by clicking on the right button
        document.getElementById("Startslideshow").addEventListener('click', function () {
            if (photoCounter != 1)
                document.getElementById("carouselExampleControls").hidden = false
        });
        document.getElementById("Stopslideshow").addEventListener('click', function () {
            document.getElementById("carouselExampleControls").hidden = true
        });
    });
})();
//==================================================================