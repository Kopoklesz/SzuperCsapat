async function loadComment() {

    let commentList = document.getElementById("commentList");

    //for (var comment of comments) {
    for (var i = 1; i < 8; i++) {
        let div = document.createElement("div");
        div.setAttribute("class", "card-body p-4");

        let div2 = document.createElement("div");
        div2.setAttribute("class", "d-flex flex-start");

        let div3 = document.createElement("div");

        let h6 = document.createElement("h6");
        h6.setAttribute("class", "fw-bold mb-1");
        h6.innerHTML = "Name 1";

        let div4 = document.createElement("div");
        div4.setAttribute("class", "d-flex align-items-center mb-3");

        let p = document.createElement("p");
        p.setAttribute("class", "mb-0");
        p.innerHTML = "March 01, 2024";

        let p2 = document.createElement("p");
        p2.setAttribute("class", "mb-0");
        p2.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

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

}


function loadData() {
    loadPost();
    loadComment();

    console.log("Page is fully loaded");
}


window.onload = loadData();



