import { useState, useEffect, useMemo } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import Header from '../components/Layout/Header';
import MobileNavigation from '../components/Layout/MobileNavigation';
import TouchableCard from '../components/UI/TouchableCard';
import SwipeableList, { SwipeableListItem } from '../components/UI/SwipeableList';
import NuevoProyecto from './NuevoProyecto';
import BotonModo from './BotonModo';
import DetalleProyecto from './DetalleProyecto';
import Clientes from './Clientes';
import Estadisticas from './Estadisticas';
import Calculadora from './Calculadora';
import Aurora from '../componentes/Aurora';

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

const proyectosDemo: Proyecto[] = [
  {
    id: 1,
    nombre: 'Reforma Oficina Central',
    cliente: 'Empresa ABC',
    presupuesto: 25000,
    horas: 45,
    estadoPago: 'Sin pagar',
    fecha: '15/1/2024',
    gastos: 8750,
    facturas: [],
    precioHora: 20,
  },
  {
    id: 2,
    nombre: 'Construcción Almacén',
    cliente: 'Logística XYZ',
    presupuesto: 85000,
    horas: 120,
    estadoPago: '50% adelantado',
    fecha: '1/2/2024',
    gastos: 0,
    facturas: [],
    precioHora: 25,
  },
  {
    id: 3,
    nombre: 'Instalación Cocina Industrial',
    cliente: 'Restaurante Gourmet',
    presupuesto: 35000,
    horas: 32,
    estadoPago: 'Pagado',
    fecha: '15/2/2024',
    gastos: 0,
    facturas: [],
    precioHora: 30,
  },
];

export default function Home() {
  const { isMobile, isTablet } = useResponsive();
  const [proyectos, setProyectos] = useState<Proyecto[]>(proyectosDemo);
  const [modoOscuro, setModoOscuro] = useState(() => {
    const guardado = localStorage.getItem('modoOscuro');
    return guardado ? guardado === 'true' : false;
  });
  
  // Estados de navegación
  const [vistaActual, setVistaActual] = useState<'home' | 'nuevo' | 'detalle' | 'clientes' | 'estadisticas' | 'calculadora'>('home');
  const [detalle, setDetalle] = useState<Proyecto|null>(null);
  
  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Aplicar tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', modoOscuro ? 'dark' : 'light');
    localStorage.setItem('modoOscuro', modoOscuro.toString());
  }, [modoOscuro]);

  // Proyectos filtrados
  const proyectosFiltrados = useMemo(() => {
    return proyectos.filter(p => {
      const coincideBusqueda = !busqueda || 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.cliente.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado = !filtroEstado || p.estadoPago === filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }, [proyectos, busqueda, filtroEstado]);

  // Estadísticas
  const stats = useMemo(() => ({
    total: proyectos.length,
    presupuesto: proyectos.reduce((acc, p) => acc + p.presupuesto, 0),
    sinPagar: proyectos.filter(p => p.estadoPago === 'Sin pagar').length,
    pagados: proyectos.filter(p => p.estadoPago === 'Pagado').length,
    beneficio: proyectos.reduce((acc, p) => acc + (p.presupuesto - p.gastos), 0),
  }), [proyectos]);

  // Navegación móvil
  const navigationItems = [
    {
      id: 'home',
      label: 'Proyectos',
      icon: '📋',
      onClick: () => setVistaActual('home'),
      badge: stats.sinPagar,
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: '👥',
      onClick: () => setVistaActual('clientes'),
    },
    {
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: '📊',
      onClick: () => setVistaActual('estadisticas'),
    },
    {
      id: 'calculadora',
      label: 'Calculadora',
      icon: '🧮',
      onClick: () => setVistaActual('calculadora'),
    },
  ];

  // Handlers
  const handleProyectoClick = (proyecto: Proyecto) => {
    setDetalle(proyecto);
    setVistaActual('detalle');
  };

  const handleProyectoSave = (proyecto: Proyecto) => {
    setProyectos(ps => ps.map(p => p.id === proyecto.id ? proyecto : p));
    setVistaActual('home');
    setDetalle(null);
  };

  const handleNuevoProyecto = (nuevoProyecto: Omit<Proyecto, 'id' | 'horas' | 'gastos' | 'facturas' | 'precioHora'>) => {
    const proyecto: Proyecto = {
      ...nuevoProyecto,
      id: Date.now(),
      horas: 0,
      gastos: 0,
      facturas: [],
      precioHora: 20,
      fecha: new Date().toLocaleDateString('es-ES'),
    };
    setProyectos(ps => [...ps, proyecto]);
    setVistaActual('home');
  };

  const handleProyectoDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      setProyectos(ps => ps.filter(p => p.id !== id));
    }
  };

  // Renderizado condicional de vistas
  if (vistaActual === 'nuevo') {
    return <NuevoProyecto 
      onBack={() => setVistaActual('home')} 
      onSave={handleNuevoProyecto} 
      modoOscuro={modoOscuro} 
      setModoOscuro={setModoOscuro} 
    />;
  }

  if (vistaActual === 'detalle' && detalle) {
    return <DetalleProyecto
      proyecto={detalle}
      modoOscuro={modoOscuro}
      setModoOscuro={setModoOscuro}
      onBack={() => setVistaActual('home')}
      onSave={handleProyectoSave}
    />;
  }

  if (vistaActual === 'clientes') {
    return <Clientes onVolver={() => setVistaActual('home')} />;
  }

  if (vistaActual === 'estadisticas') {
    return <Estadisticas 
      proyectos={proyectos} 
      modoOscuro={modoOscuro} 
      setModoOscuro={setModoOscuro} 
      onVolver={() => setVistaActual('home')} 
    />;
  }

  if (vistaActual === 'calculadora') {
    return <Calculadora 
      modoOscuro={modoOscuro} 
      setModoOscuro={setModoOscuro} 
      onVolver={() => setVistaActual('home')} 
    />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: modoOscuro ? 'var(--bg-secondary)' : 'var(--gradient-bg)',
      paddingBottom: isMobile ? '80px' : '0',
      position: 'relative',
    }}>
      {/* Aurora de fondo sutil */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '30vh', zIndex: 0, opacity: 0.3 }}>
        <Aurora 
          colorStops={modoOscuro ? ["#5227FF", "#A259FF", "#3A8BFF"] : ["#f8fafc", "#e2e8f0", "#cbd5e1"]} 
          blend={0.3} 
          amplitude={0.5} 
          speed={0.3} 
        />
      </div>

      {/* Header */}
      <Header
        title="Mis Proyectos"
        subtitle={`${stats.total} activos • €${stats.presupuesto.toLocaleString()} total`}
        rightActions={[
          {
            icon: '🔍',
            onClick: () => setMostrarFiltros(!mostrarFiltros),
            label: 'Buscar y filtrar',
          },
          {
            icon: '+',
            onClick: () => setVistaActual('nuevo'),
            label: 'Nuevo proyecto',
          },
        ]}
      />

      {/* Filtros expandibles mejorados */}
      {mostrarFiltros && (
        <div className="glass fade-in-up" style={{
          borderBottom: '1px solid var(--border-color)',
          padding: 'var(--spacing-lg)',
          margin: '0 var(--spacing-md)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--spacing-md)',
        }}>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-md)', 
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-xs)',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
              }}>
                Buscar proyectos
              </label>
              <input
                type="text"
                placeholder="Nombre del proyecto o cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ minWidth: isMobile ? 'auto' : '200px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-xs)',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
              }}>
                Estado de pago
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Todos los estados</option>
                <option value="Sin pagar">Sin pagar</option>
                <option value="50% adelantado">50% adelantado</option>
                <option value="Pagado">Pagado</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas mejoradas */}
      <div style={{ 
        padding: 'var(--spacing-md)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: 'var(--spacing-md)',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="card fade-in-up" style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-lg)',
          background: 'var(--gradient-primary)',
          color: 'white',
          border: 'none',
        }}>
          <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Proyectos Activos
          </div>
        </div>
        
        <div className="card fade-in-up" style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-lg)',
          background: 'var(--gradient-success)',
          color: 'white',
          border: 'none',
        }}>
          <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>
            €{stats.presupuesto.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Valor Total
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="card fade-in-up" style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-lg)',
              background: stats.sinPagar > 0 ? 'var(--error-color)' : 'var(--bg-primary)',
              color: stats.sinPagar > 0 ? 'white' : 'var(--text-primary)',
              border: stats.sinPagar > 0 ? 'none' : '1px solid var(--border-color)',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>
                {stats.sinPagar}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                Sin Pagar
              </div>
            </div>
            
            <div className="card fade-in-up" style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-lg)',
              background: 'var(--gradient-success)',
              color: 'white',
              border: 'none',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>
                {stats.pagados}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                Pagados
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lista de proyectos mejorada */}
      <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)', position: 'relative', zIndex: 1 }}>
        {proyectosFiltrados.length === 0 ? (
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)',
            background: 'var(--bg-overlay)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>📋</div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>
              {busqueda || filtroEstado ? 'No se encontraron proyectos' : 'No hay proyectos aún'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              {busqueda || filtroEstado 
                ? 'Intenta cambiar los filtros de búsqueda' 
                : 'Crea tu primer proyecto para comenzar'
              }
            </p>
            {!busqueda && !filtroEstado && (
              <button 
                className="btn-primary"
                onClick={() => setVistaActual('nuevo')}
              >
                ✨ Crear Primer Proyecto
              </button>
            )}
          </div>
        ) : isMobile ? (
          <SwipeableList>
            {proyectosFiltrados.map((proyecto, index) => (
              <SwipeableListItem
                key={proyecto.id}
                rightActions={[
                  {
                    id: 'delete',
                    label: 'Eliminar',
                    icon: '🗑️',
                    color: 'var(--error-color)',
                    onClick: () => handleProyectoDelete(proyecto.id),
                  },
                ]}
              >
                <TouchableCard 
                  onClick={() => handleProyectoClick(proyecto)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="fade-in-up"
                >
                  <ProyectoCard proyecto={proyecto} isMobile={isMobile} />
                </TouchableCard>
              </SwipeableListItem>
            ))}
          </SwipeableList>
        ) : (
          <div className="grid">
            {proyectosFiltrados.map((proyecto, index) => (
              <TouchableCard 
                key={proyecto.id}
                onClick={() => handleProyectoClick(proyecto)}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="fade-in-up"
              >
                <ProyectoCard proyecto={proyecto} isMobile={isMobile} />
              </TouchableCard>
            ))}
          </div>
        )}
      </div>

      {/* Navegación móvil */}
      <MobileNavigation 
        items={navigationItems}
        activeItem={vistaActual}
      />

      {/* Botón modo oscuro */}
      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
    </div>
  );
}

// Componente de tarjeta de proyecto mejorado
function ProyectoCard({ proyecto, isMobile }: { proyecto: Proyecto; isMobile: boolean }) {
  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case 'Pagado': 
        return { 
          bg: 'var(--gradient-success)', 
          color: 'white',
          icon: '✅'
        };
      case 'Sin pagar': 
        return { 
          bg: 'var(--error-color)', 
          color: 'white',
          icon: '⏳'
        };
      case '50% adelantado': 
        return { 
          bg: 'var(--warning-color)', 
          color: 'white',
          icon: '⚡'
        };
      default: 
        return { 
          bg: 'var(--border-color)', 
          color: 'var(--text-primary)',
          icon: '📋'
        };
    }
  };

  const estadoStyle = getEstadoStyle(proyecto.estadoPago);
  const beneficio = proyecto.presupuesto - proyecto.gastos;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      {/* Header del proyecto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: isMobile ? '18px' : '20px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: 'var(--spacing-xs)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {proyecto.nombre}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: '16px' }}>👤</span>
            <p style={{ 
              margin: 0, 
              fontSize: '15px', 
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }}>
              {proyecto.cliente}
            </p>
          </div>
        </div>
        
        <div
          style={{
            background: estadoStyle.bg,
            color: estadoStyle.color,
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span>{estadoStyle.icon}</span>
          {!isMobile && proyecto.estadoPago}
        </div>
      </div>

      {/* Métricas del proyecto */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
        gap: 'var(--spacing-lg)',
        padding: 'var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: isMobile ? '20px' : '24px', 
            fontWeight: 'bold', 
            color: 'var(--primary-color)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            €{proyecto.presupuesto.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            PRESUPUESTO
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: isMobile ? '20px' : '24px', 
            fontWeight: 'bold', 
            color: 'var(--secondary-color)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            {proyecto.horas}h
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            HORAS
          </div>
        </div>

        {!isMobile && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: beneficio >= 0 ? 'var(--success-color)' : 'var(--error-color)',
                marginBottom: 'var(--spacing-xs)',
              }}>
                €{beneficio.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                BENEFICIO
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '16px', 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-xs)',
              }}>
                📅 {proyecto.fecha}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                FECHA
              </div>
            </div>
          </>
        )}
      </div>

      {/* Barra de progreso visual */}
      <div style={{ 
        height: '4px', 
        background: 'var(--border-light)', 
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, (proyecto.horas / 100) * 100)}%`,
          background: 'var(--gradient-primary)',
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}