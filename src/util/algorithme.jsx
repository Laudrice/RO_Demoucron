import {copyMatrice, transposeMat} from './fonctionMatriciel'

async function algoDemoncronMin(matrice1){
    let demarche = [];
    let matrice = await copyMatrice(matrice1);
    let matriceInitialeTransposed = transposeMat(matrice1);
    // console.log(matrice);
    const tailleMatrice = matrice.length;
    let w = [];
    let entree = [];
    let sortie = [];
    let lastMatrice = [];
    let currentMatrice = [];
    let a_changee = [];
    for(var k=1; k<tailleMatrice-1; k++){
        entree = [];
        sortie = [];
        w=[];
        a_changee = [];
        lastMatrice = await copyMatrice(matrice);
        
        for(var i=0; i<tailleMatrice; i++){
            if(matrice[i][k] !== Infinity){
                entree.push(i)
            }
            if(i == k){
                for(var j=0; j<tailleMatrice; j++){
                    if(matrice[i][j] !== Infinity){
                        sortie.push(j);
                    }
                }
            }
        }
        entree.map((i)=>{
            w[i] = [];
            sortie.map((j)=>{
                w[i][j] = matrice[i][k] + matrice[k][j];
                matrice[i][j] = (w[i][j]<=matrice[i][j] ? w[i][j] : matrice[i][j]);
                a_changee.push([i,j]);
            });
        })
        currentMatrice = await copyMatrice(matrice);
        demarche.push({
            k : k,
            lastMatrice : lastMatrice,
            currentMatrice : currentMatrice,
            a_changee : a_changee,
            entree : entree,
            sortie : sortie,
            w : w
        })
    }
    let cheminMin = undefined;
    if(Number.isFinite(matrice[0][tailleMatrice-1])){
        let matriceMinTransposed= transposeMat(matrice);
        cheminMin = trouveCheminMin(matriceInitialeTransposed,matriceMinTransposed);
    }
    return {
        cheminMin : cheminMin,
        demarche : demarche
    }
}

async function algoDemoucronMax(matrice1){
    //pour enregistrer chaque demarche de demoucron
    let demarche = [];

    let matrice = await copyMatrice(matrice1);
    let matriceInitialeTransposed = transposeMat(matrice1);
    const tailleMatrice = matrice.length;
    let w = [];
    let entree = [];
    let sortie = [];
    let lastMatrice = [];
    let currentMatrice = [];
    let a_changee = [];
    
    for(var k=1; k<tailleMatrice-1; k++){
        entree = [];
        sortie = [];
        w=[];
        //pour enregistrer les cellules qui ont ete changee - utilisation css
        a_changee = [];
        lastMatrice = await copyMatrice(matrice);
        //detection des entrees et sortie
        for(var i=0; i<tailleMatrice; i++){
            if(matrice[i][k] !== Number.NEGATIVE_INFINITY){
                entree.push(i)
            }
            if(i == k){
                for(var j=0; j<tailleMatrice; j++){
                    if(matrice[i][j] !== Number.NEGATIVE_INFINITY){
                        sortie.push(j);
                    }
                }
            }
        }
        entree.map((i)=>{
            w[i] = [];
            sortie.map((j)=>{
                w[i][j] = matrice[i][k] + matrice[k][j];
                matrice[i][j] = (w[i][j]>=matrice[i][j] ? w[i][j] : matrice[i][j]);
                a_changee.push([i,j]);
            });
        });
        currentMatrice = await copyMatrice(matrice);
        demarche.push({
            k : k,
            lastMatrice : lastMatrice,
            currentMatrice : currentMatrice,
            a_changee : a_changee,
            entree : entree,
            sortie : sortie,
            w : w
        })
    }
    let cheminMax = undefined;
    if(Number.isFinite(matrice[0][tailleMatrice-1])){
        let matriceMaxTransposed= transposeMat(matrice);
        cheminMax = trouveCheminMax(matriceInitialeTransposed,matriceMaxTransposed);
    }
    return {
        demarche : demarche,
        cheminMax : cheminMax
    }
}


//cherche le chemin minimun de la matrice final


function trouveCheminMin(matriceInitialeTransposed, matriceMinTransposed){
    let tailleMatrice = matriceInitialeTransposed.length
    let index = matriceMinTransposed.length-1;
    let trouve = false;
    //trouveRow: pour verifier si on trouve le sommet precedente
    let trouveRow = false;
    let cheminMin = [];
    //compteur pour eviter la boucle infini
    let compteur = tailleMatrice;

    while(!trouve && compteur>=0){
        trouveRow = false;
        cheminMin.push(index);
        if(matriceInitialeTransposed[index][0] == matriceMinTransposed[index][0]){
            cheminMin.push(0);
            trouve = true;
        }
        for(var i =0; i< tailleMatrice && !trouveRow; i++){
            if(matriceInitialeTransposed[index][i] != Infinity){
                if(matriceMinTransposed[index][0] == (matriceInitialeTransposed[index][i]+matriceMinTransposed[i][0])){
                    index = i;
                    trouveRow = true;
                }
            }
        }
        compteur--;
    }
    return cheminMin;
}

function trouveCheminMax(matriceInitialeTransposed, matriceMaxTransposed){
    let tailleMatrice = matriceInitialeTransposed.length
    let index = matriceMaxTransposed.length-1;
    let trouve = false;
    //trouveRow: pour verifier si on trouve le sommet precedente
    let trouveRow = false;
    let cheminMax = [];
    //compteur pour eviter la boucle infini
    let compteur = tailleMatrice;

    while(!trouve && compteur>=0){
        trouveRow = false;
        cheminMax.push(index);
        if(matriceInitialeTransposed[index][0] == matriceMaxTransposed[index][0]){
            cheminMax.push(0);
            trouve = true;
        }
        for(var i =0; i< tailleMatrice && !trouveRow; i++){
            if(matriceInitialeTransposed[index][i] != Number.NEGATIVE_INFINITY){
                if(matriceMaxTransposed[index][0] == (matriceInitialeTransposed[index][i]+matriceMaxTransposed[i][0])){
                    index = i;
                    trouveRow = true;
                }
            }
        }
        compteur--;
    }
    return cheminMax;
}

export {
    algoDemoncronMin,
    algoDemoucronMax,
    trouveCheminMin,
    trouveCheminMax
};