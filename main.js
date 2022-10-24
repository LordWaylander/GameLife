let nbRow = 100;
    nbCol = 100;
    nbGeneration = 0;
    nIntervId = null;
    tableJeu = new Object();

document.addEventListener('DOMContentLoaded', function(e) {
    let start = document.getElementById('start');
    let pause = document.getElementById('pause');
    let restart = document.getElementById('restart');
    let table = document.getElementById('dataTable');

    start.addEventListener('click', () => {
        if (!nIntervId) {
            nIntervId = setInterval(play, 250);
        }
        
        //play();
    });

    pause.addEventListener('click', () => {
        clearInterval(nIntervId);
        nIntervId = null;
    });

    restart.addEventListener('click', () => {
        document.getElementById('generation').setAttribute("value", 0);
        clearInterval(nIntervId);
        nIntervId = null;
        setTable();
    });

    table.addEventListener('click', (e) => {
        e.target.classList.toggle('estvivante');
    });

    setTable();
});

function setTable() {
    let tableau = '';
    let tbody = document.querySelector('tbody');

    tableJeu.etat = new Array(nbRow);
    tableJeu.nbVoisins = new Array(nbRow);

    for (let i = 0; i < nbRow; i++) {
        tableau += '<tr>'
        tableJeu.etat[i] = new Array(nbCol);
        tableJeu.nbVoisins[i] = new Array(nbCol);
        tableJeu.nbVoisins[i].fill(0);
        for (let j = 0; j < nbCol; j++) {
            let couleur = Math.floor(Math.random() * 2);
            tableau+='<td class="' + (couleur != 0 ? 'estvivante':'') + '"data-row="'+i+'"'+ 'data-col="'+j+'"></td>'
        }
        tableau += '</tr>'
    }
    tbody.innerHTML = tableau;

    let cellules = document.getElementsByTagName('td');
    for (let i = 0; i < cellules.length; i++) {
        tableJeu.etat[cellules[i].dataset.row][cellules[i].dataset.col] = cellules[i];
    }
}

function play() {
    let cellulesVivantes = table.getElementsByClassName('estvivante');
    for (let i = 0; i < cellulesVivantes.length; i++) {

        let voisinsCellulesVivantes = getVoisins(parseInt(cellulesVivantes[i].dataset.row), parseInt(cellulesVivantes[i].dataset.col));

        for (let j = 0; j < voisinsCellulesVivantes.length; j++) {
            tableJeu.nbVoisins[voisinsCellulesVivantes[j].dataset.row][voisinsCellulesVivantes[j].dataset.col]++
        }
    }
    let cellulesAlive = checkCellules();
    // reset le tableau à 0
    for (i = 0; i < tableJeu.nbVoisins.length; i++) {
        tableJeu.nbVoisins[i].fill(0);
    }
    updateFront(cellulesAlive);
}

function getVoisins(row, col){
    let voisins = [];

    // Traitement de la ligne précédente
    if (row - 1 >= 0) {
        if (col - 1 >= 0) {
            voisins.push(tableJeu.etat[row - 1][col - 1]);
        }
        if (col + 1 < nbCol) {
            voisins.push(tableJeu.etat[row - 1][col + 1]);
        }
        voisins.push(tableJeu.etat[row - 1][col]);
    }
    // Traitement de la ligne en cours
    if (col - 1 >= 0) {
        voisins.push(tableJeu.etat[row][col - 1]);
    }
    if (col + 1 < nbCol) {
        voisins.push(tableJeu.etat[row][col + 1]);
    }
    // Traitement de la ligne suivante
    if (row + 1 < nbRow) {
        if (col - 1 >= 0) {
            voisins.push(tableJeu.etat[row + 1][col - 1]);
        }
        if (col + 1 < nbCol) {;
            voisins.push(tableJeu.etat[row + 1][col + 1]);
        }
        voisins.push(tableJeu.etat[row + 1][col]);
    }
    return voisins;
}

function checkCellules(){
    let cellulesAlive = [];

    for (let i = 0; i < tableJeu.etat.length; i++) {
        for (let j = 0; j < tableJeu.etat[i].length; j++) {
            //verif si case noire
            let celluleNoire = tableJeu.etat[i][j].classList.contains('estvivante');

            if ((!celluleNoire && tableJeu.nbVoisins[i][j]==3) || (celluleNoire && (tableJeu.nbVoisins[i][j]==2 || tableJeu.nbVoisins[i][j]==3))) {
                cellulesAlive.push(tableJeu.etat[i][j]);
            }
        }
    }
    return cellulesAlive;
}

function updateFront(cellulesAlive){
    let cellules = table.querySelectorAll('.estvivante');
    for (let i = 0; i < cellules.length; i++) {
        cellules[i].classList.remove('estvivante');
    }
    for (let i = 0; i < cellulesAlive.length; i++) {
        cellulesAlive[i].classList.add('estvivante');
    }
    nbGeneration++;
    document.getElementById('generation').setAttribute("value", nbGeneration);
}
