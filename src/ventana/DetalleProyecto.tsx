import { useState, useEffect } from 'react';
import BotonModo from './BotonModo';
import type { Proyecto } from './Home';

interface DetalleProyectoProps {
  proyecto: Proyecto;
  modoOscuro: boolean;
  setModoOscuro: (v: boolean) => void;
  onBack: () => void;
  onSave: (proyecto: Proyecto) => void;
}

export default function DetalleProyecto({ proyecto, modoOscuro, setModoOscuro, onBack, onSave }: DetalleProyectoProps) {
  const [editado, setEditado] = useState<Proyecto>({...proyecto});
  const [cambios, setCambios] = useState(false);
  const [precioHora, setPrecioHora] = useState<number>(proyecto.precioHora || 0);
  const [facturaActual, setFacturaActual] = useState(0);
  const [facturaVer, setFacturaVer] = useState<number|null>(null);
  const facturas = editado.facturas;
  const hayFacturas = facturas.length > 0;

  useEffect(() => {
    setCambios(JSON.stringify(editado) !== JSON.stringify(proyecto) || precioHora !== (proyecto.precioHora || 0));
  }, [editado, proyecto, precioHora]);

  // Colores según modo
  const bgColor = modoOscuro ? '#111' : 'linear-gradient(135deg, rgb(243, 246, 250) 0%, #213547 100%)';
  const cardBg = modoOscuro ? '#23272f' : '#fff';
  const textColor = modoOscuro ? '#f7f8fa' : '#1a2233';
  const subTextColor = modoOscuro ? '#b0b8c1' : '#6b7a90';

  // Total calculado
  const totalHorasPrecio = editado.horas * precioHora;

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: bgColor, color: textColor, padding: 0, position: 'relative' }}>
      <style>{`
        .detalle-main { max-width: 1100px; margin: 0 auto; padding: 24px 8px 64px 8px; }
        .detalle-card { background: ${cardBg}; border-radius: 16px; box-shadow: 0 4px 24px 0 rgba(58,41,255,0.08); padding: 24px; margin-bottom: 18px; }
        .detalle-label { color: ${subTextColor}; font-weight: 600; font-size: 15px; }
        .detalle-input { background: transparent; color: ${textColor}; border: 1.5px solid ${modoOscuro ? '#444' : '#3A8BFF'}; border-radius: 8px; padding: 8px 12px; font-size: 16px; margin-top: 6px; width: 100%; transition: border 0.2s, color 0.2s; }
        .detalle-input:focus { outline: none; border: 2px solid ${modoOscuro ? '#A259FF' : '#3A29FF'}; }
        .horas-btn { font-size: 28px; border: none; background: linear-gradient(90deg, #3A8BFF 0%, #A259FF 100%); color: #fff; border-radius: 50%; width: 48px; height: 48px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px 0 rgba(58,41,255,0.10); margin: 0 8px; transition: filter 0.18s; }
        .horas-btn:focus, .horas-btn:hover { filter: brightness(1.15); outline: 2px solid ${modoOscuro ? '#A259FF' : '#3A29FF'}; }
        .horas-btn:active { filter: brightness(0.95); }
        .horas-btn { border: 2px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}; }
        .horas-num { font-weight: 800; font-size: 28px; min-width: 48px; text-align: center; }
        .guardar-btn { display: block; margin: 32px auto 0 auto; background: linear-gradient(90deg, #3A8BFF 0%, #A259FF 100%); color: #fff; border: none; border-radius: 12px; padding: 18px 44px; font-weight: 700; font-size: 20px; box-shadow: 0 4px 24px 0 rgba(58,41,255,0.10); cursor: pointer; transition: background 0.2s, color 0.2s, box-shadow 0.2s; opacity: 0.97; }
        .guardar-btn:hover { filter: brightness(1.08); opacity: 1; }
        .factura-carrusel { display: flex; align-items: center; justify-content: center; gap: 18px; min-height: 120px; }
        .factura-preview { width: 90px; height: 120px; background: #f3f6fa; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #3A8BFF; box-shadow: 0 2px 8px 0 rgba(58,41,255,0.08); }
        @media (max-width: 600px) { .detalle-main { padding: 10px 2px 64px 2px; } .guardar-btn { padding: 12px 18px; font-size: 16px; } }
      `}</style>
      <div className="detalle-main">
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#3A29FF', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginBottom: 18 }}>&larr; Volver</button>
        <div className="detalle-card">
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 26 }}>{editado.nombre}</h2>
          <div style={{ color: subTextColor, fontSize: 16, marginBottom: 8 }}>{editado.cliente}</div>
          <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="detalle-label">Horas Totales</div>
              <div style={{ fontWeight: 700, fontSize: 22, marginTop: 4 }}>{editado.horas}h</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="detalle-label">Gasto Total</div>
              <div style={{ fontWeight: 700, fontSize: 22, marginTop: 4, color: '#27ae60' }}>€{editado.gastos.toLocaleString('es-ES')}</div>
            </div>
          </div>
        </div>
        {/* Resumen financiero */}
        <div className="detalle-card">
          <div className="detalle-label" style={{ marginBottom: 8 }}>€ Resumen Financiero</div>
          <div>Presupuesto: <span style={{ fontWeight: 700 }}>€{editado.presupuesto.toLocaleString('es-ES')}</span></div>
          <div>Gastos: <span style={{ color: '#e74c3c', fontWeight: 700 }}>-€{editado.gastos.toLocaleString('es-ES')}</span></div>
          <div>Beneficio: <span style={{ color: '#27ae60', fontWeight: 700 }}>€{(editado.presupuesto - editado.gastos).toLocaleString('es-ES')}</span></div>
          <div style={{ marginTop: 14 }}>
            <span className="detalle-label">Precio por hora: </span>
            <input type="number" min={0} value={precioHora} onChange={e => setPrecioHora(Number(e.target.value))} className="detalle-input" style={{ width: 100, marginLeft: 8, marginRight: 8, textAlign: 'center' }} />
            <span className="detalle-label">Total horas x precio: </span>
            <span style={{ fontWeight: 700, color: '#3A29FF', marginLeft: 6 }}>€{totalHorasPrecio.toLocaleString('es-ES')}</span>
          </div>
        </div>
        {/* Control de horas */}
        <div className="detalle-card">
          <div className="detalle-label" style={{ marginBottom: 8 }}>Control de Horas</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            <button className="horas-btn" onClick={() => setEditado((e: Proyecto) => ({ ...e, horas: Math.max(0, e.horas - 8) }))}>-8</button>
            <button className="horas-btn" onClick={() => setEditado((e: Proyecto) => ({ ...e, horas: Math.max(0, e.horas - 4) }))}>-4</button>
            <button className="horas-btn" onClick={() => setEditado((e: Proyecto) => ({ ...e, horas: Math.max(0, e.horas - 2) }))}>-2</button>
            <button className="horas-btn" onClick={() => setEditado((e: Proyecto) => ({ ...e, horas: Math.max(0, e.horas - 1) }))}>-</button>
            <span className="horas-num">{editado.horas}</span>
            <button className="horas-btn" onClick={() => setEditado((e: Proyecto) => ({ ...e, horas: e.horas + 1 }))}>+</button>
            <button className="horas-btn" onClick={() => setEditado((e: Proyecto) => ({ ...e, horas: e.horas + 2 }))}>+2</button>
            <button className="horas-btn" onClick={() => setEditado((e: Proyecto) => ({ ...e, horas: e.horas + 4 }))}>+4</button>
            <button className="horas-btn" onClick={() => setEditado((e: Proyecto) => ({ ...e, horas: e.horas + 8 }))}>+8</button>
          </div>
        </div>
        {/* Estado de pago */}
        <div className="detalle-card">
          <div className="detalle-label" style={{ marginBottom: 8 }}>Estado de Pago</div>
          <select className="detalle-input" value={editado.estadoPago} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditado(ed => ({ ...ed, estadoPago: e.target.value as any }))}>
            <option value="Sin pagar">Sin pagar</option>
            <option value="50% adelantado">50% adelantado</option>
            <option value="Pagado">Pagado</option>
          </select>
        </div>
        {/* Facturas (lista con modal) */}
        <div className="detalle-card">
          <div className="detalle-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Facturas ({facturas.length})</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: modoOscuro ? '#23272f' : '#f3f6fa', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, borderRadius: 8, padding: '6px 14px', fontWeight: 600, color: modoOscuro ? '#A259FF' : '#3A29FF', fontSize: 15 }}>
              <span style={{ fontSize: 18 }}>+ Añadir factura</span>
              <input type="file" accept="image/*,application/pdf" capture="environment" style={{ display: 'none' }} onChange={e => {
                if (!e.target.files || !e.target.files[0]) return;
                // Aquí puedes gestionar la subida o previsualización
                alert('Funcionalidad de subida de factura aún no implementada.');
              }} />
            </label>
          </div>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {facturas.length === 0 && <li style={{ color: subTextColor }}>No hay facturas</li>}
            {facturas.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, background: modoOscuro ? '#181a20' : '#fafdff', borderRadius: 8, padding: '10px 14px', boxShadow: modoOscuro ? '0 2px 8px 0 rgba(162,89,255,0.10)' : '0 2px 8px 0 rgba(58,41,255,0.08)' }}>
                <span style={{ fontWeight: 600, color: modoOscuro ? '#fff' : '#222' }}>{f.nombre}</span>
                <span style={{ color: subTextColor, fontSize: 13 }}>{f.fecha}</span>
                <span style={{ color: f.tipo === 'pdf' ? '#3A29FF' : '#A259FF', fontSize: 13, fontWeight: 700 }}>{f.tipo === 'pdf' ? 'PDF' : 'IMG'}</span>
                <button onClick={() => setFacturaVer(i)} style={{ marginLeft: 'auto', background: 'linear-gradient(90deg, #3A8BFF 0%, #A259FF 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: modoOscuro ? '0 2px 8px 0 rgba(162,89,255,0.10)' : '0 2px 8px 0 rgba(58,41,255,0.08)' }}>Ver</button>
              </li>
            ))}
          </ul>
          {/* Modal de previsualización */}
          {facturaVer !== null && facturas[facturaVer] && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,20,30,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320, maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 8px 32px 0 rgba(58,41,255,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <button onClick={() => setFacturaVer(null)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#3A29FF', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                <div style={{ marginBottom: 12, fontWeight: 700 }}>{facturas[facturaVer].nombre}</div>
                {facturas[facturaVer].tipo === 'pdf' ? (
                  <iframe src={facturas[facturaVer].nombre} title={facturas[facturaVer].nombre} style={{ width: '70vw', height: '70vh', minWidth: 320, minHeight: 320, border: 'none', borderRadius: 8, background: '#f3f6fa' }} />
                ) : (
                  <img src={facturas[facturaVer].nombre} alt={facturas[facturaVer].nombre} style={{ maxWidth: '70vw', maxHeight: '70vh', borderRadius: 10, background: '#f3f6fa' }} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {cambios && (
        <button className="guardar-btn" onClick={() => onSave({ ...editado, precioHora })}>
          Guardar cambios
        </button>
      )}
      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
    </div>
  );
} 