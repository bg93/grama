<?php

	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');

    $id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
	$tipo = (isset($_REQUEST['tipo']) ? $_REQUEST['tipo'] : '');
    $filtro = (isset($_REQUEST['filtro']) ? $_REQUEST['filtro'] : '');

    //TIPOS:
    //1- TRABALENGUAS
    //2- CALAMBURES
    //3- CRIPTOGRAMAS
    //4- LIPOGRAMAS
    //5- PANGRAMAS
    //6- TAUTOGRAMAS

    //FILTROS:
    //1 - MAS RECIENTES
    //2 - MENOS RECIENTES
    //3 - MEJOR VALORADOS
    //4 - PEOR VALORADOS


	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	$sql = "SELECT * FROM publicaciones WHERE (tipo = '$tipo')";

    if($filtro == '1') {

        $sql .= " ORDER BY fecha DESC, hora DESC";
    }

    if($filtro == '2') {

        $sql .= " ORDER BY fecha ASC, hora ASC";
    }

    if($filtro == '3') {

        $sql .= " ORDER BY valoracion DESC";
    }

    if($filtro == '4') {

        $sql .= " ORDER BY valoracion ASC";
    }

    if($filtro == '5') {

        $sql .= " AND (id_usuario = '$id_usuario') ORDER BY fecha DESC, hora DESC";
    }


	if(!$result = $db->query($sql)){

	    die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
	}


    while($row = $result->fetch_assoc()){

        $id_publicacion = $row['id'];
        $id_autor = $row['id_usuario'];
        $prefecha1 = $row['fecha'];
        $prefecha2 = date_create($prefecha1);
        $fecha = date_format($prefecha2, 'd/m/Y');
        $prehora1 = $row['hora'];
        $prehora2 = date_create($prehora1);
        $hora = date_format($prehora2, 'G:i');
        $valoracion = $row['valoracion'];
        $texto = $row['texto'];


        $sql2 = "SELECT * FROM usuarios WHERE id = '$id_autor'";

        if(!$result2 = $db->query($sql2)){

            die('Ha ocurrido un error durante la query [' . $db->error . ']');
        }

        while($row2 = $result2->fetch_assoc()){

            $autor = $row2['usuario'];
        }



        $sql3 = "SELECT * FROM votos_positivos WHERE (id_publicacion = '$id_publicacion')";

        if(!$result3 = $db->query($sql3)){

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }

        $positivos = mysqli_num_rows($result3);



        $sql4 = "SELECT * FROM votos_negativos WHERE (id_publicacion = '$id_publicacion')";

        if(!$result4 = $db->query($sql4)){

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }

        $negativos = mysqli_num_rows($result4);



        $sql5 = "SELECT * FROM votos_positivos WHERE (id_publicacion = '$id_publicacion' AND id_usuario = '$id_usuario')";

        if(!$result5 = $db->query($sql5)){

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }

        if(mysqli_num_rows($result5) > 0) {

            $voto_positivo = '1';
        }

        else {

            $voto_positivo = '0';
        }



        $sql6 = "SELECT * FROM votos_negativos WHERE (id_publicacion = '$id_publicacion' AND id_usuario = '$id_usuario')";

        if(!$result6 = $db->query($sql6)){

            die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
        }

        if(mysqli_num_rows($result6) > 0) {

            $voto_negativo = '1';
        }

        else {

            $voto_negativo = '0';
        }





        $array_publicaciones[] = array('id_publicacion'=> $id_publicacion, 'id_autor'=> $id_autor, 'autor'=> $autor, 'fecha'=> $fecha, 'hora'=> $hora, 'valoracion'=> $valoracion, 'positivos'=> $positivos, 'negativos'=> $negativos, 'texto'=> $texto, 'voto_positivo'=> $voto_positivo, 'voto_negativo'=> $voto_negativo, 'tipo'=> $tipo); 

    }



    if(isset($array_publicaciones)) {

        $publicaciones = json_encode($array_publicaciones);
        echo $publicaciones;

    }

    else {

        echo "vacio";

    }


 	//Liberamos los recusos de la consulta
    $result->free();
    
    //Cerramos la conexion
    $db->close();


?>
