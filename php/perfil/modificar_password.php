<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_POST['id-usuario-modificar-pass']) ? $_POST['id-usuario-modificar-pass'] : '');
	$password = (isset($_POST['password1-modificar-pass']) ? $_POST['password1-modificar-pass'] : '');
  	

	$clave='rv278u4h'; 
    $hash = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($clave), $password, MCRYPT_MODE_CBC, md5(md5($clave))));


	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$password = $db->real_escape_string($password);


	$sql = "UPDATE usuarios SET hash='$hash' WHERE id='$id_usuario'";


	if(!$result = $db->query($sql)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}


	$fecha = date("Y-m-d");
  	$hora = date('G:i:s');

	$sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('4','$id_usuario','0','Has modificado tu contraseña','$fecha','$hora','naranja');";


	if(!$result80 = $db->query($sql80)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}


	echo "1-Tu contraseña se ha modificado correctamente.";
	
	$db->close();

 
?>