import { useState } from 'react';  
import { BotaoReiniciar } from './Reiniciar';


function Square({valor, func}) {
  return <button className="square" onClick={func}>{valor}</button>
}

export default function Campo() {
  const [quadrados, setQuadrados] = useState(Array(9).fill(null));
  const [estado, setEstado] = useState(false);
  const [status, setStatus] = useState(null);
  const [placarX, setPlacarX] = useState(0);
const [placarO, setPlacarO] = useState(0);
const [empates, setEmpates] = useState(0);
  


  function calcularVencedor(quadradosTemp) {
  const linhas = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < linhas.length; i++) {
    const [a, b, c] = linhas[i];

    if (
      quadradosTemp[a] &&
      quadradosTemp[a] === quadradosTemp[b] &&
      quadradosTemp[a] === quadradosTemp[c]
    ) {
      return quadradosTemp[a] === "X"
        ? "Jogador 1 venceu!"
        : "Jogador 2 venceu!";
    }
  }

  if (quadradosTemp.every(quadrado => quadrado !== null)) {
    return "Deu empate!";
  }

  return null;
  }

  function handleClick(i) {
     if (status !== null) {
    return;
     }
    const quadradoTemp = quadrados.slice();
    if (quadradoTemp[i]!=null) {
      return;
    }

    if (estado==false) {
      quadradoTemp[i] = "X";
    } else {
      quadradoTemp[i] = "O";
    }
    setQuadrados(quadradoTemp);
    setEstado(!estado);
    const vencedor = calcularVencedor(quadradoTemp);

if (vencedor === "Jogador 1 venceu!") {
  setPlacarX(placarX + 1);
}

if (vencedor === "Jogador 2 venceu!") {
  setPlacarO(placarO + 1);
}

if (vencedor === "Deu empate!") {
  setEmpates(empates + 1);
}

setStatus(vencedor);

  }
  return <>
    <div className="board-row">
      <Square valor={quadrados[0]} func={() =>handleClick(0)} />
      <Square valor={quadrados[1]} func={() =>handleClick(1)}/>
      <Square valor={quadrados[2]} func={() =>handleClick(2)}/>
    </div>
    <div className="board-row">
      <Square valor={quadrados[3]} func={() =>handleClick(3)}/>
      <Square valor={quadrados[4]} func={() =>handleClick(4)}/>
      <Square valor={quadrados[5]} func={() =>handleClick(5)}/>
    </div>
    <div className="board-row">
      <Square valor={quadrados[6]} func={() =>handleClick(6)}/>
      <Square valor={quadrados[7]} func={() =>handleClick(7)}/>
      <Square valor={quadrados[8]} func={() =>handleClick(8)}/>  
    </div>
    <div><h1>{status}</h1></div>
    <div>
  <h2>Placar</h2>
  <p>Jogador X: {placarX}</p>
  <p>Jogador O: {placarO}</p>
  <p>Empates: {empates}</p>
</div>
    <BotaoReiniciar setQuadrados={setQuadrados} setEstado={setEstado} setStatus={setStatus}/>

  </>;
}