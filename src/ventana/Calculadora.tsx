import { useState } from 'react';
import BotonModo from './BotonModo';

// PON AQUÍ TU API KEY DE PILOTERR
const PILOTERR_API_KEY = 'AQUI_TU_API_KEY'; // <-- Sustituye esto por tu API key

// Busca productos en Leroy Merlin usando Piloterr
const buscarLeroyMerlin = async (query: string) => {
  if (!PILOTERR_API_KEY || PILOTERR_API_KEY === 'AQUI_TU_API_KEY') {
    alert('Debes poner tu API key de Piloterr en el código.');
    return [];
  }
  const url = `https://piloterr.com/api/v2/leroy/merlin-search?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'x-api-key': PILOTERR_API_KEY
    }
  });
  if (!res.ok) return [];
  const data = await res.json();
  // Adaptar los resultados al formato esperado
  return (data?.products || []).map((p: any, i: number) => ({
    id: p.product_id || i,
    nombre: p.name,
    precio: p.price,
    unidad: p.unit || '',
    imagen: p.images?.[0],
    url: p.url
  }));
};

export default function Calculadora({ modoOscuro, setModoOscuro, onVolver }: {
  modoOscuro: boolean;
  setModoOscuro: (v: boolean) => void;
  onVolver: () => void;
}) {
  const [busqueda, setBusqueda] = useState('');
  const [materiales, setMateriales] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<{nombre: string, precio: number, cantidad: number, unidad: string, imagen?: string, url?: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const bgColor = modoOscuro ? '#111' : 'linear-gradient(135deg, rgb(243, 246, 250) 0%, #213547 100%)';
  const cardBg = modoOscuro ? '#23272f' : '#fff';
  const textColor = modoOscuro ? '#f7f8fa' : '#1a2233';
  const subTextColor = modoOscuro ? '#b0b8c1' : '#6b7a90';

  const buscarMateriales = async () => {
    setLoading(true);
    const res = await buscarLeroyMerlin(busqueda);
    setMateriales(res);
    setLoading(false);
  };

  const agregarMaterial = (mat: any) => {
    setCarrito(cs => {
      const idx = cs.findIndex(c => c.nombre === mat.nombre);
      if (idx >= 0) {
        const nuevo = [...cs];
        nuevo[idx].cantidad += 1;
        return nuevo;
      }
      return [...cs, { nombre: mat.nombre, precio: mat.precio, cantidad: 1, unidad: mat.unidad, imagen: mat.imagen, url: mat.url }];
    });
  };

  const cambiarCantidad = (nombre: string, cantidad: number) => {
    setCarrito(cs => cs.map(c => c.nombre === nombre ? { ...c, cantidad: Math.max(1, cantidad) } : c));
  };

  const eliminarMaterial = (nombre: string) => {
    setCarrito(cs => cs.filter(c => c.nombre !== nombre));
  };

  const total = carrito.reduce((acc, m) => acc + m.precio * m.cantidad, 0);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: bgColor, color: textColor, fontFamily: 'inherit', transition: 'background 0.3s, color 0.3s', position: 'relative' }}>
      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 8px 64px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button onClick={onVolver} style={{ background: 'none', border: 'none', color: '#3A29FF', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>&larr; Volver</button>
          <h1 style={{ fontWeight: 800, fontSize: 28, margin: 0, flex: 1 }}>Calculadora de materiales</h1>
        </div>
        {/* Buscador de materiales */}
        <div style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 18, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar material Leroy Merlin..." style={{ flex: 1, fontSize: 16, borderRadius: 8, padding: '8px 12px', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: modoOscuro ? '#23272f' : '#fff', color: textColor }} />
            <button className="uiverse-btn" style={{ fontSize: 16, padding: '8px 18px', marginLeft: 4 }} onClick={buscarMateriales} disabled={loading || !busqueda.trim()}>{loading ? 'Buscando...' : 'Buscar'}</button>
          </div>
          {materiales.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0 0' }}>
              {materiales.map(mat => (
                <li key={mat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, background: modoOscuro ? '#181a20' : '#fafdff', borderRadius: 8, padding: '10px 14px', boxShadow: modoOscuro ? '0 2px 8px 0 rgba(162,89,255,0.10)' : '0 2px 8px 0 rgba(58,41,255,0.08)' }}>
                  {mat.imagen && <img src={mat.imagen} alt={mat.nombre} style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, background: '#fff' }} />}
                  <span style={{ fontWeight: 600 }}>{mat.nombre}</span>
                  <span style={{ color: subTextColor, fontSize: 14 }}>€{mat.precio} {mat.unidad && `/ ${mat.unidad}`}</span>
                  <a href={mat.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3A8BFF', fontSize: 13, textDecoration: 'underline' }}>Ver</a>
                  <button className="uiverse-btn" style={{ marginLeft: 'auto', background: 'linear-gradient(90deg, #3A8BFF 0%, #A259FF 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }} onClick={() => agregarMaterial(mat)}>Añadir</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Carrito/calculadora */}
        <div style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 18, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: textColor }}>Presupuesto</h2>
          {carrito.length === 0 ? (
            <div style={{ color: subTextColor }}>Añade materiales para calcular el presupuesto.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {carrito.map(mat => (
                <li key={mat.nombre} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, background: modoOscuro ? '#181a20' : '#fafdff', borderRadius: 8, padding: '10px 14px', boxShadow: modoOscuro ? '0 2px 8px 0 rgba(162,89,255,0.10)' : '0 2px 8px 0 rgba(58,41,255,0.08)' }}>
                  {mat.imagen && <img src={mat.imagen} alt={mat.nombre} style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6, background: '#fff' }} />}
                  <span style={{ fontWeight: 600 }}>{mat.nombre}</span>
                  <input type="number" min={1} value={mat.cantidad} onChange={e => cambiarCantidad(mat.nombre, Number(e.target.value))} style={{ width: 60, fontSize: 15, borderRadius: 8, padding: '6px 8px', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: modoOscuro ? '#23272f' : '#fff', color: textColor, textAlign: 'center' }} />
                  <span style={{ color: subTextColor, fontSize: 14 }}>{mat.unidad}</span>
                  <span style={{ color: '#3A8BFF', fontWeight: 700, fontSize: 15 }}>€{(mat.precio * mat.cantidad).toLocaleString('es-ES')}</span>
                  <button className="uiverse-btn" style={{ marginLeft: 'auto', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }} onClick={() => eliminarMaterial(mat.nombre)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: 18, fontWeight: 800, fontSize: 22, color: '#27ae60', textAlign: 'right' }}>Total: €{total.toLocaleString('es-ES')}</div>
        </div>
      </div>
    </div>
  );
} 