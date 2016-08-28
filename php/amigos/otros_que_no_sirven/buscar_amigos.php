<?php
	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    $objDatos = json_decode(file_get_contents("php://input"));
    $id_usuario = (isset($objDatos->id_propio_usuario)) ? $objDatos->id_propio_usuario : die("2-No se ha recibido tu ID de usuario. Vuelve a intentarlo.");
    $filtro_usuario = (isset($objDatos->usuario_filtros_amigos) ? $objDatos->usuario_filtros_amigos : '');
    $filtro_email = (isset($objDatos->email_filtros_amigos) ? $objDatos->email_filtros_amigos : '');
    $filtro_sexo = (isset($objDatos->sexo_filtros_amigos) ? $objDatos->sexo_filtros_amigos : '');

    $token_usuario = (isset($objDatos->token_usuario)) ? $objDatos->token_usuario : die("2-No se ha recibido el token de usuario. Vuelve a intentarlo.");
    

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
    


	$sql = "SELECT * FROM usuarios WHERE id != '$id_usuario'";

    if($filtro_usuario != '') {

        $sql .= " AND usuario LIKE '%$filtro_usuario%'";
    }

    if($filtro_email != '') {

        $sql .= " AND email LIKE '%$filtro_email%'";
    }

    if($filtro_sexo != '') {

        $sql .= " AND sexo LIKE '%$filtro_sexo%'";
    }


	if(!$result = $db->query($sql)){

        $sql90 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener al amigo del usuario (buscar amigos) de la BD.','$ip');";

        if(!$result90 = $db->query($sql90)){

        }

	    die($sql.'2-Ha ocurrido un error durante la query [' . $db->error . '].');
	}


    while($row = $result->fetch_assoc()){

        $id_amigo_candidato = $row['id'];
        $usuario_amigo_candidato = $row['usuario'];
        
        $email_amigo_candidato = $row['email'];
        $edad_amigo_candidato = $row['edad'];
        $sexo_amigo_candidato = $row['sexo'];

        if($sexo_amigo_candidato == 'H') {
            $sexo_amigo_candidato = '<i class="ion-male"></i>';
        }

        else if($sexo_amigo_candidato == 'M') {
            $sexo_amigo_candidato = '<i class="ion-female"></i>';
        }

        else {
            $sexo_amigo_candidato = '<i class="ion help"></i>';
        }

        $ultima_sesion_amigo_candidato = $row['ultima_sesion'];
        $fecha_ultima_sesion_amigo_candidato = date_create($ultima_sesion_amigo_candidato);
        $ultima_conexion_amigo_candidato = date_format($fecha_ultima_sesion_amigo_candidato, 'd/m/Y');

        $foto_amigo_candidato = $row['foto_perfil'];

        $sql3 = "SELECT imagen FROM imagenes WHERE imagen_id = '$foto_amigo_candidato'";

        if(!$result3 = $db->query($sql3)){

            $sql91 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener la imagen del amigo del usuario (buscar amigos) de la BD.','$ip');";

            if(!$result91 = $db->query($sql91)){

            }

            die('Ha ocurrido un error durante la query [' . $db->error . ']');
        }

        while($row3 = $result3->fetch_assoc()){

            $foto_amigo_candidato = $row3['imagen'];
            $foto_final_amigo_candidato = substr($foto_amigo_candidato, 3);  // devuelve la ruta sin ../

        }


        //Usuarios que SI tienen relacion alguna con el propio usuario
        $sql4 = "SELECT * FROM amigos WHERE (id_usuario1 = '$id_usuario' AND id_usuario2 = '$id_amigo_candidato') OR (id_usuario1 = '$id_amigo_candidato' AND id_usuario2 = '$id_usuario')";

        if(!$result4 = $db->query($sql4)){

            $sql92 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener a los amigos del usuario (buscar amigos) de la BD.','$ip');";

            if(!$result92 = $db->query($sql92)){

            }

            die('Ha ocurrido un error durante la query [' . $db->error . '].');
        }


        if(mysqli_num_rows($result4) > 0) {

            //Usuarios CON relacion con el propio usuario
        }

        else {

            //Usuarios SIN relacion con el propio usuario
            $amigos_candidatos[] = array('id_amigo_candidato'=> $id_amigo_candidato, 'usuario_amigo_candidato'=> $usuario_amigo_candidato, 'email_amigo_candidato'=> $email_amigo_candidato, 'foto_amigo_candidato'=> $foto_final_amigo_candidato, 'edad_amigo_candidato'=> $edad_amigo_candidato, 'sexo_amigo_candidato'=> $sexo_amigo_candidato, 'ultima_conexion_amigo_candidato'=> $ultima_conexion_amigo_candidato);                                            
        }


    }


    if(isset($amigos_candidatos)) {

        $amigos_candidatos_final = json_encode($amigos_candidatos);
        echo $amigos_candidatos_final;
    }

    else {

        echo "vacio";
    }

    //Liberamos los recusos de la consulta
    $result->free();

    //Cerramos la conexion
	$db->close();


?>