<?php

	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');

	$id_usuario = (isset($_POST['id-usuario-ver-amigos']) ? $_POST['id-usuario-ver-amigos'] : '');
    $filtro_nombre_amigo = (isset($_POST['nombre-filtro-ver-amigos']) ? $_POST['nombre-filtro-ver-amigos'] : '');
    $filtro_email_amigo = (isset($_POST['email-filtro-ver-amigos']) ? $_POST['email-filtro-ver-amigos'] : '');
    $filtro_edad_amigo = (isset($_POST['edad-filtro-ver-amigos']) ? $_POST['edad-filtro-ver-amigos'] : '');
    $filtro_sexo_amigo = (isset($_POST['sexo-filtro-ver-amigos']) ? $_POST['sexo-filtro-ver-amigos'] : 'O');
    $filtro_provincia_amigo = (isset($_POST['provincia-filtro-ver-amigos']) ? $_POST['provincia-filtro-ver-amigos'] : '0');
    $filtro_cita_amigo = (isset($_POST['cita-filtro-ver-amigos']) ? $_POST['cita-filtro-ver-amigos'] : '');



	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	$sql = "SELECT * FROM amigos WHERE (id_usuario1 = '$id_usuario' OR id_usuario2 = '$id_usuario') AND (estado = '1')";

	if(!$result = $db->query($sql)){

	    die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
	}

    if(mysqli_num_rows($result) > 0) {

    }

    else {

        die("sin");
    }


    while($row = $result->fetch_assoc()){

        $estado = $row['estado'];

        $id_amigo = "";
        $columna = "";

        $id_auxiliar1 = $row['id_usuario1'];
        $id_auxiliar2 = $row['id_usuario2'];

        if($id_auxiliar1 == $id_usuario) {

            $id_amigo = $id_auxiliar2;
            $columna = "1";
        }

        else {

            $id_amigo = $id_auxiliar1;
            $columna = "2";
        }


        $sql2 = "SELECT * FROM usuarios WHERE id = '$id_amigo'";

        if($filtro_nombre_amigo != '') {

            $sql2 .= " AND usuario LIKE '%$filtro_nombre_amigo%'";
        }

        if($filtro_email_amigo != '') {

            $sql2 .= " AND email LIKE '%$filtro_email_amigo%'";
        }

        if($filtro_edad_amigo != '') {

            $sql2 .= " AND edad LIKE '$filtro_edad_amigo'";
        }

        if($filtro_sexo_amigo != '' && $filtro_sexo_amigo != 'O') {

            $sql2 .= " AND sexo LIKE '$filtro_sexo_amigo'";
        }

        if($filtro_provincia_amigo != '' && $filtro_provincia_amigo != '0') {

            $sql2 .= " AND usuario LIKE '$filtro_provincia_amigo'";
        }

        if($filtro_cita_amigo != '') {

            $sql2 .= " AND cita LIKE '%$cita%'";
        }



        if(!$result2 = $db->query($sql2)){

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }


        while($row2 = $result2->fetch_assoc()){

            $id_amigo = $row2['id'];
            $nombre_amigo = $row2['usuario'];
            $email_amigo = $row2['email'];
            $id_foto_amigo = $row2['foto'];
            $edad_amigo = $row2['edad'];
            $prefecha1_nacimiento_amigo = $row2['fecha_nacimiento'];
            $prefecha2_nacimiento_amigo = date_create($prefecha1_nacimiento_amigo);
            $fecha_nacimiento_amigo = date_format($prefecha2_nacimiento_amigo, 'd/m/Y');
            $fecha_auxiliar1_nacimiento_amigo = date_create($prefecha1_nacimiento_amigo);
            $fecha_auxiliar_nacimiento_amigo = date_format($fecha_auxiliar1_nacimiento_amigo, 'Y-m-d');
            $sexo_amigo = $row2['sexo'];
            $preprovincia_amigo = $row2['provincia'];
            $cita_amigo = $row2['cita'];
            $prefecha1_conexion_amigo = $row2['fecha_conexion'];
            $prefecha2_conexion_amigo = date_create($prefecha1_conexion_amigo);
            $fecha_conexion_amigo = date_format($prefecha2_conexion_amigo, 'd/m/Y');
            $prehora1_conexion_amigo = $row['hora_conexion'];
            $prehora2_conexion_amigo = date_create($prehora1_conexion_amigo);
            $hora_conexion_amigo = date_format($prehora2_conexion_amigo, 'G:i');  //'G:i:s'


            if($sexo_amigo == 'O') {

                $sexo_amigo = 'Sin especificar';
            }

            else if($sexo_amigo == 'H') {

                $sexo_amigo = 'Hombre';
            }

            else if($sexo_amigo == 'M') {

                $sexo_amigo = 'Mujer';
            }

            else {

                $sexo_amigo = 'Sin sexo';
            }


            if($cita_amigo == '') {

                $cita_amigo = 'Sin cita';
            }

            if($preprovincia_amigo == '0') {

                $provincia_amigo = 'Sin provincia';
            }



            $sql3 = "SELECT imagen FROM imagenes WHERE id = '$id_foto_amigo'";

            if(!$result3 = $db->query($sql3)){

                die('Ha ocurrido un error durante la query [' . $db->error . ']');
            }

            //Si hay resultados, se recorren de la siguiente forma y luego se liberan
            while($row3 = $result3->fetch_assoc()){

                $foto_amigo = $row3['imagen'];
                //$foto_final_perfil = substr($foto_perfil, 3);  // devuelve la ruta sin ../
            }


            $sql4 = "SELECT * FROM provincias WHERE id = '$preprovincia_amigo'";

            if(!$result4 = $db->query($sql4)){

                die('Ha ocurrido un error durante la query [' . $db->error . ']');
            }

            while($row4 = $result4->fetch_assoc()){

                $provincia_amigo = $row4['provincia'];
            }


            $array_amigos[] = array('id_amigo'=> $id_amigo, 'nombre_amigo'=> $nombre_amigo, 'email_amigo'=> $email_amigo, 'foto_amigo'=> $foto_amigo, 'edad_amigo'=> $edad_amigo, 'sexo_amigo'=> $sexo_amigo, 'provincia_amigo'=> $provincia_amigo, 'cita_amigo'=> $cita_amigo, 'fecha_conexion_amigo'=> $fecha_conexion_amigo, 'hora_conexion_amigo'=> $hora_conexion_amigo, 'id_foto_amigo'=> $id_foto_amigo, 'fecha_auxiliar_nacimiento_amigo'=> $fecha_auxiliar_nacimiento_amigo, 'provincia_auxiliar_amigo'=> $preprovincia_amigo, 'estado'=> $estado, 'columna'=> $columna); 
    
        }
     
        

    }



    if(isset($array_amigos)) {

        $amigos = json_encode($array_amigos);
        echo $amigos;

    }

    else {

        echo "vacio";

    }


 	//Liberamos los recusos de la consulta
    $result->free();
    
    //Cerramos la conexion
    $db->close();


?>
