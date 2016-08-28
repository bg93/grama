<?php
 
 	session_start();

	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
  	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	$sql = "SELECT hash FROM usuarios WHERE id='$id_usuario'";

	if(!$result = $db->query($sql)){
		
	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}

	//Si hay resultados, se recorren de la siguiente forma y luego se liberan
	while($row = $result->fetch_assoc()){

    	$hash = $row['hash'];
	}

	
	$result->free();
	
	$db->close();



	$clave='rv278u4h';  // Una clave de codificacion, debe usarse la misma para encriptar y desencriptar
    $passfinal = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($clave), base64_decode($hash), MCRYPT_MODE_CBC, md5(md5($clave))), "\0");


	echo "1-$passfinal";	
	

?>