<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
    $tipo = (isset($_REQUEST['tipo']) ? $_REQUEST['tipo'] : '');
    $dificultad = (isset($_REQUEST['dificultad']) ? $_REQUEST['dificultad'] : '');
    $puntos = (isset($_REQUEST['puntos']) ? $_REQUEST['puntos'] : '');
    $tipo_historial = (isset($_REQUEST['tipo_historial']) ? $_REQUEST['tipo_historial'] : '');
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
    $tipo = $db->real_escape_string($tipo);
    $dificultad = $db->real_escape_string($dificultad);
    $puntos = $db->real_escape_string($puntos);
    $tipo_historial = $db->real_escape_string($tipo_historial);


    $fecha = date("Y-m-d");
    $hora = date('G:i:s');

    $accion = "";
    $color = "";
    $texto_dificultad = "";
    $texto_puntos = "";

    if($dificultad == '1') {

        $texto_dificultad = "Novato";
    }

    else if($dificultad == '2') {

        $texto_dificultad = "Avanzado";
    }

    else if($dificultad == '3') {

        $texto_dificultad = "Experto";
    }


    if($puntos == '1') {

        $texto_puntos = "PUNTO";
    }

    else if($puntos == '2' || $puntos == '3') {

        $texto_puntos = "PUNTOS";
    }


    if($tipo_historial == '19') {

        $accion = "Has superado un trabalenguas de dificultad ".$texto_dificultad."' [+ ".$puntos." ".$texto_puntos."]";
        $color = "verde";
    }

    else if($tipo_historial == '21') {

        $accion = "Has superado un calambur de dificultad ".$texto_dificultad." [+ ".$puntos." ".$texto_puntos."]";
        $color = "verde";
    }

    else if($tipo_historial == '23') {

        $accion = "Has superado un criptograma de dificultad ".$texto_dificultad." [+ ".$puntos." ".$texto_puntos."]";
        $color = "verde";
    }

    else if($tipo_historial == '25') {

        $accion = "Has superado un lipograma de dificultad ".$texto_dificultad." [+ ".$puntos." ".$texto_puntos."]";
        $color = "verde";
    }

    else if($tipo_historial == '27') {

        $accion = "Has superado un pangrama de dificultad ".$texto_dificultad." [+ ".$puntos." ".$texto_puntos."]";
        $color = "verde";
    }

    else if($tipo_historial == '29') {

        $accion = "Has superado unos palíndromos de dificultad ".$texto_dificultad." [+ ".$puntos." ".$texto_puntos."]";
        $color = "verde";
    }

    else if($tipo_historial == '20') {

        $accion = "No has superado un trabalenguas de dificultad ".$texto_dificultad." [- ".$puntos." ".$texto_puntos."]";
        $color = "rojo";
    }

    else if($tipo_historial == '22') {

        $accion = "No has superado un calambur de dificultad ".$texto_dificultad." [- ".$puntos." ".$texto_puntos."]";
        $color = "rojo";
    }

    else if($tipo_historial == '24') {

        $accion = "No has superado un criptograma de dificultad ".$texto_dificultad." [- ".$puntos." ".$texto_puntos."]";
        $color = "rojo";
    }

    else if($tipo_historial == '26') {

        $accion = "No has superado un lipograma de dificultad ".$texto_dificultad." [- ".$puntos." ".$texto_puntos."]";
        $color = "rojo";
    }

    else if($tipo_historial == '28') {

        $accion = "No has superado un pangrama de dificultad ".$texto_dificultad." [- ".$puntos." ".$texto_puntos."]";
        $color = "rojo";
    }

    else if($tipo_historial == '30') {

        $accion = "No has superado unos palíndromos de dificultad ".$texto_dificultad." [- ".$puntos." ".$texto_puntos."]";
        $color = "rojo";
    }



    $sql = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('$tipo_historial','$id_usuario','0','$accion','$fecha','$hora','$color');";

    if(!$result = $db->query($sql)) {

        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
    }

    echo "$accion";


     //Liberamos los recusos de la consulta
    $result->free();

	
	$db->close();

 
?>