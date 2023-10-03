var nbRow = 100;
var nbCol = 100;
var nIntervId;
var nbGeneration=0;

$(document).ready(function () {

    setTable();
    defineCase();

    $('#start').click(function(){
        if (!nIntervId) {
            nIntervId = setInterval(play, 200);
        }
    });

    $('#pause').click(function(){
        clearInterval(nIntervId);
        nIntervId = null;
    });

    $('#restart').click(function(){
        nbGeneration=0;
        $('#generation').attr("value", nbGeneration);
        clearInterval(nIntervId);
        nIntervId = null;
        setTable();
        defineCase();
    })
});

function setTable(){
    var modal = '<table id="dataTable" class="border-1"><tbody>'
    for (var i = 0; i < nbRow; i++) {
        modal+='<tr>'
        for (var j = 0; j < nbCol; j++) {
            var color = Math.floor(Math.random() * 2);
            if (color == 0) {
                modal+='<td class="w-1 h-1 border-1" id="'+i+'-'+j+'" style="background-color: white;" value="0"></td>'
            }else {
                modal+='<td class="w-1 h-1 border-1" id="'+i+'-'+j+'" style="background-color: black;" value="1"></td>'
            }
        }
        modal+='</tr>'
    }
    modal+='</tbody></table>'
    $('#table').html(modal);
}

function defineCase(){
    $("td").click(function() {
        var val = $(this).attr('value');

        if (val == "0") {
            $(this).css("background-color","black");
            $(this).attr("value", "1");
        }else {
            $(this).css("background-color","white");
            $(this).attr("value", "0");
        }
    });
}

function getVoisins(row, col) {
    // fonction pour obtenir les voisins de la cellule
    return [
        row - 1 < 0 || col - 1 < 0 ? false : [row - 1]+'-'+[col - 1],
        row - 1 < 0 ? false : [row - 1]+'-'+[col],
        row - 1 < 0 || col + 1 >= nbCol ? false : [row - 1]+'-'+[col + 1],
        col - 1 < 0 ? false : [row]+'-'+[col - 1],
        col + 1 >= nbCol ? false : [row]+'-'+[col + 1],
        row + 1 >= nbRow || col - 1 < 0 ? false : [row + 1]+'-'+[col - 1],
        row + 1 >= nbRow ? false : [row + 1]+'-'+[col],
        row + 1 >= nbRow || col + 1 >= nbCol? false : [row + 1]+'-'+[col + 1],
    ]
}

function checkCelluleStayAlive(tableGetVoisins, caseValue){
    var tableCellulesVivantes = [];
    var NbcellsNoiresVoisinnes=0;

    $.each(tableGetVoisins, function(index, id){
        var value = $('#'+id).attr("value");
        if (value == 1) {
            NbcellsNoiresVoisinnes++;
        }
    });
    if (NbcellsNoiresVoisinnes == 2 || NbcellsNoiresVoisinnes == 3) {
        // la case reste vivante
        tableCellulesVivantes.push(caseValue);
    }
    return tableCellulesVivantes;
}

function CheckNaissance(tableGetVoisins){
    var tableCellulesNaissantes = [];
    $.each(tableGetVoisins, function(index, value){
        // obtenir les voisines des cellules voisines
        var coord = value.split('-');
        var row = parseInt(coord[0]);
        var col = parseInt(coord[1]);
        var tableGetVoisinsVoisins = getVoisins(row, col);

        var NbcellsNoiresVoisinnes=0;
        $.each(tableGetVoisinsVoisins, function(index, id){
            var val = $('#'+id).attr("value");
            if (val == 1) {
                NbcellsNoiresVoisinnes++;
            }
        });

        if (NbcellsNoiresVoisinnes == 3) {
            // la case prend vie
            tableCellulesNaissantes.push(value);
        }
    });

    // enlève les cases déjà noires
    $.each(tableCellulesNaissantes, function(index, id){
        var val = $('#'+id).attr("value");
        if (val == 1) {
            var z = tableCellulesNaissantes.indexOf(false);
            if (z !== -1) {
                tableGetVoisins.splice(z, 1);
            }
        }
    });

    return tableCellulesNaissantes
}

function updateFront(TableCellules){
    var html = $("#dataTable").get(0);
    // tout setup a blanc puis set les bonnes cellules a noir
    for (var i = 0; i < html.rows.length; i++) {
        for (var j = 0; j < html.rows[i].cells.length; j++) {
            $(html.rows[i].cells[j]).css("background-color","white");
            $(html.rows[i].cells[j]).attr("value", "0");
        }
    }
    for (var z = 0; z < TableCellules.length; z++) {
        $('#'+TableCellules[z]).css("background-color","black");
        $('#'+TableCellules[z]).attr("value", "1");
    }
}

function play(){
    var tableCells = [];
    var tableCellulesVivantes = [];
    var tableCellulesNaissantes = [];
    var tableCheckCelluleStayAlive = [];
    var tableCheckNaissance = [];
    var tableConcateneAliveEtNaissance = [];

    var html = $("#dataTable").get(0);
    for (var i = 0; i < html.rows.length; i++) {
        for (var j = 0; j < html.rows[i].cells.length; j++) {
            if ($(html.rows[i].cells[j]).attr("value") == 1) {
                tableCells.push($(html.rows[i].cells[j]).attr("id"));
            }
        }
    }

    $.each(tableCells, function(index, value){
        var coord = value.split('-');
        var row = parseInt(coord[0]);
        var col = parseInt(coord[1]);
        var tableGetVoisins = getVoisins(row, col);

        $.each(tableGetVoisins, function(){
            //enlèvement des cellules non voisines
            var z = tableGetVoisins.indexOf(false);
            if (z !== -1) {
                tableGetVoisins.splice(z, 1);
            }
        });
        tableCheckCelluleStayAlive = checkCelluleStayAlive(tableGetVoisins, value);
        tableCheckNaissance = CheckNaissance(tableGetVoisins);
        tableConcateneAliveEtNaissance = tableConcateneAliveEtNaissance.concat(tableCheckCelluleStayAlive, tableCheckNaissance);
    });

    // enlèvement des doublons
    var tableConcateneAliveEtNaissance = tableConcateneAliveEtNaissance.filter(function(a, b) {
        return tableConcateneAliveEtNaissance.indexOf(a) == b;
    });

    updateFront(tableConcateneAliveEtNaissance);
    nbGeneration++;
    $('#generation').attr("value", nbGeneration);
}
