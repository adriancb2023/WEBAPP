import { useState } from 'react';
import BotonModo from './BotonModo';

interface NuevoProyectoProps {
  onBack: () => void;
  onSave: (proyecto: any) => void;
  modoOscuro: boolean;
  setModoOscuro: (v: boolean) => void;
}

const estadosPago = [
  'Sin pagar',
  '50% adelantado',
  'Pagado',
];

export default function NuevoProyecto({ onBack, onSave, modoOscuro, setModoOscuro }: NuevoProyectoProps) {
  const [nombre, setNombre] = useState('');
  const [cliente, setCliente] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [estadoPago, setEstadoPago] = useState(estadosPago[0]);
  const [tocado, setTocado] = useState<{[k:string]: boolean}>({});

  // Colores según modo
  const bgColor = modoOscuro ? '#181a1b' : 'linear-gradient(135deg, #f3f6fa 0%, #eaf1fb 100%)';
  const cardBg = modoOscuro ? '#23272f' : '#fafdff';
  const cardBorder = modoOscuro ? '#23272f' : '#e0e8f7';
  const textColor = modoOscuro ? '#f7f8fa' : '#1a2233';
  const inputBg = modoOscuro ? '#23272f' : '#f3f6fa';
  const inputBorder = modoOscuro ? '#444' : '#e0e8f7';
  const labelColor = modoOscuro ? '#b0b8c1' : '#5c6f91';

  const validar = () => {
    return nombre.trim() && cliente.trim() && Number(presupuesto) > 0;
  };

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100vw', height: '100vh', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s', overflow: 'hidden' }}>
      <style>{`
        .nuevo-form-card { width: 100%; max-width: 440px; background: ${cardBg}; border-radius: 18px; box-shadow: 0 8px 32px 0 rgba(58,41,255,0.10); padding: 28px; display: flex; flex-direction: column; gap: 22px; color: ${textColor}; border: 1.5px solid ${cardBorder}; margin: 0 auto; }
        .nuevo-form-label { font-weight: 600; color: ${labelColor}; font-size: 15px; }
        .nuevo-form-input, .nuevo-form-select { width: 100%; margin-top: 6px; padding: 12px; border-radius: 10px; border: 1.5px solid ${inputBorder}; font-size: 16px; background: ${inputBg}; outline: none; font-weight: 500; color: ${textColor}; transition: background 0.2s, color 0.2s; }
        .nuevo-form-input:focus, .nuevo-form-select:focus { border: 1.5px solid #3A8BFF; }
        @media (max-width: 600px) { .nuevo-form-card { padding: 10px; max-width: 98vw; min-width: 0; } }
      `}</style>
      <div className="nuevo-form-card">
        <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#3A29FF', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginBottom: 8 }}>&larr; Volver</button>
        <h2 style={{ fontWeight: 800, fontSize: 24, margin: 0, color: textColor }}>Nuevo Proyecto</h2>
        <label className="nuevo-form-label">Nombre del proyecto
          <input className="nuevo-form-input" type="text" value={nombre} onChange={e => setNombre(e.target.value)} onBlur={() => setTocado(t => ({...t, nombre: true}))} />
          {tocado.nombre && !nombre.trim() && <span style={{ color: '#e74c3c', fontSize: 13 }}>Este campo es obligatorio</span>}
        </label>
        <label className="nuevo-form-label">Cliente
          <input className="nuevo-form-input" type="text" value={cliente} onChange={e => setCliente(e.target.value)} onBlur={() => setTocado(t => ({...t, cliente: true}))} />
          {tocado.cliente && !cliente.trim() && <span style={{ color: '#e74c3c', fontSize: 13 }}>Este campo es obligatorio</span>}
        </label>
        <label className="nuevo-form-label">Presupuesto (€)
          <input className="nuevo-form-input" type="number" min={0} value={presupuesto} onChange={e => setPresupuesto(e.target.value)} onBlur={() => setTocado(t => ({...t, presupuesto: true}))} />
          {tocado.presupuesto && (!presupuesto || Number(presupuesto) <= 0) && <span style={{ color: '#e74c3c', fontSize: 13 }}>Introduce un presupuesto válido</span>}
        </label>
        <label className="nuevo-form-label">Estado de pago
          <select className="nuevo-form-select" value={estadoPago} onChange={e => setEstadoPago(e.target.value)}>
            {estadosPago.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </label>
        <button disabled={!validar()} onClick={() => onSave({ nombre, cliente, presupuesto: Number(presupuesto), estadoPago })} style={{ marginTop: 10, padding: 14, borderRadius: 10, fontWeight: 700, fontSize: 17, background: 'linear-gradient(90deg, #3A8BFF 0%, #A259FF 100%)', color: '#fff', border: 'none', cursor: validar() ? 'pointer' : 'not-allowed', boxShadow: '0 2px 8px 0 rgba(58,41,255,0.10)', opacity: validar() ? 1 : 0.6, transition: 'opacity 0.2s' }}>
          Guardar Proyecto
        </button>
      </div>
      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
    </div>
  );
} 