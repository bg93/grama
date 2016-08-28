<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$usuario = (isset($_POST['usuario-registro'])) ? $_POST['usuario-registro'] : die("2-No se ha recibido el usuario");
  	$email = (isset($_POST['email-registro'])) ? $_POST['email-registro'] : die("2-No se ha recibido el email");
  	$password = (isset($_POST['password-registro'])) ? $_POST['password-registro'] : die("2-No se ha recibido la contraseña");
  	$sexo = "O";
  	$edad = "";
  	$fecha_nacimiento = "0000-00-00";
  	$fecha_conexion = date("Y-m-d");
  	$hora_conexion = date('G:i:s');
  	$provincia = "0";
  	$foto = "1";
  	$cita = "";
  	

	$clave='rv278u4h'; 
    $hash = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($clave), $password, MCRYPT_MODE_CBC, md5(md5($clave))));


	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$usuario = $db->real_escape_string($usuario);
	$email = $db->real_escape_string($email);
	$password = $db->real_escape_string($password);


	$sql = "INSERT INTO usuarios (usuario,email,hash,sexo,edad,fecha_nacimiento,fecha_conexion,hora_conexion,provincia,foto,cita) VALUES('$usuario','$email','$hash','$sexo','$edad','$fecha_nacimiento','$fecha_conexion','$hora_conexion','$provincia','$foto','$cita');";


	if(!$result = $db->query($sql)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}

	$id_usuario = $db->insert_id; 


	$fecha = date("Y-m-d");
  	$hora = date('G:i:s');

	$sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('1','$id_usuario','0','Te has registrado','$fecha','$hora','amarillo');";


	if(!$result80 = $db->query($sql80)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}


	echo "1-$usuario";
	
	$db->close();

 
?>