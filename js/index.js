
//AJAX con jQuery

//LOAD:
// $(selector).load(URL,data,callback);
// Ejemplo: $("#div1").load("demo_test.txt #p1");   //Devuelve el contenido del elemento #p1 del fichero txt y lo escribe en el elemento #div1

//GET: (se suele usar para obtener datos de un fichero, pero tiene cache)
// $.get(URL,callback);

//POST: (se suele usar para enviar datos a un fichero, pero no tiene cache)
// $.post(URL,data,callback);

// Otro metodo (ejemplo):
// Se envian los datos del formulario #formdata al fichero php y se optiene la respuesta (res), que es lo que devuelve el php
// $.post("enviar.php",$("#formdata").serialize(),function(res){
//    $("#formulario").fadeOut("slow");   // Hacemos desaparecer el div "formulario" con un efecto fadeOut lento.
// });



//Funcion para las tabs
/*
$( function() {
	$("#tabs-index").tabs();
} );
*/


var id_acceso = localStorage.getItem("id_usuario");


$(document).ready(function() {

	if(id_acceso != '' && id_acceso != null) {
		//El usuario esta logueado, se redirige a la pagina principal

		window.location = "../principal/index.html";
	}
	
});


// TABS


// LOGIN
$("#item-menu-login").click(function(){

	window.location = "#contenedor-login";

	var clase = $('#item-menu-login').attr('class');

	var clase2 = $('#contenedor-login').attr('class');
	var clase3 = $('#contenedor-registro').attr('class');
	var clase4 = $('#contenedor-recuperar').attr('class');


	if(clase != "item-menu-index-activo") {

		$(".item-menu-index-activo").addClass("item-menu-index-normal");
		$(".item-menu-index-activo").removeClass("item-menu-index-activo");
		$("#item-menu-login").removeClass("item-menu-index-normal");
		$("#item-menu-login").addClass("item-menu-index-activo");
	}

	if(clase2 == "contenedor-index-oculto") {
		$("#contenedor-login").removeClass("contenedor-index-oculto");
	}

	if(clase3 != "contenedor-index-oculto") {
		$("#contenedor-registro").addClass("contenedor-index-oculto");
	}

	if(clase4 != "contenedor-index-oculto") {
		$("#contenedor-recuperar").addClass("contenedor-index-oculto");
	}

});


// REGISTRO
$("#item-menu-registro").click(function(){

	window.location = "#contenedor-registro";

	var clase = $('#item-menu-registro').attr('class');

	var clase2 = $('#contenedor-login').attr('class');
	var clase3 = $('#contenedor-registro').attr('class');
	var clase4 = $('#contenedor-recuperar').attr('class');


	if(clase != "item-menu-index-activo") {

		$(".item-menu-index-activo").addClass("item-menu-index-normal");
		$(".item-menu-index-activo").removeClass("item-menu-index-activo");
		$("#item-menu-registro").removeClass("item-menu-index-normal");
		$("#item-menu-registro").addClass("item-menu-index-activo");
	}

	if(clase2 != "contenedor-index-oculto") {
		$("#contenedor-login").addClass("contenedor-index-oculto");
	}

	if(clase3 == "contenedor-index-oculto") {
		$("#contenedor-registro").removeClass("contenedor-index-oculto");
	}

	if(clase4 != "contenedor-index-oculto") {
		$("#contenedor-recuperar").addClass("contenedor-index-oculto");
	}

});


// RECUPERAR CONTRASEÑA
$("#item-menu-recuperar").click(function(){

	window.location = "#contenedor-recuperar";

	var clase = $('#item-menu-recuperar').attr('class');

	var clase2 = $('#contenedor-login').attr('class');
	var clase3 = $('#contenedor-registro').attr('class');
	var clase4 = $('#contenedor-recuperar').attr('class');


	if(clase != "item-menu-index-activo") {

		$(".item-menu-index-activo").addClass("item-menu-index-normal");
		$(".item-menu-index-activo").removeClass("item-menu-index-activo");
		$("#item-menu-recuperar").removeClass("item-menu-index-normal");
		$("#item-menu-recuperar").addClass("item-menu-index-activo");
	}

	if(clase2 != "contenedor-index-oculto") {
		$("#contenedor-login").addClass("contenedor-index-oculto");
	}

	if(clase3 != "contenedor-index-oculto") {
		$("#contenedor-registro").addClass("contenedor-index-oculto");
	}

	if(clase4 == "contenedor-index-oculto") {
		$("#contenedor-recuperar").removeClass("contenedor-index-oculto");
	}

});












//Validacion del Login
$("#submit-login").click(function(){

	var valido = true;

	var email = $("#email-login").val();
	var password = $("#password-login").val();

	if(email == "") {
		//No se ha introducido el email
		$("#error-email-login").text("Debes introducir el email");
		$("#error-email-login").removeClass("error-oculto");
		$("#error-email-login").addClass("error");
		$("#email-login").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-email-login").removeClass("error");
		$("#error-email-login").addClass("error-oculto");
		$("#email-login").removeClass("input-warning");

		var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (expr.test(email)){
        	//El formato del email es correcto
        }

        else {
        	//El formato del email es incorrecto
            $("#error-email-login").text("El formato del email es incorrecto");
            $("#error-email-login").removeClass("error-oculto");
			$("#error-email-login").addClass("error");
			$("#email-login").addClass("input-warning");

			valido = false;
        }

	}

	if(password == "") {
		//No se ha introducido la contraseña
		$("#error-password-login").text("Debes introducir la contraseña");
		$("#error-password-login").removeClass("error-oculto");
		$("#error-password-login").addClass("error");
		$("#password-login").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-password-login").removeClass("error");
		$("#error-password-login").addClass("error-oculto");
		$("#password-login").removeClass("input-warning");
	}

	//Se intenta loguear
	login(valido);

});


//Inicio de sesion
function login(valido) {

	if(valido == true) {
		//La validacion del formulario de Login es correcta

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


	    $.ajax({

	        type: "POST",
	        url: "../php/autenticacion/login.php",
	        data: $("#form-login").serialize(),
	        success: function(data, status) {
	            //$("#respuesta").html(data); 

	            error = data.split("-");

                numero = error[0];
                cadena = error[1];


	           	if(numero == "1") {
	           		//Login correcto

	           		//Se guarda el ID del usuario
                    localStorage.setItem("id_usuario",cadena);

                    //Se redirige a la pagina principal
                    window.location = "../principal/index.html";
	            }

	            else if(numero == "2") {
	            	//El email introducido no existe en la Base de Datos

	            	$("#error-email-login").text("No existe ningún usuario con este email");
					$("#error-email-login").removeClass("error-oculto");
					$("#error-email-login").addClass("error");
					$("#email-login").addClass("input-warning");
	            }

	            else if(numero == "3") {
	            	//La contraseña introducida es incorrecta

	            	$("#error-password-login").text("La contraseña introducida es incorrecta");
					$("#error-password-login").removeClass("error-oculto");
					$("#error-password-login").addClass("error");
					$("#password-login").addClass("input-warning");
	            }

	            else if(numero == "4") {
	            	//Error de recepcion de paramatros o relacionado con la Base de Datos

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("ERROR");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	            else {
	            	//Error de Ajax o PHP

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
	            	
	            	$("#titulo-modal-error").text("ERROR");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }


	        }

	    });

	}

	return false;
}


//Validacion del Registro
$("#submit-registro").click(function(){

	var valido = true;

	var usuario = $("#usuario-registro").val();
	var email = $("#email-registro").val();
	var password = $("#password-registro").val();
	var password2 = $("#password2-registro").val();

	if(usuario == "") {
		//No se ha introducido el usuario
		$("#error-usuario-registro").text("Debes introducir el usuario");
		$("#error-usuario-registro").removeClass("error-oculto");
		$("#error-usuario-registro").addClass("error");
		$("#usuario-registro").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-usuario-registro").removeClass("error");
		$("#error-usuario-registro").addClass("error-oculto");
		$("#usuario-registro").removeClass("input-warning");
	}

	if(email == "") {
		//No se ha introducido el email
		$("#error-email-registro").text("Debes introducir el email");
		$("#error-email-registro").removeClass("error-oculto");
		$("#error-email-registro").addClass("error");
		$("#email-registro").addClass("input-warning");
		
		valido = false;
	}

	else {

		$("#error-email-registro").removeClass("error");
		$("#error-email-registro").addClass("error-oculto");
		$("#email-registro").removeClass("input-warning");

		var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (expr.test(email)){
        	//El formato del email es correcto
        }

        else {
        	//El formato del email es incorrecto
            $("#error-email-registro").text("El formato del email es incorrecto");
            $("#error-email-registro").removeClass("error-oculto");
			$("#error-email-registro").addClass("error");
			$("#email-registro").addClass("input-warning");

			valido = false;
        }

	}

	if(password == "") {
		//No se ha introducido la contraseña
		$("#error-password-registro").text("Debes introducir la contraseña");
		$("#error-password-registro").removeClass("error-oculto");
		$("#error-password-registro").addClass("error");
		$("#password-registro").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-password-registro").removeClass("error");
		$("#error-password-registro").addClass("error-oculto");
		$("#password-registro").removeClass("input-warning");
	}

	if(password2 == "") {
	/*if((password2 == "") && (password != "")) {*/
		//No se ha repetido la contraseña
		$("#error-password2-registro").text("Debes repetir la contraseña");
		$("#error-password2-registro").removeClass("error-oculto");
		$("#error-password2-registro").addClass("error");
		$("#password2-registro").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-password2-registro").removeClass("error");
		$("#error-password2-registro").addClass("error-oculto");
		$("#password2-registro").removeClass("input-warning");
	}

	if((password != "") && (password2 != "")) {

		if(password == password2) {
			//Las contraseñas coinciden
			$("#error-password2-registro").removeClass("error");
			$("#error-password2-registro").addClass("error-oculto");
			$("#password2-registro").removeClass("input-warning");
		}

		else {
			//Las contraseñas no coinciden
			$("#error-password2-registro").text("La contraseña no coincide");
			$("#error-password2-registro").removeClass("error-oculto");
			$("#error-password2-registro").addClass("error");
			$("#password2-registro").addClass("input-warning");

			valido = false;
		}
	}

	
	registro(valido);

});


//Registro
function registro(valido) {

	if(valido == true) {
		//La validacion del formulario de Registro es correcta

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


	    $.ajax({

	        type: "POST",
	        url: "../php/autenticacion/registro.php",
	        data: $("#form-registro").serialize(),
	        success: function(data, status) {
	            //$("#respuesta").html(data); 

	            error = data.split("-");

                numero = error[0];
                cadena = error[1];


	           	if(numero == "1") {
	           		//Registro correcto

	           		contenido_modal = "<p>¡Enhorabuena!<br>El registro se ha completado correctamente. <br>Ya formas parte de <strong>Grama</strong>.</p><a onclick='red_login()' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("REGISTRO COMPLETADO");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	            else if(numero == "2") {
	            	//Error de recepcion de paramatros o relacionado con la Base de Datos

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("ERROR");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	            else {
	            	//Error de Ajax o PHP

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("ERROR");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	        }

	    });

	}

	return false;
}




//Validacion de la Recuperacion de Contraseña
$("#submit-recuperar").click(function(){

	var valido = true;

	var email = $("#email-recuperar").val();

	if(email == "") {
		//No se ha introducido el email
		$("#error-email-recuperar").text("Debes introducir el email");
		$("#error-email-recuperar").removeClass("error-oculto");
		$("#error-email-recuperar").addClass("error");
		$("#email-recuperar").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-email-recuperar").removeClass("error");
		$("#error-email-recuperar").addClass("error-oculto");
		$("#email-recuperar").removeClass("input-warning");

		var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (expr.test(email)){
        	//El formato del email es correcto
        }

        else {
        	//El formato del email es incorrecto
            $("#error-email-recuperar").text("El formato del email es incorrecto");
            $("#error-email-recuperar").removeClass("error-oculto");
			$("#error-email-recuperar").addClass("error");
			$("#email-recuperar").addClass("input-warning");

			valido = false;
        }

	}


	recuperar(valido);

});



//Recuperacion de contraseña
function recuperar(valido) {

	if(valido == true) {
		//La validacion del formulario de Recuperacion de contraseña es correcta

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


	    $.ajax({

	        type: "POST",
	        url: "../php/autenticacion/procedimiento_recuperar_password.php",
	        data: $("#form-recuperar").serialize(),
	        success: function(data, status) {
	            //$("#respuesta").html(data); 

	            error = data.split("-");

                numero = error[0];
                cadena = error[1];


	            if(numero == "1") {
	           		//Procedimiento de Recuperacion de contraseña correcto

	           		contenido_modal = "<p>"+cadena+"</p><a onclick='red_login()' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("EMAIL ENVIADO");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	            else if(numero == "2") {
	            	//Error de recepcion de paramatros o relacionado con la Base de Datos

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("ERROR");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	            else if(numero == "3") {
	            	//Error en la comprobacion de datos de la Base de Datos

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("EMAIL INCORRECTO");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	            else {
	            	//Error de Ajax o PHP

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("ERROR");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }


	        }

	    });

	}

	return false;
}



//Validacion del Restablecimiento de Contraseña
$("#submit-restablecer").click(function(){

	var valido = true;

	var password = $("#password-restablecer").val();
	var password2 = $("#password2-restablecer").val();


	if(password == "") {
		//No se ha introducido la contraseña
		$("#error-password-restablecer").text("Debes introducir la contraseña");
		$("#error-password-restablecer").removeClass("error-oculto");
		$("#error-password-restablecer").addClass("error");
		$("#password-restablecer").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-password-restablecer").removeClass("error");
		$("#error-password-restablecer").addClass("error-oculto");
		$("#password-restablecer").removeClass("input-warning");
	}

	if(password2 == "") {
		//No se ha confirmado la contraseña
		$("#error-password2-restablecer").text("Debes confirmar la contraseña");
		$("#error-password2-restablecer").removeClass("error-oculto");
		$("#error-password2-restablecer").addClass("error");
		$("#password2-restablecer").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-password2-restablecer").removeClass("error");
		$("#error-password2-restablecer").addClass("error-oculto");
		$("#password2-restablecer").removeClass("input-warning");
	}

	if((password != "") && (password2 != "")) {

		if(password == password2) {
			//Las contraseñas coinciden
			$("#error-password2-restablecer").removeClass("error");
			$("#error-password2-restablecer").addClass("error-oculto");
			$("#password2-restablecer").removeClass("input-warning");
		}

		else {
			//Las contraseñas no coinciden
			$("#error-password2-restablecer").text("La contraseña no coincide");
			$("#error-password2-restablecer").removeClass("error-oculto");
			$("#error-password2-restablecer").addClass("error");
			$("#password2-restablecer").addClass("input-warning");

			valido = false;
		}
	}

	
	restablecer(valido);

});



//Restablecimiento de contraseña
function restablecer(valido) {

	if(valido == true) {
		//La validacion del formulario de Restablecimiento de contraseña es correcta

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


	    $.ajax({

	        type: "POST",
	        url: "../php/autenticacion/modificar_password.php",
	        data: $("#form-restablecer").serialize(),
	        success: function(data, status) {
	            //$("#respuesta").html(data); 

	            error = data.split("-");

                numero = error[0];
                cadena = error[1];


	            if(numero == "1") {
	           		//Procedimiento de Restablecimiento de contraseña correcto

	           		contenido_modal = "<p>"+cadena+"</p><a onclick='red_login2()' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("CONTRASEÑA RESTABLECIDA");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	            else if(numero == "2") {
	            	//Error de recepcion de paramatros o relacionado con la Base de Datos

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("ERROR");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }

	            else {
	            	//Error de Ajax o PHP

	            	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";

	            	$("#titulo-modal-error").text("ERROR");
	            	$("#contenido-modal-error").html(contenido_modal);

	            	window.location = "#modal-error";
	            }


	        }

	    });

	}

	return false;
}




function red_login() {

	//window.location = "#contenedor-login";

	window.location = "index.html";

}


function red_login2() {

	window.location = "../../entrada/index.html";

}

