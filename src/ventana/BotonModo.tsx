interface BotonModoProps {
  modoOscuro: boolean;
  setModoOscuro: (v: boolean) => void;
}

export default function BotonModo({ modoOscuro, setModoOscuro }: BotonModoProps) {
  return (
    <button
      className="modo-btn"
      onClick={() => setModoOscuro(!modoOscuro)}
      title="Cambiar modo claro/oscuro"
      style={{
        position: 'fixed',
        right: 32,
        bottom: 32,
        zIndex: 100,
        background: modoOscuro ? '#23272f' : '#fff',
        color: modoOscuro ? '#ffe066' : '#3A29FF',
        border: `2px solid ${modoOscuro ? '#444' : '#e3e7f0'}`,
        borderRadius: '50%',
        width: 54,
        height: 54,
        boxShadow: '0 4px 24px 0 rgba(58,41,255,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s, border 0.2s',
      }}
    >
      {modoOscuro ? '🌙' : '☀️'}
    </button>
  );
} 