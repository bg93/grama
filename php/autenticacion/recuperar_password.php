<?php
 
	//Configuracion de la conexion a la Base de Datos
  	header('Content-Type: text/html; charset=UTF-8');
	include("../bd_acceso.php");

    date_default_timezone_set('Europe/Madrid');
 
	//Variables GET
	$token = $_GET['token'];
	$id_usuario = $_GET['id_usuario'];
 
	$db = new mysqli(host, user, pass, basedatos);

	if($db->connect_errno > 0){

    	die('2-Imposible conectarse a la BD [' . $db->connect_error . ']');
	}

	$db->query("SET NAMES 'utf8'");




	$sql = "SELECT * FROM reseteo_password WHERE token = '$token'";

	if(!$result = $db->query($sql)){
			
		die('2-Ha ocurrido un error durante la query [' . $db->error . ']');
	}

	if(mysqli_num_rows($result) > 0) {

		$datos_usuario = $result->fetch_assoc();

		$id_usuario_auxiliar = $datos_usuario['id_usuario'];


		if(sha1($id_usuario_auxiliar) == $id_usuario) {


?>




<!DOCTYPE html>

<html>

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Trabajo de Fin de Grado">
    <meta name="author" content="Brandon Mendez Martinez">

    <title>TFG</title>

    <!-- CSS del Estilo General de la pagina -->
    <link href="../../css/index.css" rel="stylesheet">
    <!-- CSS del Estilo de las Ventanas Modales de la pagina -->
    <link href="../../css/modales.css" rel="stylesheet">
    <!-- CSS de jQuery UI -->
    <link href="../../css/jQuerybase.css" rel="stylesheet">


  </head>

  <body>




    <!-- CONTENEDOR RESTABLECER PASSWORD -->
    <div id="contenedor-restablecer">

        <form id="form-restablecer" name="form-restablecer" class="form-index" action="" method="post">
          
            <div class="cabecera-index">
                <h1>RESTABLECER CONTRASEÑA</h1>
            </div>
              
            <div class="subcontenedor-index">
                <input id="password-restablecer" name="password-restablecer" type="password" class="input-index" placeholder="Nueva contraseña" required />
                <div class="icono-password-restablecer"></div>
                <div id="error-password-restablecer" class="error-oculto"></div>
                <input id="password2-restablecer" name="password2-restablecer" type="password" class="input-index aux-input" placeholder="Confirmar contraseña" required />
                <div class="icono-password2-restablecer"></div> 
                <div id="error-password2-restablecer" class="error-oculto aux-error"></div>
                <input type="hidden" id="token-restablecer" name="token-restablecer" value="<?php echo $token ?>">
                <input type="hidden" id="id-usuario-restablecer" name="id-usuario-restablecer" value="<?php echo $id_usuario ?>">
            </div>

            <div class="pie-index">
                <input id="submit-restablecer" type="button" name="submit-restablecer" value="Restablecer" class="boton" />
            </div>
          
        </form>

    </div>






    <!-- MODALES -->
    <div id="modal-error" class="modal-error">
        <div>
            <a href="#cerrar" title="Cerrar" class="cerrar-error">X</a>
            <h2 id="titulo-modal-error"></h2>
            <div id="contenido-modal-error"></div>
        </div>
    </div>



    <div class="gradiente-index"></div>


    <!-- JS de jQuery Core -->
    <script src="https://code.jquery.com/jquery-3.1.0.js" integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk=" crossorigin="anonymous"></script>
    <!-- JS de jQuery UI -->
    <script src="https://code.jquery.com/ui/1.12.0/jquery-ui.js" integrity="sha256-0YPKAwZP7Mp3ALMRVB2i8GXeEndvCq3eSl/WsAl1Ryk=" crossorigin="anonymous"></script>

    <!-- JS del Funcionamiento General de la pagina -->
    <script src="../../js/index.js"></script>


  </body>

</html>






<?php

		}

		else{

		    header('Location:../../entrada/index.html');
		}

	}
	
	else{

		header('Location:../../entrada/index.html');
	}


	$db->close();

 
?>