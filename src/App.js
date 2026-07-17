import { useState, useEffect } from "react";

export default function App() {
  // Estado do tabuleiro (9 posições) preenchido logicamente com null, "P1" ou "P2"
  const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
  const [turnoP1, setTurnoP1] = useState(true); // true = P1 (Jogador 1), false = P2 (Jogador 2)
  const [vencedor, setVencedor] = useState(null);

  // Estados dos Pokémon (Dados do Pokémon 1 e Pokémon 2)
  const [pokemonP1, setPokemonP1] = useState(null);
  const [pokemonP2, setPokemonP2] = useState(null);

  // Estados dos inputs de texto para busca
  const [nomeP1, setNomeP1] = useState("pikachu");
  const [nomeP2, setNomeP2] = useState("bulbasaur");

  // Estado para controle de mensagens de erro
  const [erro, setErro] = useState("");

  // 1. Pokémon inicial carregado automaticamente usando useEffect com lista de dependências vazia ([])
  useEffect(() => {
    async function carregarIniciais() {
      try {
        const p1 = await buscarPokemonDados("pikachu");
        const p2 = await buscarPokemonDados("bulbasaur");
        setPokemonP1(p1);
        setPokemonP2(p2);
      } catch (error) {
        setErro("Erro ao carregar os Pokémon iniciais.");
      }
    }
    carregarIniciais();
  }, []);

  // 4. Função de consumo da API isolada com async/await e tratamento de erro (try/catch e throw)
  async function buscarPokemonDados(nomePokemon) {
    const nomeFormatado = nomePokemon.toLowerCase().trim();
    if (!nomeFormatado) {
      throw new Error("Digite um nome válido.");
    }

    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeFormatado}`);
    
    // 5. Tratamento de erro caso o Pokémon não exista
    if (!resposta.ok) {
      throw new Error("Pokémon não encontrado.");
    }

    const dados = await resposta.json();
    return dados;
  }

  // 3. Função acionada ao clicar no botão "Alterar Pokémon"
  async function handleMudarPokemon() {
    setErro(""); // Limpa erros antigos antes da busca
    try {
      const novoP1 = await buscarPokemonDados(nomeP1);
      const novoP2 = await buscarPokemonDados(nomeP2);
      
      setPokemonP1(novoP1);
      setPokemonP2(novoP2);
      reiniciarJogo(); // Opcional: reinicia o tabuleiro com os novos personagens
    } catch (err) {
      setErro(err.message); // Exibe "Pokémon não encontrado." se a API falhar
    }
  }

  // Lógica de clique nas casas do Jogo da Velha
  function lidarComClique(index) {
    if (tabuleiro[index] || vencedor) return; // Impede clicar em casa ocupada ou se o jogo acabou

    const novoTabuleiro = [...tabuleiro];
    novoTabuleiro[index] = turnoP1 ? "P1" : "P2"; // Salva de quem é a peça logicamente
    setTabuleiro(novoTabuleiro);

    // Verifica se houve vencedor
    const ganhador = verificarVencedor(novoTabuleiro);
    if (ganhador) {
      setVencedor(ganhador === "P1" ? pokemonP1?.name : pokemonP2?.name);
    } else if (novoTabuleiro.every((casa) => casa !== null)) {
      setVencedor("Empate");
    } else {
      setTurnoP1(!turnoP1); // Passa o turno
    }
  }

  function reiniciarJogo() {
    setTabuleiro(Array(9).fill(null));
    setTurnoP1(true);
    setVencedor(null);
  }

  // Função auxiliar de checagem clássica do Jogo da Velha
  function verificarVencedor(quadrados) {
    const linhas = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontais
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticais
      [0, 4, 8], [2, 4, 6],             // Diagonais
    ];
    for (let i = 0; i < linhas.length; i++) {
      const [a, b, c] = lines[i];
      if (quadrados[a] && quadrados[a] === quadrados[b] && quadrados[a] === quadrados[c]) {
        return quadrados[a];
      }
    }
    return null;
  }

  return (
    <div style={styles.container}>
      <h2>Pokémon Jogo da Velha</h2>

      {/* 3. Escolha dos Pokémon com dois campos */}
      <div style={styles.formContainer}>
        <div style={styles.inputGroup}>
          <label>Jogador 1: </label>
          <input
            type="text"
            value={nomeP1}
            onChange={(e) => setNomeP1(e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Jogador 2: </label>
          <input
            type="text"
            value={nomeP2}
            onChange={(e) => setNomeP2(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleMudarPokemon}>
          Alterar Pokémon
        </button>
      </div>

      {/* 5. Tratamento de erro exibido na tela */}
      {erro && <p style={styles.erroText}>{erro}</p>}

      <div style={styles.status}>
        {vencedor ? (
          <h3>{vencedor === "Empate" ? "Deu Velha! 🤝" : `Vitória de: ${vencedor.toUpperCase()} 🎉`}</h3>
        ) : (
          <h3>Turno de: {turnoP1 ? pokemonP1?.name?.toUpperCase() : pokemonP2?.name?.toUpperCase()}</h3>
        )}
      </div>

      {/* Tabuleiro do Jogo */}
      <div style={styles.tabuleiro}>
        {tabuleiro.map((casa, index) => (
          <button
            key={index}
            type="button"
            style={styles.casa}
            onClick={() => lidarComClique(index)}
          >
            {/* 2. Exibição das peças com a imagem do Pokémon */}
            {casa === "P1" && pokemonP1?.sprites?.front_default && (
              <img src={pokemonP1.sprites.front_default} alt={pokemonP1.name} style={styles.imgPeca} />
            )}
            {casa === "P2" && pokemonP2?.sprites?.front_default && (
              <img src={pokemonP2.sprites.front_default} alt={pokemonP2.name} style={styles.imgPeca} />
            )}
          </button>
        ))}
      </div>

      <button type="button" onClick={reiniciarJogo} style={styles.btnReset}>
        Reiniciar Partida
      </button>
    </div>
  );
}

// Estilos básicos inline para você visualizar o tabuleiro perfeitamente estruturado
const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "sans-serif" },
  formContainer: { background: "#eee", padding: "15px", borderRadius: "8px", marginBottom: "10px" },
  inputGroup: { marginBottom: "8px" },
  erroText: { color: "red", fontWeight: "bold" },
  status: { margin: "10px 0" },
  tabuleiro: { display: "grid", gridTemplateColumns: "repeat(3, 100px)", gridTemplateRows: "repeat(3, 100px)", gap: "5px", background: "#333", padding: "5px", borderRadius: "8px" },
  casa: { background: "#fff", border: "none", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" },
  imgPeca: { width: "100%", height: "100%", objectFit: "contain" },
  btnReset: { marginTop: "15px", padding: "8px 16px", cursor: "pointer" }
};