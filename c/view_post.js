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


function loadPost() {
    let postTitle = document.getElementById("postTitle");
    postTitle.innerHTML = "Test Title";

    let postText = document.getElementById("postText");
    postText.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscingelit.";

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

    comments.push({
        "id": 6,
        "user_id": 3,
        "topic_id": 1,
        "body": commentBody,
        "timestamp": datetime
    });

    loadComment();
}


function loadData() {
    loadPost();
    loadComment();

    console.log("Page is fully loaded");
}


window.onload = loadData();



