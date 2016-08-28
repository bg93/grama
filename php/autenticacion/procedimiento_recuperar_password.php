<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$email = (isset($_POST['email-recuperar'])) ? $_POST['email-recuperar'] : die("2-No se ha recibido el email");
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$email = $db->real_escape_string($email);


	function generar_link_temporal($id_usuario, $nombre_usuario){
	//Se genera una cadena para validar el cambio de contraseña

	   	$cadena = $id_usuario.$nombre_usuario.rand(1,9999999).date('Y-m-d');
	   	$token = sha1($cadena);


	   	$conexion = new mysqli(host, user, pass, basedatos);
	 
	   	//Se inserta el registro en la tabla tblreseteopass
	   	$sql2 = "INSERT INTO reseteo_password (id_usuario, usuario, token, creado) VALUES('$id_usuario','$nombre_usuario','$token',NOW());";
	   
	   	$resultado = $conexion->query($sql2);
	   	
	   	
	   	if($resultado){

	   		// Se devuelve el link que se enviara al usuario

	      	$enlace = $_SERVER["SERVER_NAME"].'/php/recuperar_password.php?id_usuario='.sha1($id_usuario).'&token='.$token;
	      	
	      	return $enlace;
		}

		else {
			
			die('2-Ha ocurrido un error durante la query [' . $db->error . ']');

		    return false;
		}

	}
 

	function enviar_email($email, $link){

		$titulo = "Recuperar contraseña";

		//Cuerpo del mensaje
	   	$mensaje = "<html><head><title>Restablece tu contraseña</title></head>";
	   	$mensaje .= "<body>";
	   	$mensaje .= "<p>Hemos recibido una petición para restablecer la contraseña de tu cuenta.</p>";
	   	$mensaje .= "<p>Si hiciste esta petición, haz clic en el siguiente enlace, si no hiciste esta petición puedes ignorar este correo.</p><p>";
	    $mensaje .= "<strong>Enlace para restablecer tu contraseña</strong><br><a href='http://".$link."''> Restablecer contraseña </a></p></body></html>";
	 
		//Cabeceras del correo
		$headers = "De: GRAMA <staff.grama@gmail.com>\r\n";
		$headers .= "X-Mailer: PHP5\n";
		$headers .= 'MIME-Version: 1.0' . "\n";
		$headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n"; //

	   // Se envia el correo al usuario
	   mail($email, $titulo, $mensaje, $headers);
	}




	if($email != ""){

		$sql = "SELECT * FROM usuarios WHERE email='$email'";

		if(!$result = $db->query($sql)){
			
		    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
		}

		if(mysqli_num_rows($result) > 0) {

			$datos_usuario = $result->fetch_assoc();

			$id = $datos_usuario['id'];
		    $usuario = $datos_usuario['usuario'];
			

			$link_temporal = generar_link_temporal($id, $usuario);

		    if($link_temporal){

		        enviar_email($email, $link_temporal);

		        echo "1-Por favor, revisa tu correo. <br>Se ha enviado un email con los pasos a seguir para modificar tu contraseña.";
		    }

		}

		else {

			echo "3-No existe una cuenta asociada a ese correo.";
		}

	}

	else {

		echo "3-Debes introducir el email.";
	}


	
	$db->close();

 
?>