<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_POST['id-usuario-creacion-criptogramas']) ? $_POST['id-usuario-creacion-criptogramas'] : '');
    $texto1 = (isset($_POST['texto1-creacion-criptogramas']) ? $_POST['texto1-creacion-criptogramas'] : '');
    $texto2 = (isset($_POST['texto2-creacion-criptogramas']) ? $_POST['texto2-creacion-criptogramas'] : '');
    $texto = "<strong>Mensaje descifrado: </strong>".$texto1."<br><strong>Mensaje cifrado: </strong>".$texto2;
    $fecha = date("Y-m-d");
  	$hora = date('G:i:s');
  	$tipo = '3';
  	$valoracion = '0';
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
	$texto1 = $db->real_escape_string($texto1);
	$texto2 = $db->real_escape_string($texto2);


	$sql = "INSERT INTO publicaciones (tipo,texto,id_usuario,fecha,hora,valoracion) VALUES('$tipo','$texto','$id_usuario','$fecha','$hora','$valoracion');";


	if(!$result = $db->query($sql)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}



	$accion = "Has creado un criptograma [+ 3 PUNTOS]";

    $sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('11','$id_usuario','0','$accion','$fecha','$hora','verde');";


    if(!$result80 = $db->query($sql80)) {

        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
    }


	echo "1-Tu criptograma se ha publicado correctamente.<br><br>Aparecerá disponible en el listado de publicaciones en el menor tiempo posible.";

	$db->close();

 
?>