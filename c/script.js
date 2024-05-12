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
                    makeCategoriesCP(response);
                }
            } catch (e) {
                console.error("Parsing error:", e);
            }
        }
    };
}

function makeCategoriesCP(response) {
    var category = document.getElementById("postCategoryCP");

    for (var i = 0; i < response.length; i++) {
        var option = document.createElement("option");
        option.text = response[i].name;
        category.add(option);
    }
}

function makeCategories(response) {
    var category = document.getElementById("postCategory");
    var option = document.createElement("option");
    option.text = "Minden";

    category.add(option);
    var category = document.getElementById("postCategory");
    for (var i = 1; i < response.length; i++) {
        var option = document.createElement("option");
        option.text = response[i].name;
        category.add(option);
    }
}

function makePost() {
    var title = document.getElementById("postTitle").value;
    var content = document.getElementById("postContent").value;
    var category = document.getElementById("postCategoryCP").value;
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
    var selectElement = document.getElementById("postCategoryCP");
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
            type: 'POST',
            dataType: 'json',
            data: { action: 'postView' },
            success: function (data) {
                var topicsSection = document.getElementById("topics");

                data.forEach(function (item) {
                    var card = document.createElement("div");
                    card.className = "card mb-4 topic-card";
                    card.onclick = function () { launchViewPost(item.id) };

                    var cardBody = document.createElement("div");
                    cardBody.className = "card-body";

                    var title = document.createElement("h3");
                    title.className = "card-title";
                    title.textContent = item.Title;

                    var content = document.createElement("p");
                    content.className = "card-text";
                    content.textContent = item.description;
                    content.textContent = item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '');

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
//View post and comment 

function loadComment() {
    var postId = getPostId();

    $(document).ready(function () {
        $.ajax({
            url: 'lib.php',
            type: 'POST',
            dataType: 'json',
            data: { action: 'getComment', postId: postId },
            success: function (data) {
                if (Array.isArray(data)) {

                    var commentList = document.getElementById("commentList");

                    while (commentList.firstChild) {
                        commentList.removeChild(commentList.firstChild);
                    }

                    data.forEach(function (item) {
                        let div = document.createElement("div");
                        div.setAttribute("class", "card-body p-4");

                        let div2 = document.createElement("div");
                        div2.setAttribute("class", "d-flex flex-start");

                        let div3 = document.createElement("div");

                        let h6 = document.createElement("h6");
                        h6.setAttribute("class", "fw-bold mb-1");


                        $(document).ready(function () {
                            $.ajax({
                                url: 'lib.php',
                                type: 'POST',
                                dataType: 'json',
                                data: { action: 'getCommentedUser', userId: item.user_id },
                                success: function (data2) {
                                    h6.innerHTML = data2.username;                                
                                }, error: function (xhr, status, error) {
                                    console.error('Error:', error);
                                }
                            });
                        });
                       

                        let div4 = document.createElement("div");
                        div4.setAttribute("class", "d-flex align-items-center mb-3");

                        let p = document.createElement("p");
                        p.setAttribute("class", "mb-0");
                        p.innerHTML = item.timestamp;  // Changed from comment.timestamp to item.timestamp

                        let p2 = document.createElement("p");
                        p2.setAttribute("class", "mb-0");
                        p2.innerHTML = item.body;  // Changed from comment.body to item.body

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
                    });
                } else {
                    console.log("No comment found with given id.")
                }
            }, error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
}


function getPostId() {
    var urlParams = new URLSearchParams(window.location.search);
    var postId = urlParams.get('postId');
    return postId;
}


function loadPost() {
    var postId = getPostId();

    var url = 'lib.php';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=getPost&postId=' + postId
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            try {
                var data = JSON.parse(text);

                if (data && data.Title && data.description) {
                    let postTitle = document.getElementById("postTitle");
                    postTitle.innerHTML = data.Title;

                    let postText = document.getElementById("postText");
                    postText.innerHTML = data.description;
                } else {
                    console.log("No topic found with given id.")
                }
            } catch (error) {
                console.error('Could not parse the following text as JSON:', text);
                console.error('Error:', error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function comment() {
    var commentBody = document.getElementById("commentInput").value;

    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    var postId = getPostId();


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "lib.php", true); // POST request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("commentInput").value = "";
            console.log("Comment created successfully");
        }
    }
    xhr.send("action=makeComment&body=" + encodeURIComponent(commentBody) + "&timestamp=" + encodeURIComponent(datetime) + "&postId=" + encodeURIComponent(postId));
    loadComment();
}


function loadData() {
    loadPost();
    loadComment();

    console.log("Page is fully loaded");
}

//Favourite Topics/Posts

let favouriteTopics = [1, 5];


/*function listFavouritePosts() {
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
}*/

function listFav() {
   
    $(document).ready(function () {
        $.ajax({
            url: 'lib.php',
            type: 'POST',
            dataType: 'json',
            data: { action: 'listFav' },
            success: function (data) {
               
                data.forEach(function (item) {
                    
                    var card = document.createElement("div");
                    card.className = "card mb-4 topic-card";
                    card.onclick = function () { launchViewPost(item.id) };

                    var cardBody = document.createElement("div");
                    cardBody.className = "card-body";

                    var title = document.createElement("h3");
                    title.className = "card-title";
                    title.textContent = item.Title;

                    var content = document.createElement("p");
                    content.className = "card-text";
                    content.textContent = item.description;
                    content.textContent = item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '');

                    cardBody.appendChild(title);
                    cardBody.appendChild(content);
                    card.appendChild(cardBody);
                    document.getElementById("topics").appendChild(card);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
}

function filterByTopicType(topicName) {
    var filterId = 0;
    var topicsSection = document.getElementById("topics");
    while (topicsSection.firstChild) {
        topicsSection.removeChild(topicsSection.firstChild);
    }
    if (topicName == "Minden") {
        listPosts();
    } else {
    /* $(document).ready(function () {
         $.ajax({
             url: 'lib.php',
             type: 'POST',
             dataType: 'json',
             data: { action: 'getTopicId', topicName: topicName},
             success: function (data) {
                 filterId = data.topic_type;
             },
             error: function (xhr, status, error) {
                 console.error('Error:', error);
                 console.log(filterId);
             }
         });
     });*/

    $.ajax({
        url: 'lib.php',
        type: 'POST',
        dataType: 'json',
        data: { action: 'getTopicId', topicName: topicName },
        success: function (data) {
            if (data.hasOwnProperty('topic_type')) {
                filterId = data.topic_type;
                // Now proceed with the rest of your logic
            } else {
                console.error('Error: Unexpected response format');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });

    $(document).ready(function () {
        $.ajax({
            url: 'lib.php',
            type: 'POST',
            dataType: 'json',
            data: { action: 'postView' },
            success: function (data) {
               

                data.forEach(function (item) {
                    console.log("filterid:     "+filterId);
                    console.log("item id:   "+item.type_id);
                    if (filterId == item.type_id) {
                        var card = document.createElement("div");
                        card.className = "card mb-4 topic-card";
                        card.onclick = function () { launchViewPost(item.id) };

                        var cardBody = document.createElement("div");
                        cardBody.className = "card-body";

                        var title = document.createElement("h3");
                        title.className = "card-title";
                        title.textContent = item.Title;

                        var content = document.createElement("p");
                        content.className = "card-text";
                        content.textContent = item.description;
                        content.textContent = item.description.substring(0, 50) + (item.description.length > 50 ? '...' : '');

                        cardBody.appendChild(title);
                        cardBody.appendChild(content);
                        card.appendChild(cardBody);
                        topicsSection.appendChild(card);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
    }
}

function changeFav() {
  

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "lib.php", true); // POST request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
           
            console.log("fav created successfully");
        }
    }
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();


    xhr.send("action=saveFav&postId=" + encodeURIComponent(getPostId()) + "&date=" + encodeURIComponent(datetime));
}

function isChecked() {
    $.ajax({
        url: 'lib.php',
        type: 'POST',
        dataType: 'json',
        data: { action: 'getChecked', getPostId(): 'postId' },
        success: function (data) {
           
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function loadFavouriteData() {
   // listFavouritePosts();
    listFav();
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




document.getElementById('postCategory').addEventListener('change', function (e) {
    console.log(e.target.options[e.target.selectedIndex].innerHTML);

    filterByTopicType(e.target.options[e.target.selectedIndex].innerHTML);
});