<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
    $tipo = (isset($_REQUEST['tipo']) ? $_REQUEST['tipo'] : '');
    $subtipo = (isset($_REQUEST['subtipo']) ? $_REQUEST['subtipo'] : '');
    $puntos = (isset($_REQUEST['puntos']) ? $_REQUEST['puntos'] : '');
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
    $tipo = $db->real_escape_string($tipo);
    $subtipo = $db->real_escape_string($subtipo);
    $puntos = $db->real_escape_string($puntos);


    $opcion = '1'; //Positivo

    $sql = "INSERT INTO puntuacion (tipo,subtipo,opcion,id_usuario,puntos) VALUES('$tipo','$subtipo','$opcion','$id_usuario','$puntos');";

    if(!$result = $db->query($sql)) {

        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
    }


     //Liberamos los recusos de la consulta
    $result->free();

	
	$db->close();

 
?>