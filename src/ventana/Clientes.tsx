import { useState, useMemo, useEffect } from 'react';
import BotonModo from './BotonModo';

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  notas: string;
  proyectos: string[];
}

const clientesDemo: Cliente[] = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    telefono: '600123456',
    email: 'juan.perez@email.com',
    direccion: 'Calle Mayor 12, Madrid',
    notas: 'Cliente habitual. Prefiere contacto por email.',
    proyectos: ['Reforma Oficina Central', 'Instalación Cocina Industrial'],
  },
  {
    id: 2,
    nombre: 'María López',
    telefono: '611987654',
    email: 'maria.lopez@email.com',
    direccion: 'Av. Andalucía 45, Sevilla',
    notas: 'Pendiente de enviar presupuesto.',
    proyectos: ['Construcción Almacén'],
  },
];

export default function Clientes({ onVolver }: { onVolver?: () => void } = {}) {
  const [clientes, setClientes] = useState<Cliente[]>(clientesDemo);
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null);
  const [modal, setModal] = useState<{visible: boolean, editar: boolean}>({visible: false, editar: false});
  const [clienteEdit, setClienteEdit] = useState<Cliente | undefined>(undefined);
  const [busqueda, setBusqueda] = useState('');
  const [modoOscuro, setModoOscuro] = useState(() => {
    const guardado = localStorage.getItem('modoOscuroClientes');
    return guardado ? guardado === 'true' : false;
  });

  // Detectar si es móvil
  const esMovil = typeof window !== 'undefined' && window.innerWidth <= 900;
  const [mostrarDetalleMovil, setMostrarDetalleMovil] = useState(false);

  useEffect(() => {
    localStorage.setItem('modoOscuroClientes', modoOscuro.toString());
  }, [modoOscuro]);

  useEffect(() => {
    if (esMovil && seleccionado && !modal.visible) {
      setMostrarDetalleMovil(true);
    } else if (!seleccionado || modal.visible) {
      setMostrarDetalleMovil(false);
    }
  }, [seleccionado, modal.visible, esMovil]);

  // Filtrado de clientes
  const clientesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.telefono.toLowerCase().includes(q)
    );
  }, [clientes, busqueda]);

  // Al abrir la vista, no seleccionar ningún cliente por defecto
  useEffect(() => {
    setSeleccionado(null);
  }, []);

  // Agregar cliente
  const handleAdd = (nuevo: Omit<Cliente, 'id' | 'proyectos'>) => {
    setClientes(cs => [
      ...cs,
      { ...nuevo, id: Date.now(), proyectos: [] }
    ]);
  };

  // Editar cliente
  const handleEdit = (editado: Omit<Cliente, 'id' | 'proyectos'>) => {
    if (!clienteEdit) return;
    setClientes(cs => cs.map(c => c.id === clienteEdit.id ? { ...c, ...editado } : c));
    setSeleccionado(s => s && s.id === clienteEdit.id ? { ...s, ...editado } : s);
  };

  // Eliminar cliente
  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que quieres eliminar este cliente?')) {
      setClientes(cs => cs.filter(c => c.id !== id));
      setSeleccionado(s => (s && s.id === id ? null : s));
    }
  };

  // Función para resaltar texto buscado
  function resaltar(texto: string, query: string) {
    if (!query) return texto;
    const partes = texto.split(new RegExp(`(${query})`, 'gi'));
    return partes.map((parte, i) =>
      parte.toLowerCase() === query.toLowerCase() ? <mark key={i} style={{ background: '#ff94b4', color: '#5227ff', padding: 0 }}>{parte}</mark> : parte
    );
  }

  // Colores y estilos según modo
  const bgColor = modoOscuro ? '#111' : 'linear-gradient(135deg, rgb(243, 246, 250) 0%, #213547 100%)';
  const cardBg = modoOscuro ? '#23272f' : '#fff';
  const cardBorder = modoOscuro ? '#23272f' : '#e0e8f7';
  const textColor = modoOscuro ? '#f7f8fa' : '#222';
  const subTextColor = modoOscuro ? '#b0b8c1' : '#5c6f91';
  const btnBg = modoOscuro ? 'linear-gradient(90deg, #23272f 0%, #3A29FF 100%)' : 'linear-gradient(90deg, #3A8BFF 0%, #A259FF 100%)';
  const btnColor = '#fff';

  // Card para el formulario de cliente
  function CardFormularioCliente(props: any) {
    return (
      <div style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 32, minWidth: 340, maxWidth: 400, width: '100%', border: `1.5px solid ${cardBorder}`, margin: '0 auto', color: textColor }}>
        {props.children}
      </div>
    );
  }

  // Modal modificado para usar card
  function ModalCliente({ visible, onClose, onSave, cliente }: {
    visible: boolean;
    onClose: () => void;
    onSave: (c: Omit<Cliente, 'id' | 'proyectos'>) => void;
    cliente?: Cliente;
  }) {
    const [form, setForm] = useState<Omit<Cliente, 'id' | 'proyectos'>>({
      nombre: cliente?.nombre || '',
      telefono: cliente?.telefono || '',
      email: cliente?.email || '',
      direccion: cliente?.direccion || '',
      notas: cliente?.notas || '',
    });
    const [tocado, setTocado] = useState<{[k: string]: boolean}>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
      setTocado({ nombre: true, telefono: true, email: true, direccion: true });
      if (!form.nombre.trim() || !form.telefono.trim() || !form.email.trim() || !form.direccion.trim()) return;
      onSave(form);
      onClose();
    };

    if (!visible) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(40,40,60,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardFormularioCliente>
          <button onClick={onClose} style={{ position: 'absolute', right: 18, top: 12, background: 'none', border: 'none', fontSize: 22, color: subTextColor, cursor: 'pointer' }}>&times;</button>
          <h3 style={{ marginTop: 0, fontWeight: 800, fontSize: 20 }}>{cliente ? 'Editar cliente' : 'Nuevo cliente'}</h3>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Nombre
            <input name="nombre" value={form.nombre} onChange={handleChange} onBlur={() => setTocado(t => ({...t, nombre: true}))} style={{ width: '100%', marginTop: 6, marginBottom: 8, padding: 10, borderRadius: 8, border: `1.5px solid ${cardBorder}`, fontSize: 15, background: modoOscuro ? '#23272f' : '#fff', color: textColor }} />
            {tocado.nombre && !form.nombre.trim() && <span style={{ color: '#e74c3c', fontSize: 13 }}>Obligatorio</span>}
          </label>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Teléfono
            <input name="telefono" value={form.telefono} onChange={handleChange} onBlur={() => setTocado(t => ({...t, telefono: true}))} style={{ width: '100%', marginTop: 6, marginBottom: 8, padding: 10, borderRadius: 8, border: `1.5px solid ${cardBorder}`, fontSize: 15, background: modoOscuro ? '#23272f' : '#fff', color: textColor }} />
            {tocado.telefono && !form.telefono.trim() && <span style={{ color: '#e74c3c', fontSize: 13 }}>Obligatorio</span>}
          </label>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Email
            <input name="email" value={form.email} onChange={handleChange} onBlur={() => setTocado(t => ({...t, email: true}))} style={{ width: '100%', marginTop: 6, marginBottom: 8, padding: 10, borderRadius: 8, border: `1.5px solid ${cardBorder}`, fontSize: 15, background: modoOscuro ? '#23272f' : '#fff', color: textColor }} />
            {tocado.email && !form.email.trim() && <span style={{ color: '#e74c3c', fontSize: 13 }}>Obligatorio</span>}
          </label>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Dirección
            <input name="direccion" value={form.direccion} onChange={handleChange} onBlur={() => setTocado(t => ({...t, direccion: true}))} style={{ width: '100%', marginTop: 6, marginBottom: 8, padding: 10, borderRadius: 8, border: `1.5px solid ${cardBorder}`, fontSize: 15, background: modoOscuro ? '#23272f' : '#fff', color: textColor }} />
            {tocado.direccion && !form.direccion.trim() && <span style={{ color: '#e74c3c', fontSize: 13 }}>Obligatorio</span>}
          </label>
          <label style={{ fontWeight: 600, fontSize: 15 }}>Notas
            <textarea name="notas" value={form.notas} onChange={handleChange} style={{ width: '100%', marginTop: 6, marginBottom: 8, padding: 10, borderRadius: 8, border: `1.5px solid ${cardBorder}`, fontSize: 15, minHeight: 60, background: modoOscuro ? '#23272f' : '#fff', color: textColor }} />
          </label>
          <button className="uiverse-btn" style={{ marginTop: 12, width: '100%' }} onClick={handleSave}>{cliente ? 'Guardar cambios' : 'Agregar cliente'}</button>
        </CardFormularioCliente>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: esMovil && mostrarDetalleMovil ? 'column' : 'row', minHeight: '100vh', height: '100vh', width: '100vw', background: bgColor, color: textColor, fontFamily: 'inherit', overflow: 'hidden', transition: 'background 0.3s, color 0.3s', position: 'relative' }}>
      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      {/* Sidebar de clientes */}
      {!(esMovil && mostrarDetalleMovil) && (
        <div className="card-clientes" style={{ width: '100%', maxWidth: 400, minWidth: 0, height: '100vh', padding: 0, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', position: 'relative', borderRight: `1.5px solid ${cardBorder}` }}>
          <div style={{ background: cardBg, borderRadius: '0 0 18px 18px', boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', borderBottom: `1.5px solid ${cardBorder}`, padding: '18px 18px 10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
            <button
              className="uiverse-btn"
              aria-label="Volver"
              style={{ background: btnBg, color: btnColor, boxShadow: '0 2px 8px 0 rgba(58,41,255,0.10)', border: 'none', fontSize: 22, padding: '8px 16px', minWidth: 0, minHeight: 0, marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
              onClick={onVolver ? onVolver : () => window.location.reload()}
              title="Volver"
            >
              <span role="img" aria-label="volver">←</span>
            </button>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, flex: 1, textAlign: 'left' }}>Clientes</h2>
            <button className="uiverse-btn" aria-label="Nuevo Cliente" style={{ fontSize: 15, padding: '8px 16px', marginLeft: 8 }} onClick={() => { setModal({ visible: true, editar: false }); setClienteEdit(undefined); setSeleccionado(null); }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>+</span>
              <span className="btn-texto-responsive"> Nuevo</span>
            </button>
          </div>
          <div style={{ padding: '10px 18px 0 18px', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ width: '100%', marginBottom: 14, padding: 10, borderRadius: 8, border: `1.5px solid ${cardBorder}`, fontSize: 15, background: modoOscuro ? '#23272f' : '#fff', color: textColor }}
            />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, minHeight: 120, flex: 1, overflowY: 'auto' }}>
              {clientesFiltrados.length === 0 ? (
                <li style={{ color: subTextColor, textAlign: 'center', marginTop: 30, fontSize: 16 }}>
                  No se encontraron clientes
                </li>
              ) : clientesFiltrados.map(cliente => (
                <li key={cliente.id} style={{ marginBottom: 10 }}>
                  <button
                    className="uiverse-btn"
                    style={{ width: '100%', textAlign: 'left', fontWeight: 600, fontSize: 16, padding: '12px 16px', borderRadius: 10, background: seleccionado?.id === cliente.id ? '#5227ff' : (modoOscuro ? '#23272f' : '#f3f6fa'), color: seleccionado?.id === cliente.id ? '#fff' : textColor, boxShadow: seleccionado?.id === cliente.id ? '0 4px 24px 0 rgba(82,39,255,0.15)' : 'none' }}
                    onClick={() => { setSeleccionado(cliente); if (esMovil) setMostrarDetalleMovil(true); }}
                    onDoubleClick={() => { setModal({ visible: true, editar: true }); setClienteEdit(cliente); }}
                  >
                    {resaltar(cliente.nombre, busqueda) || cliente.nombre}
                    <div style={{ fontSize: 13, color: subTextColor, fontWeight: 400 }}>
                      {resaltar(cliente.email, busqueda)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {clientes.length === 0 && (
              <div style={{ color: subTextColor, textAlign: 'center', marginTop: 30, fontSize: 16 }}>
                No hay clientes registrados aún
              </div>
            )}
          </div>
        </div>
      )}
      {/* Card del detalle del cliente seleccionado */}
      {(seleccionado && !modal.visible && (!esMovil || mostrarDetalleMovil)) && (
        <div className="card-detalle-cliente" style={{ flex: 1, padding: esMovil ? 0 : 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', overflowY: 'auto', background: 'transparent', width: '100vw', position: esMovil ? 'absolute' : 'static', top: 0, left: 0, zIndex: 100 }}>
          {esMovil && (
            <button
              className="uiverse-btn"
              style={{ background: 'none', color: textColor, boxShadow: 'none', border: 'none', fontSize: 24, padding: 0, minWidth: 0, minHeight: 0, margin: '18px 0 0 18px', alignSelf: 'flex-start', position: 'sticky', top: 0, zIndex: 101 }}
              onClick={() => setMostrarDetalleMovil(false)}
              title="Volver al listado"
            >
              <span role="img" aria-label="volver">←</span>
            </button>
          )}
          <div style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 32, minWidth: esMovil ? 0 : 340, maxWidth: 480, width: esMovil ? '96vw' : '100%', border: `1.5px solid ${cardBorder}`, margin: '0 auto', color: textColor, marginTop: esMovil ? 24 : 0 }}>
            <h3 style={{ marginTop: 0, fontWeight: 800, fontSize: 20 }}>{seleccionado.nombre}</h3>
            <div style={{ marginBottom: 10 }}><b>Teléfono:</b> {seleccionado.telefono}</div>
            <div style={{ marginBottom: 10 }}><b>Email:</b> {seleccionado.email}</div>
            <div style={{ marginBottom: 10 }}><b>Dirección:</b> {seleccionado.direccion}</div>
            <div style={{ marginBottom: 10 }}><b>Notas:</b> <span style={{ color: '#7c3aed' }}>{seleccionado.notas}</span></div>
            <div style={{ marginBottom: 10 }}><b>Proyectos asociados:</b>
              <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                {seleccionado.proyectos.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="uiverse-btn" style={{ background: '#7c3aed' }} onClick={() => { setModal({ visible: true, editar: true }); setClienteEdit(seleccionado); }}>Editar</button>
              <button className="uiverse-btn" style={{ background: '#e74c3c' }} onClick={() => handleDelete(seleccionado.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 