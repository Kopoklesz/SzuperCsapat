<?php
//connect
function connect(){
    $dsn = "mysql:host=localhost;dbname=Blog";
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
        session_start();
        $_SESSION["username"] = $_POST["username"];
        $_SESSION["password"] = $_POST["password"];
        $_SESSION["user_id"] = null;
        try{
            $pdo = connect(); 
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
        $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
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

$action = $_POST['action'];

if ($action === "categoryName") {
    echo categoryName();
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

function makePost(){
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        try{
            session_start();
        $title = $_POST["title"];
        $creator_id = $_SESSION["user_id"];
        $type_id = 1;
        $description = $_POST["content"];

        require_once "dbh.inc.php"; 

                $query = "INSERT INTO topics (Creator_id,Title, description)
                VALUES(?, ?, ?); ";



                $stmt = $pdo->prepare($query);

                $stmt->execute([$creator_id, $title, $description]);

                require_once "mainpage.php";
                die();

            } catch (PDOException $e) {
                die("Query failed: " . $e->getMessage());
            } 

    }else{
            header("Location: /signin.php"); // Redirect to the login page if user is not logged in
        exit();
    }
}

?>