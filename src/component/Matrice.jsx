import {Row, Col, Card} from 'react-bootstrap'

function Matrice(props){
    const {lastMatrice,currentMatrice, a_changee, entree, sortie, w, k} = props;
    const equals = (a,b) => JSON.stringify(a) === JSON.stringify(b)
    const exist = (tableau, valeur) => {
        let res = false; 
        tableau.map((element)=>{
            if(equals(element, valeur)) res = true;
            return res;
        })
        return res;
    }
    const formule = {
        backgroundColor: 'yellow',
        padding: '10px', 
        width : '260px',
        textAlign : 'center',
        marginLeft : '25px'
      };
    return(
        <>
        <Card.Body>
        <Row>
        {props.k === 1 &&
                <Col style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                    <h4 className="titleMatrice" style={{paddingLeft:'35%'}}>Matrice D<sub>{props.k}</sub></h4>
                    <table className='matrice'>
                        <tbody>
                            <tr className='matriceTopNumero'>
                                <td></td>
                                {
                                    lastMatrice.map((row,i)=>(
                                        <td key={"numtop"+i}>{i+1}</td>
                                    ))
                                }
                            </tr>
                            {lastMatrice.map((row, i)=>(
                                <tr key={k+"row"+i}>
                                    <td className="matriceLeftNumero">{i+1}</td>
                                    {row.map((cell, j)=>(
                                        <td key={j}>
                                            {
                                            (!Number.isFinite(cell)? <>{cell === Number.POSITIVE_INFINITY? <>+</>:<>-</>}&infin;</> : cell)
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                    <br />
                </Col>
            }
            </Row>
                <table className='tableFormule' style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                    <tbody>
                    <Card.Title style={{marginLeft:"2rem"}}> <u>k = {props.k + 1} :</u>
                    </Card.Title>
                    <p style={formule}>
                W<sub>ij</sub><sup>(k-1)</sup> = V<sub>ik</sub><sup>(k-1)</sup> + V<sub>kj</sub><sup>(k-1)</sup> 
            </p>
                    {
                        
                        entree.map((i)=>(
                            sortie.map((j, index)=>(
                                <tr key={index} className="formule">
                                    <td>W<sub>{(i+1)+""+(j+1)}</sub><sup>{"("+k+")"}</sup>= V<sub>{(i+1)+""+(k+1)}</sub><sup>{"("+k+")"}</sup> + V
                                        <sub>{(k+1)+""+(j+1)}</sub><sup>{"("+k+")"}</sup>= {lastMatrice[i][k] + " + " + lastMatrice[k][j] + " = " + w[i][j]}
                                    </td>
                                    <td>
                                        V<sub>{(i+1)+""+(j+1)}</sub><sup>{"("+(k+1)+")"}</sup>= {props.typeChemin.toUpperCase()} {"( W"}<sub>{(i+1)+""+(j+1)}</sub><sup>{"("+k+")"}</sup>, V<sub>{(i+1)+""+(j+1)}</sub><sup>{"("+(k)+")"}</sup>{" )"}= {props.typeChemin.toUpperCase()}{"( "+w[i][j]+","} <>{(!Number.isFinite(lastMatrice[i][j])? <>{lastMatrice[i][j]==Infinity ? <>+</> : <>-</>}&infin;</> :lastMatrice[i][j])} {" )="}<b className="a_changee_calcul">{currentMatrice[i][j]}</b></>
                                    </td>
                                </tr>
                            
                            ))
                        ))
                    }
                    </tbody>
                </table>
                <br />
                <br />
            <Row>
                <Col style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
                <h4 className="titleMatrice" style={{paddingLeft:'35%'}}>Matrice D<sub>{props.k+1}</sub></h4>
                <table className='matrice'>
                <tbody>
                <tr className='matriceTopNumero'>
                                <td></td>
                                {
                                    
                                    currentMatrice.map((row,i)=>(
                                        <td key={i}>{i+1}</td>
                                    ))
                                }
                            </tr>
                    {currentMatrice.map((row, i)=>(
                        <tr key={k+"row"+i}>
                            <td className="matriceLeftNumero">{i+1}</td>
                            {row.map((cell, j)=>(
                                // <td key={j}>{exist(a_changee, [i,j]) ? <b className="a_changee">{cell === Infinity ? <>+&infin;</> :cell}</b> : cell === Infinity ? <>+&infin;</> : cell}</td>
                                <td key={j}>{
                                    exist(a_changee, [i,j]) ? <b className="a_changee">{!Number.isFinite(cell)? <>{cell === Number.POSITIVE_INFINITY? <>+</>:<>-</>}&infin;</> :cell}</b> : 
                                    !Number.isFinite(cell)? <>{cell === Number.POSITIVE_INFINITY? <>+</>:<>-</>}&infin;</> : cell
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
                </Col>
            </Row>
            </Card.Body>
        </>
    )
}

export default Matrice;