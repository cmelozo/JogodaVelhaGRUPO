import { useState, useEffect } from "react";
import "./styles.css";

export default function App() {

  const [pokemon, setPokemon] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);

  const [nome, setNome] = useState("pikachu");
  const [nome2, setNome2] = useState("bulbasaur")

  const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
  const [turnoJogador1, setTurnoJogador1] = useState(true);
  const [vencedor, setVencedor] = useState(null);
  const [mensagemErro, setMensagemErro] = useState("");

  const [bloquearJogada, setBloquearJogada] = useState(false);

  async function buscarPokemon(nomePokemon) {
    const nomeFormatado = nomePokemon.toLowerCase().trim();

    if (!nomeFormatado) {
      throw new Error("Por favor, digite o nome de um Pokémon.");
    }

    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeFormatado}`);

    if (!resposta.ok) {
      throw new Error("Pokémon não encontrado.");
    }

    const dados = await resposta.json();
    return dados;
  }

  useEffect(() => {
  async function carregarIniciais() {
    try {
      const dadosP1 = await buscarPokemon("pikachu");
      const dadosP2 = await buscarPokemon("bulbasaur");

      setPokemon(dadosP1);
      setPokemon2(dadosP2);
    } catch (erro) {
      setMensagemErro("Erro ao carregar Pokémon iniciais.");
    }
  }

  carregarIniciais();
}, []);

    useEffect(() => {
  if (!turnoJogador1 && !vencedor) {

    const timer = setTimeout(() => {
      maquina();
    }, 600);

    return () => clearTimeout(timer);
  }

}, [turnoJogador1, tabuleiro, vencedor]);

  async function handleAlterarPokemon() {
    setMensagemErro(""); // Limpa mensagem de erro anterior

    try {
      const dadosP1 = await buscarPokemon(nome);
      const dadosP2 = await buscarPokemon(nome2);

      setPokemon(dadosP1);
      setPokemon2(dadosP2);
      reiniciarPartida();
    } catch (erro) {
      // Exibe a mensagem "Pokémon não encontrado." se falhar
      setMensagemErro(erro.message);
    }
  }

  // Lógica das jogadas no tabuleiro
  function lidarComClique(index) {
  // Se a máquina estiver jogando, ignora qualquer clique
  if (bloquearJogada) return;

  if (!turnoJogador1) return;

  if (tabuleiro[index] || vencedor) return;

    const novoTabuleiro = [...tabuleiro];
    // Grava quem jogou na posição ("P1" ou "P2")
    novoTabuleiro[index] = turnoJogador1 ? "P1" : "P2";
    setTabuleiro(novoTabuleiro);

    const ganhador = verificarVencedor(novoTabuleiro);
    if (ganhador) {
      setVencedor(ganhador === "P1" ? pokemon?.name : pokemon2?.name);
    } else if (novoTabuleiro.every((casa) => casa !== null)) {
      setVencedor("Empate");
    } else {
  setBloquearJogada(true);   // Bloqueia novos cliques
  setTurnoJogador1(false);   // Passa a vez para a máquina
}
  }
  
  // Jogador 2
  function maquina() {
  if (vencedor) return;

  // Procura as casas vazias
  const casasLivres = tabuleiro
    .map((casa, index) => (casa === null ? index : null))
    .filter((casa) => casa !== null);

  if (casasLivres.length === 0) return;

  // Escolhe uma casa aleatória
  const indice =
    casasLivres[Math.floor(Math.random() * casasLivres.length)];

  const novoTabuleiro = [...tabuleiro];

  novoTabuleiro[indice] = "P2";

  setTabuleiro(novoTabuleiro);

  const ganhador = verificarVencedor(novoTabuleiro);

if (ganhador) {
  setVencedor(pokemon2?.name);
  setBloquearJogada(false);
}
else if (novoTabuleiro.every((casa) => casa !== null)) {
  setVencedor("Empate");
  setBloquearJogada(false);
}
else {
  setTurnoJogador1(true);
  setBloquearJogada(false);
}
}

  function reiniciarPartida() {
    setTabuleiro(Array(9).fill(null));
    setTurnoJogador1(true);
    setVencedor(null);
  }

  function verificarVencedor(quadrados) {
    const combinacoes = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < combinacoes.length; i++) {
      const [a, b, c] = combinacoes[i];
      if (quadrados[a] && quadrados[a] === quadrados[b] && quadrados[a] === quadrados[c]) {
        return quadrados[a];
      }
    }
    return null;
  }

  return (
    <div className="container_principal">
      <h1>Pokémon Tic-Tac-Toe</h1>

      {/* 3. Dois campos para escolher os Pokémon */}
      <form onSubmit={(e) => e.preventDefault()} className="pokemon_form">
        <div className="campo_input">
          <label>Jogador 1:</label>
          <input
            id="pokemon_input"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Escreva o nome de um Pokémon"
          />
        </div>

        <div className="campo_input">
          <label>Jogador 2:</label>
          <input
            id="pokemon_input_2"
            type="text"
            value={nome2}
            onChange={(e) => setNome2(e.target.value)}
            placeholder="Escreva o nome de um Pokémon"
          />
        </div>

        <button type="button" onClick={handleAlterarPokemon} className="btn_buscar">
          Alterar Pokémon
        </button>
      </form>

      {/* 5. Exibição de mensagem de erro */}
      {mensagemErro && <p className="mensagem_erro">{mensagemErro}</p>}

      <div className="status_jogo">
        {vencedor ? (
          <h2>
            {vencedor === "Empate"
              ? "Deu Velha! 🤝"
              : `Vitória de: ${vencedor.toUpperCase()} 🎉`}
          </h2>
        ) : (
          <h3>Vez de: {turnoJogador1 ? pokemon?.name?.toUpperCase() : pokemon2?.name?.toUpperCase()}</h3>
        )}
      </div>

      {/* 2. Tabuleiro exibindo as imagens no lugar de X e O */}
      <div className="tabuleiro">
        {tabuleiro.map((casa, index) => (
          <button key={index} type="button" className="casa_tabuleiro" onClick={() => lidarComClique(index)} disabled={bloquearJogada}>
            {casa === "P1" && pokemon?.sprites?.front_default && (
              <img src={pokemon.sprites.front_default} alt={pokemon.name} className="imagem_peca" />
            )}
            {casa === "P2" && pokemon2?.sprites?.front_default && (
              <img src={pokemon2.sprites.front_default} alt={pokemon2.name} className="imagem_peca" />
            )}
          </button>
        ))}
      </div>

      <button type="button" onClick={reiniciarPartida} className="btn_reiniciar">
        Reiniciar Partida
      </button>
    </div>
  );
}
