function creationMatrice(tailleMatrice, valeurParDefaut){
    var matrice = [];
    for(var i=0; i<tailleMatrice; i++){
        matrice[i] = [];
        for(var j=0; j<tailleMatrice; j++){
            matrice[i][j] = valeurParDefaut;
        }
    }
    return matrice;
}

function transposeMat(matrice){
    let tailleMatrice = matrice.length
    let transposedMat = [];
    for(var i=0; i<tailleMatrice; i++){
        transposedMat[i] = new Array(tailleMatrice);
    }
    matrice.forEach((row, i)=>{
        row.forEach((cell, j)=>{
            transposedMat[j][i] = cell;
        })
    })
    return transposedMat;
}

async function copyMatrice(matrice1){
    let matrice = [];
    for(var i=0; i<matrice1.length; i++){
        matrice[i] = [];
        for(var j=0; j<matrice1.length; j++){
            matrice[i][j] = matrice1[i][j];
        }
    }
    return [...matrice];
}

export {
    creationMatrice,
    transposeMat,
    copyMatrice
}