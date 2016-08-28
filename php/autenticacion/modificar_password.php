<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$password = (isset($_POST['password-restablecer'])) ? $_POST['password-restablecer'] : die("2-No se ha recibido la contraseña");
  	$password2 = (isset($_POST['password2-restablecer'])) ? $_POST['password2-restablecer'] : die("2-No se ha recibido la confirmacion de la contraseña");
  	$token = (isset($_POST['token-restablecer'])) ? $_POST['token-restablecer'] : die("2-No se ha recibido el token");
  	$id_usuario = (isset($_POST['id-usuario-restablecer'])) ? $_POST['id-usuario-restablecer'] : die("2-No se ha recibido el id de usuario");
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$password = $db->real_escape_string($password);
	$password2 = $db->real_escape_string($password2);
	$token = $db->real_escape_string($token);
	$id_usuario = $db->real_escape_string($id_usuario);



	if($password != "" && $password2 != "" && $id_usuario != "" && $token != ""){

		$sql = "SELECT * FROM reseteo_password WHERE token='$token'";

		if(!$result = $db->query($sql)){
			
		    die('2-Ha ocurrido un error durante la query  [' . $db->error . ']');
		}



		if(mysqli_num_rows($result) > 0) {

			$datos_usuario = $result->fetch_assoc();

			$id_usuario_auxiliar = $datos_usuario['id_usuario'];

			if(sha1($id_usuario_auxiliar === $id_usuario)) {

         		if($password === $password2) {

         			$clave='rv278u4h'; 
    				$hash = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($clave), $password, MCRYPT_MODE_CBC, md5(md5($clave))));


            		$sql2 = "UPDATE usuarios SET hash='$hash' WHERE id='$id_usuario_auxiliar'";
            

            		if(!$result2 = $db->query($sql2)){
			
					    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
					}

					$token_auxiliar = sha1($token);


               		$sql3 = "DELETE FROM reseteo_password WHERE token='$token_auxiliar'";


               		$fecha = date("Y-m-d");
				  	$hora = date('G:i:s');

					$sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('4','$id_usuario','0','Has modificado tu contraseña','$fecha','$hora','naranja');";


					if(!$result80 = $db->query($sql80)) {

					    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
					}

               		
               		echo "1-Se ha restablecido tu contraseña.";

               	}

               	else {

               		echo "2-Las contraseñas no coinciden.";
               	}

            }

            else {

            	echo "2-El token no es válido.";
            }

		}

		else {

			echo "2-El token no es válido.";
		}

	}


	else{
		
	  	header('Location:../../entrada/index.html');
	}


	
	$db->close();

 
?>