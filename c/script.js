function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "lib.php", true); // POST kérés
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
        }
        if (response === "success") {
                console.log("SUCCESS-LOG")
        } else {
                console.log("FAIL-LOG")
        }
    };
    xhr.send("action=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)); // POST adatok küldése
}


function reg() {
        let name = document.getElementById("name").value;
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "lib.php", true); // POST kérés
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.responseText;
                }
                if (response === "success") {
                        console.log("SUCCESS-REG")
                } else {
                        console.log("FAIL-REG")
                }
        };
        xhr.send("action=reg&name=" + encodeURIComponent(name) + "&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)); // POST adatok küldése
}


function loginPage(){
        document.getElementById("loginPage").classList.remove("hidden");
        document.getElementById("regPage").classList.add("hidden"); 
}

function regPage(){
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("regPage").classList.remove("hidden");
}