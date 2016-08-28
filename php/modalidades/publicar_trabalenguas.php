<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_POST['id-usuario-creacion-trabalenguas']) ? $_POST['id-usuario-creacion-trabalenguas'] : '');
    $texto = (isset($_POST['texto-creacion-trabalenguas']) ? $_POST['texto-creacion-trabalenguas'] : '');
    $fecha = date("Y-m-d");
  	$hora = date('G:i:s');
  	$tipo = '1';
  	$valoracion = '0';
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
	$texto = $db->real_escape_string($texto);


	$sql = "INSERT INTO publicaciones (tipo,texto,id_usuario,fecha,hora,valoracion) VALUES('$tipo','$texto','$id_usuario','$fecha','$hora','$valoracion');";


	if(!$result = $db->query($sql)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}



    $accion = "Has creado un trabalenguas [+ 3 PUNTOS]";

    $sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('11','$id_usuario','0','$accion','$fecha','$hora','verde');";


    if(!$result80 = $db->query($sql80)) {

        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
    }




	echo "1-Tu trabalenguas se ha publicado correctamente.<br><br>Aparecerá disponible en el listado de publicaciones en el menor tiempo posible.";
	
	$db->close();

 
?>