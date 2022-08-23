var db;
var dataset;

var vgOpcio;    // variable global 'opcio'
var vgNouCodi = 0;     // variable global valor camp 'codi' mes alt + 1
var vgNumForats = 0;     /* utilitzat en la creacio d'una nova partida. Recull el valor del numero
                            de forats obtingut de la taula CAMPS segons un camp concret*/
var vgSumaTotalPar = 0;  // suma total del camp "par" de la taula CampsParForats d'un camp donat
var vgIdCamp = 0; 
var vgIdPartida = 0;
var vgMatriuParForat = new Array();  /* utilitzat per quan s'insereix el par de cada forat (dada obtinguda de 
                                        la taula CAMPSPARFORAT) en la creacio d'una nova partida */

var vgSumaPar = 0;
var vgSumaCops = 0;

/*
const cPartides = 1;
const cCops = 2;
const cCamps = 3;
var vgEdicio = false;  // si el formulari ha de llistar els forats o ha de permetre editar els cops tb
*/


function initDatabase() {
   //console.debug('called initDatabase()');

    try {
        if (!window.openDatabase) {
            alert('not supported');
        } else {
            var shortName = 'GolfDB';
            var version = '1.0';
            var displayName = 'Golf DB App';
            var maxSizeInBytes = 5000000;
            db = openDatabase(shortName, version, displayName, maxSizeInBytes);

            createTableIfNotExists();
        }
    } catch(e) {
        if (e == 2) {
            alert('Invalid database version');
        } else {
            alert('Unknown error ' + e);
        }
        return;
    }
}

function createTableIfNotExists() {
   //console.debug('called createTableIfNotExists()');

    var sqlTaulaCamps = "CREATE TABLE IF NOT EXISTS Camps (codi INTEGER PRIMARY KEY, nom TEXT, forats INTEGER)";
    var sqlTaulaCampsParForats = "CREATE TABLE IF NOT EXISTS CampsParForats (idCamp INTEGER, forat INTEGER, par INTEGER)";
    var sqlTaulaPartides = "CREATE TABLE IF NOT EXISTS Partides (codi INTEGER PRIMARY KEY, data DATATIME, idCamp INTEGER, partida INTEGER)";
    var sqlTaulaCops = "CREATE TABLE IF NOT EXISTS Cops (idPartida INTEGER, forat INTEGER, par INTEGER, cops INTEGER)";

    db.transaction(
        function (transaction) {
            //transaction.executeSql(sql, [], showRecords, handleErrors);
            transaction.executeSql(sqlTaulaPartides, [], null, handleErrors);
           //console.debug('taula PARTIDES oberta o creada');
            transaction.executeSql(sqlTaulaCops, [], null, handleErrors);
           //console.debug('taula COPS oberta o creada');
            transaction.executeSql(sqlTaulaCamps, [], null, handleErrors);
           //console.debug('taula CAMPS oberta o creada');
            transaction.executeSql(sqlTaulaCampsParForats, [], null, handleErrors);
           //console.debug('taula CAMPSPARFORATS oberta o creada');

            //mostrarPartides();
        }
    );
}


/*
******************************************************************************************************
* pagina CAMPS
******************************************************************************************************
*/

function mostrarCamps(callback_mostrarCamps){
    

    //vgOpcio = cCamps;  // utilitzada per vgOpcio SWITCH a la funcio renderRecords()
    var strSQL = "select * from Camps";
    /*
    showRecords(strSQL, function(){
       //console.debug("Final - showRecords()")
    });
    */
    db.transaction(function (transaction) {transaction.executeSql(
                strSQL, 
                [], 
                function(transaction, results){
                    dataset = results.rows;
                    //numRegistres = dataset.length
                   //console.debug("nº registres taula camps: " + dataset.length);

                    $("#taula_camps > tbody").html("");
                    //console.debug("tbody buit:" +  $("#taula_camps > tbody").html());
                    var totalRegistres = dataset.length;
                    vtbody = "";
                    //console.debug("dataset.length: " +  dataset.length);
                    
                    for (var i = 0; i < dataset.length; i++) {  
                        item = dataset.item(i);
                        numRegistre = i + 1;
                        sumaParForatsCamp(totalRegistres,
                                            numRegistre,
                                            item["codi"],
                                            item["nom"],
                                            item["forats"],
                                            function(){
                                                callback_mostrarCamps();
                                            });
                    }
                    
                }, 
                handleErrors);
        }
    );

}

function sumaParForatsCamp(vTotalRegistres, vNumRegistre, vId, vNom, vForats, callback_sumaParForatsCamp){
   //console.debug("called sumaParForatsCamp");
    vgSumaTotalPar = 0;
    
    //console.debug("select sum(Par) as TotalPar from CampsParForats where idCamp = " + vId);
    sql = "select sum(Par) as TotalPar from CampsParForats where idCamp = ?";
    
   //console.debug("vId: " + vId);
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, 
                                    [vId], 
                                    function(transaction, results){
                                        //console.debug("EXIT de la consulta!!");

                                        dataset2 = results.rows;
                                        item2 = dataset2.item(0);
                                        vgSumaTotalPar = item2["TotalPar"]
                                        //callback_sumaParForatsCamp();
                                    
                                        vtbody = "<tr id ='" + vId + "' class='registreCampSeleccionat'>";
                                        //vtbody += " <td>" + vId + "</td>";
                                        vtbody += " <td>" + vNom + "</td>";
                                        vtbody += " <td>" + vForats + "</td>";
                                        vtbody += " <td>" + String((vgSumaTotalPar == null) ? 0 : vgSumaTotalPar) + "</td>"; 
                                        vtbody += " <td><a href='#' class='btnPar'>Par</a></td>";
                                        vtbody += " <td><a href='#' class='btnEliminarCamp'>Eliminar</a></td>";
                                        vtbody += "</tr>";

                                        //console.debug(vtbody);
                                        $("#taula_camps > tbody").append(vtbody).trigger("create");  //trigger(create): per forçar els estils de JQM als botons (creats dinamicament)

                                        if (vTotalRegistres == vNumRegistre)
                                            callback_sumaParForatsCamp();
                                    }, 
                                    handleErrors);
        });
    //callback_sumaParForatsCamp();

}



amagarColumnaTaula = function (idTaula, column)
{ 
    $('#'+idTaula + ' td:nth-child(' + column + '), #'+idTaula + ' th:nth-child( ' + column + ')').hide().trigger("create");
}

mostrarColumnaTaula = function (idTaula, column)
{ 
    $('#'+idTaula + ' td:nth-child(' + column + '), #'+idTaula + ' th:nth-child( ' + column + ')').show().trigger("create");
}






/*
******************************************************************************************************
* pagina NOU CAMP
******************************************************************************************************
*/


function insertRecordCamp(callback_InsertarCamp) {
   //console.debug('called insertRecordCamp()');


    var vNom = $('#formNomCamp').val();
    var vForats = $('#formForats').val();
    nouCodi("Camps", "codi", "", function(){ // el nou codi queda regsitrat a la variable global vgNouCodi
        vgIdCamp = vgNouCodi;
        
        var sql = 'INSERT INTO Camps (codi, nom, forats) VALUES (?, ?, ?)';
       //console.debug("Parametres sql insert| vgIdCamp: " + vgIdCamp + "    vNom: " + vNom + "    vForats: " + vForats);
        
        db.transaction(
            function (transaction) {
                transaction.executeSql(sql, 
                                        [vgIdCamp, vNom, vForats], 
                                        function(){
                                           //console.debug("> registre inserit !!");
                                            callback_InsertarCamp();                                           
                                        }, 
                                        handleErrors);
            }
        );
    });

}


function insertRecordsForatsCamp(){
   //console.debug('called insertRecordsForatsCamp()');
    var vForats = parseInt($('#formForats').val());

    var sql = 'INSERT INTO CampsParForats (idCamp, forat, par) VALUES (?, ?, ?)';
    //console.debug("Parametres sql insert| vgIdCamp: " + vgIdCamp + "    vNom: " + vNom + "    vForats: " + vForats);
    db.transaction(
        function (transaction) {
            for(var i=1; i <= vForats; i++){

                transaction.executeSql(sql, 
                                    [vgIdCamp, i, 0], 
                                    function(){
                                       //console.debug("> registre taula CampsParForats inserit !!");
                                        //callback_InsertarCamp();                                           
                                    }, 
                                    handleErrors);
        
            }
        }
    );

    
}



/*
******************************************************************************************************
* pagina pagina PAR DE CADA FORAT DEL CAMP SELECCIONAT
******************************************************************************************************
*/
function mostrarTaulaParForatsCamp(){
    // vgIdCamp ja esta establert
    var sql = "select forat, par from CampsParForats where idCamp = " + vgIdCamp;

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, 
                                    [], 
                                    function(transaction, results){
                                        dataset = results.rows;
                                        //numRegistres = dataset.length
                                       //console.debug("nº registres taula camps: " + dataset.length);

                                        $("#taula_ForatsParCamp > tbody").html("");
                                        //console.debug("tbody buit:" +  $("#taula_camps > tbody").html());
                                        var totalRegistres = dataset.length;
                                        vtbody = "";
                                        //console.debug("dataset.length: " +  dataset.length);
                                        
                                        for (var i = 0; i < dataset.length; i++) {  
                                            item = dataset.item(i);
                                            //numRegistre = i + 1;
                                            vtbody = "<tr id ='" + item["forat"] + "'>";
                                            vtbody += " <td>" + item["forat"] + "</td>";
                                            vtbody += " <td>" + item["par"] + "</td>";
                                            vtbody += " <td>" +
                                                            "<div>" +
                                                                "<a href='#' data-role='button' class='ParForatMesUn' >+</a>" + 
                                                            "</div>" +
                                                            "<div>" + 
                                                                "<a href='#' data-role='button' class='ParForatMenysUn' >-</a>" +
                                                            "</div>" +
                                                      " </td>";
                                            vtbody += "</tr>";

                                            //console.debug(vtbody);
                                            $("#taula_ForatsParCamp > tbody").append(vtbody).trigger("create");  //trigger(create): per forçar els estils de JQM als botons (creats dinamicament)
                                         }   

                                    }, 

                                    handleErrors);
        });


}


function guardarParForatsCamp(){
   //console.debug('called guardarParForatsCamp()');

    db.transaction(
        function (transaction) {
            $("#taula_ForatsParCamp tbody").find("tr").each(function(){
                vForat =   parseInt($(this).find("td").eq(0).html());
                vPar =   parseInt($(this).find("td").eq(1).html());

                var sql = "UPDATE CampsParForats SET par = ? " + 
                                "WHERE idCamp = " + vgIdCamp + " and forat = " + vForat;

                transaction.executeSql(sql, 
                                    [vPar], 
                                    function(){
                                       //console.debug("> registre taula CampsParForats inserit !!");
                                        //callback_InsertarCamp();                                           
                                    }, 
                                    handleErrors);
        
            });
        }
    );

}


/*
******************************************************************************************************
* pagina PARTIDES DEL CAMP SELECCIONAT
******************************************************************************************************
*/
function mostrarPartidesCampSeleccionat(callback_mostrarPartidesCampSeleccionat){

    var strSQL = "select * from Partides where idCamp = " + vgIdCamp + " order by data DESC, partida DESC";
    $("#taula_PartidesCampSeleccionat > tbody").html("");

    db.transaction(
        function (transaction) {
            //transaction.executeSql(sql, [], renderRecords, handleErrors);
            transaction.executeSql(strSQL, [], function(transaction, results){

                var dataset = results.rows;
                //console.debug("nº partides del camp seleccionat: " + dataset.length);
                if (dataset.length == 0) {callback_mostrarPartidesCampSeleccionat();}

                vtbody = "";
                for (var i = 0, item = null; i < dataset.length; i++) {  
                    var item = dataset.item(i);
                    
                    /* procedim a trobar les sumes dels pars i nº de forats de la taula COPS per a cada partida */
                    sumarForatsPars(item["codi"], item["data"], item["partida"], function(){
                        if (i == dataset.length){
                           //console.debug("proxima instruccio: ** callback_mostrarPartidesCampSeleccionat **")
                            if (callback_mostrarPartidesCampSeleccionat) {callback_mostrarPartidesCampSeleccionat();}
                        } 
                    });
                   
                }
                //console.debug("valor i: " + i + "\tvalor dataset.length: " + dataset.length);
            });
        }
    );
}


function sumarForatsPars(idPartida2, vData, vNumPartida, callback_sumarForatsPars){
   //console.debug("called sumarForatsPars\tidPartida2: " + idPartida2);

    var strSQL = "select cops, par from Cops where idPartida = " + idPartida2 ;
    db.transaction(
        function (transaction) {
            transaction.executeSql(strSQL, [], function(transaction, results){
                vgSumaPar = 0;
                vgSumaCops = 0;

                var dataset2 = results.rows;
                for (var i = 0, item2 = null; i < dataset2.length; i++) { 
                    var item2 = dataset2.item(i);
                    if(item2["cops"] != 0){
                        vgSumaPar  += item2["par"];
                        vgSumaCops += item2["cops"];
                    }
                }

                vtbody =  "<tr id ='" + idPartida2 + "' class='registrePartidaSeleccionada'>\n";
                // vtbody += "    <td>" + idPartida2 + "</td>\n";
                vtbody += "    <td>" + vData + "</td>\n";
                vtbody += "    <td>" + vNumPartida + "</td>\n";
                vtbody += "    <td>" + vgSumaPar + "</td>\n";
                vtbody += "    <td>" + vgSumaCops + "</td>\n";
                vtbody += "    <td>" + (vgSumaCops - vgSumaPar) + "</td>\n";
                vtbody += "    <td><a href='#' class='btnEliminarPartida'>Eliminar</a></td>\n";
                vtbody += "</tr>\n";
                
               //console.debug(vtbody);
                
                $("#taula_PartidesCampSeleccionat > tbody").append(vtbody).trigger("create");

                callback_sumarForatsPars();

            });
            //console.debug("La següent instruccio cridarà **callback_sumarForatsPars**");
            //callback_sumarForatsPars();

        }
    );

}


/*
******************************************************************************************************
* pagina NOVA PARTIDA
******************************************************************************************************
*/

function insertRecordPartida(callback_insertRecordPartida) {
   //console.debug('called insertRecordPartida()');

    var vData = $('#formData').val();
    //var vIdCamp = $('#formIdCamp').val();
    
    // Obtencio del codi de la partida
    nouCodi("partides", "codi", "", function(){ // el nou codi queda regsitrat a la variable global vgNouCodi
        vgIdPartida = vgNouCodi;
       //console.debug("vgIdPartida (insertRecordPartida): " + vgIdPartida);

        vgNouCodi = 0;
        // obtencio del numero de partida (per dia jugat en el mateix camp)
        nouCodi("partides","partida", "where idCamp=" + vgIdCamp + " and data = '" + vData + "'", function(){
            var vNumPartida = vgNouCodi;
            
            var sql = 'INSERT INTO Partides (codi, data, idCamp, partida) VALUES (?, ?, ?, ?)';
            db.transaction(
                function (transaction) {
                    //transaction.executeSql(sql, [vData, vgIdCamp], showRecordsAndResetForm, handleErrors);
                    transaction.executeSql(sql,
                                         [vgIdPartida, vData, vgIdCamp, vNumPartida],
                                         function(){
                                            callback_insertRecordPartida();                                           
                                         },
                                         handleErrors);
                    
                }
            );
        });
    });
}

function insertRecordForats(callback_InsertRecordForats) {
   //console.debug('called insertRecordForats()');
   //console.debug("        vgIdPartida (insertRecordPartida): " + vgIdPartida);

    /* variable vgNumForats = valor del camp FORATS de la taula CAMPS segons el vgIdCamp */
    numForatsCamp(function(){
        
        /* matriu vgMatriuParForat = recull els par de cada forat d'un camp */
        generarMatriuParForat(function(){    
            db.transaction(function (transaction) {
                    for(var i = 1; (i <= vgNumForats); i++){
                        //console.debug("vgIdPartida: " + vgIdPartida + " ------- i: " + i);

                        var sql = 'INSERT INTO Cops (idPartida, forat, par, cops) VALUES (?, ?, ?, ?)';
                        transaction.executeSql(sql,
                                             [vgIdPartida, i, vgMatriuParForat[i-1], 0],
                                             function(){
                                                //console.debug('registre Forat '+ i +' inserit');
                                                //console.debug("> callback_InsertRecordForats");
                                             },
                                             handleErrors);
                    }
                    vgEdicio = true;
                    
                    callback_InsertRecordForats(); 

                }
            );
        });
    });

}



/*
 * Estableix vgNumForats = valor del camp "forats" de la taula CAMPS per a un camp concret
 */
function numForatsCamp (callback_numForatsCamp){
   //console.debug('called numForatsCamp()');

    var sql = "Select forats from Camps where codi = " + vgIdCamp;
    //console.debug('sql:' + sql);

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql,
                                    [],
                                    function(transaction, results){
                                        dataset = results.rows;
                                        item = dataset.item(0);
                                        vgNumForats = item["forats"];

                                       //console.debug("> callback_numForatsCamp");
                                        callback_numForatsCamp();    
                                    }, 
                                    handleErrors);
            
        }
    );

}




function generarMatriuParForat(callback_generarMatriuParForat){
   //console.debug('called generarMatriuParForat()');
    
    var sql = "Select par from CampsParForats where IdCamp = " + vgIdCamp + " order by forat";
    vgMatriuParForat.length = 0;    // eliminacio del tots els elements de la matriu
    
    db.transaction(function (transaction) {
            transaction.executeSql(sql, [], function(transaction, results){
                dataset = results.rows;
                for (var i = 0, item = null; i < dataset.length; i++) {  
                    item = dataset.item(i);
                    vgMatriuParForat[i] = item["par"];
                   //console.debug("vgMatriuParForat[" + i + "] = " + vgMatriuParForat[i]);
                }
                callback_generarMatriuParForat();
            }); 
        }
    );
}








/*
******************************************************************************************************
* pagina TARGETA
******************************************************************************************************
*/
function mostrarCops(callback_mostrarCops){
   //console.log("called 'mostrarCops()'");
    
    var sql = "select *, (CASE WHEN cops=0 THEN 0 ELSE cops - par END) as diferencia from Cops where idPartida = " + vgIdPartida + " order by forat";
    
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], function(transaction, results){

                $("#taula_targeta > tbody").html("");

                dataset = results.rows;
               //console.debug("nº registres taula Cops: " + dataset.length);

                for (var i = 0, item = null; i < dataset.length; i++) {  
                    item = dataset.item(i);
                    
                    vtbody = "";
                    
                    vtbody += "<tr>";
                    vtbody += "<td id='" + item["forat"] + "' class='foratSeleccionat'>" + item["forat"] + "</td>" + 
                              "<td class='columnaPar'>" + item["par"] + "  </td>" + 
                              "<td>" +
                                    "<div>" +
                                        "<input type='button' class='ParMesUn' value='+'/>" + 
                                    "</div>" +
                                    "<div>" + 
                                        "<input type='button' class='ParMenysUn' value='-'/>" +
                                    "</div>" +
                              "</td>" +
                              "<td class='columnaCop'>" + item["cops"] + " </td>" +
                              "<td>" +
                                    "<div>" +
                                        "<input type='button' class='CopsMesUn' value='+'/>" + 
                                    "</div>" +
                                    "<div>" + 
                                        "<input type='button' class='CopsMenysUn' value='-'/>" +
                                    "</div>" +
                              "</td>" +
                              "<td class='columnaDif'>" + item["diferencia"] + "</td>";
                    vtbody += "</tr>";          
                   

                    $("#taula_targeta > tbody").append(vtbody);

                    callback_mostrarCops();
                }

                       
                /*
                if (vgOpcio = cCops && vgEdicio == false){
                    $("#taula_targeta td").css("height", "130");
                }
                */

            }, handleErrors);
            
        });
}



/*
******************************************************************************************************
* pagina HISTORIC COPS FORAT
******************************************************************************************************
*/
function mostrarHistoricCopsForat(vIdForat, callback_mostrarHistoricCopsForat){
    //console.log("called 'mostrarCops()'");
    $("#forat").html(vIdForat);
    
    //console.debug("vgIdCamp: " + vgIdCamp);
    var sql = "select codi, data from Partides where idCamp = " + vgIdCamp + " order by data DESC";
    
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], function(transaction, results){

                $("#taulaHistoricForat > tbody").html("");

                dataset = results.rows;

                for (var i = 0, item = null; i < dataset.length; i++) {  
                    item = dataset.item(i);
                    //console.debug("codi partida: " + item["codi"]);
                    historicCops(item["codi"], vIdForat,  item["data"]);
                }
                
                callback_mostrarHistoricCopsForat();
                       
            }, handleErrors);
            
        });
}


function historicCops(vCodiPartida, vIdForat2, vData){
    var sql = "select par, cops from COPS where idPartida = " + vCodiPartida + " and forat= " + vIdForat2;
    
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], function(transaction, results){
                dataset = results.rows;
                vtbody="";

                for (var i = 0, item = null; i < dataset.length; i++) {  
                    item = dataset.item(i);
                    
                    if(item["cops"] != 0){
                        vtbody = "<tr>";
                        vtbody += " <td>" + vData + "</td>";
                        vtbody += " <td>" + item["par"] + "</td>";
                        vtbody += " <td>" + item["cops"] + "</td>";
                        vtbody += " <td>" + (item["cops"] - item["par"]) + "</td>"; 
                        vtbody += "</tr>";
                    }
                    //console.debug(vtbody);
                    $("#taulaHistoricForat > tbody").append(vtbody).trigger("create");  //trigger(create): per forçar els estils de JQM als botons (creats dinamicament)
                    
                }
                
                       
            }, handleErrors);
            
        });

}



/****************************************************************************************************/







/////////////// FUNCIONS COMPARTIDES //////////////////////////////////////////////////////////////////////////////////////////

function nouCodi (vTaula, vCamp, vWhere, callback_nouCodi){
   //console.debug('called nouCodi()');

    var sql = "select max("+ vCamp +") as maxNum from " + vTaula + " " + vWhere;

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, 
                                    [], 
                                    function(transaction, results){
                                        dataset = results.rows;
                                        item = dataset.item(0);
                                        
                                       //console.debug('------------------')
                                       //console.debug('valor max codi: ' + item["maxNum"]);
                                        vgNouCodi = item["maxNum"] + 1;
                                       //console.debug('vgNouCodi: ' + vgNouCodi);
                                       //console.debug('------------------');
                                        
                                       //console.debug("> callback_nouCodi");
                                        callback_nouCodi();    
                                    }, 
                                    handleErrors);
        }

    );

}



function mostrarCapsalera (vIdTaula){

   //console.debug ("funcio MOSTARCAPSALERA. vIdTaula: " + vIdTaula);
    sumaParForatsCamp2(vgIdCamp, function(){

        if((vIdTaula == "taula_capsaleraPartidesCampSeleccionat") || (vIdTaula == "taula_capsaleraParForatsCampSeleccionat")){
            sql = "select nom, forats from camps where codi=" + vgIdCamp;
            //console.debug(sql);
            db.transaction(
                function (transaction) {
                        transaction.executeSql(sql, 
                                                [], 
                                                function(transaction, results){
                                                    dataset = results.rows;
                                                    item = dataset.item(0);

                                                    vTbody =  "<tr>";
                                                    vTbody += "     <th>Camp:</th>";
                                                    vTbody += "     <td>" + item["nom"] + "</td>";
                                                    vTbody +=  "</tr>";

                                                    vTbody +=  "<tr>";
                                                    vTbody += "     <th>Forats:</th>";
                                                    vTbody += "     <td>" + item["forats"] + "</td>";
                                                    vTbody +=  "</tr>";

                                                    vTbody +=  "<tr>";
                                                    vTbody += "     <th>Par:</th>";
                                                    vTbody += "     <td>" + vgSumaTotalPar + "</td>";
                                                    vTbody +=  "</tr>";

                                                    //console.debug (vTbody);
                                                    $("#" + vIdTaula + " tbody").html(vTbody);
                                                }, 
                                                handleErrors
                                                );
                    }

            );

        
        }else{
            // capsalera de taula_capsaleraTargeta
            //console.debug("construccio taula_capsaleraTargeta");
            //console.debug("        vgIdPartida (taula_capsaleraTargeta): " + vgIdPartida);

            sql = "SELECT nom, forats, data, partida "+ 
                  "FROM Partides, Camps " + 
                  "WHERE Camps.codi = Partides.IdCamp AND Partides.codi=" + vgIdPartida;

            //console.debug(sql);
            db.transaction(
                function (transaction) {
                        transaction.executeSql(sql, 
                                                [], 
                                                function(transaction, results){
                                                    dataset = results.rows;
                                                    item = dataset.item(0);

                                                    vTbody =  "<tr>";
                                                    vTbody += "     <th>Camp:</th>";
                                                    vTbody += "     <td>" + item["nom"] + "</td>";
                                                    vTbody +=  "</tr>";

                                                    vTbody +=  "<tr>";
                                                    vTbody += "     <th>Forats:</th>";
                                                    vTbody += "     <td>" + item["forats"] + "</td>";
                                                    vTbody +=  "</tr>";

                                                    vTbody +=  "<tr>";
                                                    vTbody += "     <th>Par:</th>";
                                                    vTbody += "     <td>" + vgSumaTotalPar + "</td>";
                                                    vTbody +=  "</tr>";

                                                    vTbody +=  "<tr>";
                                                    vTbody += "     <th>Data:</th>";
                                                    vTbody += "     <td>" + item["data"] + "</td>";
                                                    vTbody +=  "</tr>";

                                                    vTbody +=  "<tr>";
                                                    vTbody += "     <th># partida:</th>";
                                                    vTbody += "     <td>" + item["partida"] + "</td>";
                                                    vTbody +=  "</tr>";

                                                    //console.debug (vTbody);
                                                    $("#" + vIdTaula + " tbody").html(vTbody);
                                                }, 
                                                handleErrors
                                                );
                    }

            );

        }

    });
}



function sumaParForatsCamp2(vIdCamp, callback_sumaParForatsCamp2){
   //console.debug("called sumaParForatsCamp");
    vgSumaTotalPar = 0;
    
    //console.debug("select sum(Par) as TotalPar from CampsParForats where idCamp = " + vIdCamp);
    sql = "select sum(Par) as TotalPar from CampsParForats where idCamp = " + vIdCamp;
    
   //console.debug("vIdCamp: " + vIdCamp);
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, 
                                    [], 
                                    function(transaction, results){
                                        //console.debug("EXIT de la consulta!!");

                                        dataset2 = results.rows;
                                        item2 = dataset2.item(0);
                                        vgSumaTotalPar = item2["TotalPar"]
                                        
                                        if(callback_sumaParForatsCamp2)
                                            callback_sumaParForatsCamp2();
                                    }, 
                                    handleErrors);
        });

}




















function modificarRecordCops(callback_modificarRecordCops){
   //console.debug('called insertRecordCops()');
    
    //var vIdPartida = parseInt($("#targetaIdPartida").html());
    var vForat = 0;
    var vPar = 0;
    var vCop = 0;   
    db.transaction(
        function (transaction) {
            $("#taula_targeta tbody").find("tr").each(function(){
                vForat = parseInt($(this).find("td").eq(0).html());
                vPar =   parseInt($(this).find("td").eq(1).html());
                vCop =   parseInt($(this).find("td").eq(3).html());
                
               //console.debug("vForat: " + vForat);
               //console.debug("vPar: " + vPar);
               //console.debug("vCop: " + vCop);
               //console.debug("------------------");

                var sql = "UPDATE Cops SET par = ?, " + 
                                            "cops = ? " + 
                                            "WHERE idPartida = " + vgIdPartida + " and forat = " + vForat;
                transaction.executeSql(sql,
                                     [vPar, vCop],
                                     function(){
                                        //console.debug('executeSql (insertar forat '+ i +'): ' + sql);
                                       //console.debug("> registre (forat: " + vForat +")taula COPS modificat");
                                     },
                                     handleErrors);
            });
            
            callback_modificarRecordCops(); 

        }
    );

}




function eliminarPartida(vId, callback_eliminarPartida){
    eliminarRegistres("cops", vId, function(){
       //console.debug("registres de taula COPS suposadament eliminats");
        eliminarRegistres("partida", vId, function(){
           //console.debug("registres de taula PARTIDES suposadament eliminats");
            if (callback_eliminarPartida) {callback_eliminarPartida();}
        });    
    });
}

function eliminarCamp(callback_eliminarCamps){

    var sql = "select codi from Partides where idCamp = ?";
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [vgIdCamp], function(transaction, results){
                dataset = results.rows;
                for (var i = 0, item = null; i < dataset.length; i++) { 
                    item = dataset.item(i);
                    eliminarPartida(item["codi"]);      // eliminacio registres taula PARTIDES i taula COPS
                }
                eliminarRegistres("camps", null);       // eliminacio registres taula CAMPS
                eliminarRegistres("CampsParForats", null);       // eliminacio registres taula CAMPSPARFORATS
                callback_eliminarCamps();
            }, handleErrors);
           //console.debug('executeSql: ' + sql);
        }
    );
    
}

function eliminarRegistres(vEliminarQue, vId2, callback_eliminarRegistres) {
   //console.debug('called deleteRecord()');

    switch (vEliminarQue){
        case "camps":
            var sql = 'DELETE FROM Camps WHERE codi=' + vgIdCamp;
            break;
        case "CampsParForats":
            var sql = 'DELETE FROM CampsParForats WHERE idCamp=' + vgIdCamp;
            break;
        case "partida":
            var sql = 'DELETE FROM Partides WHERE codi=' + vId2;
            //var sql = 'DELETE FROM Cops INNER JOIN Partides ON Cops.idPartida = Partides.codi WHERE Partides.Codi= ?';
            break;
        case "cops":
            var sql = 'DELETE FROM Cops WHERE idPartida=' + vId2;
            break;
    }
    
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [],  function(transaction, results){
                if (callback_eliminarRegistres) {callback_eliminarRegistres();}
            }, handleErrors);
           //console.debug('executeSql: ' + sql);
            //alert('Delete Sucessfully');
        }
    );

    //resetForm();
}

/*
function updateRecord() {
   //console.debug('called updateRecord()');

    var name = $('#name').val();
    var phone = $('#phone').val();
    var id = $("#id").val();

    var sql = 'UPDATE Contacts SET name=?, phone=? WHERE id=?';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [name, phone, id], showRecordsAndResetForm, handleErrors);
           //console.debug('executeSql: ' + sql);
        }
    );
}
*/


function dropTable(taula) {
   //console.debug('called dropTable()');

    var sql = 'DROP TABLE ' + taula;

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], function(){
               //console.debug("taula [" + taula + "] eliminada")
            }, handleErrors);
        }
    );

    //resetForm();

    initDatabase();
}

/*
function loadRecord(i) {
   //console.debug('called loadRecord()');

    var item = dataset.item(i);

    $('#name').val(item['name']);
    $('#phone').val(item['phone']);
    $('#id').val(item['id']);
}
*/


/*
function resetForm() {
   //console.debug('called resetForm()');

    $('#name').val('');
    $('#phone').val('');
    $('#id').val('');
}
*/


/*
function showRecordsAndResetForm() {
   //console.debug('called showRecordsAndResetForm()');

    resetForm();
    showRecords()
}
*/



function handleErrors(transaction, error) {
   //console.debug('called handleErrors()');
   //console.error('error ' + error.message);

    alert(error.message);
    return true;
}



/*
function omplirComboCamps(callback_omplirCamps){

    //Eliminacio de totes les OPTIONS
    $("#formIdCamp").find("option").remove().end();

    var sql = "select codi, nom from Camps";
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, 
                                    [], 
                                    function(transaction, results){
                                        dataset = results.rows;
                                        for (var i = 0, item = null; i < dataset.length; i++) { 
                                            item = dataset.item(i);
                                            $("#formIdCamp").append("<option value='" + item["codi"] + "'>" +  item["nom"] + "</option>");
                                        }
                                        callback_omplirCamps();
                                    }, 
                                    handleErrors);
        }

    ); 

}
*/



/*
function refreshPage(){
    $.mobile.changePage(
        window.location.href,
        {
            allowSamePageTransition : true,
            transition              : "none",
            showLoadMsg            : false,
            reloadPage              : true 
        }
    );
}
*/


/*
function sumarColumna(classTD) {
    var resultVal = 0; 
    $(classTD).each(function(){
        resultVal += parseInt($(this).html());
    });
   //console.debug("final sumatori de [" + classTD + "]: " + resultVal);

    return resultVal;
} 
*/

function sumarColumna(classTD) {
    var resultVal = 0; 
    $("#taula_targeta tbody tr").each(function(){
        //console.debug("Bucle");
        if (($(this).children(".columnaCop")).html() != 0) {
            //console.debug("suma");
            resultVal += parseInt(($(this).children(classTD)).html());
        }
    });

    return resultVal;
} 




function updateCacheContent(event) {
   //console.debug('called updateCacheContent()');
    window.applicationCache.swapCache();
}

$(document).ready(function () {
    window.applicationCache.addEventListener('updateready', updateCacheContent, false);

    initDatabase();
});
