var nbRow = 100;
var nbCol = 100;
var nIntervId = null;
var nbGeneration = 0;
var vueTableau = [];
var laTable = null;
var nbGeneration = 0;

document.addEventListener("DOMContentLoaded", function(e) {
    var table = document.getElementById('dataTable');
    var start = document.getElementById('start');
    var pause = document.getElementById('pause');
    var restart = document.getElementById('restart');

    setTable();
    start.addEventListener('click', () =>{
        if (!nIntervId) {
            nIntervId = setInterval(play, 10);
        }
        //play();
    });
    pause.addEventListener('click', () =>{
        clearInterval(nIntervId);
        nIntervId = null;
    });
    restart.addEventListener('click', () =>{
        nbGeneration = 0;
        document.getElementById('generation').setAttribute("value", nbGeneration);
        clearInterval(nIntervId);
        nIntervId = null;
        setTable();
    });

    table.addEventListener('click', (e)=>{
        e.target.classList.toggle('estvivante');
    });

});

function setTable(){
    var tbody = document.querySelector('tbody');
    var ts1 = performance.now();
    var tableau = '';

    vueTableau = new Array(nbRow);
    for (var i = 0; i < nbRow; i++) {
        vueTableau[i] = new Array(nbCol);
        tableau+='<tr>';
        for (var j = 0; j < nbCol; j++) {
            var color = Math.floor(Math.random() * 2);
            tableau+='<td class="' + (color != 0 ? 'estvivante':'') + '" id="'+i+'-'+j+'" data-row="'+i+'" data-col="'+j+'"></td>';
        }
    }
    tableau+='</tr>';

    tbody.innerHTML=tableau;
    var cellules = table.getElementsByTagName('td');
    for (var i = 0; i < cellules.length; i++) {
        vueTableau[cellules[i].dataset.row][cellules[i].dataset.col] = cellules[i];
    }
    var ts2 = performance.now();
    console.log('setTable : '+(ts2-ts1));
}

function play() {
    var ts3 = performance.now();
    var tableCheckCellules = [];
    var tableConcateneAliveEtNaissance = [];
    var tableGetVoisins = []
    var casesVivantes = table.getElementsByClassName('estvivante');

    for (i = 0; i<casesVivantes.length; i++) {
        var cellule = casesVivantes[i];
        var row = parseInt(cellule.getAttribute('data-row'));
        var col = parseInt(cellule.getAttribute('data-col'));
        tableGetVoisins = getVoisins(row, col);
        tableCheckCellules = checkCellules(tableGetVoisins, cellule);
        tableConcateneAliveEtNaissance = tableConcateneAliveEtNaissance.concat(tableCheckCellules);
    }

    updateFront(tableConcateneAliveEtNaissance);
    nbGeneration++;
    document.getElementById('generation').setAttribute("value", nbGeneration);
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

    for (var i = 0; i < tableGetVoisins.length; i++) {

        if (tableGetVoisins[i].classList.contains("estvivante")) {
            NbcellsNoiresVoisinnesCellule++;
        }
        // check naissances
        var row = parseInt(tableGetVoisins[i].getAttribute('data-row'));
        var col = parseInt(tableGetVoisins[i].getAttribute('data-col'));
        var tableGetVoisinsVoisins = getVoisins(row, col);
        var NbcellsNoiresVoisinnes=0;

        for (var j = 0; j < tableGetVoisinsVoisins.length; j++) {
            if (tableGetVoisinsVoisins[j].classList.contains("estvivante")) {
                NbcellsNoiresVoisinnes++;
            }
        }
        if (NbcellsNoiresVoisinnes === 3 ) {
            // la case prend vie
            tableCellulesVivantes.push(tableGetVoisins[i]);
        }
    }
    if (NbcellsNoiresVoisinnesCellule == 2 || NbcellsNoiresVoisinnesCellule == 3) {
        // la case reste vivante
        tableCellulesVivantes.push(cellule);
    }
    return tableCellulesVivantes;
}

function updateFront(tableConcateneAliveEtNaissance){
    var cellules = table.getElementsByTagName('td');
    //var cellule = table.getElementsByClassName('estvivante');

    for (var i = 0; i < cellules.length; i++) {
        cellules[i].classList.remove("estvivante");

    }
    for (var i = 0; i < tableConcateneAliveEtNaissance.length; i++) {
        tableConcateneAliveEtNaissance[i].classList.add('estvivante');
    }
}
