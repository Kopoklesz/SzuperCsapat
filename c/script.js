function login() {
    var username = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "lib.php", true); // POST request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
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
    xhr.onreadystatechange = function () {
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

function loginPage() {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("regPage").classList.add("hidden");
}

function regPage() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("regPage").classList.remove("hidden");
}

function showToast() {
    var toast = document.getElementById("toast");
    toast.textContent = "Hiba történt! Kérjük, ellenőrizze az adatokat.";
    toast.classList.remove("hide");
    setTimeout(function () {
        toast.classList.add("hide");
    }, 3000);
}

function categories(page) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "lib.php", true); // POST request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (page == "mainpage" || page == "create_post") {
        xhr.send("action=categoryName");
    } else {
        xhr.send();
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                var response = JSON.parse(xhr.responseText);
                if (page == "mainpage") {
                    makeCategories(response);
                } else if (page == "create_post") {
                    makeCategories(response);
                }
            } catch (e) {
                console.error("Parsing error:", e);
            }
        }
    };
}

function makeCategories(response) {
    var category = document.getElementById("postCategory");
    for (var i = 0; i < response.length; i++) {
        var option = document.createElement("option");
        option.text = response[i].name;
        category.add(option);
    }
}

function makePost() {
    var title = document.getElementById("postTitle").value;
    var content = document.getElementById("postContent").value;
    var category = document.getElementById("postCategory").value;
    var categoryId = getCategoryId(category);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "lib.php", true); // POST request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("postTitle").value = "";
            document.getElementById("postContent").value = "";
            console.log("Post created successfully");
        }
    }
    xhr.send("action=makePost&title=" + encodeURIComponent(title) + "&content=" + encodeURIComponent(content) + "&categoryId=" + encodeURIComponent(categoryId));
}

function getCategoryId(categoryValue) {
    var selectElement = document.getElementById("postCategory");
    var options = selectElement.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].text === categoryValue) {
            return i;
        }
    }
    return null;
}

function listPosts() {
    $(document).ready(function () {
        $.ajax({
            url: 'lib.php',
            type: 'POST', // Change type to POST
            dataType: 'json',
            data: { action: 'postView' }, // Add data parameter to specify action
            success: function (data) {
                var topicsSection = document.getElementById("topics");

                data.forEach(function (item) {
                    var card = document.createElement("div");
                    card.className = "card mb-4 topic-card";
                    card.onclick = function () { launchViewPost(getPostId()) };

                    var cardBody = document.createElement("div");
                    cardBody.className = "card-body";

                    var title = document.createElement("h3");
                    title.className = "card-title";
                    title.textContent = item.Title;

                    var content = document.createElement("p");
                    content.className = "card-text";
                    content.textContent = item.description;

                    cardBody.appendChild(title);
                    cardBody.appendChild(content);
                    card.appendChild(cardBody);
                    topicsSection.appendChild(card);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
}

function launchViewPost(postId) {
    console.log("It works!")

    location.href = "view_post.html?postId=" + postId;

}
//View post and comment handling

let comments = [
    {
        "id": 1,
        "user_id": 2,
        "topic_id": 1,
        "body": "Lorem ipsum",
        "timestamp": "2024-04-01"
    },
    {
        "id": 2,
        "user_id": 1,
        "topic_id": 1,
        "body": "Pellentesque consectetur, massa sit amet molestie hendrerit",
        "timestamp": "2024-04-01"
    },
    {
        "id": 3,
        "user_id": 2,
        "topic_id": 1,
        "body": "Consectetur adipiscing elit",
        "timestamp": "2024-04-02"
    },
    {
        "id": 4,
        "user_id": 3,
        "topic_id": 1,
        "body": "Suspendisse mi risus",
        "timestamp": "2024-04-05"
    },
    {
        "id": 5,
        "user_id": 3,
        "topic_id": 1,
        "body": "consectetur adipiscing",
        "timestamp": "2024-04-05"
    }
]

async function loadComment() {

    let commentList = document.getElementById("commentList");

    commentList.innerHTML = "";

    for (var comment of comments) {
        //for (var i = 1; i < 8; i++) {
        let div = document.createElement("div");
        div.setAttribute("class", "card-body p-4");

        let div2 = document.createElement("div");
        div2.setAttribute("class", "d-flex flex-start");

        let div3 = document.createElement("div");

        let h6 = document.createElement("h6");
        h6.setAttribute("class", "fw-bold mb-1");
        h6.innerHTML = comment.user_id;

        let div4 = document.createElement("div");
        div4.setAttribute("class", "d-flex align-items-center mb-3");

        let p = document.createElement("p");
        p.setAttribute("class", "mb-0");
        p.innerHTML = comment.timestamp;

        let p2 = document.createElement("p");
        p2.setAttribute("class", "mb-0");
        p2.innerHTML = comment.body;

        div.appendChild(div2);
        div2.appendChild(div3);
        div3.appendChild(h6);
        div3.appendChild(div4);
        div4.appendChild(p);
        div3.appendChild(p2);

        let hr = document.createElement("hr");
        hr.setAttribute("class", "my-0");

        commentList.appendChild(hr);
        commentList.appendChild(div);
    }


}

function getPostId() {
    var urlParams = new URLSearchParams(window.location.search);
    var postId = urlParams.get('postId');
    return postId;
}


function loadPost(topicData) {
    var postId = getPostId();

    var f = 0;

    for (var data of topicData) {
        if (data.id == postId) {
            let postTitle = document.getElementById("postTitle");
            postTitle.innerHTML = data.name;

            let postText = document.getElementById("postText");
            postText.innerHTML = data.description;

            f = 1;
        }
    }

    if (f == 0) {
        console.log("No topic found with given id.")
    }
}


function comment() {
    let commentBody = document.getElementById("commentInput").value;

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    var postId = getPostId();

    comments.push({
        "id": 6,
        "user_id": 3,
        "topic_id": postId,
        "body": commentBody,
        "timestamp": datetime
    });

    loadComment();

    console.log(comments);
}


function loadData() {
    //loadPost();
    loadComment();

    console.log("Page is fully loaded");
}

//Favourite Topics/Posts

let favouriteTopics = [1, 5];

/*
function listFavouritePosts() {
    let topics = document.getElementById("topics");

    var isRow = 0;

    let rowDiv = document.createElement("div");
    rowDiv.setAttribute("class", "row");

    for (var data of topicData) {
        for (var fav of favouriteTopics) {
            if (fav == data.id) {

                let div = document.createElement("div");
                div.setAttribute("class", "col-md-6");

                let div2 = document.createElement("div");
                div2.setAttribute("class", "card mb-4 topic-card");
                div2.setAttribute("onclick", "launchViewPost(" + data.id + ")");

                let div3 = document.createElement("div");
                div3.setAttribute("class", "card-body");

                let h3 = document.createElement("h3");
                h3.setAttribute("class", "card-title");
                h3.innerHTML = data.name;

                let p = document.createElement("p");
                p.setAttribute("class", "card-text");
                p.innerHTML = data.description;

                div.appendChild(div2);
                div2.appendChild(div3);
                div3.appendChild(h3);
                div3.appendChild(p);

                topics.appendChild(div);

                isRow++;

                if (isRow % 2 == 0) {
                    let rowDiv = document.createElement("div");
                    rowDiv.setAttribute("class", "row");
                }

                rowDiv.appendChild(div);
                topics.append(rowDiv);
            }
        }
    }
}
*/

function loadFavouriteData() {
    listFavouritePosts();

    console.log("Page is fully loaded");
}

if (document.getElementById("view_a_post") != null) {
    window.onload = loadData();
}

if (document.getElementById("main_page_welcome") != null) {
    window.onload = listPosts();
}

if (document.getElementById("favourite_welcome") != null) {
    window.onload = loadFavouriteData();
}
