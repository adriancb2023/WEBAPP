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

export default function Home() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [modoOscuro, setModoOscuro] = useState(() => {
    const guardado = localStorage.getItem('modoOscuro');
    return guardado ? guardado === 'true' : false;
  });
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [detalle, setDetalle] = useState<Proyecto|null>(null);
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Detectar si es móvil
  const esMovil = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Leer preferencia de localStorage al iniciar
  useEffect(() => {
    localStorage.setItem('modoOscuro', modoOscuro.toString());
  }, [modoOscuro]);

  // Estadísticas rápidas
  const totalProyectos = proyectos.length;
  const totalPresupuesto = proyectos.reduce((acc, p) => acc + p.presupuesto, 0);
  const totalGastos = proyectos.reduce((acc, p) => acc + p.gastos, 0);
  const beneficioTotal = totalPresupuesto - totalGastos;

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
    <div className={`home-container ${modoOscuro ? 'dark' : 'light'}`}>
      <style>{`
        /* Variables CSS para modo claro y oscuro */
        .home-container {
          --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          --font-weight-normal: 400;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
          --font-weight-bold: 700;
          --font-weight-extrabold: 800;
          
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --radius-xl: 20px;
          
          --spacing-xs: 4px;
          --spacing-sm: 8px;
          --spacing-md: 16px;
          --spacing-lg: 24px;
          --spacing-xl: 32px;
          --spacing-2xl: 48px;
          
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
          --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.15);
          
          font-family: var(--font-primary);
          min-height: 100vh;
          width: 100vw;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Modo claro */
        .home-container.light {
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --bg-tertiary: #f1f5f9;
          --bg-accent: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --text-tertiary: #94a3b8;
          --text-accent: #6366f1;
          
          --border-primary: #e2e8f0;
          --border-secondary: #cbd5e1;
          
          --card-bg: rgba(255, 255, 255, 0.8);
          --card-border: rgba(226, 232, 240, 0.6);
          --card-shadow: var(--shadow-md);
          
          --button-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          --button-secondary: #f1f5f9;
          --button-text: #ffffff;
          --button-text-secondary: #475569;
          
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        /* Modo oscuro */
        .home-container.dark {
          --bg-primary: #0f172a;
          --bg-secondary: #1e293b;
          --bg-tertiary: #334155;
          --bg-accent: linear-gradient(135deg, #4c1d95 0%, #581c87 100%);
          
          --text-primary: #f8fafc;
          --text-secondary: #cbd5e1;
          --text-tertiary: #94a3b8;
          --text-accent: #a78bfa;
          
          --border-primary: #334155;
          --border-secondary: #475569;
          
          --card-bg: rgba(30, 41, 59, 0.8);
          --card-border: rgba(51, 65, 85, 0.6);
          --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          
          --button-primary: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          --button-secondary: #334155;
          --button-text: #ffffff;
          --button-text-secondary: #cbd5e1;
          
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        /* Layout principal */
        .home-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-md);
          min-height: 100vh;
        }

        /* Header */
        .home-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-primary);
          padding: var(--spacing-lg) 0;
          margin-bottom: var(--spacing-xl);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-lg);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: var(--button-primary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--button-text);
        }

        .header-text h1 {
          font-size: 28px;
          font-weight: var(--font-weight-extrabold);
          color: var(--text-primary);
          margin: 0;
          line-height: 1.2;
        }

        .header-text p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 2px 0 0 0;
          font-weight: var(--font-weight-medium);
        }

        .header-actions {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        /* Botones */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: 12px 20px;
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-semibold);
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          min-height: 44px;
          justify-content: center;
        }

        .btn-primary {
          background: var(--button-primary);
          color: var(--button-text);
          box-shadow: var(--shadow-sm);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .btn-secondary {
          background: var(--button-secondary);
          color: var(--button-text-secondary);
          border: 1px solid var(--border-primary);
        }

        .btn-secondary:hover {
          background: var(--bg-tertiary);
        }

        .btn-icon {
          font-size: 16px;
        }

        /* Estadísticas */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .stat-card {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          text-align: center;
          box-shadow: var(--card-shadow);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .stat-value {
          font-size: 32px;
          font-weight: var(--font-weight-extrabold);
          color: var(--text-accent);
          margin-bottom: var(--spacing-xs);
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: var(--font-weight-medium);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Filtros */
        .filters-section {
          margin-bottom: var(--spacing-xl);
        }

        .filters-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filters-toggle:hover {
          background: var(--bg-tertiary);
        }

        .filters-content {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-top: var(--spacing-md);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .filter-input {
          padding: 12px 16px;
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: var(--font-weight-medium);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-input:focus {
          outline: none;
          border-color: var(--text-accent);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        /* Grid de proyectos */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .project-card {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--card-shadow);
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--text-accent);
        }

        .project-header {
          margin-bottom: var(--spacing-md);
        }

        .project-title {
          font-size: 18px;
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs) 0;
          line-height: 1.3;
        }

        .project-client {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: var(--font-weight-medium);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .project-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .project-stat {
          text-align: center;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .project-stat-value {
          font-size: 20px;
          font-weight: var(--font-weight-bold);
          color: var(--text-accent);
          margin-bottom: var(--spacing-xs);
        }

        .project-stat-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: var(--font-weight-medium);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .project-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .project-status {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-paid {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .status-partial {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-unpaid {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .project-date {
          font-size: 12px;
          color: var(--text-tertiary);
          font-weight: var(--font-weight-medium);
        }

        /* Estado vacío */
        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: var(--spacing-lg);
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin: 0 0 var(--spacing-sm) 0;
        }

        .empty-state p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .home-main {
            padding: 0 var(--spacing-sm);
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-md);
          }

          .header-title {
            justify-content: center;
          }

          .header-actions {
            justify-content: center;
          }

          .btn {
            flex: 1;
            min-width: 0;
          }

          .btn-text {
            display: none;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-md);
          }

          .stat-value {
            font-size: 24px;
          }

          .filters-content {
            grid-template-columns: 1fr;
          }

          .projects-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .project-card {
            padding: var(--spacing-md);
          }

          .project-stats {
            grid-template-columns: 1fr;
            gap: var(--spacing-sm);
          }
        }

        @media (max-width: 480px) {
          .header-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .header-text h1 {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: var(--spacing-md);
          }

          .stat-value {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="home-main">
        {/* Header */}
        <header className="home-header">
          <div className="header-content">
            <div className="header-title">
              <div className="header-icon">
                📋
              </div>
              <div className="header-text">
                <h1>Proyectos</h1>
                <p>{totalProyectos} proyectos activos</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={() => setMostrarEstadisticas(true)}>
                <span className="btn-icon">📊</span>
                <span className="btn-text">Estadísticas</span>
              </button>
              <button className="btn btn-secondary" onClick={() => setMostrarCalculadora(true)}>
                <span className="btn-icon">🧮</span>
                <span className="btn-text">Calculadora</span>
              </button>
              <button className="btn btn-secondary" onClick={() => setMostrarClientes(true)}>
                <span className="btn-icon">👥</span>
                <span className="btn-text">Clientes</span>
              </button>
              <button className="btn btn-primary" onClick={() => setMostrarNuevo(true)}>
                <span className="btn-icon">+</span>
                <span className="btn-text">Nuevo Proyecto</span>
              </button>
            </div>
          </div>
        </header>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totalProyectos}</div>
            <div className="stat-label">Proyectos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">€{totalPresupuesto.toLocaleString('es-ES')}</div>
            <div className="stat-label">Ingresos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">€{totalGastos.toLocaleString('es-ES')}</div>
            <div className="stat-label">Gastos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">€{beneficioTotal.toLocaleString('es-ES')}</div>
            <div className="stat-label">Beneficio</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-toggle" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
                Filtros y búsqueda
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {proyectosFiltrados.length} de {totalProyectos} proyectos
              </p>
            </div>
            <span style={{ fontSize: '20px', color: 'var(--text-secondary)', transform: mostrarFiltros ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              ▼
            </span>
          </div>
          
          {mostrarFiltros && (
            <div className="filters-content">
              <input
                type="text"
                className="filter-input"
                placeholder="Buscar por nombre o cliente..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              <select
                className="filter-input"
                value={filtroCliente}
                onChange={e => setFiltroCliente(e.target.value)}
              >
                <option value="">Todos los clientes</option>
                {clientesUnicos.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="filter-input"
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="Sin pagar">Sin pagar</option>
                <option value="50% adelantado">50% adelantado</option>
                <option value="Pagado">Pagado</option>
              </select>
              <input
                type="date"
                className="filter-input"
                value={filtroDesde}
                onChange={e => setFiltroDesde(e.target.value)}
                placeholder="Desde"
              />
              <input
                type="date"
                className="filter-input"
                value={filtroHasta}
                onChange={e => setFiltroHasta(e.target.value)}
                placeholder="Hasta"
              />
            </div>
          )}
        </div>

        {/* Lista de proyectos */}
        {proyectosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No hay proyectos</h3>
            <p>Crea tu primer proyecto para comenzar</p>
          </div>
        ) : (
          <div className="projects-grid">
            {proyectosFiltrados.map(proyecto => (
              <div
                key={proyecto.id}
                className="project-card"
                onClick={() => setDetalle(proyecto)}
              >
                <div className="project-header">
                  <h3 className="project-title">{proyecto.nombre}</h3>
                  <div className="project-client">
                    <span>👤</span>
                    {proyecto.cliente}
                  </div>
                </div>

                <div className="project-stats">
                  <div className="project-stat">
                    <div className="project-stat-value">{proyecto.horas}h</div>
                    <div className="project-stat-label">Horas</div>
                  </div>
                  <div className="project-stat">
                    <div className="project-stat-value">€{proyecto.presupuesto.toLocaleString('es-ES')}</div>
                    <div className="project-stat-label">Presupuesto</div>
                  </div>
                </div>

                <div className="project-footer">
                  <span className={`project-status ${
                    proyecto.estadoPago === 'Pagado' ? 'status-paid' :
                    proyecto.estadoPago === '50% adelantado' ? 'status-partial' :
                    'status-unpaid'
                  }`}>
                    {proyecto.estadoPago === '50% adelantado' ? '50% Adelantado' : proyecto.estadoPago}
                  </span>
                  <span className="project-date">{proyecto.fecha}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
    </div>
  );
}