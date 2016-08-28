<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
    $id_publicacion = (isset($_REQUEST['id_publicacion']) ? $_REQUEST['id_publicacion'] : '');
    $tipo = (isset($_REQUEST['tipo']) ? $_REQUEST['tipo'] : '');
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
	$id_publicacion = $db->real_escape_string($id_publicacion);
	$tipo = $db->real_escape_string($tipo);


	$sql = "DELETE FROM votos_positivos WHERE (id_publicacion = '$id_publicacion' AND id_usuario = '$id_usuario');";

	if(!$result = $db->query($sql)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
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



    $total = $positivos + $negativos;

    $auxiliar_positivos = (($positivos * 5)/$total);
    $auxiliar_negativos = (($negativos * 5)/$total);

    if($auxiliar_positivos == $auxiliar_negativos) {

    	$auxiliar_positivos = $auxiliar_positivos - 0.1;
    }

    $valoracion = round($auxiliar_positivos);



    $sql5 = "UPDATE publicaciones SET valoracion='$valoracion' WHERE id='$id_publicacion'";


	if(!$result5 = $db->query($sql5)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}





	$sql20 = "SELECT * FROM publicaciones WHERE id='$id_publicacion'";

    if(!$result20 = $db->query($sql20)){
        
        die('4-Ha ocurrido un error durante la query [' . $db->error . ']');
    }

    //Si hay resultados, se recorren de la siguiente forma y luego se liberan
    while($row20 = $result20->fetch_assoc()){

        $id_amigo = $row20['id_usuario'];



        $sql30 = "SELECT * FROM usuarios WHERE id='$id_amigo'";

	    if(!$result30 = $db->query($sql30)){
	        
	        die('4-Ha ocurrido un error durante la query [' . $db->error . ']');
	    }

	    //Si hay resultados, se recorren de la siguiente forma y luego se liberan
	    while($row30 = $result30->fetch_assoc()){

	        $amigo = $row30['usuario'];


		    $fecha = date("Y-m-d");
		    $hora = date('G:i:s');

		    if($tipo == '1') {

		    	$accion = "Ya no te gusta un trabalenguas de ".$amigo;
		    }

		    else if($tipo == '2') {

		    	$accion = "Ya no te gusta un calambur de ".$amigo;
		    }

		    else if($tipo == '3') {

		    	$accion = "Ya no te gusta un criptograma de ".$amigo;
		    }

		    else if($tipo == '4') {

		    	$accion = "Ya no te gusta un lipograma de ".$amigo;
		    }

		    else if($tipo == '5') {

		    	$accion = "Ya no te gusta un pangrama de ".$amigo;
		    }
		    
		    else if($tipo == '6') {

		    	$accion = "Ya no te gusta un palíndromo de ".$amigo;
		    }

		    $sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('14','$id_usuario','0','$accion','$fecha','$hora','rojo');";


		    if(!$result80 = $db->query($sql80)) {

		        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
		    }

        
    	}


    }

	
	$db->close();

 
?>