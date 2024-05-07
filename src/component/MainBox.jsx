import React,{ useState, useRef} from 'react';
import GraphInternet from './Graphic';
import MatriceD from './Matrice';
import { Container, Button, Form} from 'react-bootstrap'
import {algoDemoncronMin, algoDemoucronMax} from '../util/algorithme'

function MainBox(){
    const [demarche, setDemarche] = useState([]);
    const [nombreSommet, setNombreSommet] = useState(2)
    const [typeChemin, setTypeChemin] = useState('min');
    const grapheRef = useRef(null);

    let trouveSolution =  async () => {
        setDemarche([])
        grapheRef.current.props.decolorChemin();
        if(typeChemin == 'min'){
            var matrice = grapheRef.current.props.recuperationMatrice(Infinity);
            let resultat = await algoDemoncronMin(matrice);
            if(resultat.cheminMin === undefined){
                alert("Veuillez completer la graphe");
            }else{
                setDemarche(resultat.demarche);
                var cheminReel = resultat.cheminMin.map(val => {return val+1});
                grapheRef.current.props.colorChemin(cheminReel);
            }
           
        }else if(typeChemin == 'max'){
            var matrice = grapheRef.current.props.recuperationMatrice(Number.NEGATIVE_INFINITY);
            let resultat = await algoDemoucronMax(matrice);
            if(resultat.cheminMax === undefined){
                alert("Veuillez completer la graphe");
            }else{
                setDemarche(resultat.demarche);
                var cheminReel = resultat.cheminMax.map(val => {return val+1});
                grapheRef.current.props.colorChemin(cheminReel);
            }  
        }
       
    }
    let creerSommet = () => {
        grapheRef.current.props.creationNodes(nombreSommet)
    }
    return(
        <>
        {/* <Navbar bg="primary" variant="dark"> <Navbar.Brand href="#"></Navbar.Brand> <Nav className="mr-auto">          
            </Nav></Navbar> */}
            <h1 align="center">DEMOUCRON MIN MAX</h1>
            <hr />
            <Container className='mt-5'>
            <div className="form">
                <Form>
                    <Form.Check
                        checked={typeChemin=='min'}
                        label="Minimum"
                        type='radio'
                        value='min'
                        id='min'
                        onChange={ e => setTypeChemin(e.target.value)}
                    />
                     
                    <Form.Check
                        checked={typeChemin=='max'}
                        label="Maximum"
                        type='radio'
                        value='max'
                        id='max'
                        onChange={ e => setTypeChemin(e.target.value)}
                    />
                </Form>
                <Button onClick={trouveSolution} style={{height:"40px", marginTop:"5px"}}>Solution</Button>
            </div>
                <h3>Tracer la graphe</h3>
                <br />
                <GraphInternet ref={grapheRef}>
                </GraphInternet>
                
            <br /><br />
            <hr />
                <EtapeDemoucron demarche={demarche} typeChemin={typeChemin}/>
            </Container>
        </>
    )
    
}

const EtapeDemoucron = (props) => {
    return(<>{(props.demarche.length == 0 ? "" : <div className="titleSolution"><h5></h5></div>)}
    {
        props.demarche.map((etape, index)=>(
          <div key={index} >
            <MatriceD k={etape.k} lastMatrice={etape.lastMatrice} currentMatrice={etape.currentMatrice} 
            a_changee={etape.a_changee} w={etape.w} entree={etape.entree} sortie={etape.sortie} typeChemin={props.typeChemin}/>
            <br/>
            </div>
        ))
    }</>)
}

export default MainBox;