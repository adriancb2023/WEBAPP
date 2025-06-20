import { useState } from 'react';
import NuevoProyecto from './NuevoProyecto';
import BotonModo from './BotonModo';

interface Proyecto {
  id: number;
  nombre: string;
  cliente: string;
  presupuesto: number;
  horas: number;
  estadoPago: 'Pagado' | 'Sin pagar' | '50% adelantado';
  fecha: string;
}

const proyectosDemo: Proyecto[] = [
  { id: 1, nombre: 'Reforma Oficina Central', cliente: 'Empresa ABC', presupuesto: 25000, horas: 45, estadoPago: 'Sin pagar', fecha: '15/1/2024' },
  { id: 2, nombre: 'Construcción Almacén', cliente: 'Logística XYZ', presupuesto: 85000, horas: 120, estadoPago: '50% adelantado', fecha: '1/2/2024' },
  { id: 3, nombre: 'Instalación Cocina Industrial', cliente: 'Restaurante Gourmet', presupuesto: 35000, horas: 32, estadoPago: 'Pagado', fecha: '15/2/2024' },
];

const estadoColor = {
  'Sin pagar': { bg: '#ffeaea', color: '#e74c3c' },
  '50% adelantado': { bg: '#fff9db', color: '#e6b800' },
  'Pagado': { bg: '#eaffea', color: '#27ae60' },
};

export default function Home() {
  const [proyectos] = useState<Proyecto[]>(proyectosDemo);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);

  // Estadísticas rápidas
  const totalProyectos = proyectos.length;
  const totalPresupuesto = proyectos.reduce((acc, p) => acc + p.presupuesto, 0);

  // Colores y estilos solo para modo claro
  const bgColor = modoOscuro ? '#181a1b' : 'linear-gradient(135deg, #f3f6fa 0%, #eaf1fb 100%)';
  const cardBg = modoOscuro ? '#23272f' : '#fff';
  const cardBorder = modoOscuro ? '#23272f' : '#e0e8f7';
  const textColor = modoOscuro ? '#f7f8fa' : '#1a237e';
  const statBg = modoOscuro ? '#23272f' : 'rgba(255,255,255,0.85)';
  const statShadow = modoOscuro ? '0 4px 24px 0 rgba(0,0,0,0.18)' : '0 12px 36px 0 rgba(58,41,255,0.13)';
  const headerShadow = modoOscuro ? '0 2px 8px 0 rgba(0,0,0,0.18)' : '0 8px 32px 0 rgba(58,41,255,0.10)';
  const btnBg = modoOscuro ? 'linear-gradient(90deg, #23272f 0%, #3A29FF 100%)' : 'linear-gradient(90deg, #3A8BFF 0%, #A259FF 100%)';
  const btnColor = '#fff';
  const subTextColor = modoOscuro ? '#b0b8c1' : '#5c6f91';
  const glass = modoOscuro ? '' : 'backdrop-filter: blur(8px); background: rgba(255,255,255,0.85);';
  const estadoColor = {
    'Sin pagar': modoOscuro ? { bg: '#3a2323', color: '#e74c3c' } : { bg: '#ffb3b3', color: '#d32f2f' },
    '50% adelantado': modoOscuro ? { bg: '#3a3723', color: '#e6b800' } : { bg: '#fff59d', color: '#e6b800' },
    'Pagado': modoOscuro ? { bg: '#233a2a', color: '#27ae60' } : { bg: '#b2f2e5', color: '#009688' },
  };

  if (mostrarNuevo) {
    return <NuevoProyecto onBack={() => setMostrarNuevo(false)} onSave={() => setMostrarNuevo(false)} modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />;
  }

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: 'inherit', width: '100vw', minWidth: 0, color: textColor, transition: 'background 0.3s, color 0.3s' }}>
      {/* Estilos globales responsive mejorados y modo oscuro */}
      <style>{`
        html, body, #root { height: 100%; margin: 0; padding: 0; ${!modoOscuro ? 'background: linear-gradient(135deg, #f3f6fa 0%, #eaf1fb 100%);' : `background: ${bgColor};`} }
        .home-main { width: 100%; max-width: 1100px; min-width: 500px; margin: 0 auto; padding: 0 24px; }
        .home-header { padding: 18px 0 10px 0; }
        .home-stats { display: flex; gap: 16px; margin: 0 auto 18px auto; }
        .proyectos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .modo-btn { position: fixed; right: 32px; bottom: 32px; z-index: 100; background: ${cardBg}; color: ${modoOscuro ? '#ffe066' : '#3A29FF'}; border: 2px solid ${modoOscuro ? '#444' : '#e3e7f0'}; border-radius: 50%; width: 54px; height: 54px; box-shadow: 0 4px 24px 0 rgba(58,41,255,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.10); display: flex; align-items: center; justify-content: center; font-size: 28px; cursor: pointer; transition: background 0.25s, color 0.25s, border 0.25s; }
        .proyecto-card { transition: box-shadow 0.25s, background 0.25s, color 0.25s, border 0.25s, transform 0.18s; ${!modoOscuro ? glass : ''} }
        .proyecto-card:hover { 
          box-shadow: ${modoOscuro ? '0 12px 32px 0 rgba(58,41,255,0.13), 0 2px 8px 0 rgba(0,0,0,0.10)' : '0 32px 64px 0 rgba(58,41,255,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)'};
          border: 1.5px solid #3A8BFF; 
          transform: translateY(-2px) scale(1.03); 
          background: ${modoOscuro ? cardBg : '#f0f7ff'};
        }
        .nuevo-btn { ${!modoOscuro ? 'backdrop-filter: blur(8px); box-shadow: 0 8px 32px 0 rgba(58,41,255,0.13);' : ''} }
        .nuevo-btn:hover { filter: brightness(1.08); box-shadow: 0 4px 16px 0 rgba(58,41,255,0.18); }
        @media (max-width: 900px) {
          .home-main { max-width: 100vw; min-width: 500px; padding: 0 8px; }
          .proyectos-grid { grid-template-columns: 1fr; }
          .home-stats { flex-direction: column; gap: 10px; }
          .modo-btn { right: 16px; bottom: 16px; }
        }
        @media (max-width: 600px) {
          .home-header { padding: 14px 0 8px 0 !important; }
          .home-main { padding: 0 2px; min-width: 500px; }
        }
      `}</style>
      {/* Header sticky */}
      <div className="home-header" style={{
        position: 'sticky', top: 0, zIndex: 20, background: cardBg, boxShadow: headerShadow, marginBottom: 18, color: textColor, transition: 'background 0.3s, color 0.3s'
      }}>
        <div className="home-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#e7eafe', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center' }}>
              <span role="img" aria-label="proyectos" style={{ fontSize: 22 }}>📋</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{'Proyectos'}</div>
              <div style={{ fontSize: 14, color: subTextColor }}>{totalProyectos} activos</div>
            </div>
          </div>
          <button className="nuevo-btn" style={{ background: btnBg, color: btnColor, border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(58,41,255,0.10)', transition: 'background 0.2s' }} onClick={() => setMostrarNuevo(true)}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>+</span> Nuevo
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="home-main home-stats">
        <div style={{ flex: 1, background: statBg, borderRadius: 12, padding: '18px 0', textAlign: 'center', boxShadow: statShadow, color: textColor, transition: 'background 0.3s, color 0.3s' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#3A29FF' }}>{totalProyectos}</div>
          <div style={{ fontSize: 15, color: subTextColor, marginTop: 2 }}>Proyectos Activos</div>
        </div>
        <div style={{ flex: 1, background: statBg, borderRadius: 12, padding: '18px 0', textAlign: 'center', boxShadow: statShadow, color: textColor, transition: 'background 0.3s, color 0.3s' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#27ae60' }}>€{totalPresupuesto.toLocaleString('es-ES')}</div>
          <div style={{ fontSize: 15, color: subTextColor, marginTop: 2 }}>Valor Total</div>
        </div>
      </div>

      {/* Lista de proyectos activos */}
      <div className="home-main" style={{ paddingBottom: 24 }}>
        <div className="proyectos-grid">
          {proyectos.map(proyecto => (
            <div key={proyecto.id} className="proyecto-card" style={{ background: cardBg, borderRadius: 20, boxShadow: '0 12px 36px 0 rgba(58,41,255,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)', padding: 28, display: 'flex', flexDirection: 'column', gap: 8, border: `1.5px solid ${cardBorder}`, color: textColor }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{proyecto.nombre}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: subTextColor, fontSize: 15, marginBottom: 2 }}>
                <span role="img" aria-label="cliente">👤</span> {proyecto.cliente}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3A29FF', fontWeight: 700, fontSize: 16 }}>
                  <span role="img" aria-label="horas">⏰</span> {proyecto.horas}h
                  <span style={{ color: subTextColor, fontWeight: 400, fontSize: 13, marginLeft: 4 }}>Horas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#27ae60', fontWeight: 700, fontSize: 16 }}>
                  <span role="img" aria-label="presupuesto">€</span> {proyecto.presupuesto.toLocaleString('es-ES')}
                  <span style={{ color: subTextColor, fontWeight: 400, fontSize: 13, marginLeft: 4 }}>Presupuesto</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <span style={{ background: estadoColor[proyecto.estadoPago].bg, color: estadoColor[proyecto.estadoPago].color, padding: '3px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>{proyecto.estadoPago === '50% adelantado' ? '50% Adelantado' : proyecto.estadoPago}</span>
                <span style={{ color: '#bbb', fontSize: 14, marginLeft: 'auto' }}>{proyecto.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
    </div>
  );
} 