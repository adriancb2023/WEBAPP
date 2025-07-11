import { useState, useEffect } from 'react';
import NuevoProyecto from './NuevoProyecto';
import BotonModo from './BotonModo';
import DetalleProyecto from './DetalleProyecto';
import Clientes from './Clientes';
import Estadisticas from './Estadisticas';
import Calculadora from './Calculadora';
import { supabase } from '../supabaseClient'

export interface Factura { nombre: string; fecha: string; tipo: 'pdf' | 'img'; url: string; }
export interface Proyecto {
  id: number;
  nombre: string;
  cliente: string;
  presupuesto: number;
  horas: number;
  estadoPago: 'Pagado' | 'Sin pagar' | '50% adelantado';
  fecha: string;
  gastos: number;
  facturas: Factura[];
  precioHora: number;
}

const estadoColor = {
  'Sin pagar': { bg: '#ffeaea', color: '#e74c3c' },
  '50% adelantado': { bg: '#fff9db', color: '#e6b800' },
  'Pagado': { bg: '#eaffea', color: '#27ae60' },
};

export default function Home() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [modoOscuro, setModoOscuro] = useState(() => {
    const guardado = localStorage.getItem('modoOscuro');
    return guardado ? guardado === 'true' : false;
  });
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [detalle, setDetalle] = useState<Proyecto|null>(null);
  const [proyectoFocus, setProyectoFocus] = useState<number|null>(null);
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');

  // Leer preferencia de localStorage al iniciar
  useEffect(() => {
    localStorage.setItem('modoOscuro', modoOscuro.toString());
  }, [modoOscuro]);

  // Estadísticas rápidas
  const totalProyectos = proyectos.length;
  const totalPresupuesto = proyectos.reduce((acc, p) => acc + p.presupuesto, 0);

  // Colores y estilos solo para modo claro
  const bgColor = modoOscuro ? '#111' : 'linear-gradient(135deg, rgb(243, 246, 250) 0%, #213547 100%)';
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

  // Detectar si es móvil
  const esMovil = typeof window !== 'undefined' && window.innerWidth <= 900;

  // Obtener lista de clientes únicos para el filtro
  const clientesUnicos = Array.from(new Set(proyectos.map(p => p.cliente)));

  // Filtrado avanzado de proyectos
  const proyectosFiltrados = proyectos.filter(p => {
    const q = busqueda.trim().toLowerCase();
    const coincideBusqueda = !q || p.nombre.toLowerCase().includes(q) || p.cliente.toLowerCase().includes(q);
    const coincideCliente = !filtroCliente || p.cliente === filtroCliente;
    const coincideEstado = !filtroEstado || p.estadoPago === filtroEstado;
    const fechaParts = p.fecha.split('/');
    const fechaISO = `${fechaParts[2]}-${fechaParts[1].padStart(2, '0')}-${fechaParts[0].padStart(2, '0')}`;
    const coincideDesde = !filtroDesde || fechaISO >= filtroDesde;
    const coincideHasta = !filtroHasta || fechaISO <= filtroHasta;
    return coincideBusqueda && coincideCliente && coincideEstado && coincideDesde && coincideHasta;
  });

  // Cargar proyectos desde Supabase al montar
  useEffect(() => {
    const fetchProyectos = async () => {
      const { data, error } = await supabase.from('proyectos').select('*');
      if (!error && data) setProyectos(data);
    };
    fetchProyectos();
  }, []);

  // Guardar proyecto nuevo
  const handleNuevoProyecto = async (proyecto: any) => {
    const { data, error } = await supabase.from('proyectos').insert([{ ...proyecto }]).select();
    if (!error && data) setProyectos(ps => [...ps, data[0]]);
    setMostrarNuevo(false);
  };

  // Guardar edición de proyecto
  const handleGuardarProyecto = async (p: Proyecto) => {
    const { data, error } = await supabase.from('proyectos').update({ ...p }).eq('id', p.id).select();
    if (!error && data) setProyectos(ps => ps.map(proj => proj.id === p.id ? data[0] : proj));
    setDetalle(null);
  };

  if (mostrarNuevo) {
    return <NuevoProyecto onBack={() => setMostrarNuevo(false)} onSave={handleNuevoProyecto} modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />;
  }

  if (detalle) {
    return <DetalleProyecto
      proyecto={detalle}
      modoOscuro={modoOscuro}
      setModoOscuro={setModoOscuro}
      onBack={() => setDetalle(null)}
      onSave={handleGuardarProyecto}
    />;
  }

  if (mostrarClientes) {
    return <Clientes onVolver={() => setMostrarClientes(false)} />;
  }

  if (mostrarEstadisticas) {
    return <Estadisticas proyectos={proyectos} modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onVolver={() => setMostrarEstadisticas(false)} />;
  }

  if (mostrarCalculadora) {
    return <Calculadora modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} onVolver={() => setMostrarCalculadora(false)} />;
  }

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: 'inherit', width: '100vw', minWidth: 0, color: textColor, transition: 'background 0.3s, color 0.3s' }}>
      {/* Estilos globales responsive mejorados y modo oscuro */}
      <style>{`
        html, body, #root { height: 100%; margin: 0; padding: 0; ${!modoOscuro ? 'background: linear-gradient(135deg, #f3f6fa 0%, #eaf1fb 100%);' : `background: ${bgColor};`} }
        .home-main { width: 100%; max-width: 1100px; min-width: 0; margin: 0 auto; padding: 0 24px; }
        .home-header { padding: 18px 0 10px 0; }
        .home-stats { display: flex; gap: 16px; margin: 0 auto 18px auto; }
        .proyectos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        .modo-btn { position: fixed; right: 32px; bottom: 32px; z-index: 100; background: ${cardBg}; color: ${modoOscuro ? '#ffe066' : '#3A29FF'}; border: 2px solid ${modoOscuro ? '#444' : '#e3e7f0'}; border-radius: 50%; width: 54px; height: 54px; box-shadow: 0 4px 24px 0 rgba(58,41,255,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.10); display: flex; align-items: center; justify-content: center; font-size: 28px; cursor: pointer; transition: background 0.25s, color 0.25s, border 0.25s; }
        .proyecto-card { transition: box-shadow 0.25s, background 0.25s, color 0.25s, border 0.25s, transform 0.18s; ${!modoOscuro ? glass : ''}; padding: 24px 18px 22px 18px !important; margin-bottom: 8px; width: 100%; box-sizing: border-box; }
        .proyecto-card:hover { 
          box-shadow: ${modoOscuro ? '0 12px 32px 0 rgba(58,41,255,0.13), 0 2px 8px 0 rgba(0,0,0,0.10)' : '0 32px 64px 0 rgba(58,41,255,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)'};
          border: 1.5px solid #3A8BFF; 
          transform: translateY(-2px) scale(1.03); 
          background: ${modoOscuro ? cardBg : '#f0f7ff'};
        }
        .proyecto-card .proyecto-titulo { font-size: 1.18em; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.5px; }
        .proyecto-card .proyecto-icono { font-size: 22px !important; margin-right: 4px; }
        .proyecto-card .proyecto-estado { font-size: 15px; font-weight: 700; padding: 4px 16px; border-radius: 8px; margin-top: 4px; }
        .proyecto-card .proyecto-estado.sin-pagar { background: #ffb3b3; color: #d32f2f; }
        .proyecto-card .proyecto-estado.adelantado { background: #fff59d; color: #e6b800; }
        .proyecto-card .proyecto-estado.pagado { background: #b2f2e5; color: #009688; }
        .nuevo-btn { ${!modoOscuro ? 'backdrop-filter: blur(8px); box-shadow: 0 8px 32px 0 rgba(58,41,255,0.13);' : ''} }
        .nuevo-btn:hover { filter: brightness(1.08); box-shadow: 0 4px 16px 0 rgba(58,41,255,0.18); }
        @media (max-width: 900px) {
          .home-main { max-width: 100vw; min-width: 0; padding: 0 8px; }
          .proyectos-grid { grid-template-columns: 1fr; gap: 18px; }
          .home-stats { flex-direction: column; gap: 10px; }
          .modo-btn { right: 16px; bottom: 16px; }
          .home-header { flex-direction: column; gap: 10px; padding: 10px 0 8px 0 !important; }
        }
        @media (max-width: 600px) {
          .home-header { padding: 8px 0 6px 0 !important; flex-direction: column; gap: 8px; }
          .home-main { padding: 0 2vw; min-width: 0; max-width: 100vw; }
          .home-stats { flex-direction: column; gap: 12px; }
          .proyectos-grid { grid-template-columns: 1fr; gap: 18px; }
          .uiverse-btn, button { font-size: 1.15em; min-height: 48px; min-width: 48px; border-radius: 12px; }
          .proyecto-card { padding: 18px 4vw 16px 4vw !important; margin-bottom: 16px; width: 100%; box-sizing: border-box; }
          .proyecto-card .proyecto-titulo { font-size: 1.08em; }
          .home-header-btns { max-width: 100vw; }
        }
      `}</style>
      {/* Header sticky */}
      <div className="home-header" style={{
        position: 'sticky', top: 0, zIndex: 20, background: cardBg, boxShadow: headerShadow, marginBottom: 18, color: textColor, transition: 'background 0.3s, color 0.3s'
      }}>
        <div className="home-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#e7eafe', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center' }}>
              <span role="img" aria-label="proyectos" style={{ fontSize: 22 }}>📋</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{'Proyectos'}</div>
              <div style={{ fontSize: 14, color: subTextColor }}>{totalProyectos} activos</div>
            </div>
          </div>
          <div className="home-header-btns" style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', padding: '2px 0', WebkitOverflowScrolling: 'touch', maxWidth: '100vw' }}>
            <button className="uiverse-btn estadisticas-btn" aria-label="Estadísticas" onClick={() => setMostrarEstadisticas(true)}>
              <span role="img" aria-label="estadísticas" style={{ fontSize: 18 }}>📊</span>
              <span className="btn-texto-responsive"> Estadísticas</span>
            </button>
            <button className="uiverse-btn calculadora-btn" aria-label="Calculadora" onClick={() => setMostrarCalculadora(true)}>
              <span role="img" aria-label="calculadora" style={{ fontSize: 18 }}>🧮</span>
              <span className="btn-texto-responsive"> Calculadora</span>
            </button>
            <button className="uiverse-btn clientes-btn" aria-label="Clientes" onClick={() => setMostrarClientes(true)}>
              <span role="img" aria-label="clientes" style={{ fontSize: 18 }}>👥</span>
              <span className="btn-texto-responsive"> Clientes</span>
            </button>
            <button className="uiverse-btn nuevo-btn" aria-label="Nuevo Proyecto" onClick={() => setMostrarNuevo(true)}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>+</span>
              <span className="btn-texto-responsive"> Nuevo Proyecto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="home-main home-stats" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div style={{ flex: 1, background: statBg, borderRadius: 12, padding: '18px 0', textAlign: 'center', boxShadow: statShadow, color: textColor, transition: 'background 0.3s, color 0.3s', width: '100%', minWidth: 0, marginBottom: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#3A29FF' }}>{totalProyectos}</div>
          <div style={{ fontSize: 15, color: subTextColor, marginTop: 2 }}>Proyectos Activos</div>
        </div>
        <div style={{ flex: 1, background: statBg, borderRadius: 12, padding: '18px 0', textAlign: 'center', boxShadow: statShadow, color: textColor, transition: 'background 0.3s, color 0.3s', width: '100%', minWidth: 0, marginBottom: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#27ae60' }}>€{totalPresupuesto.toLocaleString('es-ES')}</div>
          <div style={{ fontSize: 15, color: subTextColor, marginTop: 2 }}>Valor Total</div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros en una card visual */}
      <div style={{ maxWidth: 900, margin: '0 auto', marginBottom: 24 }}>
        <div style={{ background: cardBg, borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(58,41,255,0.10)', padding: 18, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', border: `1.5px solid ${cardBorder}` }}>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o cliente..."
            style={{ flex: 2, minWidth: 180, fontSize: 16, borderRadius: 8, padding: '8px 12px', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: cardBg, color: textColor }}
          />
          <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} style={{ flex: 1, minWidth: 120, fontSize: 15, borderRadius: 8, padding: '8px 10px', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: cardBg, color: textColor }}>
            <option value="">Todos los clientes</option>
            {clientesUnicos.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ flex: 1, minWidth: 120, fontSize: 15, borderRadius: 8, padding: '8px 10px', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: cardBg, color: textColor }}>
            <option value="">Todos los estados</option>
            <option value="Sin pagar">Sin pagar</option>
            <option value="50% adelantado">50% adelantado</option>
            <option value="Pagado">Pagado</option>
          </select>
          <input type="date" value={filtroDesde} onChange={e => setFiltroDesde(e.target.value)} style={{ flex: 1, minWidth: 120, fontSize: 15, borderRadius: 8, padding: '8px 10px', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: cardBg, color: textColor }} placeholder="Desde" />
          <input type="date" value={filtroHasta} onChange={e => setFiltroHasta(e.target.value)} style={{ flex: 1, minWidth: 120, fontSize: 15, borderRadius: 8, padding: '8px 10px', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: cardBg, color: textColor }} placeholder="Hasta" />
        </div>
      </div>

      {/* Lista de proyectos activos */}
      <div className="home-main" style={{ paddingBottom: 24, width: '100%', boxSizing: 'border-box' }}>
        <div className="proyectos-grid">
          {proyectosFiltrados.map(proyecto => (
            <div key={proyecto.id}
              className={
                esMovil
                  ? 'proyecto-card'
                  : `proyecto-card${proyectoFocus === proyecto.id ? ' resaltada' : proyectoFocus !== null ? ' borrosa' : ''}`
              }
              style={{ background: cardBg, borderRadius: 20, boxShadow: '0 12px 36px 0 rgba(58,41,255,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 8, border: `1.5px solid ${cardBorder}`, color: textColor, cursor: 'pointer' }}
              onClick={() => setDetalle(proyecto)}
              onMouseEnter={() => !esMovil && setProyectoFocus(proyecto.id)}
              onMouseLeave={() => !esMovil && setProyectoFocus(null)}
              onFocus={() => !esMovil && setProyectoFocus(proyecto.id)}
              onBlur={() => !esMovil && setProyectoFocus(null)}
              tabIndex={0}
            >
              <div className="proyecto-titulo" style={{ fontWeight: 800, fontSize: 17, marginBottom: 2 }}>{proyecto.nombre}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: subTextColor, fontSize: 15, marginBottom: 2 }}>
                <span className="proyecto-icono" role="img" aria-label="cliente">👤</span> {proyecto.cliente}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3A29FF', fontWeight: 700, fontSize: 16 }}>
                  <span className="proyecto-icono" role="img" aria-label="horas">⏰</span> {proyecto.horas}h
                  <span style={{ color: subTextColor, fontWeight: 400, fontSize: 13, marginLeft: 4 }}>Horas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#27ae60', fontWeight: 700, fontSize: 16 }}>
                  <span className="proyecto-icono" role="img" aria-label="presupuesto">€</span> {proyecto.presupuesto.toLocaleString('es-ES')}
                  <span style={{ color: subTextColor, fontWeight: 400, fontSize: 13, marginLeft: 4 }}>Presupuesto</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <span className={`proyecto-estado ${proyecto.estadoPago === 'Sin pagar' ? 'sin-pagar' : proyecto.estadoPago === '50% adelantado' ? 'adelantado' : 'pagado'}`}>{proyecto.estadoPago === '50% adelantado' ? '50% Adelantado' : proyecto.estadoPago}</span>
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