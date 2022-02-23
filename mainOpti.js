var nbRow = 100;
var nbCol = 100;
var nIntervId = null;
var nbGeneration = 0;
var vueTableau = [];
var laTable = null;

var nbVoisins = [];

$(document).ready(function () {
    laTable = $('#dataTable');;

    setTable();

    $('#start').click(function(){
        /*if (!nIntervId) {
            nIntervId = setInterval(play, 200);
        }*/
        play();
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
    })

    $('#dataTable').on('click', 'td', function(e) {
        $(this).toggleClass('estvivante');
    });
});

function setTable(){
    var ts1 = performance.now();
    var tableau = '';
    var tableContainer = laTable.find('tbody').empty();

    vueTableau = new Array(nbRow);
    nbVoisins = new Array(nbRow);
    for (var i = 0; i < nbRow; i++) {
        vueTableau[i] = new Array(nbCol);
        nbVoisins[i] = new Array(nbCol);
        nbVoisins[i].fill(0);
        tableau+='<tr>';
        for (var j = 0; j < nbCol; j++) {
            var color = Math.floor(Math.random() * 2);
            tableau+='<td class="' + (color != 0 ? 'estvivante':'') + '" id="'+i+'-'+j+'" data-row="'+i+'" data-col="'+j+'"></td>';
        }
    }
    tableau+='</tr>';
    tableContainer.append(tableau);
    var cellules = tableContainer[0].getElementsByTagName('td');
    for (var i = 0; i < cellules.length; i++) {
        vueTableau[cellules[i].dataset.row][cellules[i].dataset.col] = $(cellules[i]);
    }
    var ts2 = performance.now();
    console.log('setTable : '+(ts2-ts1));
}

function play() {
    var ts3 = performance.now();
    var tableCheckCellules = [];
    var tableConcateneAliveEtNaissance = [];

    /*
    var tableConcateneAliveEtNaissance = tableConcateneAliveEtNaissance.filter(function(a, b) {
        return tableConcateneAliveEtNaissance.indexOf(a) == b;
    });
    */
    updateFront(tableConcateneAliveEtNaissance);
    nbGeneration++;
    $('#generation').attr("value", nbGeneration);
    var ts4 = performance.now();
    console.log('play : '+(ts4-ts3));


}

function getVoisins(row, col){
    var valeurDeRetour = [];
    var lignePrecedente = row - 1;
    var ligneSuivante = row + 1;
    var colonnePrecedente = col - 1;
    var colonneSuivante = col + 1;

    // Traitement de la ligne précédente
    if (lignePrecedente >= 0) {
        if (colonnePrecedente >= 0) {
            valeurDeRetour.push(vueTableau[lignePrecedente][colonnePrecedente]);
        }
        if (colonneSuivante < nbCol) {
            valeurDeRetour.push(vueTableau[lignePrecedente][colonneSuivante]);
        }
        valeurDeRetour.push(vueTableau[lignePrecedente][col]);
    }
    // Traitement de la ligne en cours
    if (colonnePrecedente >= 0) {
        valeurDeRetour.push(vueTableau[row][colonnePrecedente]);
    }
    if (colonneSuivante < nbCol) {
        valeurDeRetour.push(vueTableau[row][colonneSuivante]);
    }
    // Traitement de la ligne suivante
    if (ligneSuivante < nbRow) {
        if (colonnePrecedente >= 0) {
            valeurDeRetour.push(vueTableau[ligneSuivante][colonnePrecedente]);
        }
        if (colonneSuivante < nbCol) {
            valeurDeRetour.push(vueTableau[ligneSuivante][colonneSuivante]);
        }
        valeurDeRetour.push(vueTableau[ligneSuivante][col]);
    }
    return valeurDeRetour;
}

function checkCellules(tableGetVoisins, cellule){
    var tableCellulesVivantes = [];
    var NbcellsNoiresVoisinnesCellule=0;

    $.each(tableGetVoisins, function(){
        if (this.hasClass("estvivante")) {
            NbcellsNoiresVoisinnesCellule++;
        }

        var tableGetVoisinsVoisins = getVoisins(this.data('row'), this.data('col'));
        var NbcellsNoiresVoisinnes=0;
        $.each(tableGetVoisinsVoisins, function(){
            if (this.hasClass("estvivante")) {
                NbcellsNoiresVoisinnes++;
            }
        });

        if (NbcellsNoiresVoisinnes == 3 && !this.hasClass('estvivante')) {
            // la case prend vie
            tableCellulesVivantes.push(this);
        }
    });
    if (NbcellsNoiresVoisinnesCellule == 2 || NbcellsNoiresVoisinnesCellule == 3) {
        // la case reste vivante
        tableCellulesVivantes.push(cellule);
    }
    return tableCellulesVivantes;
}

function updateFront(tableConcateneAliveEtNaissance){
    laTable.find('.estvivante').removeClass('estvivante');
    $.each(tableConcateneAliveEtNaissance, function() {
        this.addClass('estvivante');
    });
}
