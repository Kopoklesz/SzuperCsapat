<?php
//connect
function connect(){
    $dsn = "mysql:host=localhost;dbname=Blog";
    $dbusername = "root";
    $dbpassword = "";

    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo; // Visszaadjuk a kapcsolatot
    } catch(PDOException $e) {
        echo "Connection failed: " .$e->getMessage();
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
            require_once "dbh.inc.php"; 
            $query = "SELECT * FROM users 
                      WHERE username = :username AND password = :password";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':username', $_SESSION["username"]);
            $stmt->bindParam(':password', $_SESSION["password"]);
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                $data = $stmt->fetch();
                $_SESSION["user_id"] = $data['id'];
            
                return "success";
            } else {
                return "fail";
            }
            die();
            
        } catch (PDOException $e) {
            die("Query failed: " . $e->getMessage());
        } 
    
    }else{
        header("/index.html");
    }
}

//register
function register($param1, $param2, $param3){
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $username = $_POST["username"];
        $password = $_POST["password"];
        $name = $_POST["name"];
    
        try{
            require_once "dbh.inc.php"; 
    
            $query = "INSERT INTO users (username, name, password)
            VALUES(?, ?, ?); ";
    
            $stmt = $pdo->prepare($query);
    
            $stmt->execute([$username, $name, $password]);
    
            return "success";
            die();
            
        } catch (PDOException $e) {
            die("Query failed: " . $e->getMessage());
            return "fail";
        } 
    
    }else{
        header("/index.html");
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

?>