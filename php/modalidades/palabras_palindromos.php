<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_POST['id-usuario-recursos-palindromos']) ? $_POST['id-usuario-recursos-palindromos'] : '');
    $cadena = (isset($_POST['cadena-recursos-palindromos']) ? $_POST['cadena-recursos-palindromos'] : '');
    $opcion = (isset($_POST['opcion-recursos-palindromos']) ? $_POST['opcion-recursos-palindromos'] : '');


    if($cadena == '' || $cadena == null) {

    	die('sin');
    }

    else if(strlen($cadena) == 1) {

    	die('corto');
    }
  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
	$cadena = $db->real_escape_string($cadena);
    $opcion = $db->real_escape_string($opcion);

    $inversa = strrev($cadena);

	$sql = "SELECT palabra FROM palabras";

    if($opcion == '1') {
        //Palabra que contiene cadena inversa a...

        $sql .= " WHERE palabra LIKE '%$inversa%'";
    }

    else if($opcion == '2') {
        //Contiene las letras...

        $sql .= " WHERE palabra LIKE '%$cadena%'";
    }

    else if($opcion == '3') {
        //Empieza por las letras...

        $sql .= " WHERE palabra LIKE '$cadena%'";
    }

    else if($opcion == '4') {
        //Acaban por las letras...

        $sql .= " WHERE palabra LIKE '%$cadena'";
    }

    //Si la consulta da cualquier error, se para aqui
    if(!$result = $db->query($sql)){
        die('Ha ocurrido un error durante la query [' . $db->error . '].');
    }

    while($row = $result->fetch_assoc()){

        $palabra = $row['palabra'];

        $palabras[] = array('palabra'=> $palabra);                                            

    }


    if(isset($palabras)) {

        $palabras_final = json_encode($palabras);
        echo $palabras_final;

    }

    else {

        echo "vacio";
    }


    //Liberamos los recusos de la consulta
    $result->free();


	$db->close();

 
?>