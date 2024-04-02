function login() {
        var username = document.getElementById("loginUsername").value;
        var password = document.getElementById("loginPassword").value;
    
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "lib.php", true); // POST request
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.responseText;
                if (response === "success") {
                    window.location.href = "mainpage.html";
                } else {
                    showToast();
                    document.getElementById("loginUsername").value = "";
                    document.getElementById("loginPassword").value = "";
                }
            }
        };
        xhr.send("action=login&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)); // Sending POST data
    }
    
    function reg() {
        let name = document.getElementById("regName").value;
        let username = document.getElementById("regUsername").value;
        let password = document.getElementById("regPassword").value;
    
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "lib.php", true); // POST request
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = xhr.responseText;
                if (response === "success") {
                    loginPage();
                } else {
                    showToast()
                }
            }
        };
        xhr.send("action=reg&name=" + encodeURIComponent(name) + "&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)); // Sending POST data
    }
    
    function loginPage(){
        document.getElementById("loginPage").classList.remove("hidden");
        document.getElementById("regPage").classList.add("hidden"); 
    }
    
    function regPage(){
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("regPage").classList.remove("hidden");
    }
    
    function showToast() {
        var toast = document.getElementById("toast");
        toast.textContent = "Hiba történt! Kérjük, ellenőrizze az adatokat.";
        toast.classList.remove("hide");
        setTimeout(function() {
            toast.classList.add("hide");
        }, 3000);
    }

    function categories(page){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "lib.php", true); // POST request
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if(page == "mainpage" || page == "create_post"){
            xhr.send("action=categoryName");
        } else {
            xhr.send();
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (page == "mainpage") {
                        makeCategories(response);
                    }else if(page == "create_post"){
                        makeCategories(response);
                    }
                } catch (e) {
                    console.error("Parsing error:", e);
                }
            }
        };
    }

    function makeCategories(response){
        var category = document.getElementById("postCategory");
        for (var i = 0; i < response.length; i++) {
            var option = document.createElement("option");
            option.text = response[i].name;
            category.add(option);
        }
    }