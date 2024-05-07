import React, {useEffect, useState} from 'react';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import CytoscapeDomNode from 'cytoscape-dom-node';
import edgehandles from 'cytoscape-edgehandles';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import {creationMatrice} from '../util/fonctionMatriciel';

cytoscape.use(CytoscapeDomNode);
cytoscape.use(edgehandles);
cytoscape.use(contextMenus);

const GraphEditer = React.forwardRef((props, ref)=>{
    var graphe = null;
    let eh = null;
    const stylesheet = [ 
      {
        selector: 'node',
        style: {
          'background-color': 'white',
          "text-valign" : "center",
          "text-halign" : "center",
          'font-weight': 'bold',
          'label': 'data(label)',
          'border-color': 'black',
          'border-width': '2px', 
        }
      },
      // {
      //   selector: 'node[debut = 1], node[fin = 1]',
      //   style: {
      //     'background-color': 'yellow',
      //   }
      // },
      {
        selector: 'node[chemin = 1]',
        style: {
          'background-color': 'yellow',
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 1.3,
          'line-color': 'black',
          'target-arrow-color': 'black',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-weight': 'bold',
          'text-margin-y': '-10px' 
          
        }
      },
      {
        selector: 'edge[chemin = 1]',
        style: {
          'line-color': 'red',
          'target-arrow-color': 'red',
        }
      }
    ];


  var options = {
    evtType: 'cxttap',
    menuItems: [
      {
        id: 'changeValeur',
        content: 'Modifier la valeur',
        tooltipText: 'change valeur',
        selector: 'edge',
        onClickFunction: function (edge) {
          var val = parseInt(prompt("Entrez la valeur de l'arc"));
          if(val == null || isNaN(val)) val = 1;
          edge.target.data('label', val);

          //suppression chemin lors d' un changement de donne
          if(edge.cy.elements('[chemin = 1]').length != 0){
            edge.cy.elements('[chemin = 1]').data('chemin', 0);
          }         
        },
        disabled: false
      },
      {
        id: 'remove',
        content: 'Supprimer',
        tooltipText: 'remove',
        image: {src: "assets/remove.svg", width: 12, height: 12, x: 6, y: 4},
        selector: 'edge',
        onClickFunction: function (event) {
          var target = event.target || event.cyTarget;
          var removed = target.remove();

          //suppression chemin lors d' un suppression d' un arc
          if(event.cy.elements('[chemin = 1]').length != 0){
            event.cy.elements('[chemin = 1]').data('chemin', 0);
          }
        },
        hasTrailingDivider: true
      },
      {
        //suppression d' un sommet
        id: 'removeNode',
        content: 'Supprimer',
        tooltipText: 'Supprimer',
        image: {src: "assets/remove.svg", width: 12, height: 12, x: 6, y: 4},
        selector: 'node[fin = 1][id>2]',
        onClickFunction: function (event) {
          var target = event.target || event.cyTarget;
          //recuperation de l'id de l' avant dernier sommet
          var lastNodeId = parseInt(target.data('id')) - 1;
          //affectation de l' avant dernier sommet comme fin;
          event.target.cy().nodes('node#'+lastNodeId).data('fin', 1);
          //suppression de la dernier sommet
          target.remove();
          //suppression des axes qui a un source sur l' avant dernier fin
          event.target.cy().edges('[source = "'+lastNodeId+'"]').remove();

          //suppression chemin lors d' un suppression d' un sommet
          if(event.cy.elements('[chemin = 1]').length != 0){
            event.cy.elements('[chemin = 1]').data('chemin', 0);
          }
        },
        hasTrailingDivider: true
      },
      {
        // Bouton pour effacer tous les nœuds et arêtes
        id: 'removeAll',
        content: 'Effacer tout',
        tooltipText: 'Effacer tous les nœuds et arêtes',
        image: { src: 'assets/remove-all.svg', width: 12, height: 12, x: 6, y: 4 },
        onClickFunction: function (event) {
          var cy = event.cy;
          cy.remove(cy.elements());
        },
      },
    ],
    menuItemClasses: [
    ],
    contextMenuClasses: [
    ],
    submenuIndicator: { src: 'assets/submenu-indicator-default.svg', width: 12, height: 12 }
};

//parametre de edge handler
let defaults = {
  canConnect: function( sourceNode, targetNode ){
    return !sourceNode.same(targetNode) && sourceNode.edgesTo(targetNode).length == 0 && targetNode.edgesTo(sourceNode).length == 0&& targetNode.data('debut') != 1 && sourceNode.data('fin') != 1; // e.g. disallow loops
  },
  edgeParams: function( sourceNode, targetNode ){

    return {data:{id : sourceNode.data('id')+'to'+targetNode.data('id'), source:sourceNode.data('id'), target:targetNode.data('id')}};
  },
  hoverDelay: 150, 
  snap: true,
  snapThreshold: 50, 
  snapFrequency: 15,
  noEdgeEventsInDraw: true,
  disableBrowserGestures: true
};

var drawOn = () =>{
  if(eh !== null){
    eh.enableDrawMode()
  }
}
var drawOff = () =>{
  if(eh !== null){
    eh.disableDrawMode()
  }
}
const [drawMode, setDrawMode] = useState(false);

  const toggleDrawMode = () => {
    setDrawMode(!drawMode);
    if (eh !== null) {
      drawMode ? eh.disableDrawMode() : eh.enableDrawMode();
    }
  };

let colorChemin = (chemin) => {
  if(graphe != null){
    var i;
    for(i = 0; i<chemin.length; i++){
      graphe.elements('node#'+chemin[i]).data('chemin',1);
      graphe.elements('edge[source = "' +chemin[i]+'"][target = "'+chemin[i-1]+'"]').data('chemin',1);
        }
      graphe.elements('edge[source = "' +chemin[i]+'"][target = "'+chemin[i-1]+'"]').data('chemin',1);
  }
}

let decolorChemin = () => {
  if(graphe != null && graphe.elements('[chemin = 1]').length != 0){
    graphe.elements('[chemin = 1]').data('chemin', 0);
  }
}

var creationNodes = (nombreSommet) => {
  
  if(graphe !== null){
    graphe.remove(graphe.elements());
    //creation d' un sommet x1 debut
      graphe.add({
        data: { id: 1, label: 'X1', debut:1}, position: { x: 50, y: 10 },
    })
    var i =2;
    for(i=2; i<nombreSommet; i++){
      graphe.add({
         data: { id: i, label: 'X'+i }, position: { x: i*50, y: 10 },
      })
    }
    //creation dernier sommet fin
      graphe.add({
         data: { id: i, label: 'X'+i, fin : 1 }, position: { x: i*50, y: 10 },
      })
  }
}

var creationGraphParDefault = () => {
  graphe.remove(graphe.elements());
  graphe.add([
    {data: { id: 1, label: 'X1', debut:1 }, position: { x: 50, y: 150 }},
    {data: { id: 2, label: 'X2'}, position: { x: 180, y: 60 }},
    {data: { id: 3, label: 'X3' }, position: { x: 340, y: 150 }},
    {data: { id: 4, label: 'X4' }, position: { x: 250, y: 250 }},
    {data: { id: 5, label: 'X5' }, position: { x: 420, y: 60 }},
    {data: { id: 6, label: 'X6', fin:1  }, position: { x: 520, y: 180}, fin:true},
    {data: {id: '1to2', source: '1', target: '2', label: '3', value:3}},
    {data: {id: '1to3', source: '1', target: '3', label: '8', value:8}},
    {data: {id: '1to4', source: '1', target: '4', label: '6', value:6}},
    {data: {id: '2to4', source: '2', target: '4', label: '2', value:2}},
    {data: {id: '2to5', source: '2', target: '5', label: '6', value:6}},
    {data: {id: '3to5', source: '3', target: '5', label: '1', value:1}},
    {data: {id: '4to3', source: '4', target: '3', label: '2', value:2}},
    {data: {id: '4to6', source: '4', target: '6', label: '7', value:7}},
    {data: {id: '5to6', source: '5', target: '6', label: '2', value:2}}
  ])
}

var recuperationMatrice = (valeurParDefaut) => {
  var matrice = [];
  if(graphe !== null){
    var elements = graphe.elements();
    var nodes = [];
    var edges = [];
    elements.map(element => {
      if(element.group() == 'nodes'){
        nodes.push(element.data())
      }else if(element.group() == 'edges'){
        edges.push(element.data())
      };
    });
      var tailleMatrice = nodes.length;
      var i, j;
      matrice = creationMatrice(tailleMatrice, valeurParDefaut)
      edges.map(edge =>{
        i = parseInt(edge.source, 10)-1;
        j = parseInt(edge.target, 10)-1;
        matrice[i][j] = parseInt(edge.label, 10)
      })
    }
    return matrice;
}

useEffect( () => {
  graphe.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
    let val = parseInt(prompt("valeur?"));
    if (val == null || isNaN(val)) val = 1;
    addedEdge.data('label', val);
     //suppression chemin lors d' un changement de donne
     if(event.cy.elements('[chemin = 1]').length != 0){
      event.cy.elements('[chemin = 1]').data('chemin', 0);
    }         
  });
  graphe.minZoom(0.5);
  graphe.maxZoom(2);

  //ajout d' un nodes en double Click
  graphe.on('dbltap', (event) => {
    //id == undefined => double click sur la background
    if(event.target.data('id') == undefined){

       //suppression chemin lors d' un changement de donne
     if(event.cy.elements('[chemin = 1]').length != 0){
      event.cy.elements('[chemin = 1]').data('chemin', 0);
    }         
      idNewNode = idLastNode + 1
      var idLastNode = event.target.elements('node').length
      var idNewNode =  idLastNode + 1
      event.cy.elements('node#'+idLastNode).data('fin', 0);
      event.cy.add({data:{id : idNewNode, label: 'X'+idNewNode, fin:1}, position : { x: event.position.x, y : event.position.y}});
    }
    
  })
  
}, [0]);

      return (
      <>
        <div className='cytsocapteContainer'>
          <div className="ct-btn-container">
            <button onClick={creationGraphParDefault} className='btn btn-outline-primary' >Exemple</button>
            <button id="draw-on" onClick={drawOn} className='btn btn-outline-primary'>Tracer des chemins</button>
            <button id="draw-off" onClick={drawOff} className='btn btn-outline-primary'>Arrêter de tracer des chemins</button>
            <button id="remove-all" onClick={() => {graphe.remove(graphe.elements());}} className="btn btn-outline-danger">
  Effacer tout
</button>

          </div>
          <CytoscapeComponent elements={[]} style={ { width: '100%', height: '400px'} } 
            stylesheet={stylesheet} recuperationMatrice={recuperationMatrice}
            colorChemin={colorChemin} creationNodes={creationNodes}
            decolorChemin={decolorChemin}
            cy={(cy) => { graphe = cy; cy.contextMenus(options); eh = cy.edgehandles(defaults); console.log('cyto')}} ref={ref}/>
            
        </div>
      </>
      )
  })
;
const GraphEditerPur = React.memo(GraphEditer)
export default GraphEditerPur;