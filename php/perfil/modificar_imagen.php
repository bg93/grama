<?php

	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');

    $id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
	$imagen = (isset($_REQUEST['imagen_perfil']) ? $_REQUEST['imagen_perfil'] : '');
	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {
    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");




  if(!empty($imagen)){

    list(, $imagen) = explode(';', $imagen);
    list(, $imagen) = explode(',', $imagen);

    $imagen = base64_decode($imagen);

    $imagen_info = getimagesizefromstring($imagen);
    $imagen_tipo = $imagen_info["mime"];
    $uploadedfileload = "true";
    $uploadedfile_size = strlen($imagen);


    //Si no se ha subido ninguna imagen, no se hace nada
    if($uploadedfile_size == 0) {

      //Ponemos id de imagen a 1 y cargamos la imagen default
        //$id_imagen = 1;
        //$add="../../imagenes/perfiles/default.png";
        
    }

    //Si se ha subido una imagen, se sube al hosting
    else {

        $file_name=uniqid().".png";
        $add="../../img/usuarios/$file_name";
        $add2="img/usuarios/$file_name";
        file_put_contents($add, $imagen);    
    
        $permitidos = array("image/jpg", "image/jpeg", "image/gif", "image/png");
        $limite_kb = 200000*1024;
        $msg = "";

        if ($uploadedfile_size > $limite_kb) {

            $msg .="El archivo es mayor que 20MB, debes reducirlo antes de subirlo</br>";
            $uploadedfileload="false";
        }

        if(!in_array($imagen_tipo, $permitidos)) {

            $msg .="El archivo no tiene extension jpg, jpeg, gif o png, debes reducirlo antes de subirlo</br>";
            $uploadedfileload="false";
        }

        if($uploadedfileload=="true") {

            //Introducimos la ruta del archivo en la BD
            $sql = "INSERT INTO imagenes (imagen) VALUES('$add2');";

            if(!$result = $db->query($sql)) {

              die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
            }

            $id_imagen_editar_perfil = $db->insert_id;


            $sql2 = "UPDATE usuarios SET foto='$id_imagen_editar_perfil' WHERE id='$id_usuario'";

            if(!$result2 = $db->query($sql2)) {

              die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
            }

            $fecha = date("Y-m-d");
            $hora = date('G:i:s');

            $sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('5','$id_usuario','0','Has modificado tu imagen de perfil','$fecha','$hora','naranja');";


            if(!$result80 = $db->query($sql80)) {

                die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
            }

            echo "1-Tu imagen de perfil se ha editado correctamente.";

        }

        else {

            echo "2-$msg";
        }

    }


  }


    
  //Cerramos la conexion
  $db->close();
 
?>
