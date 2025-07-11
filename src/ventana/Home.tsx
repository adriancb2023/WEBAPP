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
  }), [proyectos]);

  // Navegación móvil
  const navigationItems = [
    {
      id: 'home',
      label: 'Proyectos',
      icon: '📋',
      onClick: () => setVistaActual('home'),
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

  const handleProyectoDelete = (id: number) => {
    setProyectos(ps => ps.filter(p => p.id !== id));
  };

  // Renderizado condicional de vistas
  if (vistaActual === 'nuevo') {
    return <NuevoProyecto 
      onBack={() => setVistaActual('home')} 
      onSave={() => setVistaActual('home')} 
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
      background: 'var(--bg-secondary)',
      paddingBottom: isMobile ? '80px' : '0',
    }}>
      {/* Header */}
      <Header
        title="Proyectos"
        subtitle={`${stats.total} activos`}
        rightActions={[
          {
            icon: '🔍',
            onClick: () => setMostrarFiltros(!mostrarFiltros),
            label: 'Buscar',
          },
          {
            icon: '+',
            onClick: () => setVistaActual('nuevo'),
            label: 'Nuevo proyecto',
          },
        ]}
      />

      {/* Filtros expandibles */}
      {mostrarFiltros && (
        <div style={{
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          padding: 'var(--spacing-md)',
        }}>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-sm)', 
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ flex: 1 }}
            />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{ minWidth: isMobile ? 'auto' : '150px' }}
            >
              <option value="">Todos los estados</option>
              <option value="Sin pagar">Sin pagar</option>
              <option value="50% adelantado">50% adelantado</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div style={{ 
        padding: 'var(--spacing-md)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: 'var(--spacing-sm)',
      }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Total
          </div>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--success-color)' }}>
            €{stats.presupuesto.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Valor
          </div>
        </div>

        {!isMobile && (
          <>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--error-color)' }}>
                {stats.sinPagar}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Sin pagar
              </div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success-color)' }}>
                {stats.pagados}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Pagados
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lista de proyectos */}
      <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)' }}>
        {isMobile ? (
          <SwipeableList>
            {proyectosFiltrados.map(proyecto => (
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
                <TouchableCard onClick={() => handleProyectoClick(proyecto)}>
                  <ProyectoCard proyecto={proyecto} isMobile={isMobile} />
                </TouchableCard>
              </SwipeableListItem>
            ))}
          </SwipeableList>
        ) : (
          <div className="grid">
            {proyectosFiltrados.map(proyecto => (
              <TouchableCard 
                key={proyecto.id}
                onClick={() => handleProyectoClick(proyecto)}
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

// Componente de tarjeta de proyecto optimizado
function ProyectoCard({ proyecto, isMobile }: { proyecto: Proyecto; isMobile: boolean }) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pagado': return { bg: 'var(--success-color)', color: 'white' };
      case 'Sin pagar': return { bg: 'var(--error-color)', color: 'white' };
      case '50% adelantado': return { bg: 'var(--warning-color)', color: 'white' };
      default: return { bg: 'var(--border-color)', color: 'var(--text-primary)' };
    }
  };

  const estadoStyle = getEstadoColor(proyecto.estadoPago);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}>
            {proyecto.nombre}
          </h3>
          <p style={{ 
            margin: '4px 0 0 0', 
            fontSize: '14px', 
            color: 'var(--text-secondary)' 
          }}>
            {proyecto.cliente}
          </p>
        </div>
        
        <span
          style={{
            background: estadoStyle.bg,
            color: estadoStyle.color,
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          {proyecto.estadoPago}
        </span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-sm)',
      }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--success-color)' }}>
            €{proyecto.presupuesto.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Presupuesto
          </div>
        </div>
        
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {proyecto.horas}h
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Horas
          </div>
        </div>

        {!isMobile && (
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {proyecto.fecha}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Fecha
            </div>
          </div>
        )}
      </div>
    </div>
  );
}