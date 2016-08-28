<?php

	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    $id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
    $id_amigo = (isset($_REQUEST['id_amigo']) ? $_REQUEST['id_amigo'] : '');

    $token_usuario = (isset($_REQUEST['token_usuario']) ? $_REQUEST['token_usuario'] : die('2-No se ha recibido el token.'));

    $contenido_notificacion = "te ha enviado una solicitud de amistad";


    $fecha = date("Y-m-d");
    $hora = date('G:i:s');


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
    


	$sql = "SELECT usuario FROM usuarios WHERE id = '$id_amigo'";

	if(!$result = $db->query($sql)){

        $sql90 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener al amigo del usuario (agregar amigo) de la BD.','$ip');";

        if(!$result90 = $db->query($sql90)){

        }

	    die($sql.'2-Ha ocurrido un error durante la query [' . $db->error . '].');
	}


    while($row = $result->fetch_assoc()){

        $amigo_candidato = $row['usuario'];
        

        $sql2 = "INSERT INTO amigos (id_usuario1,id_usuario2,estado) VALUES('$id_usuario','$id_amigo','2')";

        //Si la consulta da cualquier error, se para aqui
        if(!$result2 = $db->query($sql2)) {

            $sql91 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-2','Error al insertar al amigo del usuario (agregar amigo) en la BD.','$ip');";

            if(!$result91 = $db->query($sql91)){

            }

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }

        echo "1-$amigo_candidato";

    }


    $sql6 = "SELECT * FROM notificaciones WHERE id_emisor = '$id_usuario' AND id_receptor = '$id_amigo' AND tipo = '6'";

    if(!$result6 = $db->query($sql6)){

        $sql92 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener la notificación de nueva solicitud de amistad del usuario (agregar amigo) de la BD.','$ip');";

        if(!$result92 = $db->query($sql92)){

        }

        die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
    }


    if(mysqli_num_rows($result6) > 0) {

        $sql8 = "UPDATE notificaciones SET contenido='$contenido_notificacion',fecha='$fecha',hora='$hora',leido='0' WHERE (id_emisor = '$id_usuario' AND id_receptor = '$id_amigo' AND tipo = '6')";

        if(!$result8 = $db->query($sql8)){

            $sql93 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-3','Error al modificar el contenido, fecha y estado de lectura de la notificación de nueva solicitud de amistad del usuario (agregar amigo) en la BD.','$ip');";

            if(!$result93 = $db->query($sql93)){

            }

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }

    }

    else {

        $sql7 = "INSERT INTO notificaciones (tipo,id_emisor,id_receptor,id_evento_publico,id_evento_privado,fecha,hora,contenido,leido) VALUES('6','$id_usuario','$id_amigo','0','0','$fecha','$hora','$contenido_notificacion','0');";

        if(!$result7 = $db->query($sql7)) {

            $sql94 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-2','Error al insertar la notificación de nueva solicitud de amistad del usuario (agregar amigo) en la BD.','$ip');";

            if(!$result94 = $db->query($sql94)){

            }

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }

    }


    //Liberamos los recusos de la consulta
    $result->free();
    
    //Cerramos la conexion
	$db->close();


?>