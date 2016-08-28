<?php

	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

  date_default_timezone_set('Europe/Madrid');

	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


  $sql = "SELECT * FROM provincias";

  if(!$result = $db->query($sql)) {

    die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
  }

  while($row = $result->fetch_assoc()){

    $provincia = $row['provincia'];
    $id_provincia = $row['id'];

    $array_provincias[] = array('id_provincia'=> $id_provincia, 'provincia'=> $provincia);                                            

  }


  if(isset($array_provincias)) {

    $provincias = json_encode($array_provincias);
    echo $provincias;

  }

  else {

    echo "vacio";
  }

  //Cerramos la conexion
  $db->close();
 
?>
