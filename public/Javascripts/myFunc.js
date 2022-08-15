document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("registerForm"))
        (document.getElementById("registerForm")).addEventListener("submit", function getData(event) {
            event.preventDefault(); // prevent the form from submitting and moving on to the next page
            //fetching the check email using the email typed in the form
            //to see if that email is already taken
            fetch(`/formHandler/checkEmail/${document.getElementById("email").value.toLowerCase()}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    if (!data.emailExist) { //incase the email doesnt exist
                        document.getElementById("registerForm").submit();
                    } else {    //if the email already taken send an error
                        document.getElementById("error").hidden = false;
                        document.getElementById("error").innerText = 'email already in use';
                    }
                })
                .catch((err) => {   //couldn't fetch
                    console.log('*** error searching for a user' + JSON.stringify(err));
                });
        });
//========================================================
    if (document.getElementById("loginForm"))
        (document.getElementById("loginForm")).addEventListener("submit", function (e) {
            e.preventDefault(); // prevent the form from submitting and moving on to the next page
            //fetching to check if that email and password (parameters) are inside the database as a user
            fetch(`/formHandler/checkLogin/${document.getElementById("email").value.toLowerCase()}/${document.getElementById("password").value}`)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                if (data.userVerified) { //get the answer as json
                    document.getElementById("userName").value = data.userName;  //set the hidden value
                    document.getElementById("loginForm").submit();  //move on to the main page
                } else {
                    document.getElementById("error").hidden = false;
                    document.getElementById("error").innerText = 'email or password incorrect ';
                }
            })
                .catch((err) => {
                    console.log('*** error finding the user' + JSON.stringify(err));
                });
        });
//========================================================
    if (document.getElementById("passwordForm"))
        (document.getElementById("passwordForm")).addEventListener("submit", function (e) {
            e.preventDefault(); // prevent the form from submitting and moving on to the next page
            let string1 = document.getElementById("password").value;
            let string2 = document.getElementById("password2").value;
            if (!(string1).localeCompare(string2)) {    //compare the two passwords to see if they match
                document.getElementById("passwordForm").submit();   //if they does, submit
            } else {
                document.getElementById("error").hidden = false;
                document.getElementById("error").innerText = 'the passwords are not the same';
            }
        });
});