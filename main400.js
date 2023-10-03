var nbRow = 100;
var nbCol = 100;
var nIntervId = null;
var nbGeneration = 0;
var laTable = null;
var nbGeneration = 0;
var etatJeu = new Object();

document.addEventListener("DOMContentLoaded", function(e) {
    var table = document.getElementById('dataTable');
    var start = document.getElementById('start');
    var pause = document.getElementById('pause');
    var restart = document.getElementById('restart');

    setTable();
    start.addEventListener('click', () =>{
        /*if (!nIntervId) {
            nIntervId = setInterval(play, 200);
        }*/
        play();
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

    etatJeu.vueTableau = new Array(nbRow);
    for (var i = 0; i < nbRow; i++) {
        etatJeu.vueTableau[i] = new Array(nbCol);
        tableau+='<tr>';
        for (var j = 0; j < nbCol; j++) {
            var color = Math.floor(Math.random() * 2);
            tableau+='<td class="' + (color != 0 ? 'estvivante':'') + '" id="'+i+'-'+j+'" data-row="'+i+'" data-col="'+j+'"></td>';
        }
    }
    tableau+='</tr>';

    tbody.innerHTML=tableau;
    var cellules = table.getElementsByTagName('td')
    for (var i = 0; i < cellules.length; i++) {
        etatJeu.vueTableau[cellules[i].dataset.row][cellules[i].dataset.col] = cellules[i];
    }
    var ts2 = performance.now();
    console.log('setTable : '+(ts2-ts1));
}

function play() {
    var ts3 = performance.now();
    var tableCheckCellules = [];
    var tableConcateneAliveEtNaissance = [];
    var tableGetVoisins = [];

    var casesVivantes = table.getElementsByClassName('estvivante');
    for (i = 0; i<casesVivantes.length; i++) {
        var cellule = casesVivantes[i];
        tableGetVoisins = getVoisins(parseInt(cellule.getAttribute('data-row')), parseInt(cellule.getAttribute('data-col')));
        tableCheckCellules = checkCellules(tableGetVoisins, cellule);
        tableConcateneAliveEtNaissance = tableConcateneAliveEtNaissance.concat(tableCheckCellules);
    }

    var ts4 = performance.now();
    console.log('play : '+(ts4-ts3));
    updateFront(tableConcateneAliveEtNaissance);
    nbGeneration++;
    document.getElementById('generation').setAttribute("value", nbGeneration);

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
            valeurDeRetour.push(etatJeu.vueTableau[lignePrecedente][colonnePrecedente]);
        }
        if (colonneSuivante < nbCol) {
            valeurDeRetour.push(etatJeu.vueTableau[lignePrecedente][colonneSuivante]);
        }
        valeurDeRetour.push(etatJeu.vueTableau[lignePrecedente][col]);
    }
    // Traitement de la ligne en cours
    if (colonnePrecedente >= 0) {
        valeurDeRetour.push(etatJeu.vueTableau[row][colonnePrecedente]);
    }
    if (colonneSuivante < nbCol) {
        valeurDeRetour.push(etatJeu.vueTableau[row][colonneSuivante]);
    }
    // Traitement de la ligne suivante
    if (ligneSuivante < nbRow) {
        if (colonnePrecedente >= 0) {
            valeurDeRetour.push(etatJeu.vueTableau[ligneSuivante][colonnePrecedente]);
        }
        if (colonneSuivante < nbCol) {
            valeurDeRetour.push(etatJeu.vueTableau[ligneSuivante][colonneSuivante]);
        }
        valeurDeRetour.push(etatJeu.vueTableau[ligneSuivante][col]);
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

        for (var k = 0; k < tableGetVoisinsVoisins.length; k++) {
            if (tableGetVoisinsVoisins[k].classList.contains("estvivante")) {
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
    var ts1 = performance.now();
    var elems = table.querySelectorAll(".estvivante");
    for (var i = 0; i < elems.length; i++) {
        elems[i].classList.remove("estvivante");
    }
    for (var i = 0; i < tableConcateneAliveEtNaissance.length; i++) {
        tableConcateneAliveEtNaissance[i].classList.add('estvivante');
    }
    var ts2 = performance.now();
    console.log('updateFront : '+(ts2-ts1));
}
