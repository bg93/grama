
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



var id_usuario = localStorage.getItem("id_usuario");
var sexo_usuario = "";

var pass_auxiliar = "";


var recognition1;
var recognizing1;
var recognition2;
var recognizing2;
var recognition3;
var recognizing3;


var array_lipogramas = [];
var array_palindromos = [];
var array_criptograma = [];
var letra_anterior_lipograma = "";
var id_palindromo_anterior = "";
var palindromo_anterior = "";
var pasada_palindromos = 0;
var numero_palindromos_correctos = 1;



$('.cropme').simpleCropper();


$(document).ready(function() {

	if(id_usuario != '' && id_usuario != null) {
		//El usuario esta logueado, puede acceder a la pagina principal
		
		$('#id-usuario-ver-amigos').val(id_usuario);
		$('#id-usuario-agregar-amigos').val(id_usuario);
		$('#id-usuario-solicitudes-amigos').val(id_usuario);
		
		cargar_provincias_editar_perfil();
		cargar_provincias_ver_amigos();
		cargar_provincias_agregar_amigos();
	    cargar_datos_ver_perfil();
	    cargar_datos_editar_perfil();
	    obtener_password();
	}

	else {
		//El usuario no esta logueado, no puede acceder a la pagina principal y se le redirige a la pagina de autenticacion

		//window.location = "../entrada/index.html";
	}
	
});



// AUXILIARES (Informacion y Contacto)

$("#enlace-informacion").click(function(){

	var clase_auxiliar = $('#popup-contacto').hasClass('ocultar-popup');

	if(clase_auxiliar == false) {
		$("#popup-contacto").addClass("ocultar-popup");
	}

	$("#popup-informacion").removeClass("ocultar-popup");

});

$("#cerrar-popup-informacion").click(function(){

	$("#popup-informacion").addClass("ocultar-popup");

});


$("#enlace-contacto").click(function(){

	var clase_auxiliar = $('#popup-informacion').hasClass('ocultar-popup');

	if(clase_auxiliar == false) {
		$("#popup-informacion").addClass("ocultar-popup");
	}

	$("#popup-contacto").removeClass("ocultar-popup");

});

$(".cerrar-popup-contacto").click(function(){

	$("#popup-contacto").addClass("ocultar-popup");

});






// MODALIDADES


function ver_publicaciones(tipo,filtro) {

	var publicaciones = "";

	$.ajax({

	    type: "POST",
	    url: "../php/modalidades/visualizar_publicaciones.php",
	    data: { tipo: tipo, filtro: filtro, id_usuario: id_usuario },
	    async: false,
	    success: function(data, status) {

	    	if(data != "vacio") {

			    var array_publicaciones = JSON.parse(data);

			    for (i = 0; i < array_publicaciones.length; i++) {

					publicaciones += "<div class='publicacion'><div class='texto-publicacion'><p>"+array_publicaciones[i].texto+"</p></div>";
					publicaciones += "<div class='info-publicacion'><p>";
					publicaciones += "<span class='dato-usuario-publicacion'><i class='fa fa-user' aria-hidden='true'></i> "+array_publicaciones[i].autor+"</span>";
					publicaciones += "<span class='dato-fecha-publicacion'><i class='fa fa-calendar' aria-hidden='true'></i> "+array_publicaciones[i].fecha+"</span>";
					publicaciones += "<span class='dato-hora-publicacion'><i class='fa fa-clock-o' aria-hidden='true'></i> "+array_publicaciones[i].hora+"</span>";
					publicaciones += "<span class='dato-juego-publicacion contenedor-estrellas'>";

					var estrellas = array_publicaciones[i].valoracion;
					var valoracion = "";

					if(estrellas == '0') {

						valoracion = "<i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i>";
					}

					else if(estrellas == '1') {

						valoracion = "<i class='con-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i>";
					}

					else if(estrellas == '2') {

						valoracion = "<i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i>";
					}

					else if(estrellas == '3') {

						valoracion = "<i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i>";
					}

					else if(estrellas == '4') {

						valoracion = "<i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i>";
					}

					else if(estrellas == '5') {

						valoracion = "<i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i><i class='con-estrella'>&#9733;</i>";
					}

					else {

						valoracion = "<i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i><i class='sin-estrella'>&#9733;</i>";
					}

					publicaciones += valoracion+"</span>";


					if(array_publicaciones[i].voto_positivo == '1') {
						//Ya he votado en positivo esta publicacion

						restar_puntos(1,array_publicaciones[i].tipo,1);
						publicaciones += "<span class='dato-positivo-publicacion voto-positivo' onclick='eliminar_voto_positivo("+array_publicaciones[i].id_publicacion+","+tipo+")'><i class='fa fa-thumbs-up' aria-hidden='true'></i> Me gusta <span class='numero-votos'>("+array_publicaciones[i].positivos+")</span></span>";
					}

					else {
						//No he votado en positivo esta publicacion

						if(array_publicaciones[i].voto_negativo != '1') {

							sumar_puntos(1,array_publicaciones[i].tipo,1);
							publicaciones += "<span class='dato-positivo-publicacion enlace-auxiliar' onclick='voto_positivo("+array_publicaciones[i].id_publicacion+","+tipo+")'><i class='fa fa-thumbs-up' aria-hidden='true'></i> Me gusta <span class='numero-votos'>("+array_publicaciones[i].positivos+")</span></span>";
						}

						else {

							sumar_puntos(1,array_publicaciones[i].tipo,1);
							publicaciones += "<span class='dato-positivo-publicacion enlace-auxiliar' onclick='voto_positivo("+array_publicaciones[i].id_publicacion+","+tipo+");eliminar_voto_negativo("+array_publicaciones[i].id_publicacion+","+tipo+");'><i class='fa fa-thumbs-up' aria-hidden='true'></i> Me gusta <span class='numero-votos'>("+array_publicaciones[i].positivos+")</span></span>";
						}

					}

					if(array_publicaciones[i].voto_negativo == '1') {
						//Ya he votado en negativo esta publicacion

						publicaciones += "<span class='dato-negativo-publicacion voto-negativo' onclick='eliminar_voto_negativo("+array_publicaciones[i].id_publicacion+","+tipo+")'><i class='fa fa-thumbs-down' aria-hidden='true'></i> No me gusta <span class='numero-votos'>("+array_publicaciones[i].negativos+")</span></span>";
					}

					else {
						//No he votado en negativo esta publicacion

						if(array_publicaciones[i].voto_positivo != '1') {

							publicaciones += "<span class='dato-negativo-publicacion enlace-auxiliar' onclick='voto_negativo("+array_publicaciones[i].id_publicacion+","+tipo+")'><i class='fa fa-thumbs-down' aria-hidden='true'></i> No me gusta <span class='numero-votos'>("+array_publicaciones[i].negativos+")</span></span>";
						}

						else {

							restar_puntos(1,array_publicaciones[i].tipo,1);
							publicaciones += "<span class='dato-negativo-publicacion enlace-auxiliar' onclick='voto_negativo("+array_publicaciones[i].id_publicacion+","+tipo+");eliminar_voto_positivo("+array_publicaciones[i].id_publicacion+","+tipo+");'><i class='fa fa-thumbs-down' aria-hidden='true'></i> No me gusta <span class='numero-votos'>("+array_publicaciones[i].negativos+")</span></span>";
						}

					}


					publicaciones += "<span class='dato-denuncia-publicacion enlace-auxiliar' onclick='denunciar_publicacion("+array_publicaciones[i].id_publicacion+")'><i class='fa fa-exclamation' aria-hidden='true'></i> Denunciar</span>";
					publicaciones += "</p></div></div>";

				}

	    	}

	    	else {

	    		publicaciones = "<p class='sin-publicaciones'>No se ha encontrado ninguna publicación de esta modalidad.</p>";
	    	}

		}

	});

	
	return publicaciones;

}


function voto_positivo(id_publicacion,tipo) {

	$.ajax({

		type: "POST",
		url: "../php/modalidades/voto_positivo.php",
		data: { id_usuario: id_usuario, id_publicacion: id_publicacion, tipo: tipo },
		success: function(data, status) {

		    var cadena = "";

		    if(tipo == '1') {

		    	cadena = "trabalenguas";
		    }

		    else if(tipo == '2') {

		    	cadena = "calambures";
		    }

		    else if(tipo == '3') {

		    	cadena = "criptogramas";
		    }

		    else if(tipo == '4') {

		    	cadena = "lipogramas";
		    }

		    else if(tipo == '5') {

		    	cadena = "pangramas";
		    }

		    else if(tipo == '6') {

		    	cadena = "palindromos";
		    }

		    var publicaciones = "";
        
			var filtro_publicaciones = $('input[type=radio][name=filtro-publicaciones-'+cadena+']:checked').val();

			publicaciones = ver_publicaciones(tipo,filtro_publicaciones);

			$("#contenedor-interior-publicaciones-"+cadena).html(publicaciones);

		}

	});

}



function eliminar_voto_positivo(id_publicacion,tipo) {

	$.ajax({

		type: "POST",
		url: "../php/modalidades/eliminar_voto_positivo.php",
		data: { id_usuario: id_usuario, id_publicacion: id_publicacion, tipo: tipo },
		success: function(data, status) {

		    var cadena = "";

		    if(tipo == '1') {

		    	cadena = "trabalenguas";
		    }

		    else if(tipo == '2') {

		    	cadena = "calambures";
		    }

		    else if(tipo == '3') {

		    	cadena = "criptogramas";
		    }

		    else if(tipo == '4') {

		    	cadena = "lipogramas";
		    }

		    else if(tipo == '5') {

		    	cadena = "pangramas";
		    }

		    else if(tipo == '6') {

		    	cadena = "palindromos";
		    }

		    var publicaciones = "";
        
			var filtro_publicaciones = $('input[type=radio][name=filtro-publicaciones-'+cadena+']:checked').val();

			publicaciones = ver_publicaciones(tipo,filtro_publicaciones);

			$("#contenedor-interior-publicaciones-"+cadena).html(publicaciones);

		}

	});

}



function voto_negativo(id_publicacion,tipo) {

	$.ajax({

		type: "POST",
		url: "../php/modalidades/voto_negativo.php",
		data: { id_usuario: id_usuario, id_publicacion: id_publicacion, tipo: tipo },
		success: function(data, status) {

		    var cadena = "";

		    if(tipo == '1') {

		    	cadena = "trabalenguas";
		    }

		    else if(tipo == '2') {

		    	cadena = "calambures";
		    }

		    else if(tipo == '3') {

		    	cadena = "criptogramas";
		    }

		    else if(tipo == '4') {

		    	cadena = "lipogramas";
		    }

		    else if(tipo == '5') {

		    	cadena = "pangramas";
		    }

		    else if(tipo == '6') {

		    	cadena = "palindromos";
		    }

		    var publicaciones = "";
        
			var filtro_publicaciones = $('input[type=radio][name=filtro-publicaciones-'+cadena+']:checked').val();

			publicaciones = ver_publicaciones(tipo,filtro_publicaciones);

			$("#contenedor-interior-publicaciones-"+cadena).html(publicaciones);

		}

	});

}



function eliminar_voto_negativo(id_publicacion,tipo) {

	$.ajax({

		type: "POST",
		url: "../php/modalidades/eliminar_voto_negativo.php",
		data: { id_usuario: id_usuario, id_publicacion: id_publicacion, tipo: tipo },
		success: function(data, status) {

		    var cadena = "";

		    if(tipo == '1') {

		    	cadena = "trabalenguas";
		    }

		    else if(tipo == '2') {

		    	cadena = "calambures";
		    }

		    else if(tipo == '3') {

		    	cadena = "criptogramas";
		    }

		    else if(tipo == '4') {

		    	cadena = "lipogramas";
		    }

		    else if(tipo == '5') {

		    	cadena = "pangramas";
		    }

		    else if(tipo == '6') {

		    	cadena = "palindromos";
		    }

		    var publicaciones = "";
        
			var filtro_publicaciones = $('input[type=radio][name=filtro-publicaciones-'+cadena+']:checked').val();

			publicaciones = ver_publicaciones(tipo,filtro_publicaciones);

			$("#contenedor-interior-publicaciones-"+cadena).html(publicaciones);

		}

	});

}




function denunciar_publicacion(id_publicacion) {

	var contenido_modal = "<p>";

	contenido_modal += "<form id='denuncia-publicacion' name='denuncia-publicacion' class='form-modificar-pass' action='' method='post'>";
	contenido_modal += "<select id='motivo-denuncia' name='motivo-denuncia' class='input-modificar-pass' required>";
	contenido_modal += "<option value='0'>MOTIVO</option>";
	contenido_modal += "<option value='1'>CONTENIDO INAPROPIADO</option>";
	contenido_modal += "<option value='2'>ERROR GRAMATICAL</option>";
	contenido_modal += "<option value='3'>ERROR SINTÁCTICO</option>";
	contenido_modal += "<option value='4'>OTRO</option>";
	contenido_modal += "</select>";
	contenido_modal += "<div id='error-motivo-denuncia' class='error-oculto'>ERROR</div>";
	contenido_modal += "<textarea id='comentario-denuncia' name='comentario-denuncia' class='input-modificar-pass' placeholder='COMENTARIO'></textarea>";
	contenido_modal += "<div class='error'></div>";
	contenido_modal += "<div class='error'></div>";
	contenido_modal += "<input type='hidden' id='id-publicacion-denuncia' name='id-publicacion-denuncia' value='"+id_publicacion+"'>";
	contenido_modal += "<input type='hidden' id='id-usuario-denuncia' name='id-usuario-denuncia' value='"+id_usuario+"'>";
	contenido_modal += "<a onclick='validacion_denuncia()' class='boton boton-modal'>ENVIAR</a>";
	contenido_modal += "</form>";

	contenido_modal += "</p>";
	        
	$("#titulo-modal-aviso").text("DENUNCIAR PUBLICACIÓN");
	$("#contenido-modal-aviso").html(contenido_modal);

	window.location = "#modal-aviso";

}



//Validacion de Denuncia de Publicacion
function validacion_denuncia() {

	var valido = true;

	var motivo_denuncia = $("#motivo-denuncia").val();


	if(motivo_denuncia == '' || motivo_denuncia == '0') {
		//No se ha seleccionado un motivo de denuncia
		$("#error-motivo-denuncia").text("Debes seleccionar un motivo");
		$("#error-motivo-denuncia").removeClass("error-oculto");
		$("#error-motivo-denuncia").addClass("error");
		$("#motivo-denuncia").addClass("input-warning");

		valido = false;
	}


	enviar_denuncia(valido);

}


function enviar_denuncia(valido) {

	if(valido == true) {


		$.ajax({

		    type: "POST",
		    url: "../php/modalidades/denuncia_publicacion.php",
		    data: $("#denuncia-publicacion").serialize(),
		    success: function(data, status) {

		    	error = data.split("-");

	            numero = error[0];
	            cadena = error[1];


		        if(numero == "1") {

		        	var contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
	        
					$("#titulo-modal-aviso").text("DENUNCIA ENVIADA");
					$("#contenido-modal-aviso").html(contenido_modal);

					window.location = "#modal-aviso";
		        }

		        else if(numero == "2") {

		        	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else {

		        	contenido_modal = "<p></p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }


			}

		});

	}

}


// TRABALENGUAS

$("#boton-ver-trabalenguas").click(function(){

	var publicaciones_auxiliar = ver_publicaciones('1','1');

	$("#modalidad-trabalenguas").removeClass("ocultar-modal-modalidad");
	$("#filtro-trabalenguas").removeClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-trabalenguas").addClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-trabalenguas").text("TRABALENGUAS PUBLICADOS");
	$("#contenedor-interior-publicaciones-trabalenguas").html(publicaciones_auxiliar);

});

$('input[type=radio][name=filtro-publicaciones-trabalenguas]').change(function() {

	var trabalenguas_publicados = "";
        
    var filtro_trabalenguas = $('input[type=radio][name=filtro-publicaciones-trabalenguas]:checked').val();

    trabalenguas_publicados = ver_publicaciones('1',filtro_trabalenguas);

    $("#contenedor-interior-publicaciones-trabalenguas").html(trabalenguas_publicados);

});


$("#boton-crear-trabalenguas").click(function(){

	var crear_trabalenguas = "<form id='creacion-trabalenguas' name='creacion-trabalenguas' class='form-creacion-publicacion' action='' method='post'>";
	crear_trabalenguas += "<div class='contenedor-texto-creacion'>";
	crear_trabalenguas += "<textarea id='texto-creacion-trabalenguas' name='texto-creacion-trabalenguas' class='texto-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ TU TRABALENGUAS'></textarea>";
	crear_trabalenguas += "<input type='hidden' id='id-usuario-creacion-trabalenguas' name='id-usuario-creacion-trabalenguas' value='"+id_usuario+"'>";
	crear_trabalenguas += "</div>";
	crear_trabalenguas += "<div class='contenedor-botones-creacion'>";
	crear_trabalenguas += "<a onclick='limpiar_trabalenguas()' class='boton-creacion'>LIMPIAR</a>";
	crear_trabalenguas += "<div id='error-creacion-trabalenguas' class='error-oculto'>ERROR</div>";
	crear_trabalenguas += "<a onclick='validacion_trabalenguas()' class='boton-creacion'>PUBLICAR</a>";
	crear_trabalenguas += "</div>";
	crear_trabalenguas += "</form>";

	crear_trabalenguas += "<div class='precontenedor-adicional-creacion'>";
	crear_trabalenguas += "<a id='enlace-recursos-trabalenguas' onclick='recursos_trabalenguas()'><i class='fa fa-cog' aria-hidden='true'></i> RECURSOS</a>";
	crear_trabalenguas += "<a id='enlace-consejos-trabalenguas' onclick='consejos_trabalenguas()'><i class='fa fa-lightbulb-o' aria-hidden='true'></i> CONSEJOS</a>";
	crear_trabalenguas += "<a id='enlace-informacion-trabalenguas' onclick='informacion_trabalenguas()'><i class='fa fa-info-circle' aria-hidden='true'></i> INFORMACIÓN</a>";
	crear_trabalenguas += "<a id='enlace-ayuda-trabalenguas' onclick='ayuda_trabalenguas()'><i class='fa fa-question-circle' aria-hidden='true'></i> AYUDA</a>";
	crear_trabalenguas += "</div>";

	crear_trabalenguas += "<div id='contenedor-adicional-trabalenguas' class='contenedor-adicional-creacion'></div>";


	$("#modalidad-trabalenguas").removeClass("ocultar-modal-modalidad");
	$("#filtro-trabalenguas").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-trabalenguas").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-trabalenguas").text("CREA UN TRABALENGUAS");
	$("#contenedor-interior-publicaciones-trabalenguas").html(crear_trabalenguas);

	recursos_trabalenguas();

});

function limpiar_trabalenguas() {

	$("#texto-creacion-trabalenguas").val("");
}


function validacion_trabalenguas() {

	var valido = true;

	var trabalenguas = $("#texto-creacion-trabalenguas").val();


	if(trabalenguas == "") {
		//El trabalenguas esta vacio
		$("#error-creacion-trabalenguas").text("Trabalenguas vacío");
		$("#error-creacion-trabalenguas").removeClass("error-oculto");
		$("#error-creacion-trabalenguas").addClass("error");
		$("#texto-creacion-trabalenguas").addClass("input-warning");

		valido = false;
	}

	publicar_trabalenguas(valido);

}


function publicar_trabalenguas(valido) {

	if(valido == true) {

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


		$.ajax({

		    type: "POST",
		    url: "../php/modalidades/publicar_trabalenguas.php",
		    data: $("#creacion-trabalenguas").serialize(),
		    success: function(data, status) {

		    	error = data.split("-");

	            numero = error[0];
	            cadena = error[1];


		        if(numero == "1") {

		        	sumar_puntos(3,1,2);

		        	contenido_modal = "<p>"+cadena+"</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("TRABALENGUAS PUBLICADO");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else if(numero == "2") {

		        	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else {

		        	contenido_modal = "<p></p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

			}

		});

	}	


}

function recursos_trabalenguas() {

	$("#enlace-recursos-trabalenguas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");

	var recursos_trabalenguas = "<div class='subcontenedor1-adicional-creacion'>";
	recursos_trabalenguas += "<form id='buscar-recursos-trabalenguas' name='buscar-recursos-trabalenguas' class='form-buscar-recursos' action='' method='post'>";
	recursos_trabalenguas += "<i class='fa fa-angle-right desplegable-recursos' aria-hidden='true'></i>";
	recursos_trabalenguas += "<select id='opcion-recursos-trabalenguas' name='opcion-recursos-trabalenguas' class=''>";
	recursos_trabalenguas += "<option value='1'>Palabras que contengan:</option>";
	recursos_trabalenguas += "<option value='2'>Palabras que empiecen por:</option>";
	recursos_trabalenguas += "<option value='3'>Palabras que terminen por:</option>";
	recursos_trabalenguas += "</select>";
	recursos_trabalenguas += "<input id='cadena-recursos-trabalenguas' name='cadena-recursos-trabalenguas' type='text' class='cadena-recursos' />";
	recursos_trabalenguas += "<input type='hidden' id='id-usuario-recursos-trabalenguas' name='id-usuario-recursos-trabalenguas' value='"+id_usuario+"'>";
	recursos_trabalenguas += "<a onclick='obtener_recursos_trabalenguas()' class='boton-recursos'>BUSCAR</a>";
	recursos_trabalenguas += "</form>";
	recursos_trabalenguas += "</div>";
	recursos_trabalenguas += "<div id='contenedor-palabras-trabalenguas' class='subcontenedor2-adicional-creacion'>";
	recursos_trabalenguas += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el trabalenguas.</p></div>";

	$("#contenedor-adicional-trabalenguas").html(recursos_trabalenguas);
}

function obtener_recursos_trabalenguas() {


	$.ajax({

	    type: "POST",
	    url: "../php/modalidades/palabras_trabalenguas.php",
	    data: $("#buscar-recursos-trabalenguas").serialize(),
	    success: function(data, status) {


	    	var contenido_palabras = "";

			
			if(data == "vacio") {

	        	contenido_palabras += "<p>No se han encontrado palabras que coincidan con las letras introducidas.</p>";

	        	$("#contenedor-palabras-trabalenguas").html(contenido_palabras);
	        }


	        else if(data == "corto") {

	        	contenido_palabras += "<p>Debes introducir dos letras como mínimo.</p>";

	        	$("#contenedor-palabras-trabalenguas").html(contenido_palabras);
	        }


	        else if(data == "sin") {

	        	contenido_palabras += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el trabalenguas.</p>";

	        	$("#contenedor-palabras-trabalenguas").html(contenido_palabras);
	        }


	        else {

	        	var array_palabras = JSON.parse(data);


	        	for (i = 0; i < array_palabras.length; i++) {

			    	contenido_palabras += "<div class='contenedor-palabra-recurso'>"+array_palabras[i].palabra+"</div>";
				}

	        	$("#contenedor-palabras-trabalenguas").html(contenido_palabras);

	        	drag_and_drop_trabalenguas();
	        }


		}

	});

}


function drag_and_drop_trabalenguas() {


  $('.contenedor-palabra-recurso').click(function() { 
    $("#texto-creacion-trabalenguas").insertAtCaret($(this).text());
    return false
  });

  $(".contenedor-palabra-recurso").draggable({helper: 'clone'});
  $(".txtDropTarget").droppable({
    accept: ".contenedor-palabra-recurso",
    drop: function(ev, ui) {
      $(this).insertAtCaret(ui.draggable.text());
    }
  });

}


function consejos_trabalenguas() {

	$("#enlace-recursos-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-trabalenguas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");

	var consejos_trabalenguas = "<div class='subcontenedor3-adicional-creacion'>";
	consejos_trabalenguas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Para que tu trabalenguas sea lo más correcto posible, puedes seguir los siguientes consejos: <br><br>";
	consejos_trabalenguas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Utiliza bastantes palabras que contengan el mismo grupo de letras seguidas o con secuencias de sonidos similares.  <br>";
	consejos_trabalenguas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Repite algunas de las palabras empleadas, con fonemas similares, a lo largo del texto. <br>";
	consejos_trabalenguas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Lee varias veces tu trabalenguas en voz alta lo más rápido posible, cuando consideres que está acabado, antes de publicarlo. Cuanto más te cueste, mayor nivel tendrá tu trabalenguas. <br><br></p>";
	consejos_trabalenguas += "</div>";

	$("#contenedor-adicional-trabalenguas").html(consejos_trabalenguas);

}


function informacion_trabalenguas() {

	$("#enlace-recursos-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-trabalenguas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");

	var informacion_trabalenguas = "<div class='subcontenedor3-adicional-creacion'>";
	informacion_trabalenguas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Los <strong>trabalenguas</strong> son oraciones o textos breves creados para que su pronunciación en voz alta sea difícil de articular. <br><br>";
	informacion_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Combinan fonemas similares y, con frecuencia, se crean con aliteraciones y rimas con dos o tres secuencias de sonidos. <br><br>";
	informacion_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Así mismo, suelen incluir palabras inexistentes que pueden ser comprendidas en el marco del texto en cuestión. <br><br>";
	informacion_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> El desafío a la hora de pronunciar un trabalenguas es hacerlo sin fallos y de manera veloz. A mayor velocidad, mayor dificultad para expresar las palabras y rimas del mismo. <br><br>";
	informacion_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Suelen utilizarse a modo de juego o como ejercicio para lograr una expresión, dicción o manera de hablar que resulte clara. <br>";
	informacion_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Es muy común que se utilicen también, junto con otro tipo de ejercicios, en grupos de teatro y en lecciones de canto, a modo de precalentamiento.</p>";
	informacion_trabalenguas += "</div>";

	$("#contenedor-adicional-trabalenguas").html(informacion_trabalenguas);

}

function ayuda_trabalenguas() {

	$("#enlace-recursos-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-trabalenguas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-trabalenguas").addClass("enlace-seleccionado-subcontenedor");

	var ayuda_trabalenguas = "<div class='subcontenedor3-adicional-creacion'>";
	ayuda_trabalenguas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Puedes crear el trabalenguas de manera libre, rellenando el campo superior dedicado a ello, o haciendo uso de los recursos ofrecidos. <br><br>";
	ayuda_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Los recursos están basados en la búsqueda de palabras que se adapten a las características deseadas de tu trabalenguas: <br><br>";
	ayuda_trabalenguas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que contengan las letras</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br>";
	ayuda_trabalenguas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que empiecen por las letras</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br>";
	ayuda_trabalenguas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que terminen por las letras</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br><br>";
	ayuda_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Se ofrecen estos recursos puesto que el trabalenguas debe combinar fonemas similares y la manera más simple de hacerlo es seleccionando distintas palabras que empiecen/terminen/contengan el mismo grupo de letras seguido, propiciando así la secuencia de sonidos deseada. <br><br>";
	ayuda_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez realizada la búsqueda, se ofrece el listado de palabras correspondiente a la misma. <br>";
	ayuda_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Estas palabras se pueden añadir al campo superior dedicado a la creación del trabalenguas pulsando sobre ellas o arrastrándolas al mismo, teniendo en cuenta que se colocarán en la última posición marcada por el puntero <i class='fa fa-i-cursor' aria-hidden='true'></i> en dicho campo. <br><br>";
	ayuda_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Si en algún momento, durante la creación del trabalenguas, decides empezar de nuevo porque no te convence el resultado, se te facilita la opción de limpiar el campo correspondiente, lo cual puede ser útil en consideración con la extensión de tu creación. <br><br>";
	ayuda_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez creado el trabalenguas, independientemente de la forma escogida, puedes publicarlo. De esta manera, tu creación pasará a ser pública y aparecerá en el listado de publicaciones de trabalenguas de la página, pudiendo acceder a ella cualquier usuario. <br><br>";
	ayuda_trabalenguas += "<i class='fa fa-angle-right' aria-hidden='true'></i> En el listado de publicaciones correspondiente puedes ver tus creaciones y eliminarlas, si así lo deseas, pero no editarlas.</p>";
	ayuda_trabalenguas += "</div>";

	$("#contenedor-adicional-trabalenguas").html(ayuda_trabalenguas);

}



function jugar_trabalenguas() {

	window.location = "#cerrar";

	var jugar_trabalenguas = "<h3 class='titulo-juego'><i class='fa fa-microphone' aria-hidden='true'></i>TRÁBATE</h3>";
	jugar_trabalenguas += "<div class='descripcion-juego'>El juego consiste en pronunciar, utilizando el micrófono de tu dispositivo, un trabalenguas propuesto aleatoriamente. <br>";
	jugar_trabalenguas += "Se dispone de temporizador, como factor adicional a superar, ajustado específicamente a cada una de las tres dificultades: </div>";

	jugar_trabalenguas += "<div class='contenedor-dificultad-juego'>";
	jugar_trabalenguas += "<div onclick='juego_trabalenguas(1)' class='boton boton-dificultad-juego'>NOVATO</div>";
	jugar_trabalenguas += "<div class='descripcion-dificultad-juego'>Trabalenguas fácil. A resolver antes de 25 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 1 PUNTO</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_trabalenguas += "</div>";

	jugar_trabalenguas += "<div class='contenedor-dificultad-juego'>";
	jugar_trabalenguas += "<div onclick='juego_trabalenguas(2)' class='boton boton-dificultad-juego'>AVANZADO</div>";
	jugar_trabalenguas += "<div class='descripcion-dificultad-juego'>Trabalenguas medio. A resolver antes de 20 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 2 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_trabalenguas += "</div>";

	jugar_trabalenguas += "<div class='contenedor-dificultad-juego'>";
	jugar_trabalenguas += "<div onclick='juego_trabalenguas(3)' class='boton boton-dificultad-juego'>EXPERTO</div>";
	jugar_trabalenguas += "<div class='descripcion-dificultad-juego'>Trabalenguas difícil. A resolver antes de 15 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 3 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_trabalenguas += "</div>";

	


	$("#modalidad-trabalenguas").removeClass("ocultar-modal-modalidad");
	$("#filtro-trabalenguas").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-trabalenguas").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-trabalenguas").text("JUEGA CON TRABALENGUAS");
	$("#contenedor-interior-publicaciones-trabalenguas").html(jugar_trabalenguas);

}



function juego_trabalenguas(dificultad) {

	window.location = "#cerrar";

	var reloj_trabalenguas = "";
	var texto_trabalenguas = "";
	var voz_trabalenguas = "";
	var contenedor_juego_trabalenguas = "";



	var contenedor_descripcion_trabalenguas = "<div class='descripcion-interior-juego'>Tienes que pulsar en el botón 'GRABAR' y pronunciar el siguiente trabalenguas. Si terminas antes de que acabe el tiempo puedes pulsar en el botón 'COMPROBAR'. Si lo completas antes de que se acabe el tiempo, habrás superado el trabalenguas. Es necesario disponer de micrófono. ¡A por ello, que el tiempo vuela!</div>";
	var contenedor_trabalenguas = "<div class='contenedor-texto-trabalenguas'>";


	$.ajax({

		type: "POST",
		url: "../php/modalidades/juego_trabalenguas.php",
		async: false,
		data: { id_usuario: id_usuario, dificultad: dificultad },
		success: function(data, status) {

			var trabalenguas = JSON.parse(data);

			texto_trabalenguas = trabalenguas.texto;

		}

	});

	contenedor_trabalenguas += texto_trabalenguas + "</div>";



	if(dificultad == '1') {

		reloj_trabalenguas = "<div id='reloj1-trabalenguas' class='reloj-juego'></div>";
		
		voz_trabalenguas = "<textarea id='texto-voz-trabalenguas1' name='texto-voz-trabalenguas1' class='texto-voz-trabalenguas' disabled></textarea>";
		voz_trabalenguas += "<div id='boton-grabar-trabalenguas1' class='boton boton-izquierda' onclick='comenzar_grabacion(1)'><i class='fa fa-microphone' aria-hidden='true'></i>GRABAR</div>";
		voz_trabalenguas += "<div class='boton boton-derecha' onclick='detener_grabacion(1)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '2') {
		
		reloj_trabalenguas = "<div id='reloj2-trabalenguas' class='reloj-juego'></div>";

		voz_trabalenguas = "<textarea id='texto-voz-trabalenguas2' name='texto-voz-trabalenguas2' class='texto-voz-trabalenguas' disabled></textarea>";
		voz_trabalenguas += "<div id='boton-grabar-trabalenguas2' class='boton boton-izquierda' onclick='comenzar_grabacion(2)'><i class='fa fa-microphone' aria-hidden='true'></i>GRABAR</div>";
		voz_trabalenguas += "<div class='boton boton-derecha' onclick='detener_grabacion(2)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '3') {
		
		reloj_trabalenguas = "<div id='reloj3-trabalenguas' class='reloj-juego'></div>";

		voz_trabalenguas = "<textarea id='texto-voz-trabalenguas3' name='texto-voz-trabalenguas3' class='texto-voz-trabalenguas' disabled></textarea>";
		voz_trabalenguas += "<div id='boton-grabar-trabalenguas3' class='boton boton-izquierda' onclick='comenzar_grabacion(3)'><i class='fa fa-microphone' aria-hidden='true'></i>GRABAR</div>";
		voz_trabalenguas += "<div class='boton boton-derecha' onclick='detener_grabacion(3)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}


	contenedor_juego_trabalenguas += contenedor_descripcion_trabalenguas+reloj_trabalenguas+contenedor_trabalenguas+voz_trabalenguas;
	

	$("#titulo-modalidad-trabalenguas").html("<i class='fa fa-arrow-left atras-juego' aria-hidden='true' onclick='jugar_trabalenguas();parar_tiempo_trabalenguas();'></i><i class='fa fa-microphone' aria-hidden='true'></i>TRÁBATE");
	$("#contenedor-interior-publicaciones-trabalenguas").html(contenedor_juego_trabalenguas);

	reloj_juego_trabalenguas(dificultad);
	voz_juego_trabalenguas(dificultad);
}


function parar_tiempo_trabalenguas() {

	$("#reloj1-trabalenguas").countdown360({}).stop();
	$("#reloj2-trabalenguas").countdown360({}).stop();
	$("#reloj3-trabalenguas").countdown360({}).stop();
}



function reloj_juego_trabalenguas(dificultad) {

	var tiempo = 0;
	var reloj = "";
	var texto_trabalenguas = $(".contenedor-texto-trabalenguas").text();
	var voz_trabalenguas = "";


	if(dificultad == '1') {

		tiempo = 25;
		reloj = "#reloj1-trabalenguas";
	}

	else if(dificultad == '2') {

		tiempo = 20;
		reloj = "#reloj2-trabalenguas";
	}

	else if(dificultad == '3') {

		tiempo = 15;
		reloj = "#reloj3-trabalenguas";
	}


	$(reloj).countdown360({
		radius      : 30,
		seconds     : tiempo,
		fontColor   : '#FFFFFF',
		fillStyle   : '#56c2e1', 
		strokeStyle : '#3f9db8',
		strokeWidth : 5,
		autostart   : false,
		fontSize    : 22,
		fontWeight  : 300,  
		onComplete  : function () {



			if(dificultad == '1') {

				voz_trabalenguas = $(".texto-voz-trabalenguas1").val();
			}

			else if(dificultad == '2') {

				voz_trabalenguas = $(".texto-voz-trabalenguas2").val();
			}

			else if(dificultad == '3') {

				voz_trabalenguas = $(".texto-voz-trabalenguas3").val();
			}





			var contenido_modal = "";
			var titulo_modal = "";

			if(texto_trabalenguas == voz_trabalenguas) {

				titulo_modal = "TRABALENGUAS SUPERADO";

				if(dificultad == '1') {

					recognition1.stop();

					sumar_puntos(1,1,3);
					historial_juegos(1,1,1,19);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_trabalenguas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else if(dificultad == '2') {

					recognition2.stop();

					sumar_puntos(2,1,4);
					historial_juegos(2,1,2,19);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_trabalenguas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else if(dificultad == '3') {

					recognition3.stop();

					sumar_puntos(3,1,5);
					historial_juegos(3,1,3,19);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_trabalenguas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

		        $("#titulo-modal-aviso").text(titulo_modal);
		        $("#contenido-modal-aviso").html(contenido_modal);

		        window.location = "#modal-aviso";

			}

			else {

				titulo_modal = "TRABALENGUAS NO SUPERADO";

				if(dificultad == '1') {

					recognition1.stop();

					restar_puntos(1,1,3);
					historial_juegos(1,1,1,20);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else if(dificultad == '2') {

					recognition2.stop();

					restar_puntos(1,1,4);
					historial_juegos(1,1,2,20);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else if(dificultad == '3') {

					recognition3.stop();

					restar_puntos(1,1,5);
					historial_juegos(1,1,3,20);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}
				
				$("#titulo-modal-aviso").text(titulo_modal);
		        $("#contenido-modal-aviso").html(contenido_modal);

		        window.location = "#modal-aviso";
			}


			$(reloj).countdown360({}).stop();

		}
	}).start()

}


function voz_juego_trabalenguas(dificultad) {

	var contenido_modal = "";
	var titulo_modal = "";
	var reloj = "";
	var texto_trabalenguas = $(".contenedor-texto-trabalenguas").text();
	var voz_trabalenguas = "";


	if(dificultad == '1') {

		reloj = "#reloj1-trabalenguas";

		recognizing1 = false;

		if (!('webkitSpeechRecognition' in window)) {
			alert("¡API no soportada!");
		} else {

			recognition1 = new webkitSpeechRecognition();
			recognition1.lang = "es-VE";
			recognition1.continuous = true;
			recognition1.interimResults = true;

			recognition1.onstart = function() {
				recognizing1 = true;
				//console.log("empezando a escuchar");
			}

			recognition1.onresult = function(event) {

			 for (var i = event.resultIndex; i < event.results.length; i++) {
				if(event.results[i].isFinal)
					document.getElementById("texto-voz-trabalenguas1").value += event.results[i][0].transcript;
			    }
				
				//texto
			}

			recognition1.onerror = function(event) {

				$(reloj).countdown360({}).stop();

				titulo_modal = "ERROR";
			    contenido_modal = "<p>Ha ocurrido un error.</p><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
					
			    $("#titulo-modal-aviso").text(titulo_modal);
			    $("#contenido-modal-aviso").html(contenido_modal);

			    window.location = "#modal-aviso";

			}

			recognition1.onend = function() {
				recognizing1 = false;
				//document.getElementById("procesar").innerHTML = "Escuchar";
				//console.log("terminó de escuchar, llegó a su fin");

				$(reloj).countdown360({}).stop();

				if(texto_trabalenguas == voz_trabalenguas) {

					sumar_puntos(1,1,3);
					historial_juegos(1,1,1,19);
					titulo_modal = "TRABALENGUAS SUPERADO";
			        contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTOS</div><a onclick='juego_trabalenguas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
			        $("#titulo-modal-aviso").text(titulo_modal);
			        $("#contenido-modal-aviso").html(contenido_modal);

			        window.location = "#modal-aviso";

				}

				else {

					restar_puntos(1,1,3);
					historial_juegos(1,1,1,20);
					titulo_modal = "TRABALENGUAS NO SUPERADO";
					contenido_modal = "<p>No has pronunciado el trabalenguas correctamente.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
					
					$("#titulo-modal-aviso").text(titulo_modal);
			        $("#contenido-modal-aviso").html(contenido_modal);

			        window.location = "#modal-aviso";
				}

			}

		}


	}


	else if(dificultad == '2') {

		reloj = "#reloj2-trabalenguas";

		recognizing2 = false;

		if (!('webkitSpeechRecognition' in window)) {
			alert("¡API no soportada!");
		} else {

			recognition2 = new webkitSpeechRecognition();
			recognition2.lang = "es-VE";
			recognition2.continuous = true;
			recognition2.interimResults = true;

			recognition2.onstart = function() {
				recognizing2 = true;
				//console.log("empezando a escuchar");
			}

			recognition2.onresult = function(event) {

			 for (var i = event.resultIndex; i < event.results.length; i++) {
				if(event.results[i].isFinal)
					document.getElementById("texto-voz-trabalenguas2").value += event.results[i][0].transcript;
			    }
				
				//texto
			}

			recognition2.onerror = function(event) {

				$(reloj).countdown360({}).stop();

				titulo_modal = "ERROR";
			    contenido_modal = "<p>Ha ocurrido un error.</p><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
					
			    $("#titulo-modal-aviso").text(titulo_modal);
			    $("#contenido-modal-aviso").html(contenido_modal);

			    window.location = "#modal-aviso";
			}

			recognition2.onend = function() {
				recognizing2 = false;
				//document.getElementById("procesar").innerHTML = "Escuchar";
				//console.log("terminó de escuchar, llegó a su fin");

				$(reloj).countdown360({}).stop();

				if(texto_trabalenguas == voz_trabalenguas) {

					sumar_puntos(2,1,4);
					historial_juegos(2,1,2,19);
					titulo_modal = "TRABALENGUAS SUPERADO";
			        contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_trabalenguas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
			        $("#titulo-modal-aviso").text(titulo_modal);
			        $("#contenido-modal-aviso").html(contenido_modal);

			        window.location = "#modal-aviso";

				}

				else {

					restar_puntos(1,1,4);
					historial_juegos(1,1,2,20);
					titulo_modal = "TRABALENGUAS NO SUPERADO";
					contenido_modal = "<p>No has pronunciado el trabalenguas correctamente.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
					
					$("#titulo-modal-aviso").text(titulo_modal);
			        $("#contenido-modal-aviso").html(contenido_modal);

			        window.location = "#modal-aviso";
				}

			}

		}


	}


	if(dificultad == '3') {

		reloj = "#reloj3-trabalenguas";

		recognizing3 = false;

		if (!('webkitSpeechRecognition' in window)) {
			alert("¡API no soportada!");
		} else {

			recognition3 = new webkitSpeechRecognition();
			recognition3.lang = "es-VE";
			recognition3.continuous = true;
			recognition3.interimResults = true;

			recognition3.onstart = function() {
				recognizing3 = true;
				//console.log("empezando a escuchar");
			}

			recognition3.onresult = function(event) {

			 for (var i = event.resultIndex; i < event.results.length; i++) {
				if(event.results[i].isFinal)
					document.getElementById("texto-voz-trabalenguas3").value += event.results[i][0].transcript;
			    }
				
				//texto
			}

			recognition3.onerror = function(event) {

				$(reloj).countdown360({}).stop();

				titulo_modal = "ERROR";
			    contenido_modal = "<p>Ha ocurrido un error.</p><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
					
			    $("#titulo-modal-aviso").text(titulo_modal);
			    $("#contenido-modal-aviso").html(contenido_modal);

			    window.location = "#modal-aviso";
			}

			recognition3.onend = function() {
				recognizing3 = false;
				//document.getElementById("procesar").innerHTML = "Escuchar";
				//console.log("terminó de escuchar, llegó a su fin");

				$(reloj).countdown360({}).stop();

				if(texto_trabalenguas == voz_trabalenguas) {

					sumar_puntos(3,1,5);
					historial_juegos(3,1,3,19);
					titulo_modal = "TRABALENGUAS SUPERADO";
			        contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_trabalenguas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
			        $("#titulo-modal-aviso").text(titulo_modal);
			        $("#contenido-modal-aviso").html(contenido_modal);

			        window.location = "#modal-aviso";

				}

				else {

					restar_puntos(1,1,5);
					historial_juegos(1,1,3,20);
					titulo_modal = "TRABALENGUAS NO SUPERADO";
					contenido_modal = "<p>No has pronunciado el trabalenguas correctamente.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
					
					$("#titulo-modal-aviso").text(titulo_modal);
			        $("#contenido-modal-aviso").html(contenido_modal);

			        window.location = "#modal-aviso";
				}


			}

		}


	}


}

function comenzar_grabacion(dificultad) {

	if(dificultad == '1') {

		//if (recognizing1 == false) {
			recognition1.start();
			//recognizing1 = true;
			//$("#boton-grabar-trabalenguas1").html("<i class='fa fa-microphone-slash' aria-hidden='true'></i>DETENER");
			
		//} 

		//else {
			//recognition1.stop();
			//recognizing1 = false;
			//$("#boton-grabar-trabalenguas1").html("<i class='fa fa-microphone' aria-hidden='true'></i>GRABAR");
		//}

	}

	else if(dificultad == '2') {

		recognition2.start();


	}

	else if(dificultad == '3') {

		recognition3.start();

	}

}


function detener_grabacion(dificultad) {

	var reloj = "";
	var texto_trabalenguas = $(".contenedor-texto-trabalenguas").text();
	var voz_trabalenguas = "";


	if(dificultad == '1') {

		reloj = "#reloj1-trabalenguas";

		recognition1.stop();

		if(texto_trabalenguas == voz_trabalenguas) {

			sumar_puntos(1,1,3);
			historial_juegos(1,1,1,19);
			titulo_modal = "TRABALENGUAS SUPERADO";
			contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_trabalenguas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
			$("#titulo-modal-aviso").text(titulo_modal);
			$("#contenido-modal-aviso").html(contenido_modal);

			    window.location = "#modal-aviso";

			}

		else {

			restar_puntos(1,1,3);
			historial_juegos(1,1,1,20);
			titulo_modal = "TRABALENGUAS NO SUPERADO";
			contenido_modal = "<p>No has pronunciado el trabalenguas correctamente.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
					
			$("#titulo-modal-aviso").text(titulo_modal);
			$("#contenido-modal-aviso").html(contenido_modal);

			window.location = "#modal-aviso";
		}

	}

	else if(dificultad == '2') {

		reloj = "#reloj2-trabalenguas";

		recognition2.stop();

		if(texto_trabalenguas == voz_trabalenguas) {

			sumar_puntos(2,1,4);
			historial_juegos(2,1,2,19);
			titulo_modal = "TRABALENGUAS SUPERADO";
			contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_trabalenguas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
			$("#titulo-modal-aviso").text(titulo_modal);
			$("#contenido-modal-aviso").html(contenido_modal);

			    window.location = "#modal-aviso";

			}

		else {

			restar_puntos(1,1,4);
			historial_juegos(1,1,2,20);
			titulo_modal = "TRABALENGUAS NO SUPERADO";
			contenido_modal = "<p>No has pronunciado el trabalenguas correctamente.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
					
			$("#titulo-modal-aviso").text(titulo_modal);
			$("#contenido-modal-aviso").html(contenido_modal);

			window.location = "#modal-aviso";
		}

	}

	else if(dificultad == '3') {

		reloj = "#reloj3-trabalenguas";

		recognition3.stop();

		if(texto_trabalenguas == voz_trabalenguas) {

			sumar_puntos(3,1,5);
			historial_juegos(3,1,3,19);
			titulo_modal = "TRABALENGUAS SUPERADO";
			contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_trabalenguas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
			$("#titulo-modal-aviso").text(titulo_modal);
			$("#contenido-modal-aviso").html(contenido_modal);

			    window.location = "#modal-aviso";

			}

		else {

			restar_puntos(1,1,5);
			historial_juegos(1,1,3,20);
			titulo_modal = "TRABALENGUAS NO SUPERADO";
			contenido_modal = "<p>No has pronunciado el trabalenguas correctamente.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_trabalenguas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_trabalenguas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
					
					
			$("#titulo-modal-aviso").text(titulo_modal);
			$("#contenido-modal-aviso").html(contenido_modal);

			window.location = "#modal-aviso";
		}

	}

	$(reloj).countdown360({}).stop();

}




$("#cerrar-modalidad-trabalenguas").click(function(){

	$("#modalidad-trabalenguas").addClass("ocultar-modal-modalidad");

});


// CALAMBURES

$("#boton-ver-calambures").click(function(){

	var publicaciones_auxiliar = ver_publicaciones('2','1');

	$("#modalidad-calambures").removeClass("ocultar-modal-modalidad");
	$("#filtro-calambures").removeClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-calambures").addClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-calambures").text("CALAMBURES PUBLICADOS");
	$("#contenedor-interior-publicaciones-calambures").html(publicaciones_auxiliar);

});


$('input[type=radio][name=filtro-publicaciones-calambures]').change(function() {

	var calambures_publicados = "";
        
    var filtro_calambures = $('input[type=radio][name=filtro-publicaciones-calambures]:checked').val();

    calambures_publicados = ver_publicaciones('2',filtro_calambures);

    $("#contenedor-interior-publicaciones-calambures").html(calambures_publicados);

});

$("#boton-crear-calambures").click(function(){


	var crear_calambures = "<form id='creacion-calambures' name='creacion-calambures' class='form-creacion-publicacion' action='' method='post'>";
	crear_calambures += "<div class='contenedor-texto-creacion'>";
	crear_calambures += "<input type='text' id='texto1-creacion-calambures' name='texto1-creacion-calambures' class='texto1-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ EL PRIMER SENTIDO DE TU CALAMBUR'>";
	crear_calambures += "<input type='text' id='texto2-creacion-calambures' name='texto2-creacion-calambures' class='texto2-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ EL SEGUNDO SENTIDO DE TU CALAMBUR'>";
	crear_calambures += "<input type='hidden' id='id-usuario-creacion-calambures' name='id-usuario-creacion-calambures' value='"+id_usuario+"'>";
	crear_calambures += "</div>";
	crear_calambures += "<div class='contenedor-botones-creacion'>";
	crear_calambures += "<a onclick='limpiar_calambures()' class='boton-creacion'>LIMPIAR</a>";
	crear_calambures += "<div id='error-creacion-calambures' class='error-oculto'>ERROR</div>";
	crear_calambures += "<a onclick='validacion_calambures()' class='boton-creacion'>PUBLICAR</a>";
	crear_calambures += "</div>";
	crear_calambures += "</form>";

	crear_calambures += "<div class='precontenedor-adicional-creacion'>";
	crear_calambures += "<a id='enlace-recursos-calambures' onclick='recursos_calambures()'><i class='fa fa-cog' aria-hidden='true'></i> RECURSOS</a>";
	crear_calambures += "<a id='enlace-consejos-calambures' onclick='consejos_calambures()'><i class='fa fa-lightbulb-o' aria-hidden='true'></i> CONSEJOS</a>";
	crear_calambures += "<a id='enlace-informacion-calambures' onclick='informacion_calambures()'><i class='fa fa-info-circle' aria-hidden='true'></i> INFORMACIÓN</a>";
	crear_calambures += "<a id='enlace-ayuda-calambures' onclick='ayuda_calambures()'><i class='fa fa-question-circle' aria-hidden='true'></i> AYUDA</a>";
	crear_calambures += "</div>";

	crear_calambures += "<div id='contenedor-adicional-calambures' class='contenedor-adicional-creacion'></div>";


	$("#modalidad-calambures").removeClass("ocultar-modal-modalidad");
	$("#filtro-calambures").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-calambures").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-calambures").text("CREA UN CALAMBUR");
	$("#contenedor-interior-publicaciones-calambures").html(crear_calambures);

	recursos_calambures();

});



function limpiar_calambures() {

	$("#texto1-creacion-calambures").val("");
	$("#texto2-creacion-calambures").val("");
}


function validacion_calambures() {

	var valido = true;

	var calambur1 = $("#texto1-creacion-calambures").val();
	var calambur2 = $("#texto2-creacion-calambures").val();


	if(calambur1 == "" && calambur2 == "") {
		//El calambur esta vacio
		$("#error-creacion-calambures").text("Calambur vacío");
		$("#error-creacion-calambures").removeClass("error-oculto");
		$("#error-creacion-calambures").addClass("error");
		$("#texto1-creacion-calambures").addClass("input-warning");
		$("#texto2-creacion-calambures").addClass("input-warning");

		valido = false;
	}

	else if(calambur1 == "") {
		//El calambur esta incompleto
		$("#error-creacion-calambures").text("Calambur incompleto");
		$("#error-creacion-calambures").removeClass("error-oculto");
		$("#error-creacion-calambures").addClass("error");
		$("#texto1-creacion-calambures").addClass("input-warning");

		valido = false;
	}

	else if(calambur2 == "") {
		//El calambur esta incompleto
		$("#error-creacion-calambures").text("Calambur incompleto");
		$("#error-creacion-calambures").removeClass("error-oculto");
		$("#error-creacion-calambures").addClass("error");
		$("#texto2-creacion-calambures").addClass("input-warning");

		valido = false;
	}

	publicar_calambures(valido);

}


function publicar_calambures(valido) {

	if(valido == true) {

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


		$.ajax({

		    type: "POST",
		    url: "../php/modalidades/publicar_calambures.php",
		    data: $("#creacion-calambures").serialize(),
		    success: function(data, status) {

		    	error = data.split("-");

	            numero = error[0];
	            cadena = error[1];


		        if(numero == "1") {

		        	sumar_puntos(3,2,2);

		        	contenido_modal = "<p>"+cadena+"</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("CALAMBUR PUBLICADO");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else if(numero == "2") {

		        	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else {

		        	contenido_modal = "<p></p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

			}

		});

	}	


}

function recursos_calambures() {

	$("#enlace-recursos-calambures").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-calambures").removeClass("enlace-seleccionado-subcontenedor");

	var recursos_calambures = "<div class='subcontenedor1-adicional-creacion'>";
	recursos_calambures += "<form id='buscar-recursos-calambures' name='buscar-recursos-calambures' class='form-buscar-recursos' action='' method='post'>";
	recursos_calambures += "<i class='fa fa-angle-right desplegable-recursos' aria-hidden='true'></i>";
	recursos_calambures += "<select id='opcion-recursos-calambures' name='opcion-recursos-calambures' class=''>";
	recursos_calambures += "<option value='1'>Palabras que empiecen por:</option>";
	recursos_calambures += "<option value='2'>Palabras que terminen por:</option>";
	recursos_calambures += "</select>";
	recursos_calambures += "<input id='cadena-recursos-calambures' name='cadena-recursos-calambures' type='text' class='cadena-recursos' />";
	recursos_calambures += "<input type='hidden' id='id-usuario-recursos-calambures' name='id-usuario-recursos-calambures' value='"+id_usuario+"'>";
	recursos_calambures += "<a onclick='obtener_recursos_calambures()' class='boton-recursos'>BUSCAR</a>";
	recursos_calambures += "</form>";
	recursos_calambures += "</div>";
	recursos_calambures += "<div id='contenedor-palabras-calambures' class='subcontenedor2-adicional-creacion'>";
	recursos_calambures += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el calambur.</p></div>";

	$("#contenedor-adicional-calambures").html(recursos_calambures);
}


function obtener_recursos_calambures() {


	$.ajax({

	    type: "POST",
	    url: "../php/modalidades/palabras_calambures.php",
	    data: $("#buscar-recursos-calambures").serialize(),
	    success: function(data, status) {


	    	var contenido_palabras = "";

			
			if(data == "vacio") {

	        	contenido_palabras += "<p>No se han encontrado palabras que coincidan con las letras introducidas.</p>";

	        	$("#contenedor-palabras-calambures").html(contenido_palabras);
	        }


	        else if(data == "corto") {

	        	contenido_palabras += "<p>Debes introducir dos letras como mínimo.</p>";

	        	$("#contenedor-palabras-calambures").html(contenido_palabras);
	        }


	        else if(data == "sin") {

	        	contenido_palabras += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el calambur.</p>";

	        	$("#contenedor-palabras-calambures").html(contenido_palabras);
	        }


	        else {

	        	var array_palabras = JSON.parse(data);


	        	for (i = 0; i < array_palabras.length; i++) {

			    	contenido_palabras += "<div class='contenedor-palabra-recurso'>"+array_palabras[i].palabra+"</div>";
				}

	        	$("#contenedor-palabras-calambures").html(contenido_palabras);

	        	drag_and_drop_calambures();
	        }


		}

	});

}




function drag_and_drop_calambures() {


  $('.contenedor-palabra-recurso').click(function() { 
    $("#texto2-creacion-calambures").insertAtCaret($(this).text());
    return false
  });

  $(".contenedor-palabra-recurso").draggable({helper: 'clone'});
  $(".txtDropTarget").droppable({
    accept: ".contenedor-palabra-recurso",
    drop: function(ev, ui) {
      $(this).insertAtCaret(ui.draggable.text());
    }
  });

}


function consejos_calambures() {

	$("#enlace-recursos-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-calambures").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-calambures").removeClass("enlace-seleccionado-subcontenedor");

	var consejos_calambures = "<div class='subcontenedor3-adicional-creacion'>";
	consejos_calambures += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Para que tu calambur sea lo más correcto posible, puedes seguir los siguientes consejos: <br><br>";
	consejos_calambures += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Utiliza bastantes palabras polisílabas, para descomponerlas después y poder formar nuevas palabras a partir de ellas.  <br>";
	consejos_calambures += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Emplea monosílabos y conjunciones, de manera auxiliar, puesto que aportan cohesión al texto y facilitan la tarea. <br>";
	consejos_calambures += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Lee tu calambur y asegúrate de que está bien cohesionado y es coherente, cuando consideres que está acabado, antes de publicarlo. <br><br></p>";
	consejos_calambures += "</div>";

	$("#contenedor-adicional-calambures").html(consejos_calambures);

}


function informacion_calambures() {

	$("#enlace-recursos-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-calambures").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-calambures").removeClass("enlace-seleccionado-subcontenedor");

	var informacion_calambures = "<div class='subcontenedor3-adicional-creacion'>";
	informacion_calambures += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Los <strong>calambures</strong> son oraciones o textos breves formados por la unión de las sílabas de dos o más palabras contiguas, variando el lugar habitual de separación entre ellas, con el fin de obtener un significado distinto al que tienen en su posición normal. <br>";
	informacion_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Es decir, consisten en modificar el significado literal de una palabra o frase agrupando de distintas formas sus sílabas. <br><br>";
	informacion_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Para conseguir su objetivo se basan en la <u>homonimia</u> (palabras que suenan igual pero que tienen distinto significado), en la <u>paronimia</u> (palabras con sonido parecido pero que se escriben de manera diferente y significan cosas distintas) y en la <u>polisemia</u> (palabras con varios significados). <br><br>";
	informacion_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Puesto que no dejan de ser juegos de palabras, se utilizan frecuentemente para la creación de pequeñas adivinanzas o acertijos para niños.</p>";
	informacion_calambures += "</div>";

	$("#contenedor-adicional-calambures").html(informacion_calambures);

}

function ayuda_calambures() {

	$("#enlace-recursos-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-calambures").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-calambures").addClass("enlace-seleccionado-subcontenedor");

	var ayuda_calambures = "<div class='subcontenedor3-adicional-creacion'>";
	ayuda_calambures += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Puedes crear el calambur de manera libre, rellenando los dos campos superiores dedicados a ello, o haciendo uso de los recursos ofrecidos. <br><br>";
	ayuda_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Los recursos están basados en la búsqueda de palabras que se adapten a las características deseadas de tu calambur: <br><br>";
	ayuda_calambures += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que empiecen por las letras</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br>";
	ayuda_calambures += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que terminen por las letras</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br><br>";
	ayuda_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Se ofrecen estos recursos puesto que el calambur pretende jugar con las combinaciones de las primeras y últimas sílabas de las palabras, con el fin de obtener significados distintos. <br><br>";
	ayuda_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez realizada la búsqueda, se ofrece el listado de palabras correspondiente a la misma. <br>";
	ayuda_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Estas palabras se pueden añadir a cualquiera de los dos campos superiores dedicados a la creación del calambur pulsando sobre ellas o arrastrándolas, teniendo en cuenta que se colocarán en la última posición marcada por el puntero <i class='fa fa-i-cursor' aria-hidden='true'></i> en el campo correspondiente. <br><br>";
	ayuda_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Si en algún momento, durante la creación del calambur, decides empezar de nuevo porque no te convence el resultado, se te facilita la opción de limpiar los campos correspondiente, lo cual puede ser útil en consideración con la extensión de tu creación. <br><br>";
	ayuda_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez creado el calambur, independientemente de la forma escogida, puedes publicarlo. De esta manera, tu creación pasará a ser pública y aparecerá en el listado de publicaciones de calambures de la página, pudiendo acceder a ella cualquier usuario. <br><br>";
	ayuda_calambures += "<i class='fa fa-angle-right' aria-hidden='true'></i> En el listado de publicaciones correspondiente puedes ver tus creaciones y eliminarlas, si así lo deseas, pero no editarlas.</p>";
	ayuda_calambures += "</div>";

	$("#contenedor-adicional-calambures").html(ayuda_calambures);

}



function jugar_calambures() {

	window.location = "#cerrar";

	var jugar_calambures = "<h3 class='titulo-juego'><i class='fa fa-th-list' aria-hidden='true'></i>COMPLETA</h3>";
	jugar_calambures += "<div class='descripcion-juego'>El juego consiste en completar, empleando palabras de una lista propuesta, un calambur asignado aleatoriamente. <br>";
	jugar_calambures += "Se dispone de temporizador, como factor adicional a superar, ajustado específicamente a cada una de las tres dificultades: </div>";

	jugar_calambures += "<div class='contenedor-dificultad-juego'>";
	jugar_calambures += "<div onclick='juego_calambures(1)' class='boton boton-dificultad-juego'>NOVATO</div>";
	jugar_calambures += "<div class='descripcion-dificultad-juego'>Calambur fácil. Aparecen 6 palabras. A resolver antes de 25 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 1 PUNTO</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_calambures += "</div>";

	jugar_calambures += "<div class='contenedor-dificultad-juego'>";
	jugar_calambures += "<div onclick='juego_calambures(2)' class='boton boton-dificultad-juego'>AVANZADO</div>";
	jugar_calambures += "<div class='descripcion-dificultad-juego'>Calambur medio. Aparecen 10 palabras. A resolver antes de 20 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 2 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_calambures += "</div>";

	jugar_calambures += "<div class='contenedor-dificultad-juego'>";
	jugar_calambures += "<div onclick='juego_calambures(3)' class='boton boton-dificultad-juego'>EXPERTO</div>";
	jugar_calambures += "<div class='descripcion-dificultad-juego'>Calambur difícil. Aparecen 14 palabras. A resolver antes de 15 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 3 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_calambures += "</div>";


	$("#modalidad-calambures").removeClass("ocultar-modal-modalidad");
	$("#filtro-calambures").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-calambures").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-calambures").text("JUEGA CON CALAMBURES");
	$("#contenedor-interior-publicaciones-calambures").html(jugar_calambures);

}


function juego_calambures(dificultad) {

	window.location = "#cerrar";

	var reloj_calambur = "";
	var texto1_calambur = "";
	var texto2_calambur = "";
	var texto3_calambur = "";
	var palabras1_calambur = "";
	var palabras2_calambur = "";
	var palabras3_calambur = "";
	var palabras_correctas_calambur = "";
	var contenedor_juego_calambur = "";
	var boton_calambur = "";



	var contenedor_descripcion_calambur = "<div class='descripcion-interior-juego'>Tienes que completar el siguiente calambur, arrastrando las palabras adecuadas a su lugar correspondiente. Si terminas antes de que acabe el tiempo puedes pulsar en el botón 'COMPROBAR'. Si lo completas antes de que se acabe el tiempo, habrás superado el calambur. ¡A por ello, que el tiempo vuela!</div>";
	var contenedor_calambur = "<div class='contenedor-texto-trabalenguas'>";


	$.ajax({

		type: "POST",
		url: "../php/modalidades/juego_calambures.php",
		async: false,
		data: { id_usuario: id_usuario, dificultad: dificultad },
		success: function(data, status) {

			if(data != "vacio") {

				var calambures = JSON.parse(data);

				texto1_calambur = calambures.texto1;
				texto2_calambur = calambures.texto2;
				texto3_calambur = calambures.texto3;
				palabras1_calambur = calambures.palabras1;
				palabras2_calambur = calambures.palabras2;
				palabras3_calambur = calambures.palabras3;
				palabras_correctas_calambur = calambures.palabras_correctas;
			}

			else {

				texto1_calambur = "HA OCURRIDO UN ERROR";
			}

		}

	});

	/*
	var palabras_auxiliares = palabras_correctas_calambur.split(",");
	var palabra1_auxiliar = palabras_auxiliares[0];
	var palabra2_auxiliar = palabras_auxiliares[1];
	*/

	contenedor_calambur += texto1_calambur + "</div>";

	contenedor_descripcion_calambur += "<input type='hidden' id='auxiliar-palabras-correctas-calambur' name='auxiliar-palabras-correctas-calambur' value='"+palabras_correctas_calambur+"'>";

	var texto4_calambur = texto3_calambur.replace("-", "<div id='palabra1-calambur' class='palabra-calambur'></div>");
	var texto5_calambur = texto4_calambur.replace("+", "<div id='palabra2-calambur' class='palabra-calambur'></div>");

	contenedor_calambur += "<div class='contenedor-texto-trabalenguas'>" + texto5_calambur + "</div>";

	var contenedor_palabras_calambur = "<div class='contenedor-palabras-calambur'>";



	if(dificultad == '1') {

		reloj_calambur = "<div id='reloj1-calambur' class='reloj-juego'></div>";

		var palabras1_propuestas_calambur = palabras1_calambur.split(",");

		for (i = 0; i < palabras1_propuestas_calambur.length; i++) {

			contenedor_palabras_calambur += "<div class='palabras-calambur'>"+palabras1_propuestas_calambur[i]+"</div>";
		}

		//boton_calambur += "<div class='boton boton-comprobar' onclick='comprobar_calambur(1,\""+palabra1_auxiliar+"\",\""+palabra2_auxiliar+"\")'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";
		boton_calambur += "<div class='boton boton-comprobar' onclick='comprobar_calambur(1)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '2') {
		
		reloj_calambur = "<div id='reloj2-calambur' class='reloj-juego'></div>";

		var palabras2_propuestas_calambur = palabras2_calambur.split(",");

		for (i = 0; i < palabras2_propuestas_calambur.length; i++) {

			contenedor_palabras_calambur += "<div class='palabras-calambur'>"+palabras2_propuestas_calambur[i]+"</div>";
		}

		boton_calambur += "<div class='boton boton-comprobar' onclick='comprobar_calambur(2)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '3') {
		
		reloj_calambur = "<div id='reloj3-calambur' class='reloj-juego'></div>";

		var palabras3_propuestas_calambur = palabras3_calambur.split(",");

		for (i = 0; i < palabras3_propuestas_calambur.length; i++) {

			contenedor_palabras_calambur += "<div class='palabras-calambur'>"+palabras3_propuestas_calambur[i]+"</div>";
		}

		boton_calambur += "<div class='boton boton-comprobar' onclick='comprobar_calambur(3)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}


	contenedor_palabras_calambur += "</div>";

	contenedor_calambur += contenedor_palabras_calambur;

	contenedor_juego_calambur += contenedor_descripcion_calambur+reloj_calambur+contenedor_calambur+boton_calambur;
	

	$("#titulo-modalidad-calambures").html("<i class='fa fa-arrow-left atras-juego' aria-hidden='true' onclick='jugar_calambures();parar_tiempo_calambures();'></i><i class='fa fa-th-list' aria-hidden='true'></i>COMPLETA");
	$("#contenedor-interior-publicaciones-calambures").html(contenedor_juego_calambur);

	reloj_juego_calambur(dificultad);
	drag_and_drop_juego_calambures();
}


function parar_tiempo_calambures() {

	$("#reloj1-calambur").countdown360({}).stop();
	$("#reloj2-calambur").countdown360({}).stop();
	$("#reloj3-calambur").countdown360({}).stop();
}




function reloj_juego_calambur(dificultad) {

	var tiempo = 0;
	var reloj = "";

	var auxiliar_palabras_correctas = $("#auxiliar-palabras-correctas-calambur").val();
	var palabras_correctas = auxiliar_palabras_correctas.split(",");
	var palabra1_correcta_calambur = palabras_correctas[0];
	var palabra2_correcta_calambur = palabras_correctas[1];


	if(dificultad == '1') {

		tiempo = 25;
		reloj = "#reloj1-calambur";
	}

	else if(dificultad == '2') {

		tiempo = 20;
		reloj = "#reloj2-calambur";
	}

	else if(dificultad == '3') {

		tiempo = 15;
		reloj = "#reloj3-calambur";
	}
	

	$(reloj).countdown360({
		radius      : 30,
		seconds     : tiempo,
		fontColor   : '#FFFFFF',
		fillStyle   : '#56c2e1', 
		strokeStyle : '#3f9db8',
		strokeWidth : 5,
		autostart   : false,
		fontSize    : 22,
		fontWeight  : 300,  
		onComplete  : function () {


			var palabra1_usuario_calambur = $("#palabra1-calambur").text();
			var palabra2_usuario_calambur = $("#palabra2-calambur").text();



			var contenido_modal = "";
			var titulo_modal = "";


			if(dificultad == '1') {

				if(palabra1_correcta_calambur == palabra1_usuario_calambur) {

					titulo_modal = "CALAMBUR SUPERADO";

					sumar_puntos(1,2,3);
					historial_juegos(1,2,1,21);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_calambures(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "CALAMBUR NO SUPERADO";

					restar_puntos(1,2,3);
					historial_juegos(1,2,1,22);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_calambures(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '2') {

				if(palabra1_correcta_calambur == palabra1_usuario_calambur) {

					titulo_modal = "CALAMBUR SUPERADO";

					sumar_puntos(2,2,4);
					historial_juegos(2,2,2,21);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_calambures(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "CALAMBUR NO SUPERADO";

					restar_puntos(1,2,4);
					historial_juegos(1,2,2,22);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_calambures(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '3') {

				if(palabra1_correcta_calambur == palabra1_usuario_calambur) {

					titulo_modal = "CALAMBUR SUPERADO";

					sumar_puntos(3,2,5);
					historial_juegos(3,2,3,21);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_calambures(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "CALAMBUR NO SUPERADO";

					restar_puntos(1,2,5);
					historial_juegos(1,2,3,22);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_calambures(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

		    $("#titulo-modal-aviso").text(titulo_modal);
		    $("#contenido-modal-aviso").html(contenido_modal);

		    window.location = "#modal-aviso";
			


			$(reloj).countdown360({}).stop();

		}
	}).start()

}



function comprobar_calambur(dificultad) {

	var auxiliar_palabras_correctas = $("#auxiliar-palabras-correctas-calambur").val();
	var palabras_correctas = auxiliar_palabras_correctas.split(",");
	var palabra1_correcta_calambur = palabras_correctas[0];
	var palabra2_correcta_calambur = palabras_correctas[1];

	var palabra1_usuario_calambur = $("#palabra1-calambur").text();
	var palabra2_usuario_calambur = $("#palabra2-calambur").text();

	var contenido_modal = "";
	var titulo_modal = "";
	var reloj = "";


	if(dificultad == '1') {

		reloj = "#reloj1-calambur";

		if(palabra1_correcta_calambur == palabra1_usuario_calambur) {

			titulo_modal = "CALAMBUR SUPERADO";

			sumar_puntos(1,2,3);
			historial_juegos(1,2,1,21);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_calambures(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "CALAMBUR NO SUPERADO";

			restar_puntos(1,2,3);
			historial_juegos(1,2,1,22);
			contenido_modal = "<p>El calambur no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_calambures(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '2') {

		reloj = "#reloj2-calambur";

		if(palabra1_correcta_calambur == palabra1_usuario_calambur) {

			titulo_modal = "CALAMBUR SUPERADO";

			sumar_puntos(2,2,4);
			historial_juegos(2,2,2,21);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_calambures(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "CALAMBUR NO SUPERADO";

			restar_puntos(1,2,4);
			historial_juegos(1,2,2,22);
			contenido_modal = "<p>El calambur no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_calambures(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '3') {

		reloj = "#reloj3-calambur";

		if(palabra1_correcta_calambur == palabra1_usuario_calambur) {

			titulo_modal = "CALAMBUR SUPERADO";

			sumar_puntos(3,2,5);
			historial_juegos(3,2,3,21);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_calambures(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "CALAMBUR NO SUPERADO";

			restar_puntos(1,2,5);
			historial_juegos(1,2,3,22);
			contenido_modal = "<p>El calambur no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_calambures(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_calambures()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}


	$(reloj).countdown360({}).stop();


	$("#titulo-modal-aviso").text(titulo_modal);
	$("#contenido-modal-aviso").html(contenido_modal);

	window.location = "#modal-aviso";
			

}



function drag_and_drop_juego_calambures() {

  //$(".palabras-calambur").draggable({helper: 'clone'});
  $(".palabras-calambur").draggable({helper: 'clone'});
  $(".palabra-calambur").droppable({
    accept: ".palabras-calambur",
    drop: function(ev, ui) {
      $(this).text(ui.draggable.text());
    }
  });

}




$("#cerrar-modalidad-calambures").click(function(){

	$("#modalidad-calambures").addClass("ocultar-modal-modalidad");

});


// CRIPTOGRAMAS

$("#boton-ver-criptogramas").click(function(){

	var publicaciones_auxiliar = ver_publicaciones('3','1');

	$("#modalidad-criptogramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-criptogramas").removeClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-criptogramas").addClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-criptogramas").text("CRIPTOGRAMAS PUBLICADOS");
	$("#contenedor-interior-publicaciones-criptogramas").html(publicaciones_auxiliar);

});


$('input[type=radio][name=filtro-publicaciones-criptogramas]').change(function() {

	var criptogramas_publicados = "";
        
    var filtro_criptogramas = $('input[type=radio][name=filtro-publicaciones-criptogramas]:checked').val();

    criptogramas_publicados = ver_publicaciones('3',filtro_criptogramas);

    $("#contenedor-interior-publicaciones-criptogramas").html(criptogramas_publicados);

});


$("#boton-crear-criptogramas").click(function(){

	var crear_criptogramas = "<form id='creacion-criptogramas' name='creacion-criptogramas' class='form-creacion-publicacion' action='' method='post'>";
	crear_criptogramas += "<div class='contenedor-texto-creacion'>";
	crear_criptogramas += "<input type='text' id='texto1-creacion-criptogramas' name='texto1-creacion-criptogramas' class='texto1-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ TU MENSAJE DESCIFRADO'>";
	crear_criptogramas += "<input type='text' id='texto2-creacion-criptogramas' name='texto2-creacion-criptogramas' class='texto2-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ TU MENSAJE CIFRADO'>";
	crear_criptogramas += "<input type='hidden' id='id-usuario-creacion-criptogramas' name='id-usuario-creacion-criptogramas' value='"+id_usuario+"'>";
	crear_criptogramas += "</div>";
	crear_criptogramas += "<div class='contenedor-botones-creacion'>";
	crear_criptogramas += "<a onclick='limpiar_criptogramas()' class='boton-creacion'>LIMPIAR</a>";
	crear_criptogramas += "<div id='error-creacion-criptogramas' class='error-oculto'>ERROR</div>";
	crear_criptogramas += "<a onclick='validacion_criptogramas()' class='boton-creacion'>PUBLICAR</a>";
	crear_criptogramas += "</div>";
	crear_criptogramas += "</form>";

	crear_criptogramas += "<div class='precontenedor-adicional-creacion'>";
	crear_criptogramas += "<a id='enlace-recursos-criptogramas' onclick='recursos_criptogramas()'><i class='fa fa-cog' aria-hidden='true'></i> RECURSOS</a>";
	crear_criptogramas += "<a id='enlace-consejos-criptogramas' onclick='consejos_criptogramas()'><i class='fa fa-lightbulb-o' aria-hidden='true'></i> CONSEJOS</a>";
	crear_criptogramas += "<a id='enlace-informacion-criptogramas' onclick='informacion_criptogramas()'><i class='fa fa-info-circle' aria-hidden='true'></i> INFORMACIÓN</a>";
	crear_criptogramas += "<a id='enlace-ayuda-criptogramas' onclick='ayuda_criptogramas()'><i class='fa fa-question-circle' aria-hidden='true'></i> AYUDA</a>";
	crear_criptogramas += "</div>";

	crear_criptogramas += "<div id='contenedor-adicional-criptogramas' class='contenedor-adicional-creacion'></div>";



	$("#modalidad-criptogramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-criptogramas").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-criptogramas").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-criptogramas").text("CREA UN CRIPTOGRAMA");
	$("#contenedor-interior-publicaciones-criptogramas").html(crear_criptogramas);

	recursos_criptogramas();

});



function limpiar_criptogramas() {

	$("#texto1-creacion-criptogramas").val("");
	$("#texto2-creacion-criptogramas").val("");
}


function validacion_criptogramas() {

	var valido = true;

	var criptograma1 = $("#texto1-creacion-criptogramas").val();
	var criptograma2 = $("#texto2-creacion-criptogramas").val();


	if(criptograma1 == "" && criptograma2 == "") {
		//El criptograma esta vacio
		$("#error-creacion-criptogramas").text("Criptograma vacío");
		$("#error-creacion-criptogramas").removeClass("error-oculto");
		$("#error-creacion-criptogramas").addClass("error");
		$("#texto1-creacion-criptogramas").addClass("input-warning");
		$("#texto2-creacion-criptogramas").addClass("input-warning");

		valido = false;
	}

	else if(criptograma1 == "") {
		//El criptograma esta incompleto
		$("#error-creacion-criptogramas").text("Criptograma incompleto");
		$("#error-creacion-criptogramas").removeClass("error-oculto");
		$("#error-creacion-criptogramas").addClass("error");
		$("#texto1-creacion-criptogramas").addClass("input-warning");

		valido = false;
	}

	else if(criptograma2 == "") {
		//El criptograma esta incompleto
		$("#error-creacion-criptogramas").text("Criptograma incompleto");
		$("#error-creacion-criptogramas").removeClass("error-oculto");
		$("#error-creacion-criptogramas").addClass("error");
		$("#texto2-creacion-criptogramas").addClass("input-warning");

		valido = false;
	}

	publicar_criptogramas(valido);

}


function publicar_criptogramas(valido) {

	if(valido == true) {

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


		$.ajax({

		    type: "POST",
		    url: "../php/modalidades/publicar_criptogramas.php",
		    data: $("#creacion-criptogramas").serialize(),
		    success: function(data, status) {

		    	error = data.split("-");

	            numero = error[0];
	            cadena = error[1];


		        if(numero == "1") {

		        	sumar_puntos(3,3,2);

		        	contenido_modal = "<p>"+cadena+"</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("CRIPTOGRAMA PUBLICADO");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else if(numero == "2") {

		        	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else {

		        	contenido_modal = "<p></p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

			}

		});

	}	


}

function recursos_criptogramas() {

	$("#enlace-recursos-criptogramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-criptogramas").removeClass("enlace-seleccionado-subcontenedor");

	var recursos_criptogramas = "<div class='subcontenedor1-adicional-creacion'>";
	recursos_criptogramas += "<form id='buscar-recursos-criptogramas' name='buscar-recursos-criptogramas' class='form-buscar-recursos' action='' method='post'>";
	recursos_criptogramas += "<i class='fa fa-angle-right desplegable-recursos' aria-hidden='true'></i>";
	recursos_criptogramas += "<div class='texto-auxiliar-criptograma'>Cifrar mensaje de manera automática con los carácteres de la derecha</div>";
	recursos_criptogramas += "<input type='hidden' id='id-usuario-recursos-criptogramas' name='id-usuario-recursos-criptogramas' value='"+id_usuario+"'>";
	recursos_criptogramas += "<div id='error-recurso-criptogramas' class='error-oculto'>ERROR</div>";
	recursos_criptogramas += "<a onclick='obtener_recursos_criptogramas()' class='boton-recursos'>CIFRAR</a>";
	recursos_criptogramas += "</form>";
	recursos_criptogramas += "</div>";
	recursos_criptogramas += "<div id='contenedor-palabras-criptogramas' class='subcontenedor2-adicional-creacion'>";

	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>A</span><input type='text' id='criptograma-caracter-a' name='criptograma-caracter-a' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>B</span><input type='text' id='criptograma-caracter-b' name='criptograma-caracter-b' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>C</span><input type='text' id='criptograma-caracter-c' name='criptograma-caracter-c' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>D</span><input type='text' id='criptograma-caracter-d' name='criptograma-caracter-d' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>E</span><input type='text' id='criptograma-caracter-e' name='criptograma-caracter-e' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>F</span><input type='text' id='criptograma-caracter-f' name='criptograma-caracter-f' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>G</span><input type='text' id='criptograma-caracter-g' name='criptograma-caracter-g' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>H</span><input type='text' id='criptograma-caracter-h' name='criptograma-caracter-h' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>I</span><input type='text' id='criptograma-caracter-i' name='criptograma-caracter-i' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>J</span><input type='text' id='criptograma-caracter-j' name='criptograma-caracter-j' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>K</span><input type='text' id='criptograma-caracter-k' name='criptograma-caracter-k' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>L</span><input type='text' id='criptograma-caracter-l' name='criptograma-caracter-l' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>M</span><input type='text' id='criptograma-caracter-m' name='criptograma-caracter-m' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>N</span><input type='text' id='criptograma-caracter-n' name='criptograma-caracter-n' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>Ñ</span><input type='text' id='criptograma-caracter-ene' name='criptograma-caracter-ene' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>O</span><input type='text' id='criptograma-caracter-o' name='criptograma-caracter-o' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>P</span><input type='text' id='criptograma-caracter-p' name='criptograma-caracter-p' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>Q</span><input type='text' id='criptograma-caracter-q' name='criptograma-caracter-q' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>R</span><input type='text' id='criptograma-caracter-r' name='criptograma-caracter-r' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>S</span><input type='text' id='criptograma-caracter-s' name='criptograma-caracter-s' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>T</span><input type='text' id='criptograma-caracter-t' name='criptograma-caracter-t' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>U</span><input type='text' id='criptograma-caracter-u' name='criptograma-caracter-u' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>V</span><input type='text' id='criptograma-caracter-v' name='criptograma-caracter-v' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>W</span><input type='text' id='criptograma-caracter-w' name='criptograma-caracter-w' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>X</span><input type='text' id='criptograma-caracter-x' name='criptograma-caracter-x' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>Y</span><input type='text' id='criptograma-caracter-y' name='criptograma-caracter-y' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>Z</span><input type='text' id='criptograma-caracter-z' name='criptograma-caracter-z' class='contenedor-interior-palabra-recurso'></div>";

	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>0</span><input type='text' id='criptograma-caracter-0' name='criptograma-caracter-0' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>1</span><input type='text' id='criptograma-caracter-1' name='criptograma-caracter-1' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>2</span></span><input type='text' id='criptograma-caracter-2' name='criptograma-caracter-2' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>3</span><input type='text' id='criptograma-caracter-3' name='criptograma-caracter-3' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>4</span><input type='text' id='criptograma-caracter-4' name='criptograma-caracter-4' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>5</span><input type='text' id='criptograma-caracter-5' name='criptograma-caracter-5' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>6</span><input type='text' id='criptograma-caracter-6' name='criptograma-caracter-6' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>7</span><input type='text' id='criptograma-caracter-7' name='criptograma-caracter-7' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>8</span></span><input type='text' id='criptograma-caracter-8' name='criptograma-caracter-8' class='contenedor-interior-palabra-recurso'></div>";
	recursos_criptogramas += "<div class='contenedor-palabra-recurso'><span class='contenedor-caracter-criptograma'>9</span><input type='text' id='criptograma-caracter-9' name='criptograma-caracter-9' class='contenedor-interior-palabra-recurso'></div>";



	recursos_criptogramas += "</div>";


	$("#contenedor-adicional-criptogramas").html(recursos_criptogramas);

	drag_and_drop_criptogramas();

}

function obtener_recursos_criptogramas() {

	var valido = true;

	var error = "";

	var auxiliar_mensaje_descifrado = $("#texto1-creacion-criptogramas").val();

	var caracter_a = $("#criptograma-caracter-a").val();
	var caracter_b = $("#criptograma-caracter-b").val();
	var caracter_c = $("#criptograma-caracter-c").val();
	var caracter_d = $("#criptograma-caracter-d").val();
	var caracter_e = $("#criptograma-caracter-e").val();
	var caracter_f = $("#criptograma-caracter-f").val();
	var caracter_g = $("#criptograma-caracter-g").val();
	var caracter_h = $("#criptograma-caracter-h").val();
	var caracter_i = $("#criptograma-caracter-i").val();
	var caracter_j = $("#criptograma-caracter-j").val();
	var caracter_k = $("#criptograma-caracter-k").val();
	var caracter_l = $("#criptograma-caracter-l").val();
	var caracter_m = $("#criptograma-caracter-m").val();
	var caracter_n = $("#criptograma-caracter-n").val();
	var caracter_ene = $("#criptograma-caracter-ene").val();
	var caracter_o = $("#criptograma-caracter-o").val();
	var caracter_p = $("#criptograma-caracter-p").val();
	var caracter_q = $("#criptograma-caracter-q").val();
	var caracter_r = $("#criptograma-caracter-r").val();
	var caracter_s = $("#criptograma-caracter-s").val();
	var caracter_t = $("#criptograma-caracter-t").val();
	var caracter_u = $("#criptograma-caracter-u").val();
	var caracter_v = $("#criptograma-caracter-v").val();
	var caracter_w = $("#criptograma-caracter-w").val();
	var caracter_x = $("#criptograma-caracter-x").val();
	var caracter_y = $("#criptograma-caracter-y").val();
	var caracter_z = $("#criptograma-caracter-z").val();

	var caracter_0 = $("#criptograma-caracter-0").val();
	var caracter_1 = $("#criptograma-caracter-1").val();
	var caracter_2 = $("#criptograma-caracter-2").val();
	var caracter_3 = $("#criptograma-caracter-3").val();
	var caracter_4 = $("#criptograma-caracter-4").val();
	var caracter_5 = $("#criptograma-caracter-5").val();
	var caracter_6 = $("#criptograma-caracter-6").val();
	var caracter_7 = $("#criptograma-caracter-7").val();
	var caracter_8 = $("#criptograma-caracter-8").val();
	var caracter_9 = $("#criptograma-caracter-9").val();



	if(auxiliar_mensaje_descifrado != '' && auxiliar_mensaje_descifrado != null) {

		var mensaje_cifrado = "";

		if(caracter_a == '' || caracter_b == '' || caracter_c == '' || caracter_d == '' || caracter_e == '' || caracter_f == '' || caracter_g == '') {

			valido = false;
		}

		if(caracter_h == '' || caracter_i == '' || caracter_j == '' || caracter_k == '' || caracter_l == '' || caracter_m == '' || caracter_n == '') {

			valido = false;
		}

		if(caracter_ene == '' || caracter_o == '' || caracter_p == '' || caracter_q == '' || caracter_r == '' || caracter_s == '' || caracter_t == '') {

			valido = false;
		}

		if(caracter_u == '' || caracter_v == '' || caracter_w == '' || caracter_x == '' || caracter_y == '' || caracter_z == '') {

			valido = false;
		}

		if(caracter_0 == '' || caracter_1 == '' || caracter_2 == '' || caracter_3 == '' || caracter_4 == '') {

			valido = false;
		}

		if(caracter_5 == '' || caracter_6 == '' || caracter_7 == '' || caracter_8 == '' || caracter_9 == '') {

			valido = false;
		}



		if(valido == false) {

			error = "Hay carácteres sin cifrar";
		}


		else {
			//Se cifra el mensaje descifrado

			separadores = ['',' '];

			var mensaje_descifrado = auxiliar_mensaje_descifrado.split(new RegExp (separadores.join('|'),'g'));


			for (i = 0; i < mensaje_descifrado.length; i++) {

				if(mensaje_descifrado[i] == '0') {

					mensaje_cifrado += caracter_0;
				}

				else if(mensaje_descifrado[i] == '1') {

					mensaje_cifrado += caracter_1;
				}

				else if(mensaje_descifrado[i] == '2') {

					mensaje_cifrado += caracter_2;
				}

				else if(mensaje_descifrado[i] == '3') {

					mensaje_cifrado += caracter_3;
				}

				else if(mensaje_descifrado[i] == '4') {

					mensaje_cifrado += caracter_4;
				}

				else if(mensaje_descifrado[i] == '5') {

					mensaje_cifrado += caracter_5;
				}

				else if(mensaje_descifrado[i] == '6') {

					mensaje_cifrado += caracter_6;
				}

				else if(mensaje_descifrado[i] == '7') {

					mensaje_cifrado += caracter_7;
				}

				else if(mensaje_descifrado[i] == '8') {

					mensaje_cifrado += caracter_8;
				}

				else if(mensaje_descifrado[i] == '9') {

					mensaje_cifrado += caracter_9;
				}

				else if(mensaje_descifrado[i] == 'a' || mensaje_descifrado[i] == 'A') {

					mensaje_cifrado += caracter_a;
				}

				else if(mensaje_descifrado[i] == 'b' || mensaje_descifrado[i] == 'B') {

					mensaje_cifrado += caracter_b;
				}

				else if(mensaje_descifrado[i] == 'c' || mensaje_descifrado[i] == 'C') {

					mensaje_cifrado += caracter_c;
				}

				else if(mensaje_descifrado[i] == 'd' || mensaje_descifrado[i] == 'D') {

					mensaje_cifrado += caracter_d;
				}

				else if(mensaje_descifrado[i] == 'e' || mensaje_descifrado[i] == 'E') {

					mensaje_cifrado += caracter_e;
				}

				else if(mensaje_descifrado[i] == 'f' || mensaje_descifrado[i] == 'F') {

					mensaje_cifrado += caracter_f;
				}

				else if(mensaje_descifrado[i] == 'g' || mensaje_descifrado[i] == 'G') {

					mensaje_cifrado += caracter_g;
				}

				else if(mensaje_descifrado[i] == 'h' || mensaje_descifrado[i] == 'H') {

					mensaje_cifrado += caracter_h;
				}

				else if(mensaje_descifrado[i] == 'i' || mensaje_descifrado[i] == 'I') {

					mensaje_cifrado += caracter_i;
				}

				else if(mensaje_descifrado[i] == 'j' || mensaje_descifrado[i] == 'J') {

					mensaje_cifrado += caracter_j;
				}

				else if(mensaje_descifrado[i] == 'k' || mensaje_descifrado[i] == 'K') {

					mensaje_cifrado += caracter_k;
				}

				else if(mensaje_descifrado[i] == 'l' || mensaje_descifrado[i] == 'L') {

					mensaje_cifrado += caracter_l;
				}

				else if(mensaje_descifrado[i] == 'm' || mensaje_descifrado[i] == 'M') {

					mensaje_cifrado += caracter_m;
				}

				else if(mensaje_descifrado[i] == 'n' || mensaje_descifrado[i] == 'N') {

					mensaje_cifrado += caracter_n;
				}

				else if(mensaje_descifrado[i] == 'ñ' || mensaje_descifrado[i] == 'Ñ') {

					mensaje_cifrado += caracter_ene;
				}

				else if(mensaje_descifrado[i] == 'o' || mensaje_descifrado[i] == 'O') {

					mensaje_cifrado += caracter_o;
				}

				else if(mensaje_descifrado[i] == 'p' || mensaje_descifrado[i] == 'P') {

					mensaje_cifrado += caracter_p;
				}

				else if(mensaje_descifrado[i] == 'q' || mensaje_descifrado[i] == 'Q') {

					mensaje_cifrado += caracter_q;
				}

				else if(mensaje_descifrado[i] == 'r' || mensaje_descifrado[i] == 'R') {

					mensaje_cifrado += caracter_r;
				}

				else if(mensaje_descifrado[i] == 's' || mensaje_descifrado[i] == 'S') {

					mensaje_cifrado += caracter_s;
				}

				else if(mensaje_descifrado[i] == 't' || mensaje_descifrado[i] == 'T') {

					mensaje_cifrado += caracter_t;
				}

				else if(mensaje_descifrado[i] == 'u' || mensaje_descifrado[i] == 'U') {

					mensaje_cifrado += caracter_u;
				}

				else if(mensaje_descifrado[i] == 'v' || mensaje_descifrado[i] == 'V') {

					mensaje_cifrado += caracter_v;
				}

				else if(mensaje_descifrado[i] == 'w' || mensaje_descifrado[i] == 'W') {

					mensaje_cifrado += caracter_w;
				}

				else if(mensaje_descifrado[i] == 'x' || mensaje_descifrado[i] == 'X') {

					mensaje_cifrado += caracter_x;
				}

				else if(mensaje_descifrado[i] == 'y' || mensaje_descifrado[i] == 'Y') {

					mensaje_cifrado += caracter_y;
				}

				else if(mensaje_descifrado[i] == 'z' || mensaje_descifrado[i] == 'Z') {

					mensaje_cifrado += caracter_z;
				}

				else if(mensaje_descifrado[i] == ' ') {

					mensaje_cifrado += " ";
				}

				else {

					mensaje_cifrado += mensaje_descifrado[i];
				}
			    
			}


			$("#texto2-creacion-criptogramas").val(mensaje_cifrado);
		}



	}

	else {

		error = "No hay mensaje descifrado";
	}


	if(error != '') {

		$("#error-recurso-criptogramas").text(error);
		$("#error-recurso-criptogramas").removeClass("error-oculto");
		$("#error-recurso-criptogramas").addClass("error");
	}

	else {

		$("#error-recurso-criptogramas").addClass("error-oculto");
		$("#error-recurso-criptogramas").removeClass("error");
	}

}


function drag_and_drop_criptogramas() {


  $('.contenedor-caracter-criptograma').click(function() { 
  	if($(this).next().val() != '' && $(this).next().val() != null) {
  		$("#texto2-creacion-criptogramas").insertAtCaret($(this).next().val());
  	}
    return false
  });

  $(".contenedor-palabra-recurso").draggable({helper: 'clone'});
  $(".txtDropTarget").droppable({
    accept: ".contenedor-palabra-recurso",
    drop: function(ev, ui) {
      //$(this).insertAtCaret(ui.draggable.text());
      $(this).insertAtCaret(ui.draggable.children('.contenedor-interior-palabra-recurso').val());
    }
  });

}


function consejos_criptogramas() {

	$("#enlace-recursos-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-criptogramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-criptogramas").removeClass("enlace-seleccionado-subcontenedor");

	var consejos_criptogramas = "<div class='subcontenedor3-adicional-creacion'>";
	consejos_criptogramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Para que tu criptograma sea lo más correcto posible, puedes seguir los siguientes consejos: <br><br>";
	consejos_criptogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Utiliza uno o varios carácteres por cada letra del alfabeto y número necesario.  <br>";
	consejos_criptogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Cuanto más corto sea el mensaje y menos letras repetidas utilices, más difícil será descifrarlo. <br>";
	consejos_criptogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Emplea distintas técnicas para cifrar cada vez que crees un nuevo criptograma. Cuanta más variedad, más destacarán tus creaciones en el listado de publicaciones. <br>";
	consejos_criptogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Lee tu mensaje y asegúrate de que está bien cifrado, cuando consideres que está acabado, antes de publicarlo. <br><br></p>";
	consejos_criptogramas += "</div>";

	$("#contenedor-adicional-criptogramas").html(consejos_criptogramas);

}


function informacion_criptogramas() {

	$("#enlace-recursos-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-criptogramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-criptogramas").removeClass("enlace-seleccionado-subcontenedor");

	var informacion_criptogramas = "<div class='subcontenedor3-adicional-creacion'>";
	informacion_criptogramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Los <strong>criptogramas</strong> son fragmentos de mensajes cifrados cuyo significado resulta ininteligible hasta que son decifrados. <br><br>";
	informacion_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Generalmente, el contenido del mensaje inteligible es modificado siguiendo un determinado patrón, de manera que sólo es posible comprender el significado original tras conocer el patrón seguido en el cifrado. <br><br>";
	informacion_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Se pueden crear criptogramas utilizando métodos de cifrado clásico, entre los que destacan: <br><br>";
	informacion_criptogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Cifrado por sustitución</u>, en el que cada letra es remplazada por una diferente o por un número. <br>";
	informacion_criptogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Cifrado por trasposición</u>, donde se cambia el orden de las letras, de acuerdo con un esquema bien definido. <br>";
	informacion_criptogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Libro de cifrado</u>, donde un libro o artículo es utilizado para cifrar el mensaje. <br><br>";
	informacion_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Así mismo, existen otras técnicas menos utilizadas en la actualidad: Cifrado Escítala, Cifrado César, Cifrado Polybios, Cifrado Playfair, Cifrado Vigenère, etc. <br><br>";
	informacion_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> En sus inicios los criptogramas fueron concebidos para aplicaciones más serias (secretos militares o privados), pero en la actualidad se utilizan, por lo general, como entretenimiento.</p>";
	informacion_criptogramas += "</div>";

	$("#contenedor-adicional-criptogramas").html(informacion_criptogramas);

}

function ayuda_criptogramas() {

	$("#enlace-recursos-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-criptogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-criptogramas").addClass("enlace-seleccionado-subcontenedor");

	var ayuda_criptogramas = "<div class='subcontenedor3-adicional-creacion'>";
	ayuda_criptogramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Puedes crear el criptograma de manera libre, rellenando los dos campos superiores dedicados a ello, o haciendo uso del recurso ofrecido. <br><br>";
	ayuda_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> El recurso está basado en cifrar distintos carácteres: <br><br>";
	ayuda_criptogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Listado de letras del alfabeto y números</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (se deben cifrar todos). <br><br>";
	ayuda_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Se ofrece este recurso puesto que el mensaje del criptograma debe ser ininteligible, y la manera más simple de hacerlo es cifrando individualmente cada carácter. <br><br>";
	ayuda_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez completado el cifrado de todos los carácteres, se ofrece la posibilidad de cifrar automáticamente, a partir de él, el mensaje descifrado del primer campo (en caso de existir) o usar individualmente estos carácteres cifrados, añadiéndolos al segundo campo pulsando sobre ellos o arrastrándolos al mismo, "; 
	ayuda_criptogramas += "teniendo en cuenta que se colocarán en la última posición marcada por el puntero <i class='fa fa-i-cursor' aria-hidden='true'></i> en dicho campo. <br><br>";
	ayuda_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Si en algún momento, durante la creación del criptograma, decides empezar de nuevo porque no te convence el resultado, se te facilita la opción de limpiar los dos campos correspondientes, lo cual puede ser útil en consideración con la extensión de tu creación. <br><br>";
	ayuda_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez creado el criptograma, independientemente de la forma escogida, puedes publicarlo. De esta manera, tu creación pasará a ser pública y aparecerá en el listado de publicaciones de criptogramas de la página, pudiendo acceder a ella cualquier usuario. <br><br>";
	ayuda_criptogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> En el listado de publicaciones correspondiente puedes ver tus creaciones y eliminarlas, si así lo deseas, pero no editarlas.</p>";
	ayuda_criptogramas += "</div>";

	$("#contenedor-adicional-criptogramas").html(ayuda_criptogramas);

}



function jugar_criptogramas() {

	window.location = "#cerrar";

	var jugar_criptogramas = "<h3 class='titulo-juego'><i class='fa fa-unlock-alt' aria-hidden='true'></i>DESCIFRA</h3>";
	jugar_criptogramas += "<div class='descripcion-juego'>El juego consiste en descifrar, a partir de algunas letras del alfabeto despejadas, un mensaje cifrado asignado aleatoriamente. <br>";
	jugar_criptogramas += "Se dispone de temporizador, como factor adicional a superar, ajustado específicamente a cada una de las tres dificultades: </div>";

	jugar_criptogramas += "<div class='contenedor-dificultad-juego'>";
	jugar_criptogramas += "<div onclick='juego_criptogramas(1)' class='boton boton-dificultad-juego'>NOVATO</div>";
	jugar_criptogramas += "<div class='descripcion-dificultad-juego'>Criptograma fácil. 20 letras despejadas. A resolver antes de 120 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 1 PUNTO</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_criptogramas += "</div>";

	jugar_criptogramas += "<div class='contenedor-dificultad-juego'>";
	jugar_criptogramas += "<div onclick='juego_criptogramas(2)' class='boton boton-dificultad-juego'>AVANZADO</div>";
	jugar_criptogramas += "<div class='descripcion-dificultad-juego'>Criptograma medio. 14 letras despejadas. A resolver antes de 120 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 2 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_criptogramas += "</div>";

	jugar_criptogramas += "<div class='contenedor-dificultad-juego'>";
	jugar_criptogramas += "<div onclick='juego_criptogramas(3)' class='boton boton-dificultad-juego'>EXPERTO</div>";
	jugar_criptogramas += "<div class='descripcion-dificultad-juego'>Criptograma difícil. 8 letras despejadas. A resolver antes de 90 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 3 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_criptogramas += "</div>";


	$("#modalidad-criptogramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-criptogramas").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-criptogramas").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-criptogramas").text("JUEGA CON CRIPTOGRAMAS");
	$("#contenedor-interior-publicaciones-criptogramas").html(jugar_criptogramas);

}






function juego_criptogramas(dificultad) {

	window.location = "#cerrar";

	array_criptograma = [];
	var reloj_criptograma = "";
	var texto1_criptograma = "";
	var texto2_criptograma = "";
	var letras_criptograma = "";
	var letras_cifradas_criptograma = [];
	var letras_descifradas_criptograma = [];
	var contenedor_juego_criptograma = "";
	var boton_criptograma = "";
	var contenedor_descripcion_criptograma = "";
	var numeros_alfabeto = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
	numeros_alfabeto = numeros_alfabeto.sort(function() {return Math.random() - 0.5});
	var numeros_seleccionados_alfabeto = [];
	var contador_auxiliar = 0;
	var texto_descifrado_criptograma = "";



	contenedor_descripcion_criptograma += "<div class='descripcion-interior-juego'>Tienes que descifrar el siguiente mensaje con ayuda del alfabeto, pulsando o arrastrando cada letra o pulsando en el botón 'DESCIFRAR' una vez que hayas descifrado el alfabeto completo. Si terminas antes de que acabe el tiempo puedes pulsar en el botón 'COMPROBAR'. Si lo completas antes de que se acabe el tiempo, habrás superado el criptograma. ¡A por ello, que el tiempo vuela!</div>";

	
	var contenedor_criptograma = "<div id='mensaje-cifrado-criptograma' class='contenedor-texto-trabalenguas'>";


	$.ajax({

		type: "POST",
		url: "../php/modalidades/juego_criptogramas.php",
		async: false,
		data: { id_usuario: id_usuario, dificultad: dificultad },
		success: function(data, status) {


			if(data != "vacio") {

				var criptogramas = JSON.parse(data);

				texto1_criptograma = criptogramas.texto1;
				texto2_criptograma = criptogramas.texto2;
				letras_criptograma = criptogramas.letras;
			}

			else {

				contenedor_criptograma = "HA OCURRIDO UN ERROR";
			}

		}

	});


	contenedor_criptograma += texto2_criptograma + "</div>";


	var letras_separadas_criptograma = letras_criptograma.split("-");

	for (i = 0; i < letras_separadas_criptograma.length; i++) {

		if (i % 2 == 1) {
			//Impar

			letras_cifradas_criptograma.push(letras_separadas_criptograma[i]);
		}

		else {
			//Par

			letras_descifradas_criptograma.push(letras_separadas_criptograma[i]);
		}

	}

	contenedor_descripcion_criptograma += "<input type='hidden' id='mensaje-descifrado-correcto' name='mensaje-descifrado-correcto' value='"+texto1_criptograma+"'>";
	
	var contenedor_letras_criptograma = "<div class='contenedor-letras-criptograma'>";



	if(dificultad == '1') {

		reloj_criptograma = "<div id='reloj1-criptograma' class='reloj-juego'></div>";

		texto_descifrado_criptograma = "<div class='contenedor-global-criptograma'><textarea id='texto-descifrado-criptograma1' name='texto-descifrado-criptograma1' class='texto-descifrado-criptograma txtDropTarget' placeholder='MENSAJE DESCIFRADO'></textarea>";
		

		for (i = 0; i < letras_cifradas_criptograma.length; i++) {

			array_criptograma.push(letras_cifradas_criptograma[i]);

		}

		boton_criptograma += "<div class='boton boton-izquierda' onclick='descifrar_criptograma(1)'><i class='fa fa-unlock-alt' aria-hidden='true'></i>DESCIFRAR</div>";
		boton_criptograma += "<div class='boton boton-derecha' onclick='comprobar_criptograma(1)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '2') {
		
		reloj_criptograma = "<div id='reloj2-criptograma' class='reloj-juego'></div>";

		texto_descifrado_criptograma = "<div class='contenedor-global-criptograma'><textarea id='texto-descifrado-criptograma2' name='texto-descifrado-criptograma2' class='texto-descifrado-criptograma txtDropTarget' placeholder='MENSAJE DESCIFRADO'></textarea>";


		for (i = 0; i < 16; i++) {

			numeros_seleccionados_alfabeto.push(numeros_alfabeto[i]);

		}

		for (i = 0; i < letras_cifradas_criptograma.length; i++) {

			if(contador_auxiliar < 16) {

				if(numeros_seleccionados_alfabeto[contador_auxiliar] == i) {

					array_criptograma.push(letras_cifradas_criptograma[i]);

					contador_auxiliar = contador_auxiliar+1;
				}

				else {

					array_criptograma.push("");
				}
			}

			else {

				array_criptograma.push("");
			}

		}


		boton_criptograma += "<div class='boton boton-izquierda' onclick='descifrar_criptograma(2)'><i class='fa fa-unlock-alt' aria-hidden='true'></i>DESCIFRAR</div>";
		boton_criptograma += "<div class='boton boton-derecha' onclick='comprobar_criptograma(2)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '3') {
		
		reloj_criptograma = "<div id='reloj3-criptograma' class='reloj-juego'></div>";

		texto_descifrado_criptograma = "<div class='contenedor-global-criptograma'><textarea id='texto-descifrado-criptograma3' name='texto-descifrado-criptograma3' class='texto-descifrado-criptograma txtDropTarget' placeholder='MENSAJE DESCIFRADO'></textarea>";
		

		for (i = 0; i < 8; i++) {

			numeros_seleccionados_alfabeto.push(numeros_alfabeto[i]);

		}

		for (i = 0; i < letras_cifradas_criptograma.length; i++) {

			if(contador_auxiliar < 8) {

				if(numeros_seleccionados_alfabeto[contador_auxiliar] == i) {

					array_criptograma.push(letras_cifradas_criptograma[i]);

					contador_auxiliar = contador_auxiliar+1;
				}

				else {

					array_criptograma.push("");
				}
			}

			else {

				array_criptograma.push("");
			}

		}


		boton_criptograma += "<div class='boton boton-izquierda' onclick='descifrar_criptograma(3)'><i class='fa fa-unlock-alt' aria-hidden='true'></i>DESCIFRAR</div>";
		boton_criptograma += "<div class='boton boton-derecha' onclick='comprobar_criptograma(3)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}



	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-a' class='contenedor-caracter-criptograma'>A</span><input type='text' id='criptograma-letra-a' name='criptograma-letra-a' class='contenedor-interior-palabra-criptograma' title='a' value='"+array_criptograma[0]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-b' class='contenedor-caracter-criptograma'>B</span><input type='text' id='criptograma-letra-b' name='criptograma-letra-b' class='contenedor-interior-palabra-criptograma' title='b' value='"+array_criptograma[1]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-c' class='contenedor-caracter-criptograma'>C</span><input type='text' id='criptograma-letra-c' name='criptograma-letra-c' class='contenedor-interior-palabra-criptograma' title='c' value='"+array_criptograma[2]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-d' class='contenedor-caracter-criptograma'>D</span><input type='text' id='criptograma-letra-d' name='criptograma-letra-d' class='contenedor-interior-palabra-criptograma' title='d' value='"+array_criptograma[3]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-e' class='contenedor-caracter-criptograma'>E</span><input type='text' id='criptograma-letra-e' name='criptograma-letra-e' class='contenedor-interior-palabra-criptograma' title='e' value='"+array_criptograma[4]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-f' class='contenedor-caracter-criptograma'>F</span><input type='text' id='criptograma-letra-f' name='criptograma-letra-f' class='contenedor-interior-palabra-criptograma' title='f' value='"+array_criptograma[5]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-g' class='contenedor-caracter-criptograma'>G</span><input type='text' id='criptograma-letra-g' name='criptograma-letra-g' class='contenedor-interior-palabra-criptograma' title='g' value='"+array_criptograma[6]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-h' class='contenedor-caracter-criptograma'>H</span><input type='text' id='criptograma-letra-h' name='criptograma-letra-h' class='contenedor-interior-palabra-criptograma' title='h' value='"+array_criptograma[7]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-i' class='contenedor-caracter-criptograma'>I</span><input type='text' id='criptograma-letra-i' name='criptograma-letra-i' class='contenedor-interior-palabra-criptograma' title='i' value='"+array_criptograma[8]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-j' class='contenedor-caracter-criptograma'>J</span><input type='text' id='criptograma-letra-j' name='criptograma-letra-j' class='contenedor-interior-palabra-criptograma' title='j' value='"+array_criptograma[9]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-k' class='contenedor-caracter-criptograma'>K</span><input type='text' id='criptograma-letra-k' name='criptograma-letra-k' class='contenedor-interior-palabra-criptograma' title='k' value='"+array_criptograma[10]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-l' class='contenedor-caracter-criptograma'>L</span><input type='text' id='criptograma-letra-l' name='criptograma-letra-l' class='contenedor-interior-palabra-criptograma' title='l' value='"+array_criptograma[11]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-m' class='contenedor-caracter-criptograma'>M</span><input type='text' id='criptograma-letra-m' name='criptograma-letra-m' class='contenedor-interior-palabra-criptograma' title='m' value='"+array_criptograma[12]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-n' class='contenedor-caracter-criptograma'>N</span><input type='text' id='criptograma-letra-n' name='criptograma-letra-n' class='contenedor-interior-palabra-criptograma' title='n' value='"+array_criptograma[13]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-ene' class='contenedor-caracter-criptograma'>Ñ</span><input type='text' id='criptograma-letra-ene' name='criptograma-letra-ene' class='contenedor-interior-palabra-criptograma' title='ñ' value='"+array_criptograma[14]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-o' class='contenedor-caracter-criptograma'>O</span><input type='text' id='criptograma-letra-o' name='criptograma-letra-o' class='contenedor-interior-palabra-criptograma' title='o' value='"+array_criptograma[15]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-p' class='contenedor-caracter-criptograma'>P</span><input type='text' id='criptograma-letra-p' name='criptograma-letra-p' class='contenedor-interior-palabra-criptograma' title='p' value='"+array_criptograma[16]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-q' class='contenedor-caracter-criptograma'>Q</span><input type='text' id='criptograma-letra-q' name='criptograma-letra-q' class='contenedor-interior-palabra-criptograma' title='q' value='"+array_criptograma[17]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-r' class='contenedor-caracter-criptograma'>R</span><input type='text' id='criptograma-letra-r' name='criptograma-letra-r' class='contenedor-interior-palabra-criptograma' title='r' value='"+array_criptograma[18]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-s' class='contenedor-caracter-criptograma'>S</span><input type='text' id='criptograma-letra-s' name='criptograma-letra-s' class='contenedor-interior-palabra-criptograma' title='s' value='"+array_criptograma[19]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-t' class='contenedor-caracter-criptograma'>T</span><input type='text' id='criptograma-letra-t' name='criptograma-letra-t' class='contenedor-interior-palabra-criptograma' title='t' value='"+array_criptograma[20]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-u' class='contenedor-caracter-criptograma'>U</span><input type='text' id='criptograma-letra-u' name='criptograma-letra-u' class='contenedor-interior-palabra-criptograma' title='u' value='"+array_criptograma[21]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-v' class='contenedor-caracter-criptograma'>V</span><input type='text' id='criptograma-letra-v' name='criptograma-letra-v' class='contenedor-interior-palabra-criptograma' title='v' value='"+array_criptograma[22]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-w' class='contenedor-caracter-criptograma'>W</span><input type='text' id='criptograma-letra-w' name='criptograma-letra-w' class='contenedor-interior-palabra-criptograma' title='w' value='"+array_criptograma[23]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-x' class='contenedor-caracter-criptograma'>X</span><input type='text' id='criptograma-letra-x' name='criptograma-letra-x' class='contenedor-interior-palabra-criptograma' title='x' value='"+array_criptograma[24]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-y' class='contenedor-caracter-criptograma'>Y</span><input type='text' id='criptograma-letra-y' name='criptograma-letra-y' class='contenedor-interior-palabra-criptograma' title='y' value='"+array_criptograma[25]+"'></div>";
	contenedor_letras_criptograma += "<div class='contenedor-palabra-criptograma'><span id='contenedor-letra-criptograma-z' class='contenedor-caracter-criptograma'>Z</span><input type='text' id='criptograma-letra-z' name='criptograma-letra-z' class='contenedor-interior-palabra-criptograma' title='z' value='"+array_criptograma[26]+"'></div>";




	contenedor_letras_criptograma += "</div></div>";

	contenedor_criptograma += texto_descifrado_criptograma+contenedor_letras_criptograma;

	contenedor_juego_criptograma += contenedor_descripcion_criptograma+reloj_criptograma+contenedor_criptograma+boton_criptograma;
	

	$("#titulo-modalidad-criptogramas").html("<i class='fa fa-arrow-left atras-juego' aria-hidden='true' onclick='jugar_criptogramas();parar_tiempo_criptogramas();'></i><i class='fa fa-unlock-alt' aria-hidden='true'></i>DESCIFRA");
	$("#contenedor-interior-publicaciones-criptogramas").html(contenedor_juego_criptograma);

	reloj_juego_criptograma(dificultad);
	drag_and_drop_juego_criptogramas(dificultad);
}


function parar_tiempo_criptogramas() {

	$("#reloj1-criptograma").countdown360({}).stop();
	$("#reloj2-criptograma").countdown360({}).stop();
	$("#reloj3-criptograma").countdown360({}).stop();
}


function reloj_juego_criptograma(dificultad) {

	var tiempo = 0;
	var reloj = "";
	var mensaje_descifrado_correcto = $("#mensaje-descifrado-correcto").val().toUpperCase();
	var mensaje_descifrado_usuario = "";

	if(dificultad == '1') {

		tiempo = 120;
		reloj = "#reloj1-criptograma";
	}

	else if(dificultad == '2') {

		tiempo = 120;
		reloj = "#reloj2-criptograma";
	}

	else if(dificultad == '3') {

		tiempo = 90;
		reloj = "#reloj3-criptograma";
	}
	

	$(reloj).countdown360({
		radius      : 30,
		seconds     : tiempo,
		fontColor   : '#FFFFFF',
		fillStyle   : '#56c2e1', 
		strokeStyle : '#3f9db8',
		strokeWidth : 5,
		autostart   : false,
		fontSize    : 22,
		fontWeight  : 300,  
		onComplete  : function () {


			var contenido_modal = "";
			var titulo_modal = "";


			if(dificultad == '1') {

				mensaje_descifrado_usuario = $("#texto-descifrado-criptograma1").val().toUpperCase();

				if(mensaje_descifrado_correcto == mensaje_descifrado_usuario) {

					titulo_modal = "CRIPTOGRAMA SUPERADO";

					sumar_puntos(1,3,3);
					historial_juegos(1,3,1,23);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_criptogramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "CRIPTOGRAMA NO SUPERADO";

					restar_puntos(1,3,3);
					historial_juegos(1,3,1,24);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_criptogramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '2') {

				mensaje_descifrado_usuario = $("#texto-descifrado-criptograma2").val().toUpperCase();

				if(mensaje_descifrado_correcto == mensaje_descifrado_usuario) {

					titulo_modal = "CRIPTOGRAMA SUPERADO";

					sumar_puntos(2,3,4);
					historial_juegos(2,3,2,23);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_criptogramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "CRIPTOGRAMA NO SUPERADO";

					restar_puntos(1,3,4);
					historial_juegos(1,3,2,24);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_criptogramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '3') {

				mensaje_descifrado_usuario = $("#texto-descifrado-criptograma3").val().toUpperCase();

				if(mensaje_descifrado_correcto == mensaje_descifrado_usuario) {

					titulo_modal = "CRIPTOGRAMA SUPERADO";

					sumar_puntos(3,3,5);
					historial_juegos(3,3,3,23);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_criptogramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "CRIPTOGRAMA NO SUPERADO";

					restar_puntos(1,3,5);
					historial_juegos(1,3,3,24);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_criptogramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

		    $("#titulo-modal-aviso").text(titulo_modal);
		    $("#contenido-modal-aviso").html(contenido_modal);

		    window.location = "#modal-aviso";
			


			$(reloj).countdown360({}).stop();

		}
	}).start()

}



function comprobar_criptograma(dificultad) {

	var mensaje_descifrado_correcto = $("#mensaje-descifrado-correcto").val().toUpperCase();
	var mensaje_descifrado_usuario = "";

	var contenido_modal = "";
	var titulo_modal = "";
	var reloj = "";


	if(dificultad == '1') {

		reloj = "#reloj1-criptograma";

		mensaje_descifrado_usuario = $("#texto-descifrado-criptograma1").val().toUpperCase();

		if(mensaje_descifrado_correcto == mensaje_descifrado_usuario) {

			titulo_modal = "CRIPTOGRAMA SUPERADO";

			sumar_puntos(1,3,3);
			historial_juegos(1,3,1,23);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_criptogramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "CRIPTOGRAMA NO SUPERADO";

			restar_puntos(1,3,3);
			historial_juegos(1,3,1,24);
			contenido_modal = "<p>El criptograma no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_criptogramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '2') {

		reloj = "#reloj2-criptograma";

		mensaje_descifrado_usuario = $("#texto-descifrado-criptograma2").val().toUpperCase();

		if(mensaje_descifrado_correcto == mensaje_descifrado_usuario) {

			titulo_modal = "CRIPTOGRAMA SUPERADO";

			sumar_puntos(2,3,4);
			historial_juegos(2,3,2,23);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_criptogramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "CRIPTOGRAMA NO SUPERADO";

			restar_puntos(1,3,4);
			historial_juegos(1,3,2,24);
			contenido_modal = "<p>El criptograma no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_criptogramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '3') {

		reloj = "#reloj3-criptograma";

		mensaje_descifrado_usuario = $("#texto-descifrado-criptograma3").val().toUpperCase();

		if(mensaje_descifrado_correcto == mensaje_descifrado_usuario) {

			titulo_modal = "CRIPTOGRAMA SUPERADO";

			sumar_puntos(3,3,5);
			historial_juegos(3,3,3,23);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_criptogramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "CRIPTOGRAMA NO SUPERADO";

			restar_puntos(1,3,5);
			historial_juegos(1,3,3,24);
			contenido_modal = "<p>El criptograma no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_criptogramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_criptogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}


	$(reloj).countdown360({}).stop();


	$("#titulo-modal-aviso").text(titulo_modal);
	$("#contenido-modal-aviso").html(contenido_modal);

	window.location = "#modal-aviso";

}




function descifrar_criptograma(dificultad) {

	var valido = true;

	var error = "";

	var auxiliar_mensaje_cifrado = $("#mensaje-cifrado-criptograma").text();

	var caracter_a = $("#criptograma-letra-a").val();
	var caracter_b = $("#criptograma-letra-b").val();
	var caracter_c = $("#criptograma-letra-c").val();
	var caracter_d = $("#criptograma-letra-d").val();
	var caracter_e = $("#criptograma-letra-e").val();
	var caracter_f = $("#criptograma-letra-f").val();
	var caracter_g = $("#criptograma-letra-g").val();
	var caracter_h = $("#criptograma-letra-h").val();
	var caracter_i = $("#criptograma-letra-i").val();
	var caracter_j = $("#criptograma-letra-j").val();
	var caracter_k = $("#criptograma-letra-k").val();
	var caracter_l = $("#criptograma-letra-l").val();
	var caracter_m = $("#criptograma-letra-m").val();
	var caracter_n = $("#criptograma-letra-n").val();
	var caracter_ene = $("#criptograma-letra-ene").val();
	var caracter_o = $("#criptograma-letra-o").val();
	var caracter_p = $("#criptograma-letra-p").val();
	var caracter_q = $("#criptograma-letra-q").val();
	var caracter_r = $("#criptograma-letra-r").val();
	var caracter_s = $("#criptograma-letra-s").val();
	var caracter_t = $("#criptograma-letra-t").val();
	var caracter_u = $("#criptograma-letra-u").val();
	var caracter_v = $("#criptograma-letra-v").val();
	var caracter_w = $("#criptograma-letra-w").val();
	var caracter_x = $("#criptograma-letra-x").val();
	var caracter_y = $("#criptograma-letra-y").val();
	var caracter_z = $("#criptograma-letra-z").val();


	var letra_a = $("#contenedor-letra-criptograma-a").text();
	var letra_b = $("#contenedor-letra-criptograma-b").text();
	var letra_c = $("#contenedor-letra-criptograma-c").text();
	var letra_d = $("#contenedor-letra-criptograma-d").text();
	var letra_e = $("#contenedor-letra-criptograma-e").text();
	var letra_f = $("#contenedor-letra-criptograma-f").text();
	var letra_g = $("#contenedor-letra-criptograma-g").text();
	var letra_h = $("#contenedor-letra-criptograma-h").text();
	var letra_i = $("#contenedor-letra-criptograma-i").text();
	var letra_j = $("#contenedor-letra-criptograma-j").text();
	var letra_k = $("#contenedor-letra-criptograma-k").text();
	var letra_l = $("#contenedor-letra-criptograma-l").text();
	var letra_m = $("#contenedor-letra-criptograma-m").text();
	var letra_n = $("#contenedor-letra-criptograma-n").text();
	var letra_ene = $("#contenedor-letra-criptograma-ene").text();
	var letra_o = $("#contenedor-letra-criptograma-o").text();
	var letra_p = $("#contenedor-letra-criptograma-p").text();
	var letra_q = $("#contenedor-letra-criptograma-q").text();
	var letra_r = $("#contenedor-letra-criptograma-r").text();
	var letra_s = $("#contenedor-letra-criptograma-s").text();
	var letra_t = $("#contenedor-letra-criptograma-t").text();
	var letra_u = $("#contenedor-letra-criptograma-u").text();
	var letra_v = $("#contenedor-letra-criptograma-v").text();
	var letra_w = $("#contenedor-letra-criptograma-w").text();
	var letra_x = $("#contenedor-letra-criptograma-x").text();
	var letra_y = $("#contenedor-letra-criptograma-y").text();
	var letra_z = $("#contenedor-letra-criptograma-z").text();



	if(auxiliar_mensaje_cifrado != '' && auxiliar_mensaje_cifrado != null) {

		var mensaje_descifrado = "";

		if(caracter_a == '' || caracter_b == '' || caracter_c == '' || caracter_d == '' || caracter_e == '' || caracter_f == '' || caracter_g == '') {

			valido = false;
		}

		if(caracter_h == '' || caracter_i == '' || caracter_j == '' || caracter_k == '' || caracter_l == '' || caracter_m == '' || caracter_n == '') {

			valido = false;
		}

		if(caracter_ene == '' || caracter_o == '' || caracter_p == '' || caracter_q == '' || caracter_r == '' || caracter_s == '' || caracter_t == '') {

			valido = false;
		}

		if(caracter_u == '' || caracter_v == '' || caracter_w == '' || caracter_x == '' || caracter_y == '' || caracter_z == '') {

			valido = false;
		}



		if(valido == false) {

			error = "No has descifrado todas las letras del alfabeto.";
		}


		else {
			//Se cifra el mensaje descifrado

			separadores = ['',' '];

			var mensaje_cifrado = auxiliar_mensaje_cifrado.split(new RegExp (separadores.join('|'),'g'));


			for (i = 0; i < mensaje_cifrado.length; i++) {

				var caracteres_mensaje = true;

				if(mensaje_cifrado[i] == '' || mensaje_cifrado[i] == ' ' || mensaje_cifrado[i] == '.' || mensaje_cifrado[i] == ',' || mensaje_cifrado[i] == '-' || mensaje_cifrado[i] == '!' || mensaje_cifrado[i] == '¡' || mensaje_cifrado[i] == '¿' || mensaje_cifrado[i] == '?' || mensaje_cifrado[i] == '"' || mensaje_cifrado[i] == ':' || mensaje_cifrado[i] == ';') {

					mensaje_descifrado += mensaje_cifrado[i];
				}

				else {

					
					var auxiliar_letra_mayuscula = mensaje_cifrado[i].toUpperCase();
					var auxiliar_letra_minuscula = mensaje_cifrado[i].toLowerCase();

					//var auxiliar_letra = $(':input[value="'+auxiliar_letra_minuscula+'"][value="'+auxiliar_letra_mayuscula+'"]').attr("title");
					//var auxiliar_letra = $('input[value="'+mensaje_cifrado[i]+'"]').attr("title");
					var auxiliar_letra = $('input[value="'+mensaje_cifrado[i]+'"]').prev(".contenedor-caracter-criptograma").text();

					mensaje_descifrado += auxiliar_letra;
					//mensaje_descifrado += auxiliar_letra.toUpperCase();
					//mensaje_descifrado += mensaje_cifrado[i];
					//mensaje_descifrado += $(':input[value="N"]').attr("title");
				}
			    
			}



			if(dificultad == '1') {

				$("#texto-descifrado-criptograma1").val(mensaje_descifrado);
	  		}

	  		else if(dificultad == '2') {

	  			$("#texto-descifrado-criptograma2").val(mensaje_descifrado);
	  		}

	  		else if(dificultad == '3') {

	  			$("#texto-descifrado-criptograma3").val(mensaje_descifrado);
	  		}

		}



	}

	else {

	}


	if(error != '') {

		var titulo_modal = "DESCIFRADO NO VÁLIDO";
		var contenido_modal = "<p>"+error+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		
		$("#titulo-modal-aviso").text(titulo_modal);
		$("#contenido-modal-aviso").html(contenido_modal);

		window.location = "#modal-aviso";
	}

}


function drag_and_drop_juego_criptogramas(dificultad) {


  $('.contenedor-caracter-criptograma').click(function() { 
  	if($(this).next().val() != '' && $(this).next().val() != null) {

  		if(dificultad == '1') {

  			$("#texto-descifrado-criptograma1").insertAtCaret($(this).text());
  		}

  		else if(dificultad == '2') {

  			$("#texto-descifrado-criptograma2").insertAtCaret($(this).text());
  		}

  		else if(dificultad == '3') {

  			$("#texto-descifrado-criptograma3").insertAtCaret($(this).text());
  		}
  		
  	}
    return false
  });

  $(".contenedor-palabra-criptograma").draggable({helper: 'clone'});
  $(".txtDropTarget").droppable({
    accept: ".contenedor-palabra-criptograma",
    drop: function(ev, ui) {
      //$(this).insertAtCaret(ui.draggable.text());
      //$(this).insertAtCaret(ui.draggable.children('.contenedor-interior-palabra-criptograma').val());
      $(this).insertAtCaret(ui.draggable.children('.contenedor-caracter-criptograma').text());
    }
  });

}






$("#cerrar-modalidad-criptogramas").click(function(){

	$("#modalidad-criptogramas").addClass("ocultar-modal-modalidad");

});


// LIPOGRAMAS

$("#boton-ver-lipogramas").click(function(){

	var publicaciones_auxiliar = ver_publicaciones('4','1');

	$("#modalidad-lipogramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-lipogramas").removeClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-lipogramas").addClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-lipogramas").text("LIPOGRAMAS PUBLICADOS");
	$("#contenedor-interior-publicaciones-lipogramas").html(publicaciones_auxiliar);

});


$('input[type=radio][name=filtro-publicaciones-lipogramas]').change(function() {

	var lipogramas_publicados = "";
        
    var filtro_lipogramas = $('input[type=radio][name=filtro-publicaciones-lipogramas]:checked').val();

    lipogramas_publicados = ver_publicaciones('4',filtro_lipogramas);

    $("#contenedor-interior-publicaciones-lipogramas").html(lipogramas_publicados);

});


$("#boton-crear-lipogramas").click(function(){

	var crear_lipogramas = "<form id='creacion-lipogramas' name='creacion-lipogramas' class='form-creacion-publicacion' action='' method='post'>";
	crear_lipogramas += "<div class='contenedor-texto-creacion'>";
	crear_lipogramas += "<textarea id='texto-creacion-lipogramas' name='texto-creacion-lipogramas' class='texto-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ TU LIPOGRAMA'></textarea>";
	crear_lipogramas += "<input type='hidden' id='id-usuario-creacion-lipogramas' name='id-usuario-creacion-lipogramas' value='"+id_usuario+"'>";
	crear_lipogramas += "</div>";
	crear_lipogramas += "<div class='contenedor-botones-creacion'>";
	crear_lipogramas += "<a onclick='limpiar_lipogramas()' class='boton-creacion'>LIMPIAR</a>";
	crear_lipogramas += "<div id='error-creacion-lipogramas' class='error-oculto'>ERROR</div>";
	crear_lipogramas += "<a onclick='validacion_lipogramas()' class='boton-creacion'>PUBLICAR</a>";
	crear_lipogramas += "</div>";
	crear_lipogramas += "</form>";

	crear_lipogramas += "<div class='precontenedor-adicional-creacion'>";
	crear_lipogramas += "<a id='enlace-recursos-lipogramas' onclick='recursos_lipogramas()'><i class='fa fa-cog' aria-hidden='true'></i> RECURSOS</a>";
	crear_lipogramas += "<a id='enlace-consejos-lipogramas' onclick='consejos_lipogramas()'><i class='fa fa-lightbulb-o' aria-hidden='true'></i> CONSEJOS</a>";
	crear_lipogramas += "<a id='enlace-informacion-lipogramas' onclick='informacion_lipogramas()'><i class='fa fa-info-circle' aria-hidden='true'></i> INFORMACIÓN</a>";
	crear_lipogramas += "<a id='enlace-ayuda-lipogramas' onclick='ayuda_lipogramas()'><i class='fa fa-question-circle' aria-hidden='true'></i> AYUDA</a>";
	crear_lipogramas += "</div>";

	crear_lipogramas += "<div id='contenedor-adicional-lipogramas' class='contenedor-adicional-creacion'></div>";



	$("#modalidad-lipogramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-lipogramas").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-lipogramas").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-lipogramas").text("CREA UN LIPOGRAMA");
	$("#contenedor-interior-publicaciones-lipogramas").html(crear_lipogramas);

	recursos_lipogramas();

});



function limpiar_lipogramas() {

	$("#texto-creacion-lipogramas").val("");
}


function validacion_lipogramas() {

	var valido = true;

	var lipograma = $("#texto-creacion-lipogramas").val();


	if(lipograma == "") {
		//El lipograma esta vacio
		$("#error-creacion-lipogramas").text("Lipograma vacío");
		$("#error-creacion-lipogramas").removeClass("error-oculto");
		$("#error-creacion-lipogramas").addClass("error");
		$("#texto-creacion-lipogramas").addClass("input-warning");

		valido = false;
	}

	publicar_lipogramas(valido);

}


function publicar_lipogramas(valido) {

	if(valido == true) {

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


		$.ajax({

		    type: "POST",
		    url: "../php/modalidades/publicar_lipogramas.php",
		    data: $("#creacion-lipogramas").serialize(),
		    success: function(data, status) {

		    	error = data.split("-");

	            numero = error[0];
	            cadena = error[1];


		        if(numero == "1") {

		        	sumar_puntos(3,4,2);

		        	contenido_modal = "<p>"+cadena+"</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("LIPOGRAMA PUBLICADO");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else if(numero == "2") {

		        	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else {

		        	contenido_modal = "<p></p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

			}

		});

	}	


}

function recursos_lipogramas() {

	$("#enlace-recursos-lipogramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-lipogramas").removeClass("enlace-seleccionado-subcontenedor");

	var recursos_lipogramas = "<div class='subcontenedor1-adicional-creacion'>";
	recursos_lipogramas += "<form id='buscar-recursos-lipogramas' name='buscar-recursos-lipogramas' class='form-buscar-recursos' action='' method='post'>";
	recursos_lipogramas += "<i class='fa fa-angle-right desplegable-recursos' aria-hidden='true'></i>";
	recursos_lipogramas += "<select id='opcion-recursos-lipogramas' name='opcion-recursos-lipogramas' class=''>";
	recursos_lipogramas += "<option value='1'>Palabras que no contengan:</option>";
	recursos_lipogramas += "</select>";
	recursos_lipogramas += "<input id='cadena-recursos-lipogramas' name='cadena-recursos-lipogramas' type='text' class='cadena-recursos' />";
	recursos_lipogramas += "<input type='hidden' id='id-usuario-recursos-lipogramas' name='id-usuario-recursos-lipogramas' value='"+id_usuario+"'>";
	recursos_lipogramas += "<a onclick='obtener_recursos_lipogramas()' class='boton-recursos'>BUSCAR</a>";
	recursos_lipogramas += "</form>";
	recursos_lipogramas += "</div>";
	recursos_lipogramas += "<div id='contenedor-palabras-lipogramas' class='subcontenedor2-adicional-creacion'>";
	recursos_lipogramas += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el lipograma.</p></div>";

	$("#contenedor-adicional-lipogramas").html(recursos_lipogramas);
}

function obtener_recursos_lipogramas() {


	$.ajax({

	    type: "POST",
	    url: "../php/modalidades/palabras_lipogramas.php",
	    data: $("#buscar-recursos-lipogramas").serialize(),
	    success: function(data, status) {


	    	var contenido_palabras = "";

			
			if(data == "vacio") {

	        	contenido_palabras += "<p>No se han encontrado palabras que no contengan las letras introducidas.</p>";

	        	$("#contenedor-palabras-lipogramas").html(contenido_palabras);
	        }

	        else if(data == "sin") {

	        	contenido_palabras += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el lipograma.</p>";

	        	$("#contenedor-palabras-lipogramas").html(contenido_palabras);
	        }


	        else {

	        	var array_palabras = JSON.parse(data);


	        	for (i = 0; i < array_palabras.length; i++) {

			    	contenido_palabras += "<div class='contenedor-palabra-recurso'>"+array_palabras[i].palabra+"</div>";
				}

	        	$("#contenedor-palabras-lipogramas").html(contenido_palabras);

	        	drag_and_drop_lipogramas();
	        }


		}

	});

}


function drag_and_drop_lipogramas() {


  $('.contenedor-palabra-recurso').click(function() { 
    $("#texto-creacion-lipogramas").insertAtCaret($(this).text());
    return false
  });

  $(".contenedor-palabra-recurso").draggable({helper: 'clone'});
  $(".txtDropTarget").droppable({
    accept: ".contenedor-palabra-recurso",
    drop: function(ev, ui) {
      $(this).insertAtCaret(ui.draggable.text());
    }
  });

}


function consejos_lipogramas() {

	$("#enlace-recursos-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-lipogramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-lipogramas").removeClass("enlace-seleccionado-subcontenedor");

	var consejos_lipogramas = "<div class='subcontenedor3-adicional-creacion'>";
	consejos_lipogramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Para que tu lipograma sea lo más correcto posible, puedes seguir los siguientes consejos: <br><br>";
	consejos_lipogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Utiliza conjunciones y otros monosílabos, de manera auxiliar, puesto que tienen pocas letras y facilitan la cohesión del texto.  <br>";
	consejos_lipogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Cuantas más letras descartes, más largas sean las palabras utilizadas y el texto en sí, más destacará en el listado de publicaciones. <br>";
	consejos_lipogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Lee tu lipograma y asegúrate de que está bien cohesionado y es coherente, cuando consideres que está acabado, antes de publicarlo. <br><br></p>";
	consejos_lipogramas += "</div>";


	$("#contenedor-adicional-lipogramas").html(consejos_lipogramas);

}


function informacion_lipogramas() {

	$("#enlace-recursos-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-lipogramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-lipogramas").removeClass("enlace-seleccionado-subcontenedor");

	var informacion_lipogramas = "<div class='subcontenedor3-adicional-creacion'>";
	informacion_lipogramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Los <strong>lipogramas</strong> son textos en los que se omite sistemáticamente alguna letra (o varias) del alfabeto, siendo ésta muy común. <br><br>";
	informacion_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> El grado de dificultad de un lipograma es proporcional al número de letras omitidas, a la frecuencia de su omisión y a la extensión del texto. <br><br>";
	informacion_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Su uso reside y se aplica, principalmente, en la literatura, a modo de innovación y aportación de nuevas formas.</p>";
	informacion_lipogramas += "</div>";

	$("#contenedor-adicional-lipogramas").html(informacion_lipogramas);

}

function ayuda_lipogramas() {

	$("#enlace-recursos-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-lipogramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-lipogramas").addClass("enlace-seleccionado-subcontenedor");

	var ayuda_lipogramas = "<div class='subcontenedor3-adicional-creacion'>";
	ayuda_lipogramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Puedes crear el lipograma de manera libre, rellenando el campo superior dedicado a ello, o haciendo uso del recurso ofrecido. <br><br>";
	ayuda_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> El recurso está basado en la búsqueda de palabras que se adapten a las características deseadas de tu lipograma: <br><br>";
	ayuda_lipogramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que no contengan la/s letra/s</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de una letra y, si son varias, separadas por comas). <br><br>";
	ayuda_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Se ofrece este recurso puesto que el lipograma debe omitir deliberadamente una o varias letras del alfabeto y la manera más simple de hacerlo es seleccionando distintas palabras que no contengan la/s letra/s deseada/s. <br><br>";
	ayuda_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez realizada la búsqueda, se ofrece el listado de palabras correspondiente a la misma. <br>";
	ayuda_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Estas palabras se pueden añadir al campo superior dedicado a la creación del lipograma pulsando sobre ellas o arrastrándolas al mismo, teniendo en cuenta que se colocarán en la última posición marcada por el puntero <i class='fa fa-i-cursor' aria-hidden='true'></i> en dicho campo. <br><br>";
	ayuda_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Si en algún momento, durante la creación del lipograma, decides empezar de nuevo porque no te convence el resultado, se te facilita la opción de limpiar el campo correspondiente, lo cual puede ser útil en consideración con la extensión de tu creación. <br><br>";
	ayuda_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez creado el lipograma, independientemente de la forma escogida, puedes publicarlo. De esta manera, tu creación pasará a ser pública y aparecerá en el listado de publicaciones de lipogramas de la página, pudiendo acceder a ella cualquier usuario. <br><br>";
	ayuda_lipogramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> En el listado de publicaciones correspondiente puedes ver tus creaciones y eliminarlas, si así lo deseas, pero no editarlas.</p>";
	ayuda_lipogramas += "</div>";

	$("#contenedor-adicional-lipogramas").html(ayuda_lipogramas);

}



function jugar_lipogramas() {

	window.location = "#cerrar";

	var jugar_lipogramas = "<h3 class='titulo-juego'><i class='fa fa-square-o' aria-hidden='true'></i>DESAPARECIDAS</h3>";
	jugar_lipogramas += "<div class='descripcion-juego'>El juego consiste en averiguar, a partir de algunas propuestas, qué letras no aparecen en un lipograma asignado aleatoriamente. <br>";
	jugar_lipogramas += "Se dispone de temporizador, como factor adicional a superar, ajustado específicamente a cada una de las tres dificultades: </div>";

	jugar_lipogramas += "<div class='contenedor-dificultad-juego'>";
	jugar_lipogramas += "<div onclick='juego_lipogramas(1)' class='boton boton-dificultad-juego'>NOVATO</div>";
	jugar_lipogramas += "<div class='descripcion-dificultad-juego'>Lipograma fácil. 1 vocal desaparecida. A resolver antes de 30 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 1 PUNTO</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_lipogramas += "</div>";

	jugar_lipogramas += "<div class='contenedor-dificultad-juego'>";
	jugar_lipogramas += "<div onclick='juego_lipogramas(2)' class='boton boton-dificultad-juego'>AVANZADO</div>";
	jugar_lipogramas += "<div class='descripcion-dificultad-juego'>Lipograma medio. 1 consonante desaparecida. A resolver antes de 25 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 2 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_lipogramas += "</div>";

	jugar_lipogramas += "<div class='contenedor-dificultad-juego'>";
	jugar_lipogramas += "<div onclick='juego_lipogramas(3)' class='boton boton-dificultad-juego'>EXPERTO</div>";
	jugar_lipogramas += "<div class='descripcion-dificultad-juego'>Lipograma difícil. Varias letras desaparecidas. A resolver antes de 25 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 3 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_lipogramas += "</div>";


	$("#modalidad-lipogramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-lipogramas").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-lipogramas").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-lipogramas").text("JUEGA CON LIPOGRAMAS");
	$("#contenedor-interior-publicaciones-lipogramas").html(jugar_lipogramas);

}



function juego_lipogramas(dificultad) {

	window.location = "#cerrar";

	array_lipogramas = [];
	letra_anterior_lipograma = "";
	var reloj_lipograma = "";
	var texto_lipograma = "";
	var letras_propuestas_lipograma = "";
	var letras_correctas_lipograma = "";
	var contenedor_juego_lipograma = "";
	var boton_lipograma = "";
	var contenedor_descripcion_lipograma = "";


	if(dificultad == '1') {

		contenedor_descripcion_lipograma += "<div class='descripcion-interior-juego'>Tienes que averiguar qué vocal no se ha utilizado en el siguiente lipograma, pulsando sobre ella. Si terminas antes de que acabe el tiempo puedes pulsar en el botón 'COMPROBAR'. Si lo completas antes de que se acabe el tiempo, habrás superado el lipograma. ¡A por ello, que el tiempo vuela!</div>";
	}

	else if(dificultad == '2') {

		contenedor_descripcion_lipograma += "<div class='descripcion-interior-juego'>Tienes que averiguar qué consonante no se ha utilizado en el siguiente lipograma, pulsando sobre ella. Si terminas antes de que acabe el tiempo puedes pulsar en el botón 'COMPROBAR'. Si lo completas antes de que se acabe el tiempo, habrás superado el lipograma. ¡A por ello, que el tiempo vuela!</div>";
	}

	else if(dificultad == '3') {

		contenedor_descripcion_lipograma += "<div class='descripcion-interior-juego'>Tienes que averiguar qué letras no se han utilizado en el siguiente lipograma, pulsando sobre ellas. Si terminas antes de que acabe el tiempo puedes pulsar en el botón 'COMPROBAR'. Si lo completas antes de que se acabe el tiempo, habrás superado el lipograma. ¡A por ello, que el tiempo vuela!</div>";
	}

	
	var contenedor_lipograma = "<div class='contenedor-texto-trabalenguas'>";


	$.ajax({

		type: "POST",
		url: "../php/modalidades/juego_lipogramas.php",
		async: false,
		data: { id_usuario: id_usuario, dificultad: dificultad },
		success: function(data, status) {

			if(data != "vacio") {

				var lipogramas = JSON.parse(data);

				texto_lipograma = lipogramas.texto;
				letras_propuestas_lipograma = lipogramas.letras_propuestas;
				letras_correctas_lipograma = lipogramas.letras_correctas;
			}

			else {

				texto_lipograma = "HA OCURRIDO UN ERROR";
			}

		}

	});


	contenedor_lipograma += texto_lipograma + "</div>";

	contenedor_descripcion_lipograma += "<input type='hidden' id='auxiliar-letras-correctas-lipograma' name='auxiliar-letras-correctas-lipograma' value='"+letras_correctas_lipograma+"'>";
	contenedor_descripcion_lipograma += "<input type='hidden' id='letras-marcadas-lipograma' name='letras-marcadas-lipograma' value=''>";


	var contenedor_letras_lipograma = "<div class='contenedor-letras-lipograma'>";



	if(dificultad == '1') {

		reloj_lipograma = "<div id='reloj1-lipograma' class='reloj-juego'></div>";

		var letras1_propuestas_lipograma = letras_propuestas_lipograma.split("-");

		for (i = 0; i < letras1_propuestas_lipograma.length; i++) {

			//contenedor_letras_lipograma += "<div class='letras-lipograma' onclick='marcar_letra_lipograma(1,this,\""+letras1_propuestas_lipograma[i]+"\")'>"+letras1_propuestas_lipograma[i]+"</div>";
			contenedor_letras_lipograma += "<div class='letras-lipograma' onclick='marcar_letra_lipograma(1,this)'>"+letras1_propuestas_lipograma[i]+"</div>";
		}

		boton_lipograma += "<div class='boton boton-comprobar' onclick='comprobar_lipograma(1)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '2') {
		
		reloj_lipograma = "<div id='reloj2-lipograma' class='reloj-juego'></div>";

		var letras2_propuestas_lipograma = letras_propuestas_lipograma.split("-");

		for (i = 0; i < letras2_propuestas_lipograma.length; i++) {

			contenedor_letras_lipograma += "<div class='letras-lipograma' onclick='marcar_letra_lipograma(2,this)'>"+letras2_propuestas_lipograma[i]+"</div>";
		}

		boton_lipograma += "<div class='boton boton-comprobar' onclick='comprobar_lipograma(2)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '3') {
		
		reloj_lipograma = "<div id='reloj3-lipograma' class='reloj-juego'></div>";

		var letras3_propuestas_lipograma = letras_propuestas_lipograma.split("-");

		for (i = 0; i < letras3_propuestas_lipograma.length; i++) {

			contenedor_letras_lipograma += "<div class='letras-lipograma' onclick='marcar_letra_lipograma(3,this)'>"+letras3_propuestas_lipograma[i]+"</div>";
		}

		boton_lipograma += "<div class='boton boton-comprobar' onclick='comprobar_lipograma(3)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}


	contenedor_letras_lipograma += "</div>";

	contenedor_lipograma += contenedor_letras_lipograma;

	contenedor_juego_lipograma += contenedor_descripcion_lipograma+reloj_lipograma+contenedor_lipograma+boton_lipograma;
	

	$("#titulo-modalidad-lipogramas").html("<i class='fa fa-arrow-left atras-juego' aria-hidden='true' onclick='jugar_lipogramas();parar_tiempo_lipogramas();'></i><i class='fa fa-square-o' aria-hidden='true'></i>DESAPARECIDAS");
	$("#contenedor-interior-publicaciones-lipogramas").html(contenedor_juego_lipograma);

	reloj_juego_lipograma(dificultad);
}


function parar_tiempo_lipogramas() {

	$("#reloj1-lipograma").countdown360({}).stop();
	$("#reloj2-lipograma").countdown360({}).stop();
	$("#reloj3-lipograma").countdown360({}).stop();
}


function marcar_letra_lipograma(dificultad,letra) {

	var texto_letra = "";
	var contiene = "";
	var posicion_auxiliar = "";

	if(dificultad == '1') {

		texto_letra = $(letra).text();
		$("#letras-marcadas-lipograma").val(texto_letra);

		contiene = array_lipogramas.includes(texto_letra);

		if(contiene == true) {

			$(letra).removeClass("letra-seleccionada-lipograma");

			for (i = 0; i < array_lipogramas.length; i++) {

				if(array_lipogramas[i] == texto_letra) {

					posicion_auxiliar = i;
				}

			}

			array_lipogramas.splice(posicion_auxiliar,1);
		}

		else {

			$(letra).addClass("letra-seleccionada-lipograma");
			array_lipogramas.push(texto_letra);
			$(letra_anterior_lipograma).removeClass("letra-seleccionada-lipograma");
		}

		letra_anterior_lipograma = letra;
	}

	else if(dificultad == '2') {

		texto_letra = $(letra).text();
		$("#letras-marcadas-lipograma").val(texto_letra);

		contiene = array_lipogramas.includes(texto_letra);

		if(contiene == true) {

			$(letra).removeClass("letra-seleccionada-lipograma");

			for (i = 0; i < array_lipogramas.length; i++) {

				if(array_lipogramas[i] == texto_letra) {

					posicion_auxiliar = i;
				}

			}

			array_lipogramas.splice(posicion_auxiliar,1);
		}

		else {

			$(letra).addClass("letra-seleccionada-lipograma");
			array_lipogramas.push(texto_letra);
			$(letra_anterior_lipograma).removeClass("letra-seleccionada-lipograma");
		}


		letra_anterior_lipograma = letra;
	}

	else if(dificultad == '3') {

		texto_letra = $(letra).text();

		contiene = array_lipogramas.includes(texto_letra);

		if(contiene == true) {
			//Ya ha pulsado sobre esta letra, se deselecciona

			$(letra).removeClass("letra-seleccionada-lipograma");

			posicion_auxiliar = "";

			for (i = 0; i < array_lipogramas.length; i++) {

				if(array_lipogramas[i] == texto_letra) {

					posicion_auxiliar = i;
				}

			}

			array_lipogramas.splice(posicion_auxiliar,1);

		}

		else {
			//No ha pulsado sobre esta letra, se selecciona

			$(letra).addClass("letra-seleccionada-lipograma");

			array_lipogramas.push(texto_letra);
		}


		var letras = array_lipogramas.toString();

		$("#letras-marcadas-lipograma").val(letras);

	}


}



function reloj_juego_lipograma(dificultad) {

	var tiempo = 0;
	var reloj = "";
	var auxiliar_letras_correctas = $("#auxiliar-letras-correctas-lipograma").val();
	var letras_correctas = auxiliar_letras_correctas.split("-");

	var total_letras_correctas = letras_correctas.length;
	var numero_letras_correctas = 0;


	if(dificultad == '1') {

		tiempo = 30;
		reloj = "#reloj1-lipograma";
	}

	else if(dificultad == '2') {

		tiempo = 25;
		reloj = "#reloj2-lipograma";
	}

	else if(dificultad == '3') {

		tiempo = 25;
		reloj = "#reloj3-lipograma";
	}
	

	$(reloj).countdown360({
		radius      : 30,
		seconds     : tiempo,
		fontColor   : '#FFFFFF',
		fillStyle   : '#56c2e1', 
		strokeStyle : '#3f9db8',
		strokeWidth : 5,
		autostart   : false,
		fontSize    : 22,
		fontWeight  : 300,  
		onComplete  : function () {


			var auxiliar_letras_marcadas = $("#letras-marcadas-lipograma").val();
			var letras_marcadas = auxiliar_letras_marcadas.split(",");


			var contenido_modal = "";
			var titulo_modal = "";


			if(dificultad == '1') {

				for (i = 0; i < letras_correctas.length; i++) {

					for (j = 0; j < letras_marcadas.length; j++) {

						if(letras_correctas[i] == letras_marcadas[j]) {

							numero_letras_correctas = numero_letras_correctas+1;
						}
					
					}
					
				}


				if(numero_letras_correctas == total_letras_correctas) {

					titulo_modal = "LIPOGRAMA SUPERADO";

					sumar_puntos(1,4,3);
					historial_juegos(1,4,1,25);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_lipogramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "LIPOGRAMA NO SUPERADO";

					restar_puntos(1,4,3);
					historial_juegos(1,4,1,26);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_lipogramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '2') {

				for (i = 0; i < letras_correctas.length; i++) {

					for (j = 0; j < letras_marcadas.length; j++) {

						if(letras_correctas[i] == letras_marcadas[j]) {

							numero_letras_correctas = numero_letras_correctas+1;
						}
					
					}
					
				}

				if(numero_letras_correctas == total_letras_correctas) {

					titulo_modal = "LIPOGRAMA SUPERADO";

					sumar_puntos(2,4,4);
					historial_juegos(2,4,2,25);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_lipogramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "LIPOGRAMA NO SUPERADO";

					restar_puntos(1,4,4);
					historial_juegos(1,4,2,26);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_lipogramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '3') {

				for (i = 0; i < letras_correctas.length; i++) {

					for (j = 0; j < letras_marcadas.length; j++) {

						if(letras_correctas[i] == letras_marcadas[j]) {

							numero_letras_correctas = numero_letras_correctas+1;
						}
					
					}
					
				}

				if(numero_letras_correctas == total_letras_correctas) {

					titulo_modal = "LIPOGRAMA SUPERADO";

					sumar_puntos(3,4,5);
					historial_juegos(3,4,3,25);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_lipogramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "LIPOGRAMA NO SUPERADO";

					restar_puntos(1,4,5);
					historial_juegos(1,4,3,26);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_lipogramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

		    $("#titulo-modal-aviso").text(titulo_modal);
		    $("#contenido-modal-aviso").html(contenido_modal);

		    window.location = "#modal-aviso";
			


			$(reloj).countdown360({}).stop();

		}
	}).start()

}



function comprobar_lipograma(dificultad) {

	var auxiliar_letras_correctas = $("#auxiliar-letras-correctas-lipograma").val();
	var letras_correctas = auxiliar_letras_correctas.split("-");

	var total_letras_correctas = letras_correctas.length;
	var numero_letras_correctas = 0;

	var auxiliar_letras_marcadas = $("#letras-marcadas-lipograma").val();
	var letras_marcadas = auxiliar_letras_marcadas.split(",");

	var contenido_modal = "";
	var titulo_modal = "";
	var reloj = "";


	if(dificultad == '1') {

		reloj = "#reloj1-lipograma";

		for (i = 0; i < letras_correctas.length; i++) {

			for (j = 0; j < letras_marcadas.length; j++) {

				if(letras_correctas[i] == letras_marcadas[j]) {

					numero_letras_correctas = numero_letras_correctas+1;
				}
					
			}
					
		}


		if(numero_letras_correctas == total_letras_correctas) {

			titulo_modal = "LIPOGRAMA SUPERADO";

			sumar_puntos(1,4,3);
			historial_juegos(1,4,1,25);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_lipogramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "LIPOGRAMA NO SUPERADO";

			restar_puntos(1,4,3);
			historial_juegos(1,4,1,26);
			contenido_modal = "<p>El lipograma no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_lipogramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '2') {

		reloj = "#reloj2-lipograma";

		for (i = 0; i < letras_correctas.length; i++) {

			for (j = 0; j < letras_marcadas.length; j++) {

				if(letras_correctas[i] == letras_marcadas[j]) {

					numero_letras_correctas = numero_letras_correctas+1;
				}
					
			}
					
		}

		if(numero_letras_correctas == total_letras_correctas) {

			titulo_modal = "LIPOGRAMA SUPERADO";

			sumar_puntos(2,4,4);
			historial_juegos(2,4,2,25);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_lipogramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "LIPOGRAMA NO SUPERADO";

			restar_puntos(1,4,4);
			historial_juegos(1,4,2,26);
			contenido_modal = "<p>El lipograma no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_lipogramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '3') {

		reloj = "#reloj3-lipograma";

		for (i = 0; i < letras_correctas.length; i++) {

			for (j = 0; j < letras_marcadas.length; j++) {

				if(letras_correctas[i] == letras_marcadas[j]) {

					numero_letras_correctas = numero_letras_correctas+1;
				}
					
			}
					
		}

		if(numero_letras_correctas == total_letras_correctas) {

			titulo_modal = "LIPOGRAMA SUPERADO";

			sumar_puntos(3,4,5);
			historial_juegos(3,4,3,25);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_lipogramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "LIPOGRAMA NO SUPERADO";

			restar_puntos(1,4,5);
			historial_juegos(1,4,3,26);
			contenido_modal = "<p>El lipograma no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_lipogramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_lipogramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}


	$(reloj).countdown360({}).stop();


	$("#titulo-modal-aviso").text(titulo_modal);
	$("#contenido-modal-aviso").html(contenido_modal);

	window.location = "#modal-aviso";
			

}





$("#cerrar-modalidad-lipogramas").click(function(){

	$("#modalidad-lipogramas").addClass("ocultar-modal-modalidad");

});


// PANGRAMAS

$("#boton-ver-pangramas").click(function(){

	var publicaciones_auxiliar = ver_publicaciones('5','1');

	$("#modalidad-pangramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-pangramas").removeClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-pangramas").addClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-pangramas").text("PANGRAMAS PUBLICADOS");
	$("#contenedor-interior-publicaciones-pangramas").html(publicaciones_auxiliar);

});


$('input[type=radio][name=filtro-publicaciones-pangramas]').change(function() {

	var pangramas_publicados = "";
        
    var filtro_pangramas = $('input[type=radio][name=filtro-publicaciones-pangramas]:checked').val();

    pangramas_publicados = ver_publicaciones('5',filtro_pangramas);

    $("#contenedor-interior-publicaciones-pangramas").html(pangramas_publicados);

});


$("#boton-crear-pangramas").click(function(){


	var crear_pangramas = "<form id='creacion-pangramas' name='creacion-pangramas' class='form-creacion-publicacion' action='' method='post'>";
	crear_pangramas += "<div class='contenedor-texto-creacion'>";
	crear_pangramas += "<textarea id='texto-creacion-pangramas' name='texto-creacion-pangramas' class='texto-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ TU PANGRAMA'></textarea>";
	crear_pangramas += "<input type='hidden' id='id-usuario-creacion-pangramas' name='id-usuario-creacion-pangramas' value='"+id_usuario+"'>";
	crear_pangramas += "</div>";
	crear_pangramas += "<div class='contenedor-botones-creacion'>";
	crear_pangramas += "<a onclick='limpiar_pangramas()' class='boton-creacion'>LIMPIAR</a>";
	crear_pangramas += "<div id='error-creacion-pangramas' class='error-oculto'>ERROR</div>";
	crear_pangramas += "<a onclick='validacion_pangramas()' class='boton-creacion'>PUBLICAR</a>";
	crear_pangramas += "</div>";
	crear_pangramas += "</form>";

	crear_pangramas += "<div class='precontenedor-adicional-creacion'>";
	crear_pangramas += "<a id='enlace-recursos-pangramas' onclick='recursos_pangramas()'><i class='fa fa-cog' aria-hidden='true'></i> RECURSOS</a>";
	crear_pangramas += "<a id='enlace-consejos-pangramas' onclick='consejos_pangramas()'><i class='fa fa-lightbulb-o' aria-hidden='true'></i> CONSEJOS</a>";
	crear_pangramas += "<a id='enlace-informacion-pangramas' onclick='informacion_pangramas()'><i class='fa fa-info-circle' aria-hidden='true'></i> INFORMACIÓN</a>";
	crear_pangramas += "<a id='enlace-ayuda-pangramas' onclick='ayuda_pangramas()'><i class='fa fa-question-circle' aria-hidden='true'></i> AYUDA</a>";
	crear_pangramas += "</div>";

	crear_pangramas += "<div id='contenedor-adicional-pangramas' class='contenedor-adicional-creacion'></div>";


	$("#modalidad-pangramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-pangramas").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-pangramas").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-pangramas").text("CREA UN PANGRAMA");
	$("#contenedor-interior-publicaciones-pangramas").html(crear_pangramas);

	recursos_pangramas();

});



function limpiar_pangramas() {

	$("#texto-creacion-pangramas").val("");
}


function validacion_pangramas() {

	var valido = true;

	var pangrama = $("#texto-creacion-pangramas").val();


	if(pangrama == "") {
		//El pangrama esta vacio
		$("#error-creacion-pangramas").text("Pangrama vacío");
		$("#error-creacion-pangramas").removeClass("error-oculto");
		$("#error-creacion-pangramas").addClass("error");
		$("#texto-creacion-pangramas").addClass("input-warning");

		valido = false;
	}

	publicar_pangramas(valido);

}


function publicar_pangramas(valido) {

	if(valido == true) {

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


		$.ajax({

		    type: "POST",
		    url: "../php/modalidades/publicar_pangramas.php",
		    data: $("#creacion-pangramas").serialize(),
		    success: function(data, status) {

		    	error = data.split("-");

	            numero = error[0];
	            cadena = error[1];


		        if(numero == "1") {

		        	sumar_puntos(3,5,2);

		        	contenido_modal = "<p>"+cadena+"</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("PANGRAMA PUBLICADO");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else if(numero == "2") {

		        	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else {

		        	contenido_modal = "<p></p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

			}

		});

	}	


}

function recursos_pangramas() {

	$("#enlace-recursos-pangramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-pangramas").removeClass("enlace-seleccionado-subcontenedor");

	var recursos_pangramas = "<div class='subcontenedor1-adicional-creacion'>";
	recursos_pangramas += "<form id='buscar-recursos-pangramas' name='buscar-recursos-pangramas' class='form-buscar-recursos' action='' method='post'>";
	recursos_pangramas += "<i class='fa fa-angle-right desplegable-recursos' aria-hidden='true'></i>";
	recursos_pangramas += "<select id='opcion-recursos-pangramas' name='opcion-recursos-pangramas' class=''>";
	recursos_pangramas += "<option value='1'>Palabras que contengan:</option>";
	recursos_pangramas += "</select>";
	recursos_pangramas += "<input id='cadena-recursos-pangramas' name='cadena-recursos-pangramas' type='text' class='cadena-recursos' />";
	recursos_pangramas += "<input type='hidden' id='id-usuario-recursos-pangramas' name='id-usuario-recursos-pangramas' value='"+id_usuario+"'>";
	recursos_pangramas += "<a onclick='obtener_recursos_pangramas()' class='boton-recursos'>BUSCAR</a>";
	recursos_pangramas += "</form>";
	recursos_pangramas += "</div>";
	recursos_pangramas += "<div id='contenedor-palabras-pangramas' class='subcontenedor2-adicional-creacion'>";
	recursos_pangramas += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el pangrama.</p></div>";

	$("#contenedor-adicional-pangramas").html(recursos_pangramas);
}

function obtener_recursos_pangramas() {


	$.ajax({

	    type: "POST",
	    url: "../php/modalidades/palabras_pangramas.php",
	    data: $("#buscar-recursos-pangramas").serialize(),
	    success: function(data, status) {

	    	var contenido_palabras = "";

			
			if(data == "vacio") {

	        	contenido_palabras += "<p>No se han encontrado palabras que contengan las letras introducidas.</p>";

	        	$("#contenedor-palabras-pangramas").html(contenido_palabras);
	        }


	        else if(data == "sin") {

	        	contenido_palabras += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el pangrama.</p>";

	        	$("#contenedor-palabras-pangramas").html(contenido_palabras);
	        }


	        else {

	        	var array_palabras = JSON.parse(data);


	        	for (i = 0; i < array_palabras.length; i++) {

			    	contenido_palabras += "<div class='contenedor-palabra-recurso'>"+array_palabras[i].palabra+"</div>";
				}

	        	$("#contenedor-palabras-pangramas").html(contenido_palabras);

	        	drag_and_drop_pangramas();
	        }


		}

	});

}


function drag_and_drop_pangramas() {


  $('.contenedor-palabra-recurso').click(function() { 
    $("#texto-creacion-pangramas").insertAtCaret($(this).text());
    return false
  });

  $(".contenedor-palabra-recurso").draggable({helper: 'clone'});
  $(".txtDropTarget").droppable({
    accept: ".contenedor-palabra-recurso",
    drop: function(ev, ui) {
      $(this).insertAtCaret(ui.draggable.text());
    }
  });

}


function consejos_pangramas() {

	$("#enlace-recursos-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-pangramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-pangramas").removeClass("enlace-seleccionado-subcontenedor");

	var consejos_pangramas = "<div class='subcontenedor3-adicional-creacion'>";
	consejos_pangramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Para que tu pangrama sea lo más correcto posible, puedes seguir los siguientes consejos: <br><br>";
	consejos_pangramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Utiliza palabras largas que incluyan el mínimo número de letras repetidas. Cuantas menos palabras, menos extenso sea el texto y más letras incluidas no repetidas, más nivel tendrá tu pangrama y más destacará en el listado de publicaciones.  <br>";
	consejos_pangramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> En ocasiones es difícil encontrar palabras que contengan ciertas letras (la W, por ejemplo). Conviene usar sustantivos en estos casos, puesto que hay más variedad que en verbos, adverbios, adjetivos, etc. <br>";
	consejos_pangramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Lee tu pangrama y asegúrate de que está bien cohesionado y mantiene, al menos, un mínimo de coherencia, cuando consideres que está acabado, antes de publicarlo. <br><br></p>";
	consejos_pangramas += "</div>";


	$("#contenedor-adicional-pangramas").html(consejos_pangramas);

}


function informacion_pangramas() {

	$("#enlace-recursos-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-pangramas").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-pangramas").removeClass("enlace-seleccionado-subcontenedor");

	var informacion_pangramas = "<div class='subcontenedor3-adicional-creacion'>";
	informacion_pangramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Los <strong>pangramas</strong> son textos que usan todas las letras posibles del alfabeto de la forma más breve posible, incluyendo el mínimo número de repeticiones. <br><br>";
	informacion_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Son útiles para la mecanografía, puesto que obligan a presionar todas las teclas y a ejercitar todos los dedos. <br>";
	informacion_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Así mismo, también tienen valor para la tipografía, ya que permiten la exhibición completa del conjunto de carácteres disponibles en una fuente.</p>";
	informacion_pangramas += "</div>";

	$("#contenedor-adicional-pangramas").html(informacion_pangramas);

}

function ayuda_pangramas() {

	$("#enlace-recursos-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-pangramas").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-pangramas").addClass("enlace-seleccionado-subcontenedor");

	var ayuda_pangramas = "<div class='subcontenedor3-adicional-creacion'>";
	ayuda_pangramas += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Puedes crear el pangrama de manera libre, rellenando el campo superior dedicado a ello, o haciendo uso del recurso ofrecido. <br><br>";
	ayuda_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> El recurso está basado en la búsqueda de palabras que se adapten a las características deseadas de tu pangrama: <br><br>";
	ayuda_pangramas += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que contengan la/s letra/s</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de una letra y, si son varias, separadas por comas). <br><br>";
	ayuda_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Se ofrece este recurso puesto que el pangrama debe hacer uso de todas las letras posibles del alfabeto, y la manera más simple de hacerlo es seleccionando distintas palabras que contengan la/s letra/s deseada/s. <br><br>";
	ayuda_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez realizada la búsqueda, se ofrece el listado de palabras correspondiente a la misma. <br>";
	ayuda_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Estas palabras se pueden añadir al campo superior dedicado a la creación del pangrama pulsando sobre ellas o arrastrándolas al mismo, teniendo en cuenta que se colocarán en la última posición marcada por el puntero <i class='fa fa-i-cursor' aria-hidden='true'></i> en dicho campo. <br><br>";
	ayuda_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Si en algún momento, durante la creación del pangrama, decides empezar de nuevo porque no te convence el resultado, se te facilita la opción de limpiar el campo correspondiente, lo cual puede ser útil en consideración con la extensión de tu creación. <br><br>";
	ayuda_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez creado el pangrama, independientemente de la forma escogida, puedes publicarlo. De esta manera, tu creación pasará a ser pública y aparecerá en el listado de publicaciones de pangramas de la página, pudiendo acceder a ella cualquier usuario. <br><br>";
	ayuda_pangramas += "<i class='fa fa-angle-right' aria-hidden='true'></i> En el listado de publicaciones correspondiente puedes ver tus creaciones y eliminarlas, si así lo deseas, pero no editarlas.</p>";
	ayuda_pangramas += "</div>";

	$("#contenedor-adicional-pangramas").html(ayuda_pangramas);

}



function jugar_pangramas() {

	window.location = "#cerrar";

	var jugar_pangramas = "<h3 class='titulo-juego'><i class='fa fa-scissors' aria-hidden='true'></i>ACORTA</h3>";
	jugar_pangramas += "<div class='descripcion-juego'>El juego consiste en sustituir, a partir de algunas propuestas, una palabra de un pangrama asignado aleatoriamente, con el fin de reducir la extensión del pangrama resultante, conteniendo todas las letras del alfabeto repetidas el mínimo número de veces. <br>";
	jugar_pangramas += "Se dispone de temporizador, como factor adicional a superar, ajustado específicamente a cada una de las tres dificultades: </div>";

	jugar_pangramas += "<div class='contenedor-dificultad-juego'>";
	jugar_pangramas += "<div onclick='juego_pangramas(1)' class='boton boton-dificultad-juego'>NOVATO</div>";
	jugar_pangramas += "<div class='descripcion-dificultad-juego'>Pangrama fácil. Aparecen 3 palabras. A resolver antes de 40 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 1 PUNTO</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_pangramas += "</div>";

	jugar_pangramas += "<div class='contenedor-dificultad-juego'>";
	jugar_pangramas += "<div onclick='juego_pangramas(2)' class='boton boton-dificultad-juego'>AVANZADO</div>";
	jugar_pangramas += "<div class='descripcion-dificultad-juego'>Pangrama medio. Aparecen 6 palabras. A resolver antes de 35 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 2 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_pangramas += "</div>";

	jugar_pangramas += "<div class='contenedor-dificultad-juego'>";
	jugar_pangramas += "<div onclick='juego_pangramas(3)' class='boton boton-dificultad-juego'>EXPERTO</div>";
	jugar_pangramas += "<div class='descripcion-dificultad-juego'>Pangrama difícil. Aparecen 9 palabras. A resolver antes de 30 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 3 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_pangramas += "</div>";


	$("#modalidad-pangramas").removeClass("ocultar-modal-modalidad");
	$("#filtro-pangramas").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-pangramas").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-pangramas").text("JUEGA CON PANGRAMAS");
	$("#contenedor-interior-publicaciones-pangramas").html(jugar_pangramas);

}





function juego_pangramas(dificultad) {

	window.location = "#cerrar";

	var reloj_pangrama = "";
	var texto_pangrama = "";
	var texto1_pangrama = "";
	var texto2_pangrama = "";
	var palabras1_propuestas_pangrama = "";
	var palabras2_propuestas_pangrama = "";
	var palabras3_propuestas_pangrama = "";
	var palabra_incorrecta_pangrama = "";
	var palabra_correcta_pangrama = "";
	var contenedor_juego_pangrama = "";
	var boton_pangrama = "";


	var contenedor_descripcion_pangrama = "<div class='descripcion-interior-juego'>Tienes que sustituir la palabra destacada del siguiente pangrama por otra de las propuestas, pulsando sobre ella o arrastrándola. Si terminas antes de que acabe el tiempo puedes pulsar en el botón 'COMPROBAR'. Si lo completas antes de que se acabe el tiempo, habrás superado el pangrama. ¡A por ello, que el tiempo vuela!</div>";

	
	var contenedor_pangrama = "<div class='contenedor-texto-trabalenguas'>";


	$.ajax({

		type: "POST",
		url: "../php/modalidades/juego_pangramas.php",
		async: false,
		data: { id_usuario: id_usuario, dificultad: dificultad },
		success: function(data, status) {

			if(data != "vacio") {

				var pangramas = JSON.parse(data);

				texto1_pangrama = pangramas.texto1;
				texto2_pangrama = pangramas.texto2;
				palabras1_propuestas_pangrama = pangramas.palabras1_propuestas;
				palabras2_propuestas_pangrama = pangramas.palabras2_propuestas;
				palabras3_propuestas_pangrama = pangramas.palabras3_propuestas;
				palabra_incorrecta_pangrama = pangramas.palabra_incorrecta;
				palabra_correcta_pangrama = pangramas.palabra_correcta;

			}

			else {

				texto_pangrama = "HA OCURRIDO UN ERROR";
			}

		}

	});

	var texto_pangrama = texto2_pangrama.replace("-", "<div id='palabra-pangrama' class='palabra-pangrama'>"+palabra_incorrecta_pangrama+"</div>");

	contenedor_pangrama += texto_pangrama + "</div>";

	contenedor_descripcion_pangrama += "<input type='hidden' id='auxiliar-palabra-correcta-pangrama' name='auxiliar-palabra-correcta-pangrama' value='"+palabra_correcta_pangrama+"'>";
	//contenedor_descripcion_lipograma += "<input type='hidden' id='letras-marcadas-lipograma' name='letras-marcadas-lipograma' value=''>";


	var contenedor_palabras_pangrama = "<div class='contenedor-palabras-pangrama'>";



	if(dificultad == '1') {

		reloj_pangrama = "<div id='reloj1-pangrama' class='reloj-juego'></div>";

		var auxiliar_palabras1_propuestas_pangrama = palabras1_propuestas_pangrama.split(",");

		for (i = 0; i < auxiliar_palabras1_propuestas_pangrama.length; i++) {

			contenedor_palabras_pangrama += "<div class='palabras-pangrama'>"+auxiliar_palabras1_propuestas_pangrama[i]+"</div>";
		}

		boton_pangrama += "<div class='boton boton-comprobar' onclick='comprobar_pangrama(1)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '2') {
		
		reloj_pangrama = "<div id='reloj2-pangrama' class='reloj-juego'></div>";

		var auxiliar_palabras2_propuestas_pangrama = palabras2_propuestas_pangrama.split(",");

		for (i = 0; i < auxiliar_palabras2_propuestas_pangrama.length; i++) {

			contenedor_palabras_pangrama += "<div class='palabras-pangrama'>"+auxiliar_palabras2_propuestas_pangrama[i]+"</div>";
		}

		boton_pangrama += "<div class='boton boton-comprobar' onclick='comprobar_pangrama(2)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '3') {
		
		reloj_pangrama = "<div id='reloj3-pangrama' class='reloj-juego'></div>";

		var auxiliar_palabras3_propuestas_pangrama = palabras3_propuestas_pangrama.split(",");

		for (i = 0; i < auxiliar_palabras3_propuestas_pangrama.length; i++) {

			contenedor_palabras_pangrama += "<div class='palabras-pangrama'>"+auxiliar_palabras3_propuestas_pangrama[i]+"</div>";
		}

		boton_pangrama += "<div class='boton boton-comprobar' onclick='comprobar_pangrama(3)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}


	contenedor_palabras_pangrama += "</div>";

	contenedor_pangrama += contenedor_palabras_pangrama;

	contenedor_juego_pangrama += contenedor_descripcion_pangrama+reloj_pangrama+contenedor_pangrama+boton_pangrama;
	

	$("#titulo-modalidad-pangramas").html("<i class='fa fa-arrow-left atras-juego' aria-hidden='true' onclick='jugar_pangramas();parar_tiempo_pangramas();'></i><i class='fa fa-scissors' aria-hidden='true'></i>ACORTA");
	$("#contenedor-interior-publicaciones-pangramas").html(contenedor_juego_pangrama);

	reloj_juego_pangrama(dificultad);
	drag_and_drop_juego_pangramas();
}


function parar_tiempo_pangramas() {

	$("#reloj1-pangrama").countdown360({}).stop();
	$("#reloj2-pangrama").countdown360({}).stop();
	$("#reloj3-pangrama").countdown360({}).stop();
}



function reloj_juego_pangrama(dificultad) {

	var tiempo = 0;
	var reloj = "";
	var palabra_correcta = $("#auxiliar-palabra-correcta-pangrama").val();


	if(dificultad == '1') {

		tiempo = 40;
		reloj = "#reloj1-pangrama";
	}

	else if(dificultad == '2') {

		tiempo = 35;
		reloj = "#reloj2-pangrama";
	}

	else if(dificultad == '3') {

		tiempo = 30;
		reloj = "#reloj3-pangrama";
	}
	

	$(reloj).countdown360({
		radius      : 30,
		seconds     : tiempo,
		fontColor   : '#FFFFFF',
		fillStyle   : '#56c2e1', 
		strokeStyle : '#3f9db8',
		strokeWidth : 5,
		autostart   : false,
		fontSize    : 22,
		fontWeight  : 300,  
		onComplete  : function () {


			var palabra_seleccionada = $("#palabra-pangrama").text();


			var contenido_modal = "";
			var titulo_modal = "";


			if(dificultad == '1') {


				if(palabra_correcta == palabra_seleccionada) {

					titulo_modal = "PANGRAMA SUPERADO";

					sumar_puntos(1,5,3);
					historial_juegos(1,5,1,27);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_pangramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "PANGRAMA NO SUPERADO";

					restar_puntos(1,5,3);
					historial_juegos(1,5,1,28);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_pangramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '2') {


				if(palabra_correcta == palabra_seleccionada) {

					titulo_modal = "PANGRAMA SUPERADO";

					sumar_puntos(2,5,4);
					historial_juegos(2,5,2,27);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_pangramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "PANGRAMA NO SUPERADO";

					restar_puntos(1,5,4);
					historial_juegos(1,5,2,28);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_pangramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '3') {

				if(palabra_correcta == palabra_seleccionada) {

					titulo_modal = "PANGRAMA SUPERADO";

					sumar_puntos(3,5,5);
					historial_juegos(3,5,3,27);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_pangramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "PANGRAMA NO SUPERADO";

					restar_puntos(1,5,5);
					historial_juegos(1,5,3,28);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_pangramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

		    $("#titulo-modal-aviso").text(titulo_modal);
		    $("#contenido-modal-aviso").html(contenido_modal);

		    window.location = "#modal-aviso";


			$(reloj).countdown360({}).stop();

		}
	}).start()

}



function comprobar_pangrama(dificultad) {

	var palabra_correcta = $("#auxiliar-palabra-correcta-pangrama").val();
	var palabra_seleccionada = $("#palabra-pangrama").text();

	var contenido_modal = "";
	var titulo_modal = "";
	var reloj = "";


	if(dificultad == '1') {

		reloj = "#reloj1-pangrama";


		if(palabra_correcta == palabra_seleccionada) {

			titulo_modal = "PANGRAMA SUPERADO";

			sumar_puntos(1,5,3);
			historial_juegos(1,5,1,27);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_pangramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "PANGRAMA NO SUPERADO";

			restar_puntos(1,5,3);
			historial_juegos(1,5,1,28);
			contenido_modal = "<p>El pangrama no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_pangramas(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '2') {

		reloj = "#reloj2-pangrama";


		if(palabra_correcta == palabra_seleccionada) {

			titulo_modal = "PANGRAMA SUPERADO";

			sumar_puntos(2,5,4);
			historial_juegos(2,5,2,27);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_pangramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "PANGRAMA NO SUPERADO";

			restar_puntos(1,5,4);
			historial_juegos(1,5,2,28);
			contenido_modal = "<p>El pangrama no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_pangramas(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '3') {

		reloj = "#reloj3-pangrama";


		if(palabra_correcta == palabra_seleccionada) {

			titulo_modal = "PANGRAMA SUPERADO";

			sumar_puntos(3,5,5);
			historial_juegos(3,5,3,27);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_pangramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "PANGRAMA NO SUPERADO";

			restar_puntos(1,5,5);
			historial_juegos(1,5,3,28);
			contenido_modal = "<p>El pangrama no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_pangramas(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_pangramas()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}


	$(reloj).countdown360({}).stop();


	$("#titulo-modal-aviso").text(titulo_modal);
	$("#contenido-modal-aviso").html(contenido_modal);

	window.location = "#modal-aviso";
			
}




function drag_and_drop_juego_pangramas() {


  $('.palabras-pangrama').click(function() { 
    $("#palabra-pangrama").text($(this).text());
    return false
  });

  $(".palabras-pangrama").draggable({helper: 'clone'});
  $("#palabra-pangrama").droppable({
    accept: ".palabras-pangrama",
    drop: function(ev, ui) {
      $(this).text(ui.draggable.text());
    }
  });

}





$("#cerrar-modalidad-pangramas").click(function(){

	$("#modalidad-pangramas").addClass("ocultar-modal-modalidad");

});


// PALINDROMOS

$("#boton-ver-palindromos").click(function(){

	var publicaciones_auxiliar = ver_publicaciones('6','1');

	$("#modalidad-palindromos").removeClass("ocultar-modal-modalidad");
	$("#filtro-palindromos").removeClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-palindromos").addClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-palindromos").text("PALÍNDROMOS PUBLICADOS");
	$("#contenedor-interior-publicaciones-palindromos").html(publicaciones_auxiliar);

});


$('input[type=radio][name=filtro-publicaciones-palindromos]').change(function() {

	var palindromos_publicados = "";
        
    var filtro_palindromos = $('input[type=radio][name=filtro-publicaciones-palindromos]:checked').val();

    palindromos_publicados = ver_publicaciones('6',filtro_palindromos);

    $("#contenedor-interior-publicaciones-palindromos").html(palindromos_publicados);

});


$("#boton-crear-palindromos").click(function(){

	var crear_palindromos = "<form id='creacion-palindromos' name='creacion-palindromos' class='form-creacion-publicacion' action='' method='post'>";
	crear_palindromos += "<div class='contenedor-texto-creacion'>";
	crear_palindromos += "<input type='text' id='texto1-creacion-palindromos' name='texto1-creacion-palindromos' class='texto1-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ EL PRIMER SENTIDO DE TU PALÍNDROMO'>";
	crear_palindromos += "<input type='text' id='texto2-creacion-palindromos' name='texto2-creacion-palindromos' class='texto2-creacion txtDropTarget' placeholder='ESCRIBE AQUÍ EL SEGUNDO SENTIDO DE TU PALÍNDROMO'>";
	crear_palindromos += "<input type='hidden' id='id-usuario-creacion-palindromos' name='id-usuario-creacion-palindromos' value='"+id_usuario+"'>";
	crear_palindromos += "</div>";
	crear_palindromos += "<div class='contenedor-botones-creacion'>";
	crear_palindromos += "<a onclick='limpiar_palindromos()' class='boton-creacion'>LIMPIAR</a>";
	crear_palindromos += "<div id='error-creacion-palindromos' class='error-oculto'>ERROR</div>";
	crear_palindromos += "<a onclick='validacion_palindromos()' class='boton-creacion'>PUBLICAR</a>";
	crear_palindromos += "</div>";
	crear_palindromos += "</form>";

	crear_palindromos += "<div class='precontenedor-adicional-creacion'>";
	crear_palindromos += "<a id='enlace-recursos-palindromos' onclick='recursos_palindromos()'><i class='fa fa-cog' aria-hidden='true'></i> RECURSOS</a>";
	crear_palindromos += "<a id='enlace-consejos-palindromos' onclick='consejos_palindromos()'><i class='fa fa-lightbulb-o' aria-hidden='true'></i> CONSEJOS</a>";
	crear_palindromos += "<a id='enlace-informacion-palindromos' onclick='informacion_palindromos()'><i class='fa fa-info-circle' aria-hidden='true'></i> INFORMACIÓN</a>";
	crear_palindromos += "<a id='enlace-ayuda-palindromos' onclick='ayuda_palindromos()'><i class='fa fa-question-circle' aria-hidden='true'></i> AYUDA</a>";
	crear_palindromos += "</div>";

	crear_palindromos += "<div id='contenedor-adicional-palindromos' class='contenedor-adicional-creacion'></div>";


	$("#modalidad-palindromos").removeClass("ocultar-modal-modalidad");
	$("#filtro-palindromos").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-palindromos").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-palindromos").text("CREA UN PALÍNDROMO");
	$("#contenedor-interior-publicaciones-palindromos").html(crear_palindromos);

	recursos_palindromos();

});




function limpiar_palindromos() {

	$("#texto1-creacion-palindromos").val("");
	$("#texto2-creacion-palindromos").val("");
}


function validacion_palindromos() {

	var valido = true;

	var palindromo1 = $("#texto1-creacion-palindromos").val();
	var palindromo2 = $("#texto2-creacion-palindromos").val();


	if(palindromo1 == "" && palindromo2 == "") {
		//El palindromo esta vacio
		$("#error-creacion-palindromos").text("Palíndromo vacío");
		$("#error-creacion-palindromos").removeClass("error-oculto");
		$("#error-creacion-palindromos").addClass("error");
		$("#texto1-creacion-palindromos").addClass("input-warning");
		$("#texto2-creacion-palindromos").addClass("input-warning");

		valido = false;
	}

	else if(palindromo1 == "") {
		//El palindromo esta incompleto
		$("#error-creacion-palindromos").text("Palíndromo incompleto");
		$("#error-creacion-palindromos").removeClass("error-oculto");
		$("#error-creacion-palindromos").addClass("error");
		$("#texto1-creacion-palindromos").addClass("input-warning");

		valido = false;
	}

	else if(palindromo2 == "") {
		//El palindromo esta incompleto
		$("#error-creacion-palindromos").text("Palíndromo incompleto");
		$("#error-creacion-palindromos").removeClass("error-oculto");
		$("#error-creacion-palindromos").addClass("error");
		$("#texto2-creacion-palindromos").addClass("input-warning");

		valido = false;
	}

	publicar_palindromos(valido);

}


function publicar_palindromos(valido) {

	if(valido == true) {

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


		$.ajax({

		    type: "POST",
		    url: "../php/modalidades/publicar_palindromos.php",
		    data: $("#creacion-palindromos").serialize(),
		    success: function(data, status) {

		    	error = data.split("-");

	            numero = error[0];
	            cadena = error[1];


		        if(numero == "1") {

		        	sumar_puntos(3,6,2);

		        	contenido_modal = "<p>"+cadena+"</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a href='../principal/index.html' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("PALÍNDROMO PUBLICADO");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else if(numero == "2") {

		        	contenido_modal = "<p>"+cadena+"</p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else {

		        	contenido_modal = "<p></p><a href='#cerrar' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

			}

		});

	}	


}

function recursos_palindromos() {

	$("#enlace-recursos-palindromos").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-palindromos").removeClass("enlace-seleccionado-subcontenedor");

	var recursos_palindromos = "<div class='subcontenedor1-adicional-creacion'>";
	recursos_palindromos += "<form id='buscar-recursos-palindromos' name='buscar-recursos-palindromos' class='form-buscar-recursos' action='' method='post'>";
	recursos_palindromos += "<i class='fa fa-angle-right desplegable-recursos' aria-hidden='true'></i>";
	recursos_palindromos += "<select id='opcion-recursos-palindromos' name='opcion-recursos-palindromos' class=''>";
	recursos_palindromos += "<option value='1'>Palabras inversas a:</option>";
	recursos_palindromos += "<option value='2'>Palabras que contengan:</option>";
	recursos_palindromos += "<option value='3'>Palabras que empiecen por:</option>";
	recursos_palindromos += "<option value='4'>Palabras que terminen por:</option>";
	recursos_palindromos += "</select>";
	recursos_palindromos += "<input id='cadena-recursos-palindromos' name='cadena-recursos-palindromos' type='text' class='cadena-recursos' />";
	recursos_palindromos += "<input type='hidden' id='id-usuario-recursos-palindromos' name='id-usuario-recursos-palindromos' value='"+id_usuario+"'>";
	recursos_palindromos += "<a onclick='obtener_recursos_palindromos()' class='boton-recursos'>BUSCAR</a>";
	recursos_palindromos += "</form>";
	recursos_palindromos += "</div>";
	recursos_palindromos += "<div id='contenedor-palabras-palindromos' class='subcontenedor2-adicional-creacion'>";
	recursos_palindromos += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el palíndromo.</p></div>";

	$("#contenedor-adicional-palindromos").html(recursos_palindromos);
}


function obtener_recursos_palindromos() {


	$.ajax({

	    type: "POST",
	    url: "../php/modalidades/palabras_palindromos.php",
	    data: $("#buscar-recursos-palindromos").serialize(),
	    success: function(data, status) {


	    	var contenido_palabras = "";

			
			if(data == "vacio") {

	        	contenido_palabras += "<p>No se han encontrado palabras que coincidan con las letras introducidas.</p>";

	        	$("#contenedor-palabras-palindromos").html(contenido_palabras);
	        }


	        else if(data == "corto") {

	        	contenido_palabras += "<p>Debes introducir dos letras como mínimo.</p>";

	        	$("#contenedor-palabras-palindromos").html(contenido_palabras);
	        }


	        else if(data == "sin") {

	        	contenido_palabras += "<p>Utiliza el buscador para obtener palabras que te ayuden a crear el palíndromo.</p>";

	        	$("#contenedor-palabras-palindromos").html(contenido_palabras);
	        }


	        else {

	        	var array_palabras = JSON.parse(data);


	        	for (i = 0; i < array_palabras.length; i++) {

			    	contenido_palabras += "<div class='contenedor-palabra-recurso'>"+array_palabras[i].palabra+"</div>";
				}

	        	$("#contenedor-palabras-palindromos").html(contenido_palabras);

	        	drag_and_drop_palindromos();
	        }


		}

	});

}


function drag_and_drop_palindromos() {


  $('.contenedor-palabra-recurso').click(function() { 
    $("#texto2-creacion-palindromos").insertAtCaret($(this).text());
    return false
  });

  $(".contenedor-palabra-recurso").draggable({helper: 'clone'});
  $(".txtDropTarget").droppable({
    accept: ".contenedor-palabra-recurso",
    drop: function(ev, ui) {
      $(this).insertAtCaret(ui.draggable.text());
    }
  });

}


function consejos_palindromos() {

	$("#enlace-recursos-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-palindromos").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-palindromos").removeClass("enlace-seleccionado-subcontenedor");

	var consejos_palindromos = "<div class='subcontenedor3-adicional-creacion'>";
	consejos_palindromos += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Para que tu palíndromo sea lo más correcto posible, puedes seguir los siguientes consejos: <br><br>";
	consejos_palindromos += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Utiliza palabras cortas, puesto que hay más variedad de ellas que al invertirlas sigan teniendo sentido o formen una nueva palabra. <br>";
	consejos_palindromos += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Intenta que el texto creado tenga una extensión considerable. Cuanto más largo sea más nivel tendrá tu palíndromo y más destacará en el listado de publicaciones. <br>";
	consejos_palindromos += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Recuerda que no es necesario que las palabras conserven su estructura inicial al invertirlas. Se pueden descomponer para formar otras nuevas. <br>";
	consejos_palindromos += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> Lee tu palíndromo y asegúrate de que está bien cohesionado y mantiene, al menos, un mínimo de coherencia, cuando consideres que está acabado, antes de publicarlo. <br><br></p>";
	consejos_palindromos += "</div>";

	$("#contenedor-adicional-palindromos").html(consejos_palindromos);

}


function informacion_palindromos() {

	$("#enlace-recursos-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-palindromos").addClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-palindromos").removeClass("enlace-seleccionado-subcontenedor");

	var informacion_palindromos = "<div class='subcontenedor3-adicional-creacion'>";
	informacion_palindromos += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Los <strong>palíndromos</strong> son palabras o frases que se leen igual de izquierda a derecha que de derecha a izquierda. <br>";
	informacion_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Se trata del equivalente a lo que, respecto a los números, se conoce como capicúa. <br><br>";
	informacion_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Los palíndromos se resienten en su significado cuanto más extensos son, lo cual marca su dificultad. <br><br>";
	informacion_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Su uso principal reside en la literatura, como método de innovación. </p>";
	informacion_palindromos += "</div>";

	$("#contenedor-adicional-palindromos").html(informacion_palindromos);

}

function ayuda_palindromos() {

	$("#enlace-recursos-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-consejos-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-informacion-palindromos").removeClass("enlace-seleccionado-subcontenedor");
	$("#enlace-ayuda-palindromos").addClass("enlace-seleccionado-subcontenedor");

	var ayuda_palindromos = "<div class='subcontenedor3-adicional-creacion'>";
	ayuda_palindromos += "<p><i class='fa fa-angle-right' aria-hidden='true'></i> Puedes crear el palíndromo de manera libre, rellenando los dos campos superiores dedicados a ello, o haciendo uso de los recursos ofrecidos. <br><br>";
	ayuda_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Los recursos están basados en la búsqueda de palabras que se adapten a las características deseadas de tu palíndromo: <br><br>";
	ayuda_palindromos += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que contengan las letras inversas</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br>";
	ayuda_palindromos += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que contengan las letras</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br>";
	ayuda_palindromos += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que empiecen por las letras</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br>";
	ayuda_palindromos += "<i class='fa fa-long-arrow-right i-margen' aria-hidden='true'></i> <u>Palabras que terminen por las letras</u> [<i class='fa fa-ellipsis-h' aria-hidden='true'></i>] (con un mínimo de dos letras). <br><br>";
	ayuda_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Se ofrecen estos recursos puesto que el palíndromo debe tener sentido tanto de izquierda a derecha como de derecha a izquierda, y la manera más simple de hacerlo es seleccionando palabras existentes que contengan grupos de letras inversas a otras, así como distintas palabras que empiecen/terminen/contengan el mismo grupo de letras, de manera auxiliar. <br><br>";
	ayuda_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez realizada la búsqueda, se ofrece el listado de palabras correspondiente a la misma. <br>";
	ayuda_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Estas palabras se pueden añadir a cualquiera de los dos campos superiores dedicados a la creación del palíndromo pulsando sobre ellas o arrastrándolas, teniendo en cuenta que se colocarán en la última posición marcada por el puntero <i class='fa fa-i-cursor' aria-hidden='true'></i> en el campo correspondiente. <br><br>";
	ayuda_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Si en algún momento, durante la creación del palíndromo, decides empezar de nuevo porque no te convence el resultado, se te facilita la opción de limpiar los campos correspondientes, lo cual puede ser útil en consideración con la extensión de tu creación. <br><br>";
	ayuda_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> Una vez creado el palíndromo, independientemente de la forma escogida, puedes publicarlo. De esta manera, tu creación pasará a ser pública y aparecerá en el listado de publicaciones de palíndromos de la página, pudiendo acceder a ella cualquier usuario. <br><br>"; 
	ayuda_palindromos += "<i class='fa fa-angle-right' aria-hidden='true'></i> En el listado de publicaciones correspondiente puedes ver tus creaciones y eliminarlas, si así lo deseas, pero no editarlas.</p>";
	ayuda_palindromos += "</div>";

	$("#contenedor-adicional-palindromos").html(ayuda_palindromos);

}



function jugar_palindromos() {

	window.location = "#cerrar";

	var jugar_palindromos = "<h3 class='titulo-juego'><i class='fa fa-exchange' aria-hidden='true'></i>DEL REVÉS</h3>";
	jugar_palindromos += "<div class='descripcion-juego'>El juego consiste en relacionar, a partir de una lista propuesta, parejas de frases para formar palíndromos (cada una es inversa de la otra). <br>";
	jugar_palindromos += "Se dispone de temporizador, como factor adicional a superar, ajustado específicamente a cada una de las tres dificultades: </div>";

	jugar_palindromos += "<div class='contenedor-dificultad-juego'>";
	jugar_palindromos += "<div onclick='juego_palindromos(1)' class='boton boton-dificultad-juego'>NOVATO</div>";
	jugar_palindromos += "<div class='descripcion-dificultad-juego'>Palíndromo fácil. Aparecen 3 pares de frases. A resolver antes de 20 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 1 PUNTO</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_palindromos += "</div>";

	jugar_palindromos += "<div class='contenedor-dificultad-juego'>";
	jugar_palindromos += "<div onclick='juego_palindromos(2)' class='boton boton-dificultad-juego'>AVANZADO</div>";
	jugar_palindromos += "<div class='descripcion-dificultad-juego'>Palíndromo medio. Aparecen 5 pares de frases. A resolver antes de 15 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 2 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_palindromos += "</div>";

	jugar_palindromos += "<div class='contenedor-dificultad-juego'>";
	jugar_palindromos += "<div onclick='juego_palindromos(3)' class='boton boton-dificultad-juego'>EXPERTO</div>";
	jugar_palindromos += "<div class='descripcion-dificultad-juego'>Palíndromo difícil. Aparecen 7 pares de frases. A resolver antes de 15 segundos.<div class='subcontenedor-descripcion-dificultad-juego'><span class='descipcion-juego-positivo'>Si se supera: + 3 PUNTOS</span><span class='descipcion-juego-negativo'>Si no se supera: - 1 PUNTO</span></div></div>";
	jugar_palindromos += "</div>";


	$("#modalidad-palindromos").removeClass("ocultar-modal-modalidad");
	$("#filtro-palindromos").addClass("ocultar-filtro");
	$("#contenedor-interior-publicaciones-palindromos").removeClass("contenedor-interior-publicaciones");

	$("#titulo-modalidad-palindromos").text("JUEGA CON PALÍNDROMOS");
	$("#contenedor-interior-publicaciones-palindromos").html(jugar_palindromos);

}



function juego_palindromos(dificultad) {

	window.location = "#cerrar";

	array_palindromos = [];
	id_palindromo_anterior = "";
	palindromo_anterior = "";
	pasada_palindromos = 0;
	numero_palindromos_correctos = 1;
	var palindromos = "";
	var palindromo_auxiliar = "";
	var reloj_palindromos = "";
	var id_palindromo;
	var texto1_palindromo = "";
	var texto2_palindromo = "";
	var contenedor_juego_palindromos = "";
	var boton_palindromos = "";
	var contenedor_descripcion_palindromos = "";


	contenedor_descripcion_palindromos += "<div class='descripcion-interior-juego'>Tienes que emparejar los pares de fragmentos, pulsando sobre uno a continuación del otro, para formar palíndromos. Si terminas antes de que acabe el tiempo puedes pulsar en el botón 'COMPROBAR'. Si lo completas antes de que se acabe el tiempo, habrás superado los palíndromos. ¡A por ello, que el tiempo vuela!</div>";



	$.ajax({

		type: "POST",
		url: "../php/modalidades/juego_palindromos.php",
		async: false,
		data: { id_usuario: id_usuario, dificultad: dificultad },
		success: function(data, status) {

			if(data != "vacio") {

				palindromos = JSON.parse(data);

				//id_palindromo = palindromos.id_palindromo;
				//texto1_palindromo = palindromos.texto1;
				//texto2_palindromo = palindromos.texto2;
			}

			else {

				contenedor_descripcion_palindromos = "<br><br>HA OCURRIDO UN ERROR<br>";
			}

		}

	});


	for (i = 0; i < palindromos.length; i++) {

		palindromo_auxiliar = "<div class='palabras-palindromos' title='"+palindromos[i].id_palindromo+"' onclick='marcar_palindromo(this)'>"+palindromos[i].texto1+"</div>";
		array_palindromos.push(palindromo_auxiliar);
		palindromo_auxiliar = "<div class='palabras-palindromos' title='"+palindromos[i].id_palindromo+"' onclick='marcar_palindromo(this)'>"+palindromos[i].texto2+"</div>";
		array_palindromos.push(palindromo_auxiliar);
	}

	array_palindromos = array_palindromos.sort(function() {return Math.random() - 0.5});


	//contenedor_descripcion_lipograma += "<input type='hidden' id='auxiliar-letras-correctas-lipograma' name='auxiliar-letras-correctas-lipograma' value='"+letras_correctas_lipograma+"'>";
	//contenedor_descripcion_lipograma += "<input type='hidden' id='letras-marcadas-lipograma' name='letras-marcadas-lipograma' value=''>";


	var contenedor_palabras_palindromos = "<div class='contenedor-palabras-palindromos'>";



	if(dificultad == '1') {

		reloj_palindromos = "<div id='reloj1-palindromos' class='reloj-juego'></div>";


		for (i = 0; i < array_palindromos.length; i++) {

			contenedor_palabras_palindromos += array_palindromos[i];
		}

		boton_palindromos += "<div class='boton boton-comprobar' onclick='comprobar_palindromos(1)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '2') {
		
		reloj_palindromos = "<div id='reloj2-palindromos' class='reloj-juego'></div>";


		for (i = 0; i < array_palindromos.length; i++) {

			contenedor_palabras_palindromos += array_palindromos[i];
		}

		boton_palindromos += "<div class='boton boton-comprobar' onclick='comprobar_palindromos(2)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}

	else if(dificultad == '3') {
		
		reloj_palindromos = "<div id='reloj3-palindromos' class='reloj-juego'></div>";


		for (i = 0; i < array_palindromos.length; i++) {

			contenedor_palabras_palindromos += array_palindromos[i];
		}

		boton_palindromos += "<div class='boton boton-comprobar' onclick='comprobar_palindromos(3)'><i class='fa fa-check' aria-hidden='true'></i>COMPROBAR</div>";

	}


	contenedor_palabras_palindromos += "</div>";

	contenedor_juego_palindromos += contenedor_descripcion_palindromos+reloj_palindromos+contenedor_palabras_palindromos+boton_palindromos;
	

	$("#titulo-modalidad-palindromos").html("<i class='fa fa-arrow-left atras-juego' aria-hidden='true' onclick='jugar_palindromos();parar_tiempo_palindromos();'></i><i class='fa fa-square-o' aria-hidden='true'></i>DESAPARECIDAS");
	$("#contenedor-interior-publicaciones-palindromos").html(contenedor_juego_palindromos);

	reloj_juego_palindromos(dificultad);
}


function marcar_palindromo(palindromo) {

	var texto_palindromo = $(palindromo).text();
	var id_palindromo = $(palindromo).attr("title");

	$(palindromo_anterior).removeClass("palindromo-seleccionado");
	$(palindromo).addClass("palindromo-seleccionado");
	$(palindromo).addClass("bloquear-palindromo");
	$(palindromo).attr("disabled", "disabled").off('click');
	$(palindromo_anterior).removeClass("bloquear-palindromo");
	$(palindromo_anterior).removeAttr("disabled");

	if(id_palindromo == id_palindromo_anterior) {

		$(palindromo).removeClass("palindromo-seleccionado");
		$(palindromo).addClass("palindromo-correcto"+numero_palindromos_correctos);
		$(palindromo).addClass("pareja-correcta");
		$(palindromo).attr("disabled", "disabled").off('click');
		$(palindromo_anterior).removeClass("palindromo-seleccionado");
		$(palindromo_anterior).addClass("palindromo-correcto"+numero_palindromos_correctos);
		$(palindromo_anterior).addClass("pareja-correcta");
		$(palindromo_anterior).attr("disabled", "disabled").off('click');

		numero_palindromos_correctos = numero_palindromos_correctos+1;

	}

	else {

		pasada_palindromos = pasada_palindromos+1;

		if(pasada_palindromos > 1) {

			//$(palindromo).removeClass("palindromo-seleccionado");
			$(palindromo_anterior).removeClass("palindromo-seleccionado");
			pasada_palindromos = 0;

		}


	}

	palindromo_anterior = palindromo;
	id_palindromo_anterior = id_palindromo;

}


function parar_tiempo_palindromos() {

	$("#reloj1-palindromos").countdown360({}).stop();
	$("#reloj2-palindromos").countdown360({}).stop();
	$("#reloj3-palindromos").countdown360({}).stop();
}


function reloj_juego_palindromos(dificultad) {

	var tiempo = 0;
	var reloj = "";


	if(dificultad == '1') {

		tiempo = 20;
		reloj = "#reloj1-palindromos";
	}

	else if(dificultad == '2') {

		tiempo = 15;
		reloj = "#reloj2-palindromos";
	}

	else if(dificultad == '3') {

		tiempo = 15;
		reloj = "#reloj3-palindromos";
	}
	

	$(reloj).countdown360({
		radius      : 30,
		seconds     : tiempo,
		fontColor   : '#FFFFFF',
		fillStyle   : '#56c2e1', 
		strokeStyle : '#3f9db8',
		strokeWidth : 5,
		autostart   : false,
		fontSize    : 22,
		fontWeight  : 300,  
		onComplete  : function () {


			var contenido_modal = "";
			var titulo_modal = "";

			var auxiliar_numero_palindromos_correctos = numero_palindromos_correctos-1;


			if(dificultad == '1') {

				if(auxiliar_numero_palindromos_correctos == 3) {

					titulo_modal = "PALÍNDROMOS SUPERADOS";

					sumar_puntos(1,6,3);
					historial_juegos(1,6,1,29);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_palindromos(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "PALÍNDROMOS NO SUPERADOS";

					restar_puntos(1,6,3);
					historial_juegos(1,6,1,30);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_palindromos(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '2') {

				if(auxiliar_numero_palindromos_correctos == 5) {

					titulo_modal = "PALÍNDROMOS SUPERADOS";

					sumar_puntos(2,6,4);
					historial_juegos(2,6,2,29);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_palindromos(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "PALÍNDROMOS NO SUPERADOS";

					restar_puntos(1,6,4);
					historial_juegos(1,6,2,30);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_palindromos(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

			else if(dificultad == '3') {

				if(auxiliar_numero_palindromos_correctos == 7) {

					titulo_modal = "PALÍNDROMOS SUPERADOS";

					sumar_puntos(3,6,5);
					historial_juegos(3,6,3,29);
		        	contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_palindromos(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

				else {

					titulo_modal = "PALÍNDROMOS NO SUPERADOS";

					restar_puntos(1,6,5);
					historial_juegos(1,6,3,30);
					contenido_modal = "<p>Se ha agotado el tiempo.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_palindromos(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
				}

			}

		    $("#titulo-modal-aviso").text(titulo_modal);
		    $("#contenido-modal-aviso").html(contenido_modal);

		    window.location = "#modal-aviso";
			


			$(reloj).countdown360({}).stop();

		}
	}).start()

}



function comprobar_palindromos(dificultad) {

	var contenido_modal = "";
	var titulo_modal = "";
	var reloj = "";

	var auxiliar_numero_palindromos_correctos = numero_palindromos_correctos-1;


	if(dificultad == '1') {

		reloj = "#reloj1-palindromos";

		if(auxiliar_numero_palindromos_correctos == 3) {

			titulo_modal = "PALÍNDROMOS SUPERADOS";

			sumar_puntos(1,6,3);
			historial_juegos(1,6,1,29);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 1 PUNTO</div><a onclick='juego_palindromos(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "PALÍNDROMOS NO SUPERADOS";

			restar_puntos(1,6,3);
			historial_juegos(1,6,1,30);
			contenido_modal = "<p>El palíndromo no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_palindromos(1)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '2') {

		reloj = "#reloj2-palindromos";

		if(auxiliar_numero_palindromos_correctos == 5) {

			titulo_modal = "PALÍNDROMOS SUPERADOS";

			sumar_puntos(2,6,4);
			historial_juegos(2,6,2,29);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 2 PUNTOS</div><a onclick='juego_palindromos(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "PALÍNDROMOS NO SUPERADOS";

			restar_puntos(1,6,4);
			historial_juegos(1,6,2,30);
			contenido_modal = "<p>El palíndromos no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_palindromos(2)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}

	else if(dificultad == '3') {

		reloj = "#reloj3-palindromos";

		if(auxiliar_numero_palindromos_correctos == 7) {

			titulo_modal = "PALÍNDROMOS SUPERADOS";

			sumar_puntos(3,6,5);
			historial_juegos(3,6,3,29);
		    contenido_modal = "<p>¡ENHORABUENA!</p><div class='boton-informativo-puntos'>+ 3 PUNTOS</div><a onclick='juego_palindromos(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

		else {

			titulo_modal = "PALÍNDROMOS NO SUPERADOS";

			restar_puntos(1,6,5);
			historial_juegos(1,6,3,30);
			contenido_modal = "<p>El palíndromo no es correcto.</p><div class='boton-informativo-puntos'>- 1 PUNTO</div><a onclick='juego_palindromos(3)' class='boton boton-modal'>SEGUIR JUGANDO</a><a class='boton boton-modal' onclick='jugar_palindromos()'>CAMBIAR DIFICULTAD</a><a href='../principal/index.html' class='boton boton-modal'>SALIR</a>";
		}

	}


	$(reloj).countdown360({}).stop();


	$("#titulo-modal-aviso").text(titulo_modal);
	$("#contenido-modal-aviso").html(contenido_modal);

	window.location = "#modal-aviso";
			

}



$("#cerrar-modalidad-palindromos").click(function(){

	$("#modalidad-palindromos").addClass("ocultar-modal-modalidad");

});




// INICIO (paneles)
$("#item-menu-inicio").click(function(){

	window.location = "#contenedor-paneles";

	var clase = $('#item-menu-inicio').attr('class');

	if(clase != "item-menu-activo") {

		$(".item-menu-activo").addClass("item-menu-normal");
		$(".item-menu-activo").removeClass("item-menu-activo");
		$("#item-menu-inicio").removeClass("item-menu-normal");
		$("#item-menu-inicio").addClass("item-menu-activo");
	}

	var clase_auxiliar1 = $('#popup-contacto').hasClass('ocultar-popup');
	var clase_auxiliar2 = $('#popup-informacion').hasClass('ocultar-popup');
	var clase_auxiliar3 = $('#modalidad-trabalenguas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar4 = $('#modalidad-calambures').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar5 = $('#modalidad-criptogramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar6 = $('#modalidad-lipogramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar7 = $('#modalidad-pangramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar8 = $('#modalidad-palindromos').hasClass('ocultar-modal-modalidad');

	if(clase_auxiliar1 == false) {
		$("#popup-contacto").addClass("ocultar-popup");
	}

	if(clase_auxiliar2 == false) {
		$("#popup-informacion").addClass("ocultar-popup");
	}

	if(clase_auxiliar3 == false) {
		$("#modalidad-trabalenguas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar4 == false) {
		$("#modalidad-calambures").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar5 == false) {
		$("#modalidad-criptogramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar6 == false) {
		$("#modalidad-lipogramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar7 == false) {
		$("#modalidad-pangramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar8 == false) {
		$("#modalidad-palindromos").addClass("ocultar-modal-modalidad");
	}

});


// PERFIL
$("#item-menu-perfil").click(function(){


	window.location = "#contenedor-perfil";

	var clase = $('#item-menu-perfil').attr('class');

	if(clase != "item-menu-activo") {

		$(".item-menu-activo").addClass("item-menu-normal");
		$(".item-menu-activo").removeClass("item-menu-activo");
		$("#item-menu-perfil").removeClass("item-menu-normal");
		$("#item-menu-perfil").addClass("item-menu-activo");
	}

	var clase_auxiliar1 = $('#popup-contacto').hasClass('ocultar-popup');
	var clase_auxiliar2 = $('#popup-informacion').hasClass('ocultar-popup');
	var clase_auxiliar1 = $('#popup-contacto').hasClass('ocultar-popup');
	var clase_auxiliar2 = $('#popup-informacion').hasClass('ocultar-popup');
	var clase_auxiliar3 = $('#modalidad-trabalenguas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar4 = $('#modalidad-calambures').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar5 = $('#modalidad-criptogramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar6 = $('#modalidad-lipogramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar7 = $('#modalidad-pangramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar8 = $('#modalidad-palindromos').hasClass('ocultar-modal-modalidad');

	if(clase_auxiliar1 == false) {
		$("#popup-contacto").addClass("ocultar-popup");
	}

	if(clase_auxiliar2 == false) {
		$("#popup-informacion").addClass("ocultar-popup");
	}

	if(clase_auxiliar3 == false) {
		$("#modalidad-trabalenguas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar4 == false) {
		$("#modalidad-calambures").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar5 == false) {
		$("#modalidad-criptogramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar6 == false) {
		$("#modalidad-lipogramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar7 == false) {
		$("#modalidad-pangramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar8 == false) {
		$("#modalidad-palindromos").addClass("ocultar-modal-modalidad");
	}


});


$("#provincia-usuario-editar-perfil").change(function() {

	var codigo_provincia = $("#provincia-usuario-editar-perfil").val();

	if(codigo_provincia == '0') {

		$("#provincia-usuario-editar-perfil").addClass("gris-formulario");
	}

	else {

		$("#provincia-usuario-editar-perfil").removeClass("gris-formulario");
	}

});



// PERFIL
$("#boton-editar-perfil").click(function(){

	var numero = "";
	var cadena = "";
	var error = "";

	var contenido_modal = "";


	$.ajax({

	    type: "POST",
	    url: "../php/perfil/editar_perfil.php",
	    data: $("#form-editar-perfil").serialize(),
	    success: function(data, status) {

	    	error = data.split("-");

            numero = error[0];
            cadena = error[1];


	        if(numero == "1") {

	        	contenido_modal = "<p>"+cadena+"</p><a onclick='cargar_datos_ver_perfil();red_perfil();' class='boton boton-modal'>ACEPTAR</a>";
	        
	        	$("#titulo-modal-aviso").text("PERFIL EDITADO");
	        	$("#contenido-modal-aviso").html(contenido_modal);

	        	window.location = "#modal-aviso";
	        }

	        else if(numero == "2") {

	        	contenido_modal = "<p>"+cadena+"</p><a onclick='cargar_datos_ver_perfil();red_perfil();' class='boton boton-modal'>ACEPTAR</a>";
	        
	        	$("#titulo-modal-aviso").text("ERROR");
	        	$("#contenido-modal-aviso").html(contenido_modal);

	        	window.location = "#modal-aviso";
	        }

	        else {

	        	contenido_modal = "<p></p><a onclick='cargar_datos_ver_perfil();red_perfil();' class='boton boton-modal'>ACEPTAR</a>";
	        
	        	$("#titulo-modal-aviso").text("ERROR");
	        	$("#contenido-modal-aviso").html(contenido_modal);

	        	window.location = "#modal-aviso";
	        }


		}

	});

});




function obtener_password() {

	var error = "";
	var numero = "";
	var cadena = "";

	$.ajax({

		type: "POST",
		url: "../php/perfil/obtener_password.php",
		async: true,
		data: { id_usuario: id_usuario },
		success: function(data, status) {

		 	error = data.split("-");

	        numero = error[0];
	        cadena = error[1];



		    if(numero == "1") {

		     	pass_auxiliar = cadena;
		    }
		}

	});

}


// PERFIL
$("#boton-modificar-pass").click(function(){

	contenido_modal = "<form id='form-modificar-pass' name='form-modificar-pass' class='form-modificar-pass' action='' method='post'>";
	
	contenido_modal += "<input id='password-actual-modificar-pass' name='password-actual-modificar-pass' type='password' class='input-modificar-pass' placeholder='CONTRASEÑA ACTUAL' required />";
	contenido_modal += "<div id='error-password-actual-modificar-pass' class='error-oculto'>ERROR</div>";
	contenido_modal += "<input id='password1-modificar-pass' name='password1-modificar-pass' type='password' class='input-modificar-pass' placeholder='NUEVA CONTRASEÑA' required />";
	contenido_modal += "<div id='error-password1-modificar-pass' class='error-oculto'>ERROR</div>";
	contenido_modal += "<input id='password2-modificar-pass' name='password2-modificar-pass' type='password' class='input-modificar-pass' placeholder='CONFIRMAR CONTRASEÑA' required />";
	contenido_modal += "<div id='error-password2-modificar-pass' class='error-oculto'>ERROR</div>";
	contenido_modal += "<input type='hidden' id='password-auxiliar-modificar-pass' name='password-auxiliar-modificar-pass' value='"+pass_auxiliar+"'>";
	contenido_modal += "<input type='hidden' id='id-usuario-modificar-pass' name='id-usuario-modificar-pass' value='"+id_usuario+"'>";
	
	contenido_modal += "<a onclick='validacion_modificar_pass()' class='boton boton-modal'>ACEPTAR</a>";
	contenido_modal += "</form>";

	        
	$("#titulo-modal-aviso").text("MODIFICAR CONTRASEÑA");
	$("#contenido-modal-aviso").html(contenido_modal);

	window.location = "#modal-aviso";
	   
	  
});



//Validacion de la Modificacion de Contraseña
function validacion_modificar_pass() {

	var valido = true;

	var pass_actual = $("#password-actual-modificar-pass").val();
	var pass_auxiliar = $("#password-auxiliar-modificar-pass").val();
	var pass1 = $("#password1-modificar-pass").val();
	var pass2 = $("#password2-modificar-pass").val();


	if(pass_actual == "") {
		//No se ha introducido la contraseña actual
		$("#error-password-actual-modificar-pass").text("Debes introducir tu contraseña actual");
		$("#error-password-actual-modificar-pass").removeClass("error-oculto");
		$("#error-password-actual-modificar-pass").addClass("error");
		$("#password-actual-modificar-pass").addClass("input-warning");

		valido = false;
	}

	else {

		if(pass_actual != pass_auxiliar) {
			//La contraseña actual no es correcta
			$("#error-password-actual-modificar-pass").text("Tu contraseña actual no es correcta");
			$("#error-password-actual-modificar-pass").removeClass("error-oculto");
			$("#error-password-actual-modificar-pass").addClass("error");
			$("#password-actual-modificar-pass").addClass("input-warning");

			valido = false;
		}

		else {

			$("#error-password-actual-modificar-pass").removeClass("error");
			$("#error-password-actual-modificar-pass").addClass("error-oculto");
			$("#password-actual-modificar-pass").removeClass("input-warning");

		}

	}


	if(pass1 == "") {
		//No se ha introducido la nueva contraseña
		$("#error-password1-modificar-pass").text("Debes introducir la nueva contraseña");
		$("#error-password1-modificar-pass").removeClass("error-oculto");
		$("#error-password1-modificar-pass").addClass("error");
		$("#password1-modificar-pass").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-password1-modificar-pass").removeClass("error");
		$("#error-password1-modificar-pass").addClass("error-oculto");
		$("#password1-modificar-pass").removeClass("input-warning");

	}

	if(pass2 == "") {
		//No se ha confirmado la nueva contraseña
		$("#error-password2-modificar-pass").text("Debes confirmar la nueva contraseña");
		$("#error-password2-modificar-pass").removeClass("error-oculto");
		$("#error-password2-modificar-pass").addClass("error");
		$("#error-password2-modificar-pass").addClass("aux-error");
		$("#password2-modificar-pass").addClass("input-warning");

		valido = false;
	}

	else {

		$("#error-password2-modificar-pass").removeClass("error");
		$("#error-password2-modificar-pass").removeClass("aux-error");
		$("#error-password2-modificar-pass").addClass("error-oculto");
		$("#password2-modificar-pass").removeClass("input-warning");

	}

	if((pass1 != "") && (pass2 != "")) {

		if(pass1 == pass2) {
			//Las contraseñas coinciden
			$("#error-password2-modificar-pass").removeClass("error");
			$("#error-password2-modificar-pass").removeClass("aux-error");
			$("#error-password2-modificar-pass").addClass("error-oculto");
			$("#password2-modificar-pass").removeClass("input-warning");
		}

		else {
			//Las contraseñas no coinciden
			$("#error-password2-modificar-pass").text("La nueva contraseña no coincide");
			$("#error-password2-modificar-pass").removeClass("error-oculto");
			$("#error-password2-modificar-pass").addClass("error");
			$("#error-password2-modificar-pass").addClass("aux-error");
			$("#password2-modificar-pass").addClass("input-warning");

			valido = false;
		}
	}


	modificar_pass(valido);

}


// PERFIL
function modificar_pass(valido) {

	if(valido == true) {

		var numero = "";
		var cadena = "";
		var error = "";

		var contenido_modal = "";


		$.ajax({

		    type: "POST",
		    url: "../php/perfil/modificar_password.php",
		    data: $("#form-modificar-pass").serialize(),
		    success: function(data, status) {

		    	error = data.split("-");

	            numero = error[0];
	            cadena = error[1];


		        if(numero == "1") {

		        	contenido_modal = "<p>"+cadena+"</p><a onclick='red_perfil()' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("CONTRASEÑA MODIFICADA");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else if(numero == "2") {

		        	contenido_modal = "<p>"+cadena+"</p><a onclick='red_perfil()' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }

		        else {

		        	contenido_modal = "<p></p><a onclick='red_perfil()' class='boton boton-modal'>ACEPTAR</a>";
		        
		        	$("#titulo-modal-aviso").text("ERROR");
		        	$("#contenido-modal-aviso").html(contenido_modal);

		        	window.location = "#modal-aviso";
		        }


			}

		});

	}

}




// PERFIL
$("#boton-salir").click(function(){

	localStorage.removeItem("id_usuario");

	window.location = "../index.html";

});



function red_perfil() {

	window.location = "#contenedor-perfil";
}



function cargar_provincias_editar_perfil() {

	$.ajax({

	    type: "GET",
	    async : true,
	    url: "../php/perfil/cargar_provincias.php",
	    success: function(data, status) {

	    	if(data != "vacio") {

			    var array_provincias = JSON.parse(data);

			    var contenido_provincias = "<option value='0'>PROVINCIA</option>";

			    for (i = 0; i < array_provincias.length; i++) {

			    	contenido_provincias += "<option value='"+array_provincias[i].id_provincia+"'>"+array_provincias[i].provincia+"</option>";
				    
				}

				$('#provincia-usuario-editar-perfil').html(contenido_provincias);

	    	}

		}

	});

}


function cargar_provincias_ver_amigos() {

	$.ajax({

	    type: "GET",
	    async : true,
	    url: "../php/perfil/cargar_provincias.php",
	    success: function(data, status) {

	    	if(data != "vacio") {

			    var array_provincias = JSON.parse(data);
				var contenido_provincias = "<option value='0'>PROVINCIA</option>";

			    for (i = 0; i < array_provincias.length; i++) {

			    	contenido_provincias += "<option value='"+array_provincias[i].id_provincia+"'>"+array_provincias[i].provincia+"</option>";
				    
				}

				$('#provincia-filtro-ver-amigos').html(contenido_provincias);

	    	}

		}

	});

}


function cargar_provincias_agregar_amigos() {

	$.ajax({

	    type: "GET",
	    async : true,
	    url: "../php/perfil/cargar_provincias.php",
	    success: function(data, status) {

	    	if(data != "vacio") {

			    var array_provincias = JSON.parse(data);
				var contenido_provincias = "<option value='0'>PROVINCIA</option>";

			    for (i = 0; i < array_provincias.length; i++) {

			    	contenido_provincias += "<option value='"+array_provincias[i].id_provincia+"'>"+array_provincias[i].provincia+"</option>";
				    
				}

				$('#provincia-filtro-agregar-amigos').html(contenido_provincias);

	    	}

		}

	});

}



function cargar_datos_ver_perfil() {

	$.ajax({

	    type: "POST",
	    async : true,
	    url: "../php/perfil/visualizar_perfil.php",
	    data: { id_usuario: id_usuario },
	    success: function(data, status) {

		    var datos_perfil_usuario = JSON.parse(data);

		    var url_foto_usuario = datos_perfil_usuario.foto_usuario;

		    $("#imagen-usuario-ver-perfil").attr('src',"../"+url_foto_usuario);
		    $("#dato-nombre-usuario-ver-perfil").text(datos_perfil_usuario.nombre_usuario);
		    $("#dato-email-usuario-ver-perfil").text(datos_perfil_usuario.email_usuario);
		    $("#dato-edad-usuario-ver-perfil").text(datos_perfil_usuario.edad_usuario+" AÑOS");
		    sexo_usuario = datos_perfil_usuario.sexo_usuario;

		    if(datos_perfil_usuario.sexo_usuario == 'Hombre') {

		    	$("#dato-icono-sexo-usuario-ver-perfil").html("<i class='fa fa-mars' aria-hidden='true'></i> SEXO");
		    } 

		    else if(datos_perfil_usuario.sexo_usuario == 'Mujer') {

		    	$("#dato-icono-sexo-usuario-ver-perfil").html("<i class='fa fa-venus' aria-hidden='true'></i> SEXO");
		    }

		    else {

		    	$("#dato-icono-sexo-usuario-ver-perfil").html("<i class='fa fa-venus-mars' aria-hidden='true'></i> SEXO");
		    }

		    $("#dato-sexo-usuario-ver-perfil").text(datos_perfil_usuario.sexo_usuario);
		    $("#dato-provincia-usuario-ver-perfil").text(datos_perfil_usuario.provincia_usuario);
		    $("#dato-cita-usuario-ver-perfil").text(datos_perfil_usuario.cita_usuario);

		    $("#imagen-usuario-ver-perfil").attr("src","../"+url_foto_usuario);

		}

	});

}




function cargar_datos_editar_perfil() {

	//cargar_provincias_editar_perfil();

	$.ajax({

	    type: "POST",
	    async : true,
	    url: "../php/perfil/visualizar_perfil.php",
	    data: { id_usuario: id_usuario },
	    success: function(data, status) {

	    	$("#id-usuario-editar-perfil").val(id_usuario);

		    var datos_perfil_usuario = JSON.parse(data);

		    var url_foto_usuario = datos_perfil_usuario.foto_usuario;

		    $(".cropme").css("background-image", "url('../"+url_foto_usuario+"')");
		    $("#nombre-usuario-editar-perfil").val(datos_perfil_usuario.nombre_usuario);
		    $("#email-usuario-editar-perfil").val(datos_perfil_usuario.email_usuario);
		    $("#edad-usuario-editar-perfil").val(datos_perfil_usuario.fecha_auxiliar_nacimiento_usuario);

		    if(datos_perfil_usuario.sexo_usuario == 'Hombre') {

		    	$("#sexo-h-editar-perfil").prop('checked', true);
		    	$("#sexo-m-editar-perfil").prop('checked', false);
		    } 

		    else if(datos_perfil_usuario.sexo_usuario == 'Mujer') {

		    	$("#sexo-h-editar-perfil").prop('checked', false);
		    	$("#sexo-m-editar-perfil").prop('checked', true);
		    }

		    else {

		    	$("#sexo-h-editar-perfil").prop('checked', false);
		    	$("#sexo-m-editar-perfil").prop('checked', false);
		    }

		    $("#provincia-usuario-editar-perfil").val(datos_perfil_usuario.provincia_auxiliar_usuario);

		    var codigo_provincia = $("#provincia-usuario-editar-perfil").val();

			if(codigo_provincia == '0') {

				$("#provincia-usuario-editar-perfil").addClass("gris-formulario");
			}

			else {

				$("#provincia-usuario-editar-perfil").removeClass("gris-formulario");
			}


		    if(datos_perfil_usuario.cita_usuario != "Sin especificar") {

		    	$("#cita-usuario-editar-perfil").val(datos_perfil_usuario.cita_usuario);
		    }

		    //$("#imagen-usuario-editar-perfil").attr("src",url_foto_usuario);

		}

	});

}




// AMIGOS
$("#item-menu-amigos").click(function(){

	$('#id-usuario-ver-amigos').val(id_usuario);
	$('#id-usuario-agregar-amigos').val(id_usuario);
	$('#id-usuario-solicitudes-amigos').val(id_usuario);

	//cargar_provincias_ver_amigos();
	filtrar_amigos();
	filtrar_solicitudes();


	window.location = "#contenedor-amigos";

	var clase = $('#item-menu-amigos').attr('class');

	if(clase != "item-menu-activo") {

		$(".item-menu-activo").addClass("item-menu-normal");
		$(".item-menu-activo").removeClass("item-menu-activo");
		$("#item-menu-amigos").removeClass("item-menu-normal");
		$("#item-menu-amigos").addClass("item-menu-activo");
	}

	var clase_auxiliar1 = $('#popup-contacto').hasClass('ocultar-popup');
	var clase_auxiliar2 = $('#popup-informacion').hasClass('ocultar-popup');
	var clase_auxiliar1 = $('#popup-contacto').hasClass('ocultar-popup');
	var clase_auxiliar2 = $('#popup-informacion').hasClass('ocultar-popup');
	var clase_auxiliar3 = $('#modalidad-trabalenguas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar4 = $('#modalidad-calambures').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar5 = $('#modalidad-criptogramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar6 = $('#modalidad-lipogramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar7 = $('#modalidad-pangramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar8 = $('#modalidad-palindromos').hasClass('ocultar-modal-modalidad');

	if(clase_auxiliar1 == false) {
		$("#popup-contacto").addClass("ocultar-popup");
	}

	if(clase_auxiliar2 == false) {
		$("#popup-informacion").addClass("ocultar-popup");
	}

	if(clase_auxiliar3 == false) {
		$("#modalidad-trabalenguas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar4 == false) {
		$("#modalidad-calambures").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar5 == false) {
		$("#modalidad-criptogramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar6 == false) {
		$("#modalidad-lipogramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar7 == false) {
		$("#modalidad-pangramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar8 == false) {
		$("#modalidad-palindromos").addClass("ocultar-modal-modalidad");
	}
	
});



function filtrar_amigos() {

	var contenido_lista = "";

	$.ajax({

	    type: "POST",
	    url: "../php/amigos/filtrar_amigos.php",
	    data: $("#form-filtro-ver-amigos").serialize(),
	    success: function(data, status) {


	    	if(data != "sin" && data != "vacio") {

			    var array_amigos = JSON.parse(data);

			    for (i = 0; i < array_amigos.length; i++) {

			    	contenido_lista += "<div class='contenedor-amigo'>";
			    	contenido_lista += "<img src='../"+array_amigos[i].foto_amigo+"' alt='"+array_amigos[i].nombre_amigo+"'>";
			    	contenido_lista += "<div class='puntuacion-amigo'><i class='fa fa-trophy' aria-hidden='true'></i> 250</div>";
			    	contenido_lista += "<div class='contenedor-datos-amigo'>";
			    	contenido_lista += "<span class='dato-nombre'><i class='fa fa-user' aria-hidden='true'></i> "+array_amigos[i].nombre_amigo+"</span>";
			    	contenido_lista += "<span class='dato-email'><i class='fa fa-envelope' aria-hidden='true'></i> "+array_amigos[i].email_amigo+"</span>";
			    	contenido_lista += "<span class='subcontenedor-datos-amigo'>";
			    	contenido_lista += "<span class='dato-sexo'><i class='fa fa-venus-mars' aria-hidden='true'></i> "+array_amigos[i].sexo_amigo+"</span>";
			    	contenido_lista += "<span class='dato-edad'><i class='fa fa-calendar' aria-hidden='true'></i> "+array_amigos[i].edad_amigo+"</span>";
			    	contenido_lista += "<span class='dato-provincia'><i class='fa fa-globe' aria-hidden='true'></i> "+array_amigos[i].provincia_amigo+"</span>";
			    	contenido_lista += "</span>";
			    	contenido_lista += "<span class='dato-cita'><i class='fa fa-quote-left' aria-hidden='true'></i> "+array_amigos[i].cita_amigo+"</span>";
			    	contenido_lista += "</div>";
			    	contenido_lista += "<div class='contenedor-opciones1-amigo'>";
			    	contenido_lista += "<a onclick='confirmar_eliminar_amigo("+array_amigos[i].id_amigo+")' class='boton boton1'>ELIMINAR</a>";
			    	contenido_lista += "</div>";
			    	contenido_lista += "</div>";  

				}

	    	}

	    	else {

	    		if(data == "sin") {

	    			contenido_lista = "<p>Aún no tienes amig@s.</p>";
	    		}

	    		else {

	    			contenido_lista = "<p>No se han encontrado amig@s.</p>";
	    		}

	    		
	    	}


	    	$('#lista-ver-amigos').html(contenido_lista);

		}

	});

}




function buscar_amigos() {

	var contenido_lista = "";
	var contenido_lista_auxiliar = "";

	$.ajax({

	    type: "POST",
	    url: "../php/amigos/buscar_amigos.php",
	    data: $("#form-filtro-agregar-amigos").serialize(),
	    success: function(data, status) {

	    	if(data != "sin" && data != "vacio") {

			    var array_amigos = JSON.parse(data);
			    var estado = "";
			    var columna = "";

			    for (i = 0; i < array_amigos.length; i++) {

			    	estado = array_amigos[i].estado;
			    	columna = array_amigos[i].columna;

			    	if(estado == '1') {
			    		//Usuario1 y usuario2 son amigos

			    		contenido_lista_auxiliar = "<a class='boton boton1 boton-deshabilitado'>AGREGADO</a><a onclick='confirmar_eliminar_amigo("+array_amigos[i].id_amigo+")' class='boton boton2'>ELIMINAR</a>";
			    	}

			    	if(estado == '2') {
			    		//Usuario1 envia peticion de amistad a usuario2

			    		if(columna == '1') {
			    			//Yo soy usuario1
			    			//Envio peticion de amistad a usuario2

			    			contenido_lista_auxiliar = "<a class='boton boton-deshabilitado'>PENDIENTE</a><a onclick='eliminar_amigo("+array_amigos[i].id_amigo+")' class='boton boton2'>CANCELAR</a>";
			    		}

			    		else {
			    			//Yo soy usuario2
			    			//usuario1 me envia peticion de amistad

			    			contenido_lista_auxiliar = "<a onclick='aceptar_solicitud_amistad("+array_amigos[i].id_amigo+")' class='boton'>ACEPTAR</a><a onclick='rechazar_solicitud_amistad("+array_amigos[i].id_amigo+")' class='boton boton2'>RECHAZAR</a>";
			    		}

			    	}


			    	else if(estado == '3') {
			    		//Usuario1 rechaza peticion de amistad de usuario2

			    		if(columna == '1') {
			    			//Yo soy usuario1
			    			//Rechazo peticion de amistad de usuario2

			    			contenido_lista_auxiliar = "<a class='boton boton-deshabilitado'>NULA</a><a onclick='aceptar_solicitud_amistad("+array_amigos[i].id_amigo+")' class='boton boton2'>ACEPTAR</a>";
			    		}

			    		else {
			    			//Yo soy usuario2
			    			//usuario2 rechaza mi peticion de amistad

			    			contenido_lista_auxiliar = "<a class='boton boton1 boton-deshabilitado'>NULA</a>";
			    		}

			    	}


			    	else if(estado == '4') {
			    		//Usuario2 rechaza peticion de amistad de usuario1

			    		if(columna == '1') {
			    			//Yo soy usuario1
			    			//usuario2 rechaza mi peticion de amistad

			    			contenido_lista_auxiliar = "<a class='boton boton1 boton-deshabilitado'>NULA</a>";
			    		}

			    		else {
			    			//Yo soy usuario2

			    			//Rechazo peticion de amistad de usuario2

			    			contenido_lista_auxiliar = "<a class='boton boton-deshabilitado'>NULA</a><a onclick='aceptar_solicitud_amistad("+array_amigos[i].id_amigo+")' class='boton boton2'>ACEPTAR</a>";
			    		}

			    	}


			    	else {
			    		//Usuario1 y usuario2 no tienen ninguna relacion

			    		contenido_lista_auxiliar = "<a onclick='agregar_amigo("+array_amigos[i].id_amigo+")' class='boton boton1'>AGREGAR</a>";
			    	}



			    	contenido_lista += "<div class='contenedor-amigo'>";
			    	contenido_lista += "<img src='../"+array_amigos[i].foto_amigo+"' alt='"+array_amigos[i].nombre_amigo+"'>";
			    	contenido_lista += "<div class='puntuacion-amigo'><i class='fa fa-trophy' aria-hidden='true'></i> 250</div>";
			    	contenido_lista += "<div class='contenedor-datos-amigo'>";
			    	contenido_lista += "<span class='dato-nombre'><i class='fa fa-user' aria-hidden='true'></i> "+array_amigos[i].nombre_amigo+"</span>";
			    	contenido_lista += "<span class='dato-email'><i class='fa fa-envelope' aria-hidden='true'></i> "+array_amigos[i].email_amigo+"</span>";
			    	contenido_lista += "<span class='subcontenedor-datos-amigo'>";
			    	contenido_lista += "<span class='dato-sexo'><i class='fa fa-venus-mars' aria-hidden='true'></i> "+array_amigos[i].sexo_amigo+"</span>";
			    	contenido_lista += "<span class='dato-edad'><i class='fa fa-calendar' aria-hidden='true'></i> "+array_amigos[i].edad_amigo+"</span>";
			    	contenido_lista += "<span class='dato-provincia'><i class='fa fa-globe' aria-hidden='true'></i> "+array_amigos[i].provincia_amigo+"</span>";
			    	contenido_lista += "</span>";
			    	contenido_lista += "<span class='dato-cita'><i class='fa fa-quote-left' aria-hidden='true'></i> "+array_amigos[i].cita_amigo+"</span>";
			    	contenido_lista += "</div>";
			    	contenido_lista += "<div class='contenedor-opciones1-amigo'>";
			    	contenido_lista += contenido_lista_auxiliar;
			    	contenido_lista += "</div>";
			    	contenido_lista += "</div>";  

				}

	    	}

	    	else {

	    		if(data == "vacio") {

	    			contenido_lista = "<p>No se han encontrado usuarios.</p>";
	    		}

	    		else {

	    			contenido_lista = "<p>No has introducido ningún criterio de búsqueda.</p>";
	    		}

	    		
	    	}


	    	$('#lista-agregar-amigos').html(contenido_lista);

		}

	});

}



function filtrar_solicitudes() {

	var contenido_lista = "";
	var contenido_lista_auxiliar = "";

	$.ajax({

	    type: "POST",
	    url: "../php/amigos/filtrar_solicitudes.php",
	    data: $("#form-filtro-solicitudes-amigos").serialize(),
	    success: function(data, status) {


	    	if(data != "vacio1" && data != "vacio2" && data != "vacio3" && data != "vacio4" && data != "vacio5") {

			    var array_solicitudes = JSON.parse(data);
			    var estado = "";
			    var columna = "";

			    for (i = 0; i < array_solicitudes.length; i++) {

			    	estado = array_solicitudes[i].estado;
			    	columna = array_solicitudes[i].columna;

			    	if(estado == '2') {
			    		//Usuario1 envia peticion de amistad a usuario2

			    		if(columna == '1') {
			    			//Yo soy usuario1
			    			//Envio peticion de amistad a usuario2

			    			contenido_lista_auxiliar = "<a class='boton boton-deshabilitado'>PENDIENTE</a><a onclick='eliminar_amigo("+array_solicitudes[i].id_amigo+")' class='boton boton2'>CANCELAR</a>";
			    		}

			    		else {
			    			//Yo soy usuario2
			    			//usuario1 me envia peticion de amistad

			    			contenido_lista_auxiliar = "<a onclick='aceptar_solicitud_amistad("+array_solicitudes[i].id_amigo+")' class='boton'>ACEPTAR</a><a onclick='rechazar_solicitud_amistad("+array_solicitudes[i].id_amigo+")' class='boton boton2'>RECHAZAR</a>";
			    		}

			    	}


			    	else if(estado == '3') {
			    		//Usuario1 rechaza peticion de amistad de usuario2

			    		if(columna == '1') {
			    			//Yo soy usuario1
			    			//Rechazo peticion de amistad de usuario2

			    			contenido_lista_auxiliar = "<a class='boton boton-deshabilitado'>NULA</a><a onclick='aceptar_solicitud_amistad("+array_solicitudes[i].id_amigo+")' class='boton boton2'>ACEPTAR</a>";
			    		}

			    		else {
			    			//Yo soy usuario2
			    			//usuario2 rechaza mi peticion de amistad

			    			contenido_lista_auxiliar = "<a class='boton boton1 boton-deshabilitado'>NULA</a>";
			    		}

			    	}


			    	else if(estado == '4') {
			    		//Usuario2 rechaza peticion de amistad de usuario1

			    		if(columna == '1') {
			    			//Yo soy usuario1
			    			//usuario2 rechaza mi peticion de amistad

			    			contenido_lista_auxiliar = "<a class='boton boton1 boton-deshabilitado'>NULA</a>";
			    		}

			    		else {
			    			//Yo soy usuario2

			    			//Rechazo peticion de amistad de usuario2

			    			contenido_lista_auxiliar = "<a class='boton boton-deshabilitado'>NULA</a><a onclick='aceptar_solicitud_amistad("+array_solicitudes[i].id_amigo+")' class='boton boton2'>ACEPTAR</a>";
			    		}

			    	}


			    	contenido_lista += "<div class='contenedor-amigo'>";
			    	contenido_lista += "<img src='../"+array_solicitudes[i].foto_amigo+"' alt='"+array_solicitudes[i].nombre_amigo+"'>";
			    	contenido_lista += "<div class='puntuacion-amigo'><i class='fa fa-trophy' aria-hidden='true'></i> 250</div>";
			    	contenido_lista += "<div class='contenedor-datos-amigo'>";
			    	contenido_lista += "<span class='dato-nombre'><i class='fa fa-user' aria-hidden='true'></i> "+array_solicitudes[i].nombre_amigo+"</span>";
			    	contenido_lista += "<span class='subcontenedor-datos-amigo'>";
			    	contenido_lista += "<span class='dato-sexo'><i class='fa fa-venus-mars' aria-hidden='true'></i> "+array_solicitudes[i].sexo_amigo+"</span>";
			    	contenido_lista += "<span class='dato-edad'><i class='fa fa-calendar' aria-hidden='true'></i> "+array_solicitudes[i].edad_amigo+"</span>";
			    	contenido_lista += "<span class='dato-provincia'><i class='fa fa-globe' aria-hidden='true'></i> "+array_solicitudes[i].provincia_amigo+"</span>";
			    	contenido_lista += "</span>";
			    	contenido_lista += "<span class='dato-cita'><i class='fa fa-quote-left' aria-hidden='true'></i> "+array_solicitudes[i].cita_amigo+"</span>";
			    	contenido_lista += "</div>";
			    	contenido_lista += "<div class='contenedor-opciones1-amigo'>";
			    	contenido_lista += contenido_lista_auxiliar;
			    	contenido_lista += "</div>";
			    	contenido_lista += "</div>";  

				}

	    	}

	    	else {

	    		if(data == "vacio1") {

	    			contenido_lista = "<p>No has seleccionado ninguna opción.</p>";
	    		}

	    		else if(data == "vacio2") {

	    			contenido_lista = "<p>No tienes ninguna petición de amistad recibida pendiente de confirmación.</p>";
	    		}

	    		else if(data == "vacio3") {

	    			contenido_lista = "<p>No tienes ninguna petición de amistad enviada pendiente de confirmación.</p>";
	    		}

	    		else if(data == "vacio4") {

	    			contenido_lista = "<p>No tienes ninguna petición de amistad rechazada.</p>";
	    		}

	    		else if(data == "vacio5") {

	    			contenido_lista = "<p>No tienes peticiones de amistad.</p>";
	    		}

	    		else {

	    			contenido_lista = "<p>No tienes peticiones de amistad.</p>";
	    		}

	    		
	    	}


	    	$('#lista-solicitudes-amigos').html(contenido_lista);

		}

	});

}




function aceptar_solicitud_amistad(id_amigo) {

	$.ajax({

	    type: "POST",
	    url: "../php/amigos/aceptar_solicitud_amistad.php",
	    data: { id_usuario: id_usuario, id_amigo: id_amigo },
	    success: function(data, status) {

	    	buscar_amigos();
	    	filtrar_solicitudes();
	    	filtrar_amigos();

	    }

	});

}


function rechazar_solicitud_amistad(id_amigo) {

	$.ajax({

	    type: "POST",
	    url: "../php/amigos/rechazar_solicitud_amistad.php",
	    data: { id_usuario: id_usuario, id_amigo: id_amigo },
	    success: function(data, status) {

	    	buscar_amigos();
	    	filtrar_solicitudes();
	    	filtrar_amigos();

	    }

	});

}


function agregar_amigo(id_amigo) {

	$.ajax({

	    type: "POST",
	    url: "../php/amigos/agregar_amigo.php",
	    data: { id_usuario: id_usuario, id_amigo: id_amigo },
	    success: function(data, status) {

	    	buscar_amigos();
	    	filtrar_solicitudes();
	    	filtrar_amigos();

	    }

	});

}



function confirmar_eliminar_amigo(id_amigo) {


	//AJAX con visualizar_perfil.php (pasandole mi id para saber si soy chico o chica) y otro (pasandole el id del amigo para saber su nombre)
	// y asi hacer bien la frase de contenido_modal

	var cadena_auxiliar = "";

	if(sexo_usuario == 'Mujer') {

		cadena_auxiliar = "segura";
	}

	else {

		cadena1_auxiliar = "seguro";
	}
	

	$.ajax({

	    type: "POST",
	    url: "../php/perfil/visualizar_perfil.php",
	    data: { id_usuario: id_amigo },
	    success: function(data, status) {

	    	var datos_perfil_amigo = JSON.parse(data);

	    	var cadena2_auxiliar = datos_perfil_amigo.nombre_usuario;

	    	var contenido_modal = "<p>¿Estás "+cadena1_auxiliar+" de que deseas eliminar a "+cadena2_auxiliar+"?</p><a onclick='eliminar_amigo("+id_amigo+")' class='boton boton-modal'>ACEPTAR</a>";
	        
			$("#titulo-modal-aviso").text("ELIMINAR AMIG@");
			$("#contenido-modal-aviso").html(contenido_modal);

			window.location = "#modal-aviso";

	    }

	});

}



function eliminar_amigo(id_amigo) {

	$.ajax({

	    type: "POST",
	    url: "../php/amigos/eliminar_amigo.php",
	    data: { id_usuario: id_usuario, id_amigo: id_amigo },
	    success: function(data, status) {

	    	buscar_amigos();
	    	filtrar_solicitudes();
	    	filtrar_amigos();

	    }

	});

}




// ESTADISTICAS
$("#item-menu-estadisticas").click(function(){

	cargar_estadisticas();
	cargar_historial();

	window.location = "#contenedor-estadisticas";

	var clase = $('#item-menu-estadisticas').attr('class');

	if(clase != "item-menu-activo") {

		$(".item-menu-activo").addClass("item-menu-normal");
		$(".item-menu-activo").removeClass("item-menu-activo");
		$("#item-menu-estadisticas").removeClass("item-menu-normal");
		$("#item-menu-estadisticas").addClass("item-menu-activo");
	}

	var clase_auxiliar1 = $('#popup-contacto').hasClass('ocultar-popup');
	var clase_auxiliar2 = $('#popup-informacion').hasClass('ocultar-popup');
	var clase_auxiliar1 = $('#popup-contacto').hasClass('ocultar-popup');
	var clase_auxiliar2 = $('#popup-informacion').hasClass('ocultar-popup');
	var clase_auxiliar3 = $('#modalidad-trabalenguas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar4 = $('#modalidad-calambures').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar5 = $('#modalidad-criptogramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar6 = $('#modalidad-lipogramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar7 = $('#modalidad-pangramas').hasClass('ocultar-modal-modalidad');
	var clase_auxiliar8 = $('#modalidad-palindromos').hasClass('ocultar-modal-modalidad');

	if(clase_auxiliar1 == false) {
		$("#popup-contacto").addClass("ocultar-popup");
	}

	if(clase_auxiliar2 == false) {
		$("#popup-informacion").addClass("ocultar-popup");
	}

	if(clase_auxiliar3 == false) {
		$("#modalidad-trabalenguas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar4 == false) {
		$("#modalidad-calambures").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar5 == false) {
		$("#modalidad-criptogramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar6 == false) {
		$("#modalidad-lipogramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar7 == false) {
		$("#modalidad-pangramas").addClass("ocultar-modal-modalidad");
	}

	if(clase_auxiliar8 == false) {
		$("#modalidad-palindromos").addClass("ocultar-modal-modalidad");
	}
	
});








// TABS PERFIL

$("#item-submenu-ver-perfil").click(function(){

	cargar_datos_ver_perfil();


	var clase_submenu = $('#item-submenu-ver-perfil').hasClass('submenu-activo');
	var clase_contenido = $('#contenido-ver-perfil').hasClass('contenido-oculto');

	if(clase_submenu == false) {

		$("#item-submenu-ver-perfil").removeClass("submenu-normal");
		$("#item-submenu-ver-perfil").addClass("submenu-activo");
		$("#item-submenu-editar-perfil").removeClass("submenu-activo");
		$("#item-submenu-editar-perfil").addClass("submenu-normal");
		$("#item-submenu-salir-perfil").removeClass("submenu-activo");
		$("#item-submenu-salir-perfil").addClass("submenu-normal");
	}

	if(clase_contenido == true) {

		$("#contenido-ver-perfil").removeClass("contenido-oculto");
		$("#contenido-editar-perfil").addClass("contenido-oculto");
		$("#contenido-salir-perfil").addClass("contenido-oculto");
	}
	
});


$("#item-submenu-editar-perfil").click(function(){

	cargar_datos_editar_perfil();


	var clase_submenu = $('#item-submenu-editar-perfil').hasClass('submenu-activo');
	var clase_contenido = $('#contenido-editar-perfil').hasClass('contenido-oculto');

	if(clase_submenu == false) {

		$("#item-submenu-editar-perfil").removeClass("submenu-normal");
		$("#item-submenu-editar-perfil").addClass("submenu-activo");
		$("#item-submenu-ver-perfil").removeClass("submenu-activo");
		$("#item-submenu-ver-perfil").addClass("submenu-normal");
		$("#item-submenu-salir-perfil").removeClass("submenu-activo");
		$("#item-submenu-salir-perfil").addClass("submenu-normal");
	}

	if(clase_contenido == true) {

		$("#contenido-editar-perfil").removeClass("contenido-oculto");
		$("#contenido-ver-perfil").addClass("contenido-oculto");
		$("#contenido-salir-perfil").addClass("contenido-oculto");
	}
	
});


$("#item-submenu-salir-perfil").click(function(){

	var clase_submenu = $('#item-submenu-salir-perfil').hasClass('submenu-activo');
	var clase_contenido = $('#contenido-salir-perfil').hasClass('contenido-oculto');

	if(clase_submenu == false) {

		$("#item-submenu-salir-perfil").removeClass("submenu-normal");
		$("#item-submenu-salir-perfil").addClass("submenu-activo");
		$("#item-submenu-editar-perfil").removeClass("submenu-activo");
		$("#item-submenu-editar-perfil").addClass("submenu-normal");
		$("#item-submenu-ver-perfil").removeClass("submenu-activo");
		$("#item-submenu-ver-perfil").addClass("submenu-normal");
	}

	if(clase_contenido == true) {

		$("#contenido-salir-perfil").removeClass("contenido-oculto");
		$("#contenido-editar-perfil").addClass("contenido-oculto");
		$("#contenido-ver-perfil").addClass("contenido-oculto");
	}
	
});


// TABS AMIGOS

$("#item-submenu-ver-amigos").click(function(){

	$('#id-usuario-ver-amigos').val(id_usuario);

	//cargar_provincias_ver_amigos();
	filtrar_amigos();

	var clase_submenu = $('#item-submenu-ver-amigos').hasClass('submenu-activo');
	var clase_contenido = $('#contenido-ver-amigos').hasClass('contenido-oculto');

	if(clase_submenu == false) {

		$("#item-submenu-ver-amigos").removeClass("submenu-normal");
		$("#item-submenu-ver-amigos").addClass("submenu-activo");
		$("#item-submenu-agregar-amigos").removeClass("submenu-activo");
		$("#item-submenu-agregar-amigos").addClass("submenu-normal");
		$("#item-submenu-solicitudes-amigos").removeClass("submenu-activo");
		$("#item-submenu-solicitudes-amigos").addClass("submenu-normal");
	}

	if(clase_contenido == true) {

		$("#contenido-ver-amigos").removeClass("contenido-oculto");
		$("#contenido-agregar-amigos").addClass("contenido-oculto");
		$("#contenido-solicitudes-amigos").addClass("contenido-oculto");
	}
	
});


$("#item-submenu-agregar-amigos").click(function(){

	$('#id-usuario-agregar-amigos').val(id_usuario);

	//cargar_provincias_agregar_amigos();

	var clase_submenu = $('#item-submenu-agregar-amigos').hasClass('submenu-activo');
	var clase_contenido = $('#contenido-agregar-amigos').hasClass('contenido-oculto');

	if(clase_submenu == false) {

		$("#item-submenu-agregar-amigos").removeClass("submenu-normal");
		$("#item-submenu-agregar-amigos").addClass("submenu-activo");
		$("#item-submenu-ver-amigos").removeClass("submenu-activo");
		$("#item-submenu-ver-amigos").addClass("submenu-normal");
		$("#item-submenu-solicitudes-amigos").removeClass("submenu-activo");
		$("#item-submenu-solicitudes-amigos").addClass("submenu-normal");
	}

	if(clase_contenido == true) {

		$("#contenido-agregar-amigos").removeClass("contenido-oculto");
		$("#contenido-ver-amigos").addClass("contenido-oculto");
		$("#contenido-solicitudes-amigos").addClass("contenido-oculto");
	}
	
});


$("#item-submenu-solicitudes-amigos").click(function(){

	$('#id-usuario-solicitudes-amigos').val(id_usuario);

	filtrar_solicitudes();

	var clase_submenu = $('#item-submenu-solicitudes-amigos').hasClass('submenu-activo');
	var clase_contenido = $('#contenido-solicitudes-amigos').hasClass('contenido-oculto');

	if(clase_submenu == false) {

		$("#item-submenu-solicitudes-amigos").removeClass("submenu-normal");
		$("#item-submenu-solicitudes-amigos").addClass("submenu-activo");
		$("#item-submenu-agregar-amigos").removeClass("submenu-activo");
		$("#item-submenu-agregar-amigos").addClass("submenu-normal");
		$("#item-submenu-ver-amigos").removeClass("submenu-activo");
		$("#item-submenu-ver-amigos").addClass("submenu-normal");
	}

	if(clase_contenido == true) {

		$("#contenido-solicitudes-amigos").removeClass("contenido-oculto");
		$("#contenido-ver-amigos").addClass("contenido-oculto");
		$("#contenido-agregar-amigos").addClass("contenido-oculto");
	}
	
});


// TABS ESTADISTICAS

$("#item-submenu-puntuacion-estadisticas").click(function(){

	var clase_submenu = $('#item-submenu-puntuacion-estadisticas').hasClass('submenu-activo');
	var clase_contenido = $('#contenido-puntuacion-estadisticas').hasClass('contenido-oculto');

	if(clase_submenu == false) {

		$("#item-submenu-puntuacion-estadisticas").removeClass("submenu-normal");
		$("#item-submenu-puntuacion-estadisticas").addClass("submenu-activo");
		$("#item-submenu-historial-estadisticas").removeClass("submenu-activo");
		$("#item-submenu-historial-estadisticas").addClass("submenu-normal");
	}

	if(clase_contenido == true) {

		$("#contenido-puntuacion-estadisticas").removeClass("contenido-oculto");
		$("#contenido-historial-estadisticas").addClass("contenido-oculto");
	}


	cargar_estadisticas();

	
});


function cargar_estadisticas() {


	$.ajax({

	    type: "POST",
	    url: "../php/estadisticas/puntuacion.php",
	    data: { id_usuario: id_usuario },
	    async: true,
	    success: function(data, status) {

	    	if(data != "vacio") {

			    var puntuacion = JSON.parse(data);

			    $("#panel-total-estadisticas").text("Tu puntuación TOTAL actualmente es de: "+puntuacion.total+" PUNTOS");

			    $("#puntuacion-total-trabalenguas").text(puntuacion.total_trabalenguas);
			    $("#puntuacion-votos-trabalenguas").text(puntuacion.votos_trabalenguas);
			    $("#puntuacion-creaciones-trabalenguas").text(puntuacion.creaciones_trabalenguas);
			    $("#puntuacion-juegos-trabalenguas").text(puntuacion.juegos_trabalenguas);
			    $("#puntuacion-novato-trabalenguas").text(puntuacion.novato_trabalenguas);
			    $("#puntuacion-avanzado-trabalenguas").text(puntuacion.avanzado_trabalenguas);
			    $("#puntuacion-experto-trabalenguas").text(puntuacion.experto_trabalenguas);

			    $("#puntuacion-total-calambures").text(puntuacion.total_calambures);
			    $("#puntuacion-votos-calambures").text(puntuacion.votos_calambures);
			    $("#puntuacion-creaciones-calambures").text(puntuacion.creaciones_calambures);
			    $("#puntuacion-juegos-calambures").text(puntuacion.juegos_calambures);
			    $("#puntuacion-novato-calambures").text(puntuacion.novato_calambures);
			    $("#puntuacion-avanzado-calambures").text(puntuacion.avanzado_calambures);
			    $("#puntuacion-experto-calambures").text(puntuacion.experto_calambures);

			    $("#puntuacion-total-palindromos").text(puntuacion.total_palindromos);
			    $("#puntuacion-votos-palindromos").text(puntuacion.votos_palindromos);
			    $("#puntuacion-creaciones-palindromos").text(puntuacion.creaciones_palindromos);
			    $("#puntuacion-juegos-palindromos").text(puntuacion.juegos_palindromos);
			    $("#puntuacion-novato-palindromos").text(puntuacion.novato_palindromos);
			    $("#puntuacion-avanzado-palindromos").text(puntuacion.avanzado_palindromos);
			    $("#puntuacion-experto-palindromos").text(puntuacion.experto_palindromos);

			    $("#puntuacion-total-lipogramas").text(puntuacion.total_lipogramas);
			    $("#puntuacion-votos-lipogramas").text(puntuacion.votos_lipogramas);
			    $("#puntuacion-creaciones-lipogramas").text(puntuacion.creaciones_lipogramas);
			    $("#puntuacion-juegos-lipogramas").text(puntuacion.juegos_lipogramas);
			    $("#puntuacion-novato-lipogramas").text(puntuacion.novato_lipogramas);
			    $("#puntuacion-avanzado-lipogramas").text(puntuacion.avanzado_lipogramas);
			    $("#puntuacion-experto-lipogramas").text(puntuacion.experto_lipogramas);

			    $("#puntuacion-total-pangramas").text(puntuacion.total_pangramas);
			    $("#puntuacion-votos-pangramas").text(puntuacion.votos_pangramas);
			    $("#puntuacion-creaciones-pangramas").text(puntuacion.creaciones_pangramas);
			    $("#puntuacion-juegos-pangramas").text(puntuacion.juegos_pangramas);
			    $("#puntuacion-novato-pangramas").text(puntuacion.novato_pangramas);
			    $("#puntuacion-avanzado-pangramas").text(puntuacion.avanzado_pangramas);
			    $("#puntuacion-experto-pangramas").text(puntuacion.experto_pangramas);

			    $("#puntuacion-total-criptogramas").text(puntuacion.total_criptogramas);
			    $("#puntuacion-votos-criptogramas").text(puntuacion.votos_criptogramas);
			    $("#puntuacion-creaciones-criptogramas").text(puntuacion.creaciones_criptogramas);
			    $("#puntuacion-juegos-criptogramas").text(puntuacion.juegos_criptogramas);
			    $("#puntuacion-novato-criptogramas").text(puntuacion.novato_criptogramas);
			    $("#puntuacion-avanzado-criptogramas").text(puntuacion.avanzado_criptogramas);
			    $("#puntuacion-experto-criptogramas").text(puntuacion.experto_criptogramas);

			}


			else {


			}


	    }


	});


}


$("#item-submenu-historial-estadisticas").click(function(){

	var clase_submenu = $('#item-submenu-historial-estadisticas').hasClass('submenu-activo');
	var clase_contenido = $('#contenido-historial-estadisticas').hasClass('contenido-oculto');

	if(clase_submenu == false) {

		$("#item-submenu-historial-estadisticas").removeClass("submenu-normal");
		$("#item-submenu-historial-estadisticas").addClass("submenu-activo");
		$("#item-submenu-puntuacion-estadisticas").removeClass("submenu-activo");
		$("#item-submenu-puntuacion-estadisticas").addClass("submenu-normal");
	}

	if(clase_contenido == true) {

		$("#contenido-historial-estadisticas").removeClass("contenido-oculto");
		$("#contenido-puntuacion-estadisticas").addClass("contenido-oculto");
	}

	cargar_historial();
	
});



function cargar_historial() {

	$.ajax({

	    type: "POST",
	    url: "../php/estadisticas/historial.php",
	    data: { id_usuario: id_usuario },
	    async: true,
	    success: function(data, status) {

	    	if(data != "vacio") {

			    var historial = JSON.parse(data);

			    var contenido_historial = "<table>";


			    for (i = 0; i < historial.length; i++) {

			    	contenido_historial += "<tr><td class='columna-accion-historial' width='70%'>"+historial[i].accion+"</td><td class='columna-fecha-historial'>"+historial[i].fecha+"</td><td class='columna-hora-historial'>"+historial[i].hora+"</td></tr>";

			    }

			    contenido_historial += "</table>";


			    $("#panel-contenido-historial").html(contenido_historial);

			}


			else {

				$("#panel-contenido-historial").html("<span class='historial-auxiliar'>NO HAS REALIZADO NINGUNA ACTIVIDAD</span>");
			}


	    }


	});


}





// FORMULARIO DE CONTACTO 

$("#enviar-contacto").click(function(){

	var cargando = "<div class='contenido-contacto-enviado'><div class='loading'></div><p class='texto-loading'>ENVIANDO...</p></div>";

	var contacto_enviado = "<div class='contenido-contacto-enviado'><div>";
	contacto_enviado += "<div class='informacion-formulario-contacto'>";
	contacto_enviado += "<p>El formulario de contacto se ha enviado correctamente.</p></div>";
	contacto_enviado += "<br><a id='boton-contacto-enviado' class='boton boton-contacto cerrar-popup-contacto'>ACEPTAR</a>";
	contacto_enviado += "</div></div>";
	
	var contenido_error = "<div class='contenido-contacto-enviado'><div>";
	contacto_error += "<div class='informacion-formulario-contacto'>";
	contacto_error += "<p>El formulario no se ha podido enviar. Vuelve a intentarlo en unos minutos.</p></div>";
	contacto_error += "<br><a id='boton-contacto-error' class='boton boton-contacto cerrar-popup-contacto'>ACEPTAR</a>";
	contacto_error += "</div></div>";


	$.ajax({

	    type: "POST",
	    url: "../php/auxiliares/contacto.php",
	    data: $("#form-contacto").serialize(),
	    success: function(data, status) {
	        //$("#respuesta").html(data); 

	        $("#contenido-popup-contacto").html(cargando);


	        setTimeout(function(){

			  	$("#contenido-popup-contacto").html(contacto_enviado);

			}, 2000);

	    },

		error: function(){

			$("#contenido-popup-contacto").html(cargando);


	        setTimeout(function(){

			  	$("#contenido-popup-contacto").html(contacto_error);

			}, 2000);

		}


	});












	var clase_auxiliar = $('#popup-informacion').hasClass('ocultar-popup');

	if(clase_auxiliar == false) {
		$("#popup-informacion").addClass("ocultar-popup");
	}

	$("#popup-contacto").removeClass("ocultar-popup");

});






$("input[type='radio']").click(function(){

  var previousValue = $(this).attr('previousValue');
  var name = $(this).attr('name');

  if (previousValue == 'checked') {

    $(this).removeAttr('checked');
    $(this).attr('previousValue', true);
    $(this).prop('checked', false);
  }

  else {

    $("input[name="+name+"]:radio").attr('previousValue', true);
    $(this).attr('previousValue', 'checked');
    $(this).prop('checked', true);

  }

});




function sumar_puntos(puntos,tipo,subtipo) {

	$.ajax({

		type: "POST",
		url: "../php/estadisticas/sumar_puntos.php",
		async: false,
		data: { id_usuario: id_usuario, tipo: tipo, subtipo: subtipo, puntos: puntos },
		success: function(data, status) {


			if(data != "vacio") {

				//Los puntos se han sumado correctamente
			}

			else {

				//Los puntos no se han sumado correctamente
			}

		}

	});

}


function restar_puntos(puntos,tipo,subtipo) {

	$.ajax({

		type: "POST",
		url: "../php/estadisticas/restar_puntos.php",
		async: false,
		data: { id_usuario: id_usuario, tipo: tipo, subtipo: subtipo, puntos: puntos },
		success: function(data, status) {


			if(data != "vacio") {

				//Los puntos se han restado correctamente
			}

			else {

				//Los puntos no se han restado correctamente
			}

		}

	});
	
}



function historial_juegos(puntos,tipo,dificultad,tipo_historial) {

	$.ajax({

		type: "POST",
		url: "../php/estadisticas/historial_juegos.php",
		async: false,
		data: { id_usuario: id_usuario, tipo: tipo, dificultad: dificultad, puntos: puntos, tipo_historial: tipo_historial },
		success: function(data, status) {


			if(data != "vacio") {

				//Se ha añadido la accion al historial correctamente
			}

			else {

				//No se ha añadido la accion al historial correctamente
			}

		}

	});

}





$.fn.insertAtCaret = function (myValue) {
  return this.each(function(){
  //IE support
  if (document.selection) {
    this.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
    this.focus();
  }
  //MOZILLA / NETSCAPE support
  else if (this.selectionStart || this.selectionStart == '0') {
    var startPos = this.selectionStart;
    var endPos = this.selectionEnd;
    var scrollTop = this.scrollTop;
    this.value = this.value.substring(0, startPos)+ myValue+ this.value.substring(endPos,this.value.length);
    this.focus();
    this.selectionStart = startPos + myValue.length;
    this.selectionEnd = startPos + myValue.length;
    this.scrollTop = scrollTop;
  } else {
    this.value += myValue;
    this.focus();
  }
  });
};



