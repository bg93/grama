<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);


    $fecha = date("Y-m-d");
    $hora = date('G:i:s');

    $tipo = '3';
    $accion = "Te has desconectado";
    $color = "rojo";
    



    $sql = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('$tipo','$id_usuario','0','$accion','$fecha','$hora','$color');";

    if(!$result = $db->query($sql)) {

        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
    }

    echo "$accion";


     //Liberamos los recusos de la consulta
    $result->free();

	
	$db->close();

 
?>