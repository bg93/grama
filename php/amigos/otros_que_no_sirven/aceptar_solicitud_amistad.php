<?php
	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
    $id_amigo = (isset($_REQUEST['id_amigo']) ? $_REQUEST['id_amigo'] : '');

    $token_usuario = (isset($_REQUEST['token_usuario']) ? $_REQUEST['token_usuario'] : die('2-No se ha recibido el token.'));


	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {
    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


    //-------------------------------------------------------------------

    //Comprobacion Caducidad Token
    $sql100 = "SELECT * FROM usuarios WHERE id='$id_usuario'";

    //Si la consulta da cualquier error, se para aqui
    if(!$result100 = $db->query($sql100)){

        $sql102 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Token','-1','Error al obtener el token del usuario de la BD.','$ip');";

        if(!$result102 = $db->query($sql102)){

        }

        die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
    }

    while($row100 = $result100->fetch_assoc()){

        $caducidad_token = $row100['caducidad_token'];
    }

    $date1 = new DateTime("now");
    $date2 = new DateTime("$caducidad_token");

    if($date2 < $date1) {

        $sql103 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Token','1','El token de usuario ($id_usuario) ha caducado.','$ip');";

        if(!$result103 = $db->query($sql103)){

        }
        
        die('2-El token de usuario ha caducado.');
        //header ("Location: #/login");
    }

    //-------------------------------------------------------------------

    

    //Seleccionamos al usuario amigo
    $sql = "SELECT usuario FROM usuarios WHERE id='$id_amigo'";

    //Si la consulta da cualquier error, se para aqui
    if(!$result = $db->query($sql)){

        $sql90 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener al amigo del usuario (aceptar solicitud de amistad) de la BD.','$ip');";

        if(!$result90 = $db->query($sql90)){

        }

        die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
    }

    while($row = $result->fetch_assoc()){

        $usuario = $row['usuario'];

        $sql2 = "UPDATE amigos SET estado=1 WHERE (id_usuario1='$id_usuario' AND id_usuario2='$id_amigo' AND estado=2) OR (id_usuario1='$id_amigo' AND id_usuario2='$id_usuario' AND estado=2)";

        //Si la consulta da cualquier error, se para aqui
        if(!$result2 = $db->query($sql2)) {

            $sql91 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-3','Error al modificar el estado a la relación de amistad del usuario (aceptar solicitud de amistad) de la BD con su amigo.','$ip');";

            if(!$result91 = $db->query($sql91)){

            }

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }

        echo "1-$usuario";

    }


    //Liberamos los recusos de la consulta
    $result->free();
    

	//Cerramos la conexion
    $db->close();


?>