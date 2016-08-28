<?php

	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

  date_default_timezone_set('Europe/Madrid');

  $id_usuario = (isset($_POST['id-usuario-editar-perfil']) ? $_POST['id-usuario-editar-perfil'] : '');
  $nombre_usuario = (isset($_POST['nombre-usuario-editar-perfil']) ? $_POST['nombre-usuario-editar-perfil'] : '');
  $email_usuario = (isset($_POST['email-usuario-editar-perfil']) ? $_POST['email-usuario-editar-perfil'] : '');
  $fecha_nacimiento_usuario = (isset($_POST['edad-usuario-editar-perfil']) ? $_POST['edad-usuario-editar-perfil'] : '0000-00-00');
  $sexo_usuario = (isset($_POST['sexo-editar-perfil']) ? $_POST['sexo-editar-perfil'] : 'O');
  $provincia_usuario = (isset($_POST['provincia-usuario-editar-perfil']) ? $_POST['provincia-usuario-editar-perfil'] : '0');
  $cita_usuario = (isset($_POST['cita-usuario-editar-perfil']) ? $_POST['cita-usuario-editar-perfil'] : '');

  $foto = "";

  if($sexo_usuario == 'H') {

    $foto = '2';
  }

  else if($sexo_usuario == 'M') {

    $foto = '3';
  }

  else {

    $foto = '1';
  }


  list($ano,$mes,$dia) = explode("-",$fecha_nacimiento_usuario);
  $ano_diferencia  = date("Y") - $ano;
  $mes_diferencia = date("m") - $mes;
  $dia_diferencia   = date("d") - $dia;

  if($dia_diferencia < 0 || $mes_diferencia < 0) {

    $ano_diferencia--;
  }

  $edad_usuario = $ano_diferencia;



	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0) {

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");


  $sql = "UPDATE usuarios SET usuario='$nombre_usuario', email='$email_usuario', fecha_nacimiento='$fecha_nacimiento_usuario', sexo='$sexo_usuario', provincia='$provincia_usuario', cita='$cita_usuario', edad='$edad_usuario', foto='$foto' WHERE id='$id_usuario'";

  if(!$result = $db->query($sql)) {

    die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
  }


  $fecha = date("Y-m-d");
  $hora = date('G:i:s');

  $sql80 = "INSERT INTO historial (tipo,id_usuario,id_auxiliar,accion,fecha,hora,color) VALUES('6','$id_usuario','0','Has editado tu perfil','$fecha','$hora','naranja');";


  if(!$result80 = $db->query($sql80)) {

      die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
  }


  echo "1-Tu perfil se ha editado correctamente.";

  //Cerramos la conexion
  $db->close();
 
?>
