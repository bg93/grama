<?php
 
 	session_start();

	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
  	$email = (isset($_POST['email-login'])) ? $_POST['email-login'] : die("4-No se ha recibido el email");
  	$password = (isset($_POST['password-login'])) ? $_POST['password-login'] : die("4-No se ha recibido la contraseña");
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {

    	die('4-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$email = $db->real_escape_string($email);
	$password = $db->real_escape_string($password);


	$sql = "SELECT * FROM usuarios WHERE email='$email'";

	if(!$result = $db->query($sql)){
		
	    die('4-Ha ocurrido un error durante la query [' . $db->error . ']');
	}

	//Si hay resultados, se recorren de la siguiente forma y luego se liberan
	while($row = $result->fetch_assoc()){

		$id = $row['id'];
    	$hash = $row['hash'];
	}


	$fecha = date("Y-m-d");
  	$hora = date('G:i:s');

	$sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('2','$id','0','Te has logueado','$fecha','$hora','azul');";


	if(!$result80 = $db->query($sql80)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}



	
	$result->free();
	
	$db->close();



	$clave='rv278u4h';  // Una clave de codificacion, debe usarse la misma para encriptar y desencriptar
    $passfinal = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($clave), base64_decode($hash), MCRYPT_MODE_CBC, md5(md5($clave))), "\0");


	if(!isset($hash)){

		die("2-No existe ningún usuario con este email");
	}

	if ($password == $passfinal){	

		echo "1-$id";	
		$_SESSION['id_usuario']=$id;
	}

	else{

		die("3-La contraseña introducida es incorrecta");
	}
 

?>