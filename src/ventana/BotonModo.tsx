import { useResponsive } from '../hooks/useResponsive';

interface BotonModoProps {
  modoOscuro: boolean;
  setModoOscuro: (v: boolean) => void;
}

export default function BotonModo({ modoOscuro, setModoOscuro }: BotonModoProps) {
  const { isMobile } = useResponsive();
  
  return (
    <button
      onClick={() => setModoOscuro(!modoOscuro)}
      title="Cambiar modo claro/oscuro"
      aria-label={`Cambiar a modo ${modoOscuro ? 'claro' : 'oscuro'}`}
      style={{
        position: 'fixed',
        right: isMobile ? '16px' : '32px',
        bottom: isMobile ? '100px' : '32px',
        zIndex: 1000,
        background: 'var(--bg-primary)',
        color: modoOscuro ? '#ffe066' : 'var(--primary-color)',
        border: `2px solid ${modoOscuro ? '#444' : 'var(--border-color)'}`,
        borderRadius: '50%',
        width: isMobile ? '48px' : '56px',
        height: isMobile ? '48px' : '56px',
        boxShadow: 'var(--shadow-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '20px' : '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-heavy)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
      }}
    >
      {modoOscuro ? '🌙' : '☀️'}
    </button>
  );
}