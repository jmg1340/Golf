//$(document).on('deviceready', function(){
$(document).ready(function(){	


/*
 * Desactivacio del boto tornar enrere (ANDROID)
*/
	$(document).on('backbutton',function(){});


/*
******************************************************************************************************
* pagina PRINCIPAL
******************************************************************************************************
*/
	$("#btnSortir").bind("click", function(){
		navigator.app.exitApp();
		return false;
	});


	$("#btnCamps").bind("click", function(){
		mostrarCamps();
		window.setTimeout(function(){
			amagarColumnaTaula("taula_camps", 5)	// columna boto "par"
			amagarColumnaTaula("taula_camps", 6)	// columna boto "eliminar"
			$("#btnEditarCamps").show();
			$("#btnFetCamps").hide();

			$("body").pagecontainer("change", "#pagina_camps");
			$.mobile.changePage("#pagina_camps",{"transition": "slide"});
		}, 
		250
		);
		

		return false;
	});


	$("#btnDropTaules").bind("click", function(){
		$.mobile.changePage("#pagina_drop_taules");
		//mostrarPartides();
		return false;
	});




/*
******************************************************************************************************
* pagina DROP TAULES
******************************************************************************************************
*/
	$("#btnDropTaulaCamps").bind("click", function(){
		dropTable("Camps");
		return false;
	});

	$("#btnDropTaulaCampsParForats").bind("click", function(){
		dropTable("CampsParForats");
		return false;
	});

	$("#btnDropTaulaPartides").bind("click", function(){
		dropTable("Partides");
		return false;
	});

	$("#btnDropTaulaCops").bind("click", function(){
		dropTable("Cops");
		return false;
	});




/*
******************************************************************************************************
* pagina CAMPS
******************************************************************************************************
*/
	
	$("#pagina_camps").bind("pagebeforeshow", function(){
		mostrarCamps(function(){
			$("#btnInici").show();
			$("#btnEditarCamps").show();
			$("#btnNouCamp").show();
			$("#btnFetCamps").hide();				
			//amagarColumnaTaula("taula_camps", 1)	// columna boto "codi del camp"
			amagarColumnaTaula("taula_camps", 4)	// columna boto "par"
			amagarColumnaTaula("taula_camps", 5)	// columna boto "eliminar"
		});

	});



	$("#btnEditarCamps").bind("click", function(){
		mostrarColumnaTaula("taula_camps", 4)	// columna boto "par"
		mostrarColumnaTaula("taula_camps", 5)	// columna boto "eliminar"
		$("#taula_camps tr").removeClass("registreCampSeleccionat");
		//window.setTimeout(function(){
			$("#btnInici").hide();
			$("#btnEditarCamps").hide();
			$("#btnNouCamp").hide();
			$("#btnFetCamps").show();
		//}, 
		//250
		//);

		return false;
	});

	$("#btnFetCamps").bind("click", function(){
		amagarColumnaTaula("taula_camps", 4)	// columna boto "par"
		amagarColumnaTaula("taula_camps", 5)	// columna boto "eliminar"
		$("#taula_camps tr").addClass("registreCampSeleccionat");
		$("#btnInici").show();
		$("#btnEditarCamps").show();
		$("#btnNouCamp").show();
		$("#btnFetCamps").hide();
		return false;
	});
	

	$(document).on('click', '.registreCampSeleccionat', function(){
	    vgIdCamp = $(this).closest("tr").attr("id");
	    $.mobile.changePage("#pagina_partitscamp", {"transition": "slide"});
	    return false;
	});


	$(document).on('click', '.btnPar', function(){
		//console.debug("Has clicat boto 'Par'");
		vgIdCamp = $(this).closest("tr").attr("id");
		$.mobile.changePage("#pagina_parforatscamp", {"transition": "slide"});
		return false;
	});

	$(document).on('click', '.btnEliminarCamp', function(){
		vgIdCamp = $(this).closest("tr").attr("id");
		eliminarCamp(function(){
			mostrarCamps();
		});
		return false;
	});




/*
******************************************************************************************************
* pagina NOU CAMP
******************************************************************************************************
*/

	$("#pagina_nouCamp").bind("pagebeforeshow", function(){
		$("#formNomCamp").attr("value", "");
		$("#formForats").attr("value", "");
	});



	$("#forumalri_nouCamp").validate(
		{
			rules:{
				camp: {
					required: true,
					minlength: 3
				},
				forats: {
					required: true,
					number: true
				}
			},
			messages:{
				camp:{
					required: 	"No es pot deixar en blanc",
					minlength: 	"minim 3 caracters"
				},
				forats:{
					required: 	"No es pot deixar en blanc",
					number: 	"Han de ser numeros"
				}
			}
		}

	);

	$("#btCrearCamp").bind("click", function(){
		var validacioForumlariNouCamp = $("#forumalri_nouCamp").validate();
		if (validacioForumlariNouCamp.form() == true){
			//console.debug("Ha validat formulari NOU CAMP");
			insertRecordCamp(function(){
				insertRecordsForatsCamp();
		        $.mobile.changePage("#pagina_preguntaInformarPar");
		        		
			});			
		}

		return false;
	});




/*
******************************************************************************************************
* pagina PREGUNTA SI ES VOL INFORMAR EL PAR DE CADA FORAT DEL NOU CAMP
******************************************************************************************************
*/

	$("#informarPar").bind("click", function(){
		$.mobile.changePage("#pagina_parforatscamp");	
		return false;
	});	


/*
******************************************************************************************************
* pagina PAR DE CADA FORAT DEL CAMP SELECCIONAT
******************************************************************************************************
*/
	$("#pagina_parforatscamp").bind("pagebeforeshow", function(){
		mostrarCapsalera ("taula_capsaleraParForatsCampSeleccionat");
		mostrarTaulaParForatsCamp();
	});






/*
******************************************************************************************************
* pagina PARTITS DEL CAMP SELECCIONAT
******************************************************************************************************
*/
	$("#pagina_partitscamp").bind("pagebeforeshow", function(){
		//console.debug("carrega de la pagina partits-camp");
		mostrarCapsalera ("taula_capsaleraPartidesCampSeleccionat");
		mostrarPartidesCampSeleccionat(function(){
			//amagarColumnaTaula("taula_PartidesCampSeleccionat", 1)	// columna boto "codiPartida"
			amagarColumnaTaula("taula_PartidesCampSeleccionat", 6)	// columna boto "eliminar"
			//console.debug("columna 'elminar' amagada");
			$("#btnEditarPartidesCamp").show();
			$("#btnFetPartidesCamp").hide();				
		});
		return false;

	});


	$("#btnNovaPartida").bind("click", function(){
		$.mobile.changePage("#pagina_nova_partida");	
		return false;
	});


	$(document).on('click', '.registrePartidaSeleccionada', function(){
	    vgIdPartida = $(this).closest("tr").attr("id");
	    $.mobile.changePage("#pagina_targeta", {"transition": "slide"});
	    return false;
	});

	$("#btnEditarPartidesCamp").bind("click", function(){
		//mostrarColumnaTaula("taula_PartidesCampSeleccionat", 1)	// columna boto "codiPartida"
		mostrarColumnaTaula("taula_PartidesCampSeleccionat", 6)	// columna boto "eliminar"
		$("#taula_PartidesCampSeleccionat tr").removeClass("registrePartidaSeleccionada");
		$("#btnCamps2").hide();
		$("#btnEditarPartidesCamp").hide();
		$("#btnNovaPartidaCamp").hide();
		$("#btnFetPartidesCamp").show();
		return false;
	});

	$("#btnFetPartidesCamp").bind("click", function(){
		//amagarColumnaTaula("taula_PartidesCampSeleccionat", 1)	// columna boto "codiPartida"
		amagarColumnaTaula("taula_PartidesCampSeleccionat", 6)	// columna boto "eliminar"
		$("#taula_PartidesCampSeleccionat tr").addClass("registrePartidaSeleccionada");
		$("#btnCamps2").show();
		$("#btnEditarPartidesCamp").show();
		$("#btnNovaPartidaCamp").show();
		$("#btnFetPartidesCamp").hide();
		return false;
	});


	$(document).on('click', '.btnEliminarPartida', function(){
		vgIdPartida = $(this).closest("tr").attr("id");
		eliminarPartida(vgIdPartida, function(){
			mostrarPartidesCampSeleccionat();
		});
		return false;
	});




/*
******************************************************************************************************
* pagina PAR DE CADA FORAT DEL CAMP SELECCIONAT
******************************************************************************************************
*/
	$("#btCamps").bind("click", function(){
		guardarParForatsCamp();
	});



	$(document).on('click', '.ParForatMesUn', function(){
	    
	    var valor = parseInt($(this).parent().parent().parent().children().eq(1).html());
	    if (valor >= 15){
	        valor = 15;
	    }else{
	        valor += 1;
	    }
	    $(this).parent().parent().parent().children().eq(1).html(valor);

	    
	    return false;

	});



	$(document).on('click', '.ParForatMenysUn', function(){
	    
	    var valor = parseInt($(this).parent().parent().parent().children().eq(1).html());
	    if (valor <= 0){
	        valor = 0;
	    }else{
	        valor -= 1;
	    }
	    $(this).parent().parent().parent().children().eq(1).html(valor);

	    
	    return false;

	});


/*
******************************************************************************************************
* pagina NOVA PARTIDA
******************************************************************************************************
*/

	$("#formulariNovaPartida").validate(
		{
			rules:{
				Data: {
					required: 	true,
					date: 		true
				}
			},
			messages:{
				Data:{
					required: 	"No es pot deixar en blanc",
					date: 		"Ha de ser una data valida" 
				}
			}
		}

	);



	$("#btnCrearNovaPartida").bind("click", function(){
		var validacioForumlariNovaPartida = $("#formulariNovaPartida").validate();
		if (validacioForumlariNovaPartida.form() == true){
			//console.debug("Ha validat formulari NOVA PARTIDA");
			insertRecordPartida(function(){
				insertRecordForats(function(){
					mostrarCops(vgIdPartida);
					$.mobile.changePage("#pagina_targeta");
				});
			});
		
		}

		return false;
	});
	




/*
******************************************************************************************************
* pagina TARGETA
******************************************************************************************************
*/
	$("#pagina_targeta").bind("pagebeforeshow", function(){
		mostrarCapsalera ("taula_capsaleraTargeta");
		mostrarCops(function(){
			//console.debug("rutina mostrarCops feta");
			$("#sumaPar").html(sumarColumna(".columnaPar"));
			$("#sumaCops").html(sumarColumna(".columnaCop"));
			$("#sumaDiferencia").html(sumarColumna(".columnaDif"));

			$("#btnPartides2").show();
			$("#btnGuardar").show();
			$("#btnEditar").hide();
		});

	});



	/*
	$("#btnPartides2").bind("click", function(){
		mostrarPartides();
		$.mobile.changePage("#pagina_partides");
		return false;
	});	
	*/

	$("#btnTargetaSortir").bind("click", function(){
		//alert("btnTargetaSortir");
		modificarRecordCops(function(){
			$.mobile.changePage("#pagina_partitscamp");
		});
		return false;
	});	

	
	$(document).on('click', '.foratSeleccionat', function(){
	    // vgIdCamp ja establert;
		var nForat = $(this).attr("id");
		modificarRecordCops(function(){
		    //console.debug("$(this).attr('id'): " + $(this).attr("id"));
		    mostrarHistoricCopsForat(nForat, function(){
		    	$.mobile.changePage("#pagina_HistoricCopsForat");
		    });
		});
	    return false;
	});


 
	$(document).on('click', '.ParMesUn', function(){
		//alert("asda");
		var valor = parseInt($(this).parent().parent().parent().children().eq(1).html());
		valor += 1;
		$(this).parent().parent().parent().children().eq(1).html(valor);

		//Diferencia Cops - Par
		var vPar = parseInt($(this).parent().parent().parent().children().eq(1).html());
		var vCops = parseInt($(this).parent().parent().parent().children().eq(3).html());
		
		// si Cops = 0, el reslutat de Diferencia sempre = 0
		var vCops = parseInt($(this).parent().parent().parent().children().eq(3).html());
		if (vCops == 0 ){
			vDiferencia = 0;
		} else {
			vDiferencia = vCops - vPar;
		}
		$(this).parent().parent().parent().children().eq(5).html(vDiferencia);

	    // totals
	    $("#sumaPar").html(sumarColumna(".columnaPar"));
	    if (vCops != 0 ){
	    	$("#sumaDiferencia").html(sumarColumna(".columnaDif"));
	    }
		return false;

	});


	$(document).on('click', '.ParMenysUn', function(){
		//alert("asda");
		var valor = parseInt($(this).parent().parent().parent().children().eq(1).html());
		if (valor <= 0){
			valor = 0;
		}else{
			valor -= 1;
		}
		$(this).parent().parent().parent().children().eq(1).html(valor);

		//Diferencia Cops - Par
		var vPar = parseInt($(this).parent().parent().parent().children().eq(1).html());
		var vCops = parseInt($(this).parent().parent().parent().children().eq(3).html());
		
		// si Cops = 0, el reslutat de Diferencia sempre = 0
		var vCops = parseInt($(this).parent().parent().parent().children().eq(3).html());
		if (vCops == 0 ){
			vDiferencia = 0;
		} else {
			vDiferencia = vCops - vPar;
		}
		$(this).parent().parent().parent().children().eq(5).html(vDiferencia);

	    
		// TOTALS
	    $("#sumaPar").html(sumarColumna(".columnaPar"));
	    if (vCops != 0 ){
	    	$("#sumaDiferencia").html(sumarColumna(".columnaDif"));
	    }
		return false;

		return false;

	});


	$(document).on('click', '.CopsMesUn', function(){
		//alert("asda");
		//var vIdPartida = $("#targetaIdPartida").html();
		//var vForat =  $(this).parent().parent().parent().children().eq(0).html();

		var valor = parseInt($(this).parent().parent().parent().children().eq(3).html());
		valor += 1;
		$(this).parent().parent().parent().children().eq(3).html(valor);

		//Diferencia Cops - Par
		var vPar = parseInt($(this).parent().parent().parent().children().eq(1).html());
		var vCops = parseInt($(this).parent().parent().parent().children().eq(3).html());
		
		// si Cops = 0, el reslutat de Diferencia sempre = 0
		if (valor == 0 ){
			vDiferencia = 0;
		} else {
			vDiferencia = vCops - vPar;
		}
		$(this).parent().parent().parent().children().eq(5).html(vDiferencia);

	    $("#sumaCops").html(sumarColumna(".columnaCop"));
	    $("#sumaDiferencia").html(sumarColumna(".columnaDif"));
	    $("#sumaPar").html(sumarColumna(".columnaPar"));

		return false;

	});


	$(document).on('click', '.CopsMenysUn', function(){
		
		var valor = parseInt($(this).parent().parent().parent().children().eq(3).html());
		if (valor <= 0){
			valor = 0;
		}else{
			valor -= 1;
		}
		$(this).parent().parent().parent().children().eq(3).html(valor);

		//Diferencia Cops - Par
		var vPar = parseInt($(this).parent().parent().parent().children().eq(1).html());
		var vCops = parseInt($(this).parent().parent().parent().children().eq(3).html());
		
		// si Cops = 0, el reslutat de Diferencia sempre = 0
		if (valor == 0 ){
			vDiferencia = 0;
		} else {
			vDiferencia = vCops - vPar;
		}
		$(this).parent().parent().parent().children().eq(5).html(vDiferencia);

	    $("#sumaCops").html(sumarColumna(".columnaCop"));
	    $("#sumaDiferencia").html(sumarColumna(".columnaDif"));
	    $("#sumaPar").html(sumarColumna(".columnaPar"));

		return false;

	});


























	// ------ pagina PARTIDES ---------	


	$(document).on('click', '.btnVeureCopsPartida', function(){
		var vIdPartida = $(this).closest("tr").attr("id");
		mostarDadesPartida(vIdPartida, function(){
			vgEdicio = false;
			mostrarCops(vIdPartida, function(){
				//console.debug("callback_mostrarCops");
				//console.debug("comencen els sumatoris");
				
				$("#sumaPar").html(sumarColumna(".columnaPar",1));
			    $("#sumaCops").html(sumarColumna(".columnaCop",3));
			    $("#sumaDiferencia").html(sumarColumna(".columnaDif",5));

				$("#btnEditar").show();
				$("#btnGuardar").hide();

				$.mobile.changePage("#pagina_targeta");	

			});

		});
		return false;
	});


	/*
	$(document).on('click', '.btnEliminarPartida', function(){
		eliminarCops($(this).closest("tr").attr("id"));
		eliminarPartida($(this).closest("tr").attr("id"));
		mostrarPartides();
		return false;
	});
	*/









});
//});