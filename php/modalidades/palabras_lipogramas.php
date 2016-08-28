<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');
 
	//Variables POST
	$id_usuario = (isset($_POST['id-usuario-recursos-lipogramas']) ? $_POST['id-usuario-recursos-lipogramas'] : '');
    $cadenas = (isset($_POST['cadena-recursos-lipogramas']) ? $_POST['cadena-recursos-lipogramas'] : '');
    $opcion = (isset($_POST['opcion-recursos-lipogramas']) ? $_POST['opcion-recursos-lipogramas'] : '');


    if($cadenas == '' || $cadenas == null) {

    	die('sin');
    }

    
    $cadena = explode(",", $cadenas);

    $numero_cadenas = count($cadena);

  	

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


	//Escapamos los resultados para evitar conflictos
	$id_usuario = $db->real_escape_string($id_usuario);
	$cadenas = $db->real_escape_string($cadenas);
    $opcion = $db->real_escape_string($opcion);




	$sql = "SELECT palabra FROM palabras WHERE palabra != ''";

    if($opcion == '1') {
        //No contienen las letras...

        for ($i = 0; $i < $numero_cadenas; $i++) {

            $sql .= " AND palabra NOT LIKE '%".$cadena[$i]."%'";
        }

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