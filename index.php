<?php

include 'BBDD/BBDD.php';

header('Access-Control-Allow-Origin: *');

if($_SERVER['REQUEST_METHOD']=='GET'){
    if(isset($_GET['id'])){
        $query="SELECT * FROM tabla WHERE id=".$_GET['id'];
        $resultado=queryGet($query);
        echo json_encode($resultado->fetch(PDO::FETCH_ASSOC));
    }else{
        $query="SELECT * FROM tabla";
        $resultado=queryGet($query);
        echo json_encode($resultado->fetchAll()); 
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if($_POST['METHOD']=='POST'){
    unset($_POST['METHOD']);
    $nombre=$_POST['nombre'];
    $apellidos=$_POST['apellidos'];
    $ciudad=$_POST['ciudad'];
    $query="INSERT into tabla(nombre, apellidos, ciudad) VALUES ('$nombre', '$apellidos', '$ciudad')";
    $queryAutoIncrement="SELECT MAX(id) AS id FROM tabla";
    $resultado=queryPost($query, $queryAutoIncrement);
    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

if($_POST['METHOD']=='PUT'){
    unset($_POST['METHOD']);
    $id=$_GET['id'];
    $nombre=$_POST['nombre'];
    $apellidos=$_POST['apellidos'];
    $ciudad=$_POST['ciudad'];
    $query="UPDATE tabla SET nombre='$nombre', apellidos='$apellidos', ciudad='$ciudad' WHERE id='$id'";
    $resultado=queryPut($query);
    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

if($_POST['METHOD']=='DELETE'){
    unset($_POST['METHOD']);
    $id=$_GET['id'];
    $query="DELETE FROM tabla WHERE id='$id'";
    $resultado=queryDelete($query);
    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");


?>