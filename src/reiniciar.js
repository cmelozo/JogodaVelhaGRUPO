export function BotaoReiniciar({ setQuadrados, setEstado, setStatus }) {

  function reiniciarJogo() {
    setQuadrados(Array(9).fill(null));
    setEstado(false);
    setStatus(null);
  }

  return (
    <button onClick={reiniciarJogo}>
      Reiniciar Jogo
    </button>
  );
}