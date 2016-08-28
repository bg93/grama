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


	$sql = "INSERT INTO votos_positivos (tipo,id_usuario,id_publicacion) VALUES('$tipo','$id_usuario','$id_publicacion');";


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



        $usuario_auxiliar = "Grama";

        $sql31 = "SELECT * FROM usuarios WHERE id='$id_usuario'";

	    if(!$result31 = $db->query($sql31)){
	        
	        die('4-Ha ocurrido un error durante la query [' . $db->error . ']');
	    }

	    //Si hay resultados, se recorren de la siguiente forma y luego se liberan
	    while($row31 = $result31->fetch_assoc()){

	        $usuario_auxiliar = $row31['usuario'];
	    }



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

		    	$accion = "Te ha gustado un trabalenguas de ".$amigo;
		    	$accion2 = "A ".$usuario_auxiliar." le ha gustado un trabalenguas tuyo [+ 1 PUNTO]";
		    }

		    else if($tipo == '2') {

		    	$accion = "Te ha gustado un calambur de ".$amigo;
		    	$accion2 = "A ".$usuario_auxiliar." le ha gustado un calambur tuyo [+ 1 PUNTO]";
		    }

		    else if($tipo == '3') {

		    	$accion = "Te ha gustado un criptograma de ".$amigo;
		    	$accion2 = "A ".$usuario_auxiliar." le ha gustado un criptograma tuyo [+ 1 PUNTO]";
		    }

		    else if($tipo == '4') {

		    	$accion = "Te ha gustado un lipograma de ".$amigo;
		    	$accion2 = "A ".$usuario_auxiliar." le ha gustado un lipograma tuyo [+ 1 PUNTO]";
		    }

		    else if($tipo == '5') {

		    	$accion = "Te ha gustado un pangrama de ".$amigo;
		    	$accion2 = "A ".$usuario_auxiliar." le ha gustado un pangrama tuyo [+ 1 PUNTO]";
		    }
		    
		    else if($tipo == '6') {

		    	$accion = "Te ha gustado un palíndromo de ".$amigo;
		    	$accion2 = "A ".$usuario_auxiliar." le ha gustado un palíndromo tuyo [+ 1 PUNTO]";
		    }

		    $sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('13','$id_usuario','0','$accion','$fecha','$hora','verde');";


		    if(!$result80 = $db->query($sql80)) {

		        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
		    }



		    $sql81 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('15','$id_amigo','0','$accion2','$fecha','$hora','verde');";


		    if(!$result81 = $db->query($sql81)) {

		        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
		    }

        
    	}


    }




	
	$db->close();

 
?>