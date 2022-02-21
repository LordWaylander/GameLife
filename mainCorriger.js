var nbRow = 100,
    nbCol = 100,
    nIntervId,
    nbGeneration=0,
    vueTableau = [],
    vivantTable=[],
    laTable = null;


$(document).ready(function () {
    laTable = $('#dataTable');
    setTable();

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
    })

    $('#dataTable').on('click', 'td', function(e) {
        $(this).toggleClass('estvivante');
    });
});

function setTable(){
    var maLigne = null,
        maCellule = null,
        tableContainer = laTable.find('tbody').empty();

    vueTableau = new Array(nbRow);
    for (var i = 0; i < nbRow; i++) {
        maLigne = $('<tr></tr>');
        vueTableau[i] = new Array(nbCol);
        for (var j = 0; j < nbCol; j++) {
            var color = Math.floor(Math.random() * 2);
            maCellule = $('<td class="' + (color != 0 ? 'estvivante':'') + '" id="' + i + '-' + j + '" data-row="' + i + '" data-col="' + j + '"></td>');
            if (color!=0) {
                vivantTable.push(maCellule);
            }
            maLigne.append(maCellule);
            vueTableau[i][j] = maCellule;
        }
        tableContainer.append(maLigne);
    }
    console.log(vivantTable);
}

function getVoisins(row, col) {
    // fonction pour obtenir les voisins de la cellule
    var valeurDeRetour = [],
        lignePrecedente = row - 1,
        ligneSuivante = row + 1,
        colonnePrecedente = col - 1,
        colonneSuivante = col + 1;

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

function checkCelluleStayAlive(tableGetVoisins, caseValue){
    var tableCellulesVivantes = [];
    var NbcellsNoiresVoisinnes=0;

    $.each(tableGetVoisins, function(index, id){
        if (this.hasClass("estvivante")) {
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
    $.each(tableGetVoisins, function(){
        var tableGetVoisinsVoisins = getVoisins(this.data('row'), this.data('col'));

        var NbcellsNoiresVoisinnes=0;
        $.each(tableGetVoisinsVoisins, function(){
            if (this.hasClass("estvivante")) {
                NbcellsNoiresVoisinnes++;
            }
        });

        if (NbcellsNoiresVoisinnes == 3 && !this.hasClass('estvivante')) {
            // la case prend vie
            tableCellulesNaissantes.push(this);
        }
    });

    return tableCellulesNaissantes
}

function updateFront(TableCellules){
    var html = $("#dataTable").get(0);
    // tout setup a blanc puis set les bonnes cellules a noir
    laTable.find('.estvivante').removeClass('estvivante');
    $.each(TableCellules, function() {
        this.addClass('estvivante');
    });
}

function play(){
    var tableCells = [];
    var tableCheckCelluleStayAlive = [];
    var tableCheckNaissance = [];
    var tableConcateneAliveEtNaissance = [];

    tableCells = laTable.find('.estvivante');
    tableCells.each(function() {
        var maCellule = $(this);
        var tableGetVoisins = getVoisins(maCellule.data('row'), maCellule.data('col'));
        tableCheckCelluleStayAlive = checkCelluleStayAlive(tableGetVoisins, maCellule);
        tableCheckNaissance = CheckNaissance(tableGetVoisins);
        tableConcateneAliveEtNaissance = tableConcateneAliveEtNaissance.concat(tableCheckCelluleStayAlive, tableCheckNaissance);
    });

    var tableConcateneAliveEtNaissance = tableConcateneAliveEtNaissance.filter(function(a, b) {
        return tableConcateneAliveEtNaissance.indexOf(a) == b;
    });

    updateFront(tableConcateneAliveEtNaissance);
    nbGeneration++;
    $('#generation').attr("value", nbGeneration);
}
