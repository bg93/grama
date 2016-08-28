<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_REQUEST['id_usuario']) ? $_REQUEST['id_usuario'] : '');
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);





    //TIPO 1: Te has registrado.
    //Tipo 2: Te has logueado.
    //Tipo 3: Te has desconectado.   [[PENDIENTE!!!]]
    //Tipo 4: Has modificado tu contraseña.
    //Tipo 5: Has modificado tu imagen de perfil.
    //Tipo 6: Has editado tu perfil.
    //Tipo 7: Has enviado una solicitud de amistad a ''.
    //Tipo 8: Has aceptado la solicitud de amistad de ''.
    //Tipo 9: Has cancelado la solicitud de amistad de ''.
    //Tipo 10: Has eliminado a '' de tu lista de amigos.



    //Tipo 11: Has creado un '(trabalenguas, etc)'. [+ (X) PUNTOS]
    //Tipo 12: Has eliminado un '(trabalenguas, etc)'.   [[PENDIENTE!!!]]
    //Tipo 13: Te ha gustado un '(trabalenguas, etc)' de ''. (tambien si es suyo propio)
    //Tipo 14: No te ha gustado un '(trabalenguas, etc)' de ''. (tambien si es suyo propio)
    //Tipo 15: A '' le ha gustado un '(trabalenguas, etc)' tuyo. [+ (X) PUNTOS]
    //Tipo 16: A '' no le ha gustado un '(trabalenguas, etc)' tuyo.
    //Tipo 17: Has denunciado un '(trabalenguas, etc)' de ''. (tambien si es suyo propio) 
    //Tipo 18: Han denunciado un '(trabalenguas, etc)' tuyo. [- (X) PUNTOS]   

    //Tipo 19: Has superado un trabalenguas de dificultad '(Novato, Avanzado, Experto)'. [+ (X) PUNTOS]
    //Tipo 20: No has superado un trabalenguas de dificultad '(Novato, Avanzado, Experto)'. [- (X) PUNTOS]
    //Tipo 21: Has superado un calambur de dificultad '(Novato, Avanzado, Experto)'. [+ (X) PUNTOS]
    //Tipo 22: No has superado un calambur de dificultad '(Novato, Avanzado, Experto)'. [- (X) PUNTOS]
    //Tipo 23: Has superado un criptograma de dificultad '(Novato, Avanzado, Experto)'. [+ (X) PUNTOS]
    //Tipo 24: No has superado un criptograma de dificultad '(Novato, Avanzado, Experto)'. [- (X) PUNTOS]
    //Tipo 25: Has superado un lipograma de dificultad '(Novato, Avanzado, Experto)'. [+ (X) PUNTOS]
    //Tipo 26: No has superado un lipograma de dificultad '(Novato, Avanzado, Experto)'. [- (X) PUNTOS]
    //Tipo 27: Has superado un pangrama de dificultad '(Novato, Avanzado, Experto)'. [+ (X) PUNTOS]
    //Tipo 28: No has superado un pangrama de dificultad '(Novato, Avanzado, Experto)'. [- (X) PUNTOS]
    //Tipo 29: Has superado unos palindromos de dificultad '(Novato, Avanzado, Experto)'. [+ (X) PUNTOS]
    //Tipo 30: No has superado unos palindromos de dificultad '(Novato, Avanzado, Experto)'. [- (X) PUNTOS]
    //Tipo 31: Has enviado un email de contacto a Grama.





	$sql = "SELECT * FROM historial WHERE (id_usuario = '$id_usuario') ORDER BY fecha DESC, hora DESC";

    if(!$result = $db->query($sql)){

        die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
    }


    while($row = $result->fetch_assoc()){

        $id = $row['id'];
        $tipo = $row['tipo'];
        $id_auxiliar = $row['id_auxiliar'];
        $accion = $row['accion'];
        $prefecha1 = $row['fecha'];
        $prefecha2 = date_create($prefecha1);
        $fecha = date_format($prefecha2, 'd/m/Y');
        $prehora1 = $row['hora'];
        $prehora2 = date_create($prehora1);
        $hora = date_format($prehora2, 'G:i');
        $color = $row['color'];


        $historial[] = array('tipo'=> $tipo, 'id_auxiliar'=> $id_auxiliar, 'accion'=> $accion, 'fecha'=> $fecha, 'hora'=> $hora, 'color'=> $color);

    }   
    

    if(isset($historial)) {

        $historial_final = json_encode($historial);
        echo $historial_final;

    }

    else {

        echo "vacio";
    }


     //Liberamos los recusos de la consulta
    $result->free();

	
	$db->close();

 
?>