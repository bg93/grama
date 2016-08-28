<?php
	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');

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
    


	$sql = "SELECT id FROM usuarios WHERE id != '$id_usuario'";

	if(!$result = $db->query($sql)){

        $sql90 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener al amigo del usuario (visualizar amigos) de la BD.','$ip');";

        if(!$result90 = $db->query($sql90)){

        }

	    die($sql.'2-Ha ocurrido un error durante la query [' . $db->error . '].');
	}


    while($row = $result->fetch_assoc()){

        $id_usuario_amigo = $row['id'];


        $sql3 = "SELECT * FROM amigos WHERE (id_usuario1 = '$id_usuario' AND id_usuario2 = '$id_usuario_amigo' AND (estado = 1 OR estado = 30 OR estado = 33)) OR (id_usuario1 = '$id_usuario_amigo' AND id_usuario2 = '$id_usuario' AND (estado = 1 OR estado = 30 OR estado = 33))";
                  
        if(!$result3 = $db->query($sql3)){

            $sql91 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener al amigo (bloqueado) del usuario (visualizar amigos) de la BD.','$ip');";

            if(!$result91 = $db->query($sql91)){

            }

            die($sql3.'Ha ocurrido un error durante la query [' . $db->error . ']');
        }

        //Si hay resultados, se recorren de la siguiente forma y luego se liberan

        while($row3 = $result3->fetch_assoc()){

            $id_amigo1 = $row3['id_usuario1'];
            $id_amigo2 = $row3['id_usuario2'];

            $estado = $row3['estado'];


            if($id_amigo1 != $id_usuario){
                $id_amigo = $id_amigo1;

                
                if($estado == 30) {
                    $estado = 03;
                }
            }

            else if($id_amigo2 != $id_usuario){
                $id_amigo = $id_amigo2;
            }

            else {
                $id_amigo = 0;
            }

            $sql4 = "SELECT * FROM usuarios WHERE id = '$id_amigo'";

            if(!$result4 = $db->query($sql4)){

                $sql92 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener al amigo del usuario (visualizar amigos) de la BD.','$ip');";

                if(!$result92 = $db->query($sql92)){

                }

                die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
            }

            while($row4 = $result4->fetch_assoc()){
                $id_amigo_usuario = $row4['id'];
                $id_url_amigo = $row4['id_url'];
                $usuario_amigo = $row4['usuario'];
                $email_amigo = $row4['email'];
                $foto_amigo = $row4['foto_perfil'];
                $edad_amigo = $row4['edad'];
                $sexo_amigo = $row4['sexo'];
                $ultima_sesion_amigo = $row4['ultima_sesion'];
                $fecha_ultima_sesion = date_create($ultima_sesion_amigo);
                $ultima_conexion_amigo = date_format($fecha_ultima_sesion, 'd/m/Y');


                $sql2 = "SELECT imagen FROM imagenes WHERE imagen_id = '$foto_amigo'";

                if(!$result2 = $db->query($sql2)){

                    $sql93 = "INSERT INTO log_errores (contexto,numero,error,ip) VALUES ('Amigos','-1','Error al obtener la imagen del amigo del usuario (visualizar amigos) de la BD.','$ip');";

                    if(!$result93 = $db->query($sql93)){

                    }

                    die($sql2.'Ha ocurrido un error durante la query [' . $db->error . ']');
                }

                //Si hay resultados, se recorren de la siguiente forma y luego se liberan

                while($row2 = $result2->fetch_assoc()){
                    $foto_amigo_usuario = $row2['imagen'];
                    $foto_final_amigo = substr($foto_amigo_usuario, 3);  // devuelve la ruta sin ../

                    $amigos_usuario[] = array('id_amigo_usuario'=> $id_amigo_usuario, 'id_url_amigo'=> $id_url_amigo, 'usuario_amigo'=> $usuario_amigo, 'email_amigo'=> $email_amigo, 'foto_amigo'=> $foto_final_amigo, 'edad_amigo'=> $edad_amigo, 'sexo_amigo'=> $sexo_amigo, 'ultima_conexion_amigo'=> $ultima_conexion_amigo, 'estado'=> $estado);                                            

                }


            }


        }


    }


    if(isset($amigos_usuario)) {

        $amigos_usuario_final = json_encode($amigos_usuario);
        echo $amigos_usuario_final;

    }

    else {
        echo "vacio";
    }


    //Liberamos los recusos de la consulta
    $result->free();

    //Cerramos la conexion
	$db->close();


?>