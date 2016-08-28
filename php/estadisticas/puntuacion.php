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




	$total = 0;

	$total_trabalenguas = 0;
	$votos_trabalenguas = 0;
	$creaciones_trabalenguas = 0;
	$juegos_trabalenguas = 0;
	$novato_trabalenguas = 0;
	$avanzado_trabalenguas = 0;
	$experto_trabalenguas = 0;

	$votos_trabalenguas_positivo = 0;
	$creaciones_trabalenguas_positivo = 0;
	$novato_trabalenguas_positivo = 0;
	$avanzado_trabalenguas_positivo = 0;
	$experto_trabalenguas_positivo = 0;

	$votos_trabalenguas_negativo = 0;
	$creaciones_trabalenguas_negativo = 0;
	$novato_trabalenguas_negativo = 0;
	$avanzado_trabalenguas_negativo = 0;
	$experto_trabalenguas_negativo = 0;


	$total_calambures = 0;
	$votos_calambures = 0;
	$creaciones_calambures = 0;
	$juegos_calambures = 0;
	$novato_calambures = 0;
	$avanzado_calambures = 0;
	$experto_calambures = 0;

	$votos_calambures_positivo = 0;
	$creaciones_calambures_positivo = 0;
	$novato_calambures_positivo = 0;
	$avanzado_calambures_positivo = 0;
	$experto_calambures_positivo = 0;

	$votos_calambures_negativo = 0;
	$creaciones_calambures_negativo = 0;
	$novato_calambures_negativo = 0;
	$avanzado_calambures_negativo = 0;
	$experto_calambures_negativo = 0;


	$total_criptogramas = 0;
	$votos_criptogramas = 0;
	$creaciones_criptogramas = 0;
	$juegos_criptogramas = 0;
	$novato_criptogramas = 0;
	$avanzado_criptogramas = 0;
	$experto_criptogramas = 0;

	$votos_criptogramas_positivo = 0;
	$creaciones_criptogramas_positivo = 0;
	$novato_criptogramas_positivo = 0;
	$avanzado_criptogramas_positivo = 0;
	$experto_criptogramas_positivo = 0;

	$votos_criptogramas_negativo = 0;
	$creaciones_criptogramas_negativo = 0;
	$novato_criptogramas_negativo = 0;
	$avanzado_criptogramas_negativo = 0;
	$experto_criptogramas_negativo = 0;


	$total_lipogramas = 0;
	$votos_lipogramas = 0;
	$creaciones_lipogramas = 0;
	$juegos_lipogramas = 0;
	$novato_lipogramas = 0;
	$avanzado_lipogramas = 0;
	$experto_lipogramas = 0;

	$votos_lipogramas_positivo = 0;
	$creaciones_lipogramas_positivo = 0;
	$novato_lipogramas_positivo = 0;
	$avanzado_lipogramas_positivo = 0;
	$experto_lipogramas_positivo = 0;

	$votos_lipogramas_negativo = 0;
	$creaciones_lipogramas_negativo = 0;
	$novato_lipogramas_negativo = 0;
	$avanzado_lipogramas_negativo = 0;
	$experto_lipogramas_negativo = 0;


	$total_pangramas = 0;
	$votos_pangramas = 0;
	$creaciones_pangramas = 0;
	$juegos_pangramas = 0;
	$novato_pangramas = 0;
	$avanzado_pangramas = 0;
	$experto_pangramas = 0;

	$votos_pangramas_positivo = 0;
	$creaciones_pangramas_positivo = 0;
	$novato_pangramas_positivo = 0;
	$avanzado_pangramas_positivo = 0;
	$experto_pangramas_positivo = 0;

	$votos_pangramas_negativo = 0;
	$creaciones_pangramas_negativo = 0;
	$novato_pangramas_negativo = 0;
	$avanzado_pangramas_negativo = 0;
	$experto_pangramas_negativo = 0;


	$total_palindromos = 0;
	$votos_palindromos = 0;
	$creaciones_palindromos = 0;
	$juegos_palindromos = 0;
	$novato_palindromos = 0;
	$avanzado_palindromos = 0;
	$experto_palindromos = 0;

	$votos_palindromos_positivo = 0;
	$creaciones_palindromos_positivo = 0;
	$novato_palindromos_positivo = 0;
	$avanzado_palindromos_positivo = 0;
	$experto_palindromos_positivo = 0;

	$votos_palindromos_negativo = 0;
	$creaciones_palindromos_negativo = 0;
	$novato_palindromos_negativo = 0;
	$avanzado_palindromos_negativo = 0;
	$experto_palindromos_negativo = 0;




	$sql = "SELECT * FROM puntuacion WHERE (id_usuario = '$id_usuario')";

    if(!$result = $db->query($sql)){

        die('2-Ha ocurrido un error durante la query [' . $db->error . '].');
    }


    while($row = $result->fetch_assoc()){

        $id = $row['id'];
        $tipo = $row['tipo'];
        $subtipo = $row['subtipo'];
        $opcion = $row['opcion'];
        $puntos = $row['puntos'];


        if($opcion == '1') {
        	//Votos positivos

        	if($tipo == '1') {
        		//Trabalenguas

        		if($subtipo == '1') {
        			//Por votos

        			$votos_trabalenguas_positivo = $votos_trabalenguas_positivo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_trabalenguas_positivo = $creaciones_trabalenguas_positivo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_trabalenguas_positivo = $novato_trabalenguas_positivo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_trabalenguas_positivo = $avanzado_trabalenguas_positivo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_trabalenguas_positivo = $experto_trabalenguas_positivo+$puntos;

        		}


        	}



        	else if($tipo == '2') {
        		//Calambures

        		if($subtipo == '1') {
        			//Por votos

        			$votos_calambures_positivo = $votos_calambures_positivo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_calambures_positivo = $creaciones_calambures_positivo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_calambures_positivo = $novato_calambures_positivo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_calambures_positivo = $avanzado_calambures_positivo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_calambures_positivo = $experto_calambures_positivo+$puntos;

        		}


        	}



        	else if($tipo == '3') {
        		//Criptogramas

        		if($subtipo == '1') {
        			//Por votos

        			$votos_criptogramas_positivo = $votos_criptogramas_positivo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_criptogramas_positivo = $creaciones_criptogramas_positivo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_criptogramas_positivo = $novato_criptogramas_positivo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_criptogramas_positivo = $avanzado_criptogramas_positivo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_criptogramas_positivo = $experto_criptogramas_positivo+$puntos;

        		}


        	}



        	else if($tipo == '4') {
        		//Lipogramas

        		if($subtipo == '1') {
        			//Por votos

        			$votos_lipogramas_positivo = $votos_lipogramas_positivo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_lipogramas_positivo = $creaciones_lipogramas_positivo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_lipogramas_positivo = $novato_lipogramas_positivo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_lipogramas_positivo = $avanzado_lipogramas_positivo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_lipogramas_positivo = $experto_lipogramas_positivo+$puntos;

        		}


        	}



        	else if($tipo == '5') {
        		//Pangramas

        		if($subtipo == '1') {
        			//Por votos

        			$votos_pangramas_positivo = $votos_pangramas_positivo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_pangramas_positivo = $creaciones_pangramas_positivo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_pangramas_positivo = $novato_pangramas_positivo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_pangramas_positivo = $avanzado_pangramas_positivo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_pangramas_positivo = $experto_pangramas_positivo+$puntos;

        		}


        	}



        	else if($tipo == '6') {
        		//Palindromos

        		if($subtipo == '1') {
        			//Por votos

        			$votos_palindromos_positivo = $votos_palindromos_positivo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_palindromos_positivo = $creaciones_palindromos_positivo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_palindromos_positivo = $novato_palindromos_positivo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_palindromos_positivo = $avanzado_palindromos_positivo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_palindromos_positivo = $experto_palindromos_positivo+$puntos;

        		}


        	}



        }

        else {
        	//Votos negativos



        	if($tipo == '1') {
        		//Trabalenguas

        		if($subtipo == '1') {
        			//Por votos

        			$votos_trabalenguas_negativo = $votos_trabalenguas_negativo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_trabalenguas_negativo = $creaciones_trabalenguas_negativo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_trabalenguas_negativo = $novato_trabalenguas_negativo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_trabalenguas_negativo = $avanzado_trabalenguas_negativo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_trabalenguas_negativo = $experto_trabalenguas_negativo+$puntos;

        		}


        	}



        	else if($tipo == '2') {
        		//Calambures

        		if($subtipo == '1') {
        			//Por votos

        			$votos_calambures_negativo = $votos_calambures_negativo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_calambures_negativo = $creaciones_calambures_negativo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_calambures_negativo = $novato_calambures_negativo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_calambures_negativo = $avanzado_calambures_negativo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_calambures_negativo = $experto_calambures_negativo+$puntos;

        		}


        	}



        	else if($tipo == '3') {
        		//Criptogramas

        		if($subtipo == '1') {
        			//Por votos

        			$votos_criptogramas_negativo = $votos_criptogramas_negativo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_criptogramas_negativo = $creaciones_criptogramas_negativo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_criptogramas_negativo = $novato_criptogramas_negativo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_criptogramas_negativo = $avanzado_criptogramas_negativo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_criptogramas_negativo = $experto_criptogramas_negativo+$puntos;

        		}


        	}



        	else if($tipo == '4') {
        		//Lipogramas

        		if($subtipo == '1') {
        			//Por votos

        			$votos_lipogramas_negativo = $votos_lipogramas_negativo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_lipogramas_negativo = $creaciones_lipogramas_negativo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_lipogramas_negativo = $novato_lipogramas_negativo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_lipogramas_negativo = $avanzado_lipogramas_negativo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_lipogramas_negativo = $experto_lipogramas_negativo+$puntos;

        		}


        	}



        	else if($tipo == '5') {
        		//Pangramas

        		if($subtipo == '1') {
        			//Por votos

        			$votos_pangramas_negativo = $votos_pangramas_negativo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_pangramas_negativo = $creaciones_pangramas_negativo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_pangramas_negativo = $novato_pangramas_negativo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_pangramas_negativo = $avanzado_pangramas_negativo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_pangramas_negativo = $experto_pangramas_negativo+$puntos;

        		}


        	}



        	else if($tipo == '6') {
        		//Palindromos

        		if($subtipo == '1') {
        			//Por votos

        			$votos_palindromos_negativo = $votos_palindromos_negativo+$puntos;

        		}

        		else if($subtipo == '2') {
        			//Creacion

        			$creaciones_palindromos_negativo = $creaciones_palindromos_negativo+$puntos;

        		}

        		else if($subtipo == '3') {
        			//Juego: Novato

        			$novato_palindromos_negativo = $novato_palindromos_negativo+$puntos;

        		}

        		else if($subtipo == '4') {
        			//Juego: Avanzado

        			$avanzado_palindromos_negativo = $avanzado_palindromos_negativo+$puntos;

        		}

        		else if($subtipo == '5') {
        			//Juego: Experto

        			$experto_palindromos_negativo = $experto_palindromos_negativo+$puntos;

        		}


        	}


        }

    }




    //PUNTUACION TRABALENGUAS

    $votos_trabalenguas = $votos_trabalenguas_positivo-$votos_trabalenguas_negativo;

    if($votos_trabalenguas<0) {

    	$votos_trabalenguas=0;
    }

    $creaciones_trabalenguas = $creaciones_trabalenguas_positivo-$creaciones_trabalenguas_negativo;

    if($creaciones_trabalenguas<0) {

    	$creaciones_trabalenguas=0;
    }

    $novato_trabalenguas = $novato_trabalenguas_positivo-$novato_trabalenguas_negativo;

    if($novato_trabalenguas<0) {

    	$novato_trabalenguas=0;
    }

    $avanzado_trabalenguas = $avanzado_trabalenguas_positivo-$avanzado_trabalenguas_negativo;

    if($avanzado_trabalenguas<0) {

    	$avanzado_trabalenguas=0;
    }

    $experto_trabalenguas = $experto_trabalenguas_positivo-$experto_trabalenguas_negativo;

    if($experto_trabalenguas<0) {

    	$experto_trabalenguas=0;
    }

    $juegos_trabalenguas = $novato_trabalenguas+$avanzado_trabalenguas+$experto_trabalenguas;

    $total_trabalenguas = $votos_trabalenguas+$creaciones_trabalenguas+$juegos_trabalenguas;



    //PUNTUACION CALAMBURES

    $votos_calambures = $votos_calambures_positivo-$votos_calambures_negativo;

    if($votos_calambures<0) {

    	$votos_calambures=0;
    }

    $creaciones_calambures = $creaciones_calambures_positivo-$creaciones_calambures_negativo;

    if($creaciones_calambures<0) {

    	$creaciones_calambures=0;
    }

    $novato_calambures = $novato_calambures_positivo-$novato_calambures_negativo;

    if($novato_calambures<0) {

    	$novato_calambures=0;
    }

    $avanzado_calambures = $avanzado_calambures_positivo-$avanzado_calambures_negativo;

    if($avanzado_calambures<0) {

    	$avanzado_calambures=0;
    }

    $experto_calambures = $experto_calambures_positivo-$experto_calambures_negativo;

    if($experto_calambures<0) {

    	$experto_calambures=0;
    }

    $juegos_calambures = $novato_calambures+$avanzado_calambures+$experto_calambures;

    $total_calambures = $votos_calambures+$creaciones_calambures+$juegos_calambures;



    //PUNTUACION CRIPTOGRAMAS

    $votos_criptogramas = $votos_criptogramas_positivo-$votos_criptogramas_negativo;

    if($votos_criptogramas<0) {

    	$votos_criptogramas=0;
    }

    $creaciones_criptogramas = $creaciones_criptogramas_positivo-$creaciones_criptogramas_negativo;

    if($creaciones_criptogramas<0) {

    	$creaciones_criptogramas=0;
    }

    $novato_criptogramas = $novato_criptogramas_positivo-$novato_criptogramas_negativo;

    if($novato_criptogramas<0) {

    	$novato_criptogramas=0;
    }

    $avanzado_criptogramas = $avanzado_criptogramas_positivo-$avanzado_criptogramas_negativo;

    if($avanzado_criptogramas<0) {

    	$avanzado_criptogramas=0;
    }

    $experto_criptogramas = $experto_criptogramas_positivo-$experto_criptogramas_negativo;

    if($experto_criptogramas<0) {

    	$experto_criptogramas=0;
    }

    $juegos_criptogramas = $novato_criptogramas+$avanzado_criptogramas+$experto_criptogramas;

    $total_criptogramas = $votos_criptogramas+$creaciones_criptogramas+$juegos_criptogramas;



    //PUNTUACION LIPOGRAMAS

    $votos_lipogramas = $votos_lipogramas_positivo-$votos_lipogramas_negativo;

    if($votos_lipogramas<0) {

    	$votos_lipogramas=0;
    }

    $creaciones_lipogramas = $creaciones_lipogramas_positivo-$creaciones_lipogramas_negativo;

    if($creaciones_lipogramas<0) {

    	$creaciones_lipogramas=0;
    }

    $novato_lipogramas = $novato_lipogramas_positivo-$novato_lipogramas_negativo;

    if($novato_lipogramas<0) {

    	$novato_lipogramas=0;
    }

    $avanzado_lipogramas = $avanzado_lipogramas_positivo-$avanzado_lipogramas_negativo;

    if($avanzado_lipogramas<0) {

    	$avanzado_lipogramas=0;
    }

    $experto_lipogramas = $experto_lipogramas_positivo-$experto_lipogramas_negativo;

    if($experto_lipogramas<0) {

    	$experto_lipogramas=0;
    }

    $juegos_lipogramas = $novato_lipogramas+$avanzado_lipogramas+$experto_lipogramas;

    $total_lipogramas = $votos_lipogramas+$creaciones_lipogramas+$juegos_lipogramas;



    //PUNTUACION PANGRAMAS

    $votos_pangramas = $votos_pangramas_positivo-$votos_pangramas_negativo;

    if($votos_pangramas<0) {

    	$votos_pangramas=0;
    }

    $creaciones_pangramas = $creaciones_pangramas_positivo-$creaciones_pangramas_negativo;

    if($creaciones_pangramas<0) {

    	$creaciones_pangramas=0;
    }

    $novato_pangramas = $novato_pangramas_positivo-$novato_pangramas_negativo;

    if($novato_pangramas<0) {

    	$novato_pangramas=0;
    }

    $avanzado_pangramas = $avanzado_pangramas_positivo-$avanzado_pangramas_negativo;

    if($avanzado_pangramas<0) {

    	$avanzado_pangramas=0;
    }

    $experto_pangramas = $experto_pangramas_positivo-$experto_pangramas_negativo;

    if($experto_pangramas<0) {

    	$experto_pangramas=0;
    }

    $juegos_pangramas = $novato_pangramas+$avanzado_pangramas+$experto_pangramas;

    $total_pangramas = $votos_pangramas+$creaciones_pangramas+$juegos_pangramas;



    //PUNTUACION PALINDROMOS

    $votos_palindromos = $votos_palindromos_positivo-$votos_palindromos_negativo;

    if($votos_palindromos<0) {

    	$votos_palindromos=0;
    }

    $creaciones_palindromos = $creaciones_palindromos_positivo-$creaciones_palindromos_negativo;

    if($creaciones_palindromos<0) {

    	$creaciones_palindromos=0;
    }

    $novato_palindromos = $novato_palindromos_positivo-$novato_palindromos_negativo;

    if($novato_palindromos<0) {

    	$novato_palindromos=0;
    }

    $avanzado_palindromos = $avanzado_palindromos_positivo-$avanzado_palindromos_negativo;

    if($avanzado_palindromos<0) {

    	$avanzado_palindromos=0;
    }

    $experto_palindromos = $experto_palindromos_positivo-$experto_palindromos_negativo;

    if($experto_palindromos<0) {

    	$experto_palindromos=0;
    }

    $juegos_palindromos = $novato_palindromos+$avanzado_palindromos+$experto_palindromos;

    $total_palindromos = $votos_palindromos+$creaciones_palindromos+$juegos_palindromos;




    $total = $total_trabalenguas+$total_calambures+$total_criptogramas+$total_lipogramas+$total_pangramas+$total_palindromos;






    $puntuacion = array('total'=> $total, 'total_trabalenguas'=> $total_trabalenguas, 'votos_trabalenguas'=> $votos_trabalenguas, 'creaciones_trabalenguas'=> $creaciones_trabalenguas, 'juegos_trabalenguas'=> $juegos_trabalenguas, 'novato_trabalenguas'=> $novato_trabalenguas, 'avanzado_trabalenguas'=> $avanzado_trabalenguas, 'experto_trabalenguas'=> $experto_trabalenguas, 'total_calambures'=> $total_calambures, 'votos_calambures'=> $votos_calambures, 'creaciones_calambures'=> $creaciones_calambures, 'juegos_calambures'=> $juegos_calambures, 'novato_calambures'=> $novato_calambures, 'avanzado_calambures'=> $avanzado_calambures, 'experto_calambures'=> $experto_calambures, 'total_criptogramas'=> $total_criptogramas, 'votos_criptogramas'=> $votos_criptogramas, 'creaciones_criptogramas'=> $creaciones_criptogramas, 'juegos_criptogramas'=> $juegos_criptogramas, 'novato_criptogramas'=> $novato_criptogramas, 'avanzado_criptogramas'=> $avanzado_criptogramas, 'experto_criptogramas'=> $experto_criptogramas, 'total_lipogramas'=> $total_lipogramas, 'votos_lipogramas'=> $votos_lipogramas, 'creaciones_lipogramas'=> $creaciones_lipogramas, 'juegos_lipogramas'=> $juegos_lipogramas, 'novato_lipogramas'=> $novato_lipogramas, 'avanzado_lipogramas'=> $avanzado_lipogramas, 'experto_lipogramas'=> $experto_lipogramas, 'total_pangramas'=> $total_pangramas, 'votos_pangramas'=> $votos_pangramas, 'creaciones_pangramas'=> $creaciones_pangramas, 'juegos_pangramas'=> $juegos_pangramas, 'novato_pangramas'=> $novato_pangramas, 'avanzado_pangramas'=> $avanzado_pangramas, 'experto_pangramas'=> $experto_pangramas, 'total_palindromos'=> $total_palindromos, 'votos_palindromos'=> $votos_palindromos, 'creaciones_palindromos'=> $creaciones_palindromos, 'juegos_palindromos'=> $juegos_palindromos, 'novato_palindromos'=> $novato_palindromos, 'avanzado_palindromos'=> $avanzado_palindromos, 'experto_palindromos'=> $experto_palindromos);                                            

    
    if(isset($puntuacion)) {

        $puntuacion_final = json_encode($puntuacion);
        echo $puntuacion_final;

    }

    else {

        echo "vacio";
    }


     //Liberamos los recusos de la consulta
    $result->free();

	
	$db->close();

 
?>