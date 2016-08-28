<?php

	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');

	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
    $id_amigo = (isset($_REQUEST['id_amigo']) ? $_REQUEST['id_amigo'] : '');



	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


    $sql = "DELETE FROM amigos WHERE ((id_usuario1 = '$id_usuario' AND id_usuario2 = '$id_amigo') OR (id_usuario1 = '$id_amigo' AND id_usuario2 = '$id_usuario'));";

	if(!$result = $db->query($sql)){

	    die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
	}



	$sql3 = "SELECT * FROM usuarios WHERE id='$id_amigo'";

    if(!$result3 = $db->query($sql3)){
        
        die('4-Ha ocurrido un error durante la query [' . $db->error . ']');
    }

    //Si hay resultados, se recorren de la siguiente forma y luego se liberan
    while($row3 = $result3->fetch_assoc()){

        $amigo = $row3['usuario'];
    }


    $fecha = date("Y-m-d");
    $hora = date('G:i:s');
    $accion = "Has eliminado a ".$amigo." de tu lista de amigos";

    $sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('10','$id_usuario','0','$accion','$fecha','$hora','rojo');";


    if(!$result80 = $db->query($sql80)) {

        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
    }


 	//Liberamos los recusos de la consulta
    //$result->free();
    
    //Cerramos la conexion
    $db->close();


?>
