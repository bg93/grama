<?php

	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');

	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');


	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	$sql = "SELECT * FROM usuarios WHERE id = '$id_usuario'";

	if(!$result = $db->query($sql)){

	    die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
	}


    while($row = $result->fetch_assoc()){

        $id_usuario = $row['id'];
        $nombre_usuario = $row['usuario'];
        $email_usuario = $row['email'];
        $id_foto_usuario = $row['foto'];
        $edad_usuario = $row['edad'];
        $prefecha1_nacimiento_usuario = $row['fecha_nacimiento'];
        $prefecha2_nacimiento_usuario = date_create($prefecha1_nacimiento_usuario);
        $fecha_nacimiento_usuario = date_format($prefecha2_nacimiento_usuario, 'd/m/Y');
        $fecha_auxiliar1_nacimiento_usuario = date_create($prefecha1_nacimiento_usuario);
        $fecha_auxiliar_nacimiento_usuario = date_format($fecha_auxiliar1_nacimiento_usuario, 'Y-m-d');
        $sexo_usuario = $row['sexo'];
        $preprovincia_usuario = $row['provincia'];
        $cita_usuario = $row['cita'];
        $prefecha1_conexion_usuario = $row['fecha_conexion'];
        $prefecha2_conexion_usuario = date_create($prefecha1_conexion_usuario);
        $fecha_conexion_usuario = date_format($prefecha2_conexion_usuario, 'd/m/Y');
        $prehora1_conexion_usuario = $row['hora_conexion'];
        $prehora2_conexion_usuario = date_create($prehora1_conexion_usuario);
        $hora_conexion_usuario = date_format($prehora2_conexion_usuario, 'G:i');  //'G:i:s'

        if($sexo_usuario == 'O') {

            $sexo_usuario = 'Sin especificar';
        }

        else if($sexo_usuario == 'H') {

            $sexo_usuario = 'Hombre';
        }

        else if($sexo_usuario == 'M') {

            $sexo_usuario = 'Mujer';
        }

        else {

            $sexo_usuario = 'Sin especificar';
        }


        if($cita_usuario == '') {

            $cita_usuario = 'Sin especificar';
        }

        if($preprovincia_usuario == '0') {

            $provincia_usuario = 'Sin especificar';
        }


        /*
        list($dia,$mes,$ano) = explode("/",$fecha_nacimiento_usuario);
        $ano_diferencia  = date("Y") - $ano;
        $mes_diferencia = date("m") - $mes;
        $dia_diferencia   = date("d") - $dia;

        if($dia_diferencia < 0 || $mes_diferencia < 0) {

            $ano_diferencia--;
        }

        $edad_usuario = $ano_diferencia;
        */


                                                
        $sql2 = "SELECT imagen FROM imagenes WHERE id = '$id_foto_usuario'";

        if(!$result2 = $db->query($sql2)){

            die('Ha ocurrido un error durante la query [' . $db->error . ']');
        }

        //Si hay resultados, se recorren de la siguiente forma y luego se liberan
        while($row2 = $result2->fetch_assoc()){
            $foto_usuario = $row2['imagen'];
            //$foto_final_perfil = substr($foto_perfil, 3);  // devuelve la ruta sin ../
        }


        $sql3 = "SELECT * FROM provincias WHERE id = '$preprovincia_usuario'";

        if(!$result3 = $db->query($sql3)){

            die('Ha ocurrido un error durante la query [' . $db->error . ']');
        }

        while($row3 = $result3->fetch_assoc()){

            $provincia_usuario = $row3['provincia'];
        }

        $perfil_usuario = array('id_usuario'=> $id_usuario, 'nombre_usuario'=> $nombre_usuario, 'email_usuario'=> $email_usuario, 'foto_usuario'=> $foto_usuario, 'edad_usuario'=> $edad_usuario, 'sexo_usuario'=> $sexo_usuario, 'provincia_usuario'=> $provincia_usuario, 'cita_usuario'=> $cita_usuario, 'fecha_conexion_usuario'=> $fecha_conexion_usuario, 'hora_conexion_usuario'=> $hora_conexion_usuario, 'id_foto_usuario'=> $id_foto_usuario, 'fecha_auxiliar_nacimiento_usuario'=> $fecha_auxiliar_nacimiento_usuario, 'provincia_auxiliar_usuario'=> $preprovincia_usuario);                                            

    }


    if(isset($perfil_usuario)) {

        $perfil_usuario_final = json_encode($perfil_usuario);
        echo $perfil_usuario_final;
    }

    else {
        echo "vacio";
    }


 	//Liberamos los recusos de la consulta
    $result->free();
    
    //Cerramos la conexion
    $db->close();


?>
