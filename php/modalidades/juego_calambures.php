<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
    $dificultad = (isset($_REQUEST['dificultad']) ? $_REQUEST['dificultad'] : '');
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
	$dificultad = $db->real_escape_string($dificultad);


	if($dificultad == '1') {

		$sql = "SELECT * FROM juego_calambures WHERE (dificultad = '0') OR (dificultad = '1') OR (dificultad = '12') OR (dificultad = '13') ORDER BY RAND()
LIMIT 1";
	}

	else if($dificultad == '2') {

		$sql = "SELECT * FROM juego_calambures WHERE (dificultad = '0') OR (dificultad = '2') OR (dificultad = '12') OR (dificultad = '23') ORDER BY RAND()
LIMIT 1";
	}

	else if($dificultad == '3') {

		$sql = "SELECT * FROM juego_calambures WHERE (dificultad = '0') OR (dificultad = '3') OR (dificultad = '13') OR (dificultad = '23') ORDER BY RAND()
LIMIT 1";
	}
	

	if(!$result = $db->query($sql)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}

	while($row = $result->fetch_assoc()){

		$id_calambur = $row['id'];
        $texto1 = $row['texto1'];
        $texto2 = $row['texto2'];
        $texto3 = $row['texto3'];
        $palabras1 = $row['palabras1'];
        $palabras2 = $row['palabras2'];
        $palabras3 = $row['palabras3'];
        $palabras_correctas = $row['palabras_correctas'];

        $calambures = array('id'=> $id_calambur, 'texto1'=> $texto1, 'texto2'=> $texto2, 'texto3'=> $texto3, 'palabras1'=> $palabras1, 'palabras2'=> $palabras2, 'palabras3'=> $palabras3, 'palabras_correctas'=> $palabras_correctas);                                            

    }


    if(isset($calambures)) {

        $calambures_final = json_encode($calambures);
        echo $calambures_final;

    }

    else {

        echo "vacio";
    }


    //Liberamos los recusos de la consulta
    $result->free();

	
	$db->close();

 
?>