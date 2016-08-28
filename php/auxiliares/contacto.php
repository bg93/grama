<?php

	//Comprobamos que se haya presionado el boton enviar
	if(isset($_POST['enviar'])){

		//Guardamos en variables los datos enviados
		$nombre = $_POST['nombre-contacto'];
		$email = $_POST['email-contacto'];
		$asunto = $_POST['asunto-contacto'];
		$mensaje = $_POST['mensaje-contacto'];
		 

		$para = "staff.grama@gmail.com";
		$titulo = "Contacto - GRAMA";

		//Este sería el cuerpo del mensaje
		$mensaje = "<table border='0' cellspacing='3' cellpadding='2'>";
		$mensaje .= "<tr><td width='30%' align='left' bgcolor='#f0efef'><strong>Nombre: </strong></td><td width='70%' align='left'>$nombre</td></tr>";
		$mensaje .= "<tr><td width='30%' align='left' bgcolor='#f0efef'><strong>E-mail: </strong></td><td width='70%' align='left'>$email</td></tr>";
		$mensaje .= "<tr><td width='30%' align='left' bgcolor='#f0efef'><strong>Asunto: </strong></td><td width='70%' align='left'>$asunto</td></tr>";
		$mensaje .= "<tr><td width='30%' align='left' bgcolor='#f0efef'><strong>Mensaje: </strong></td><td width='70%' align='left'>$mensaje</td></tr></table>";
 
		//Cabeceras del correo
		$headers = "De: $nombre <$email>\r\n";
		$headers .= "X-Mailer: PHP5\n";
		$headers .= 'MIME-Version: 1.0' . "\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n"; //

 
		//Comprobamos que los datos enviados a la función MAIL de PHP estén bien 
		if(mail($para, $titulo, $mensaje, $headers)){

			//TODO CORRECTO
		}

		else{
			
			//ERROR
		}

	}

?>