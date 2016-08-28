<?php

// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No se han recibido los argumentos";
	return false;
   }
	
$name = strip_tags(htmlspecialchars($_POST['name']));
$email_address = strip_tags(htmlspecialchars($_POST['email']));
$message = strip_tags(htmlspecialchars($_POST['message']));
	
// Create the email and send the message
$to = 'staff.grama@gmail.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
$email_subject = "Formulario de Contacto Web - GRAMA:  $name";
$email_body = "Nuevo formulario de contacto recibido de la página de información inicial de Grama.\n\n"."Aquí están los detalles:\n\nNombre: $name\n\nEmail: $email_address\n\nMensaje:\n$message";
$headers = "De: noreply@grama.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Responder a: $email_address";	
mail($to,$email_subject,$email_body,$headers);
return true;			
?>
