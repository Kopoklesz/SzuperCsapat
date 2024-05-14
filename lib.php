<?php


function connect(){
    session_start();
    $dsn = "mysql:host=localhost;dbname=blog";
    $dbusername = "root";
    $dbpassword = "";

    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo; 
    } catch(PDOException $e) {
        return "Connection failed";
    }
}


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

        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return json_encode($data);
     
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
    if ($action === "getComment") {
        echo getComment($_POST["postId"]);
    }
    if($action === "postView") {
        echo postView();
    }
    if($action === "getPost") {
        echo getPost($_POST["postId"]);
    }
     if($action === "getCommentedUser") {
        echo getCommentedUser($_POST["userId"]);
    }
    if($action === "listFav") {
        echo lisFav();
    }
    if($action === "getTopicId"){
        echo getTopicId($_POST["topicName"]);
    }
    if($action === "saveFav"){
        echo saveFav($_POST["postId"], $_POST["date"]);
    }
    if($action === "getChecked"){
        echo getChecked($_POST["postId"]);
    }
    if($action === "deleteFav"){
        echo deleteFav($_POST["postId"]);
    }
    if($action === "favView"){
        echo favView();
    }
   if($action === "updateLastChecked"){
        echo updateLastChecked($_POST["postId"], $_POST["timestamp"]);
    }
    if($action === "lastCheckedCheker"){
        echo lastCheckedCheker($_POST["postId"]);
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
            $stmt->execute([$creator_id, $title, ($categoryId+1), $content]);

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
        $sql = "SELECT id, Title,type_id, description FROM topics";
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

function getComment($postId){

    try {
        $pdo = connect();
        $sql = "SELECT id,user_id, body, timestamp FROM comments WHERE topic_id = :postId"; 
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':postId', $postId, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC); 

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

function getCommentedUser($userId){
    try{
        $pdo = connect();
        $sql = "SELECT username FROM users WHERE id = :user_id"; 
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
       
        if($data) {
            header('Content-Type: application/json');
          
            echo json_encode($data);
        } else {
            
            header('Content-Type: application/json');
            echo json_encode(["error" => "User not found"]);
        }
    }catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(["error" => "Query Failed"]);
    }
}

function lisFav() {
    try {
        $pdo = connect();
        $userId = $_SESSION["user_id"];
        $sql = "SELECT topic_id FROM comments WHERE user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $data = array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row['topic_id']; 
        }

        $finalArray = array();
        foreach ($data as $topicId) {
            $sqli = "SELECT id, Title, description FROM topics WHERE id = :postId";
            $stmt2 = $pdo->prepare($sqli);
            $stmt2->bindParam(':postId', $topicId, PDO::PARAM_INT); 
            $stmt2->execute();

            $result2 = $stmt2->fetch(PDO::FETCH_ASSOC); 
            if ($result2) {
                $finalArray[] = $result2;
            }
        }

        header('Content-Type: application/json'); 
        echo json_encode($finalArray); 

    } catch (PDOException $e) {
        header('Content-Type: application/json'); 
        echo json_encode(["error" => "Query Failed"]); 
    }
}


function getTopicId($topicName){
    try {
        $pdo = connect();
        $sql = "SELECT id FROM topic_types WHERE name = :topicName";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':topicName', $topicName, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

       

         header('Content-Type: application/json');
        if ($data) {
            $responseData = array("topic_type" => $data['id']);
           
            echo json_encode($responseData);
        } else {
          
            echo json_encode(["error" => "Topic not found"]);
        }
    } catch (PDOException $e) {
       
        echo json_encode(["error" => "Query Failed"]);
    }
}
function saveFav($postId, $date){

if ($_SERVER["REQUEST_METHOD"] == "POST") {
        try{
            $pdo = connect(); 

            $userId = $_SESSION["user_id"];
           
            $query = "INSERT INTO favorite_topics (user_id, topic_id, last_checked)
            VALUES(?, ?, ?); ";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$userId, $postId, $date]);

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

function getChecked($postId){

  try {
        $pdo = connect();
        $userId = $_SESSION["user_id"];
        $sql = "SELECT last_checked FROM favorite_topics WHERE user_id = :user_id AND topic_id = :post_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if($data){
            echo "true";
        } else {
            echo "false";
        }   

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}



    function deleteFav($postId){

  try {
        $pdo = connect();
        $userId = $_SESSION["user_id"];
        $sql = "DELETE FROM `favorite_topics` WHERE user_id = :user_id AND topic_id = :post_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
        $stmt->execute();


    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }



}

function favView(){
     try {
        $pdo = connect();
        $userId = $_SESSION["user_id"];
        $sql = "SELECT topic_id FROM favorite_topics WHERE user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $data = array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row['topic_id'];
        }

        $finalArray = array();
        foreach ($data as $topicId) {
            $sqli = "SELECT id, Title, description FROM topics WHERE id = :postId";
            $stmt2 = $pdo->prepare($sqli);
            $stmt2->bindParam(':postId', $topicId, PDO::PARAM_INT); 
            $stmt2->execute();

            $result2 = $stmt2->fetch(PDO::FETCH_ASSOC); 
            if ($result2) {
                $finalArray[] = $result2;
            }
        }

        header('Content-Type: application/json'); 
        echo json_encode($finalArray); 

    } catch (PDOException $e) {
        header('Content-Type: application/json'); 
        echo json_encode(["error" => "Query Failed"]); 
    }
    
}

function updateLastChecked($postId, $timestamp){

        
        try{
            $pdo = connect(); 

            $userId = $_SESSION["user_id"];
           
          $query = "UPDATE `favorite_topics` SET `last_checked`=:date WHERE user_id = :user_id AND topic_id = :post_id";
          $stmt = $pdo->prepare($query);
          $stmt->bindParam(':date', $timestamp, PDO::PARAM_STR);
          $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
          $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
          $stmt->execute();


            header("Location: mainpage.html");
            exit();

        } catch (PDOException $e) {
            error_log("Query failed: " . $e->getMessage());
            die("An error occurred. Please try again later.");
        }    
}

function lastCheckedCheker($postId){
       
         try {
        $pdo = connect();
        $userId = $_SESSION["user_id"];

      
        $sql = "SELECT last_checked FROM favorite_topics WHERE user_id = :user_id AND topic_id = :post_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':post_id', $postId, PDO::PARAM_INT);
        $stmt->execute();

        $last_checked_row = $stmt->fetch(PDO::FETCH_ASSOC);

       
        if (!$last_checked_row) {
            return "true";
        }

        $last_checked = $last_checked_row['last_checked'];

      
        $sql2 = "SELECT timestamp FROM comments WHERE topic_id = :post_id";
        $stmt2 = $pdo->prepare($sql2);
        $stmt2->bindParam(':post_id', $postId, PDO::PARAM_INT);
        $stmt2->execute();

        $comment_times = $stmt2->fetchAll(PDO::FETCH_COLUMN);

        
        foreach ($comment_times as $comment_time) {
            if ($comment_time > $last_checked) {
                return "true";
            }
        }

       
        return "false";

    } catch (PDOException $e) {
        error_log("Query failed: " . $e->getMessage());
        die("An error occurred. Please try again later.");
    }
}
?>