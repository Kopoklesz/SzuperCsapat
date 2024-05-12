<?php

//connect
function connect(){
    session_start();
    $dsn = "mysql:host=localhost;dbname=blog";
    $dbusername = "root";
    $dbpassword = "";

    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo; // Return the connection
    } catch(PDOException $e) {
        return "Connection failed";
    }
}

//Login
function login($username, $password){
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $pdo = connect(); 
        $_SESSION["username"] = $_POST["username"];
        $_SESSION["password"] = $_POST["password"];
        $_SESSION["user_id"] = null;
        try{
            
            $query = "SELECT * FROM users WHERE username = :username";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':username', $_SESSION["username"]);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $data = $stmt->fetch();
                if($_SESSION["password"] == $data['password']) {
                    $_SESSION["user_id"] = $data['id'];
                    return "success";
                }
            }
            return "fail";
        } catch (PDOException $e) {
            return "Query failed";
        } 
    }else{
        exit();
    }
}

//register
function register(){
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $username = $_POST["username"];
        $password =$_POST["password"];
        $name = $_POST["name"];
    
        try{
            $pdo = connect(); 
    
            $query = "INSERT INTO users (username, name, password)
            VALUES(?, ?, ?); ";
    
            $stmt = $pdo->prepare($query);
    
            $stmt->execute([$username, $name, $password]);
    
            return "success";
        } catch (PDOException $e) {
            return "Query failed";
        } 
    }else{
        exit();
    }    
}

if(isset($_POST['action']) && $_POST['action'] === 'login') {
    if(isset($_POST['username'], $_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $result = login($username, $password);
        
        echo $result;
    } else {
        echo "Missing username or password";
    }
} elseif(isset($_POST['action']) && $_POST['action'] === 'reg'){
    if(isset($_POST['name'], $_POST['username'], $_POST['password'])) {
        $name = $_POST['name'];
        $username = $_POST['username'];
        $password = $_POST['password'];

        $result = register($name, $username, $password);
        
        echo $result;
    } else {
        echo "Missing name or username or password";
    }
}

function categoryName() {
    try {
        $pdo = connect(); 
        $query = "SELECT name FROM topic_types";
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($data);
        }
        return json_encode([]);
    } catch (PDOException $e) {
        return json_encode(["error" => "Query Failed"]);
    } 
}

if(isset($_POST['action'])) {
    $action = $_POST['action'];
    if ($action === "categoryName") {
        echo categoryName();
    }
    if ($action === "makePost") {
        echo makePost($_POST["title"], $_POST["content"], $_POST["categoryId"]);
    }
    if ($action === "makeComment") {
        echo makeComment($_POST["body"], $_POST["timestamp"], $_POST["postId"]);
    }
    if($action === "postView") {
        echo postView();
    }
    if($action == "getPost") {
        echo getPost($_POST["postId"]);
    }
}

function makePost($title, $content, $categoryId){
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        try{
            $pdo = connect(); 

            $creator_id = $_SESSION["user_id"];
           
            $query = "INSERT INTO topics (Creator_id, Title, type_id, description)
            VALUES(?, ?, ?, ?); ";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$creator_id, $title, $categoryId, $content]);

            header("Location: mainpage.html");
            exit();

        } catch (PDOException $e) {
            error_log("Query failed: " . $e->getMessage());
            die("An error occurred. Please try again later.");
        }

    } else {
        header("Location: /signin.php");
        exit();
    }
}

function makeComment($body, $timestamp, $postId){
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        try{
            $pdo = connect(); 
            $creator_id = $_SESSION["user_id"];
            

            $query = "INSERT INTO comments (user_id, topic_id, body, timestamp)
            VALUES(?, ?, ?, ?); ";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$creator_id, $postId, $body, $timestamp]);

            header("Location: view_post.html");
            exit();

        } catch (PDOException $e) {
            error_log("Query failed: " . $e->getMessage());
            die("An error occurred. Please try again later.");
        }

    } else {
        header("Location: /signin.php");
        exit();
    }
}

function postView(){
    try {
        $pdo = connect();
        $sql = "SELECT id, Title, description FROM topics";
        $result = $pdo->query($sql);

        $data = array();

        if ($result->rowCount() > 0) {
            while($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $data[] = $row;
            }
            header('Content-Type: application/json'); 
            echo json_encode($data); 
        } else {
            header('Content-Type: application/json'); 
            echo json_encode([]); 
        }
    } catch (PDOException $e) {
        header('Content-Type: application/json'); 
        echo json_encode(["error" => "Query Failed"]); 
    }
}

function getPost($postId){
    try {
        $pdo = connect();
        $sql = "SELECT Title, description FROM topics WHERE id = :postId";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':postId', $postId, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            header('Content-Type: application/json');
            echo json_encode($data);
        } else {
            header('Content-Type: application/json');
            echo json_encode(["error" => "Post not found"]);
        }
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Query Failed"]);
    }
}
?>