<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

	date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_POST['id-usuario-denuncia']) ? $_POST['id-usuario-denuncia'] : '');
    $id_publicacion = (isset($_POST['id-publicacion-denuncia']) ? $_POST['id-publicacion-denuncia'] : '');
    $motivo = (isset($_POST['motivo-denuncia']) ? $_POST['motivo-denuncia'] : '');
    $comentario = (isset($_POST['comentario-denuncia']) ? $_POST['comentario-denuncia'] : '');
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
	$id_publicacion = $db->real_escape_string($id_publicacion);
	$motivo = $db->real_escape_string($motivo);
	$comentario = $db->real_escape_string($comentario);


	$sql = "INSERT INTO denuncias (id_publicacion,id_usuario,motivo,comentario) VALUES('$id_publicacion','$id_usuario','$motivo','$comentario');";


	if(!$result = $db->query($sql)) {

	    die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}

	$cadena = "La denuncia se ha enviado correctamente.<br><br>Gracias por tu colaboración.";

	echo "1-$cadena";





	$sql20 = "SELECT * FROM publicaciones WHERE id='$id_publicacion'";

    if(!$result20 = $db->query($sql20)){
        
        die('4-Ha ocurrido un error durante la query [' . $db->error . ']');
    }

    //Si hay resultados, se recorren de la siguiente forma y luego se liberan
    while($row20 = $result20->fetch_assoc()){

        $id_amigo = $row20['id_usuario'];
        $tipo = $row20['tipo'];



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

		    	$accion = "Has denunciado un trabalenguas de ".$amigo;
		    	$accion2 = $usuario_auxiliar." ha denunciado un trabalenguas tuyo [- 1 PUNTO]";
		    }

		    else if($tipo == '2') {

		    	$accion = "Has denunciado un calambur de ".$amigo;
		    	$accion2 = $usuario_auxiliar." ha denunciado un calambur tuyo [- 1 PUNTO]";
		    }

		    else if($tipo == '3') {

		    	$accion = "Has denunciado un criptograma de ".$amigo;
		    	$accion2 = $usuario_auxiliar." ha denunciado un criptograma tuyo [- 1 PUNTO]";
		    }

		    else if($tipo == '4') {

		    	$accion = "Has denunciado un lipograma de ".$amigo;
		    	$accion2 = $usuario_auxiliar." ha denunciado un lipograma tuyo [- 1 PUNTO]";
		    }

		    else if($tipo == '5') {

		    	$accion = "Has denunciado un pangrama de ".$amigo;
		    	$accion2 = $usuario_auxiliar." ha denunciado un pangrama tuyo [- 1 PUNTO]";
		    }
		    
		    else if($tipo == '6') {

		    	$accion = "Has denunciado un palíndromo de ".$amigo;
		    	$accion2 = $usuario_auxiliar." ha denunciado un palíndromo tuyo [- 1 PUNTO]";
		    }

		    $sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('17','$id_usuario','0','$accion','$fecha','$hora','verde');";


		    if(!$result80 = $db->query($sql80)) {

		        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
		    }



		    $sql81 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('18','$id_amigo','0','$accion2','$fecha','$hora','verde');";


		    if(!$result81 = $db->query($sql81)) {

		        die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
		    }

        
    	}


    }







	
	$db->close();

 
?>