import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useState, useMemo } from 'react';
import BotonModo from './BotonModo';
import type { Proyecto } from './Home';

// Recibe los proyectos y el modo oscuro como props
export default function Estadisticas({ proyectos, modoOscuro, setModoOscuro, onVolver }: {
  proyectos: Proyecto[];
  modoOscuro: boolean;
  setModoOscuro: (v: boolean) => void;
  onVolver: () => void;
}) {
  // Obtener meses disponibles a partir de los proyectos
  const mesesDisponibles = useMemo(() => {
    const meses = new Set<string>();
    proyectos.forEach(p => {
      const [d, m, y] = p.fecha.split('/');
      meses.add(`${y}-${m.padStart(2, '0')}`);
    });
    return Array.from(meses).sort().reverse();
  }, [proyectos]);

  // Por defecto, último mes disponible
  const [mes, setMes] = useState(mesesDisponibles[0] || '');

  // Filtrar proyectos del mes seleccionado
  const proyectosMes = useMemo(() => {
    return proyectos.filter(p => {
      const [d, m, y] = p.fecha.split('/');
      return `${y}-${m.padStart(2, '0')}` === mes;
    });
  }, [proyectos, mes]);

  // Preparar datos para gráficas
  const datos = useMemo(() => {
    // Agrupar por día
    const dias: {[dia: string]: {ingresos: number, gastos: number, horas: number}} = {};
    proyectosMes.forEach(p => {
      const [d, m, y] = p.fecha.split('/');
      const dia = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      if (!dias[dia]) dias[dia] = { ingresos: 0, gastos: 0, horas: 0 };
      dias[dia].ingresos += p.presupuesto;
      dias[dia].gastos += p.gastos;
      dias[dia].horas += p.horas;
    });
    // Convertir a array ordenado por día
    const arr = Object.entries(dias).map(([dia, v]) => ({ dia, ...v, ingresosHora: v.horas ? v.ingresos / v.horas : 0 }));
    arr.sort((a, b) => a.dia.localeCompare(b.dia));
    return arr;
  }, [proyectosMes]);

  // Colores y estilos
  const bgColor = modoOscuro ? '#111' : 'linear-gradient(135deg, rgb(243, 246, 250) 0%, #213547 100%)';
  const cardBg = modoOscuro ? '#23272f' : '#fff';
  const textColor = modoOscuro ? '#f7f8fa' : '#1a2233';
  const subTextColor = modoOscuro ? '#b0b8c1' : '#6b7a90';

  // Simulación de rol admin (en el futuro se conectará con la gestión de usuarios)
  const esAdmin = true; // Cambia a false para probar como usuario normal

  // Calcular datos para el dashboard
  const totalProyectos = proyectosMes.length;
  const totalIngresos = proyectosMes.reduce((acc, p) => acc + p.presupuesto, 0);
  const totalGastos = proyectosMes.reduce((acc, p) => acc + p.gastos, 0);
  const totalBeneficio = totalIngresos - totalGastos;
  // Simular próximos vencimientos (proyectos con fecha >= hoy)
  const hoy = new Date();
  const vencimientos = proyectosMes.filter(p => {
    const [d, m, y] = p.fecha.split('/');
    const fecha = new Date(Number(y), Number(m) - 1, Number(d));
    return fecha >= hoy;
  }).sort((a, b) => {
    const [da, ma, ya] = a.fecha.split('/');
    const [db, mb, yb] = b.fecha.split('/');
    return new Date(Number(ya), Number(ma) - 1, Number(da)).getTime() - new Date(Number(yb), Number(mb) - 1, Number(db)).getTime();
  }).slice(0, 3);
  // Número de clientes únicos (solo para admin)
  const totalClientes = esAdmin ? new Set(proyectosMes.map(p => p.cliente)).size : null;

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: bgColor, color: textColor, fontFamily: 'inherit', transition: 'background 0.3s, color 0.3s', position: 'relative' }}>
      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 8px 64px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button onClick={onVolver} style={{ background: 'none', border: 'none', color: '#3A29FF', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>&larr; Volver</button>
          <h1 style={{ fontWeight: 800, fontSize: 28, margin: 0, flex: 1 }}>Estadísticas</h1>
          <select value={mes} onChange={e => setMes(e.target.value)} style={{ fontSize: 16, borderRadius: 8, padding: '6px 12px', border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: cardBg, color: textColor }}>
            {mesesDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {/* DASHBOARD RESUMEN */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 32 }}>
          <div style={{ flex: 1, minWidth: 180, background: cardBg, borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(58,41,255,0.10)', padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: subTextColor, marginBottom: 4 }}>Proyectos activos</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: '#3A29FF' }}>{totalProyectos}</div>
          </div>
          <div style={{ flex: 1, minWidth: 180, background: cardBg, borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(58,41,255,0.10)', padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: subTextColor, marginBottom: 4 }}>Ingresos del mes</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: '#27ae60' }}>€{totalIngresos.toLocaleString('es-ES')}</div>
          </div>
          <div style={{ flex: 1, minWidth: 180, background: cardBg, borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(58,41,255,0.10)', padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: subTextColor, marginBottom: 4 }}>Gastos del mes</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: '#e74c3c' }}>€{totalGastos.toLocaleString('es-ES')}</div>
          </div>
          <div style={{ flex: 1, minWidth: 180, background: cardBg, borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(58,41,255,0.10)', padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: subTextColor, marginBottom: 4 }}>Beneficio estimado</div>
            <div style={{ fontWeight: 800, fontSize: 28, color: '#A259FF' }}>€{totalBeneficio.toLocaleString('es-ES')}</div>
          </div>
          {esAdmin && (
            <div style={{ flex: 1, minWidth: 180, background: cardBg, borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(58,41,255,0.10)', padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 15, color: subTextColor, marginBottom: 4 }}>Clientes únicos</div>
              <div style={{ fontWeight: 800, fontSize: 28, color: '#3A8BFF' }}>{totalClientes}</div>
            </div>
          )}
        </div>
        {/* Próximos vencimientos */}
        {vencimientos.length > 0 && (
          <div style={{ background: cardBg, borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(58,41,255,0.10)', padding: 18, marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: textColor }}>Próximos vencimientos</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {vencimientos.map((p, i) => (
                <li key={i} style={{ marginBottom: 8, color: textColor }}>
                  <span style={{ fontWeight: 600 }}>{p.nombre}</span> — <span style={{ color: subTextColor }}>{p.cliente}</span> <span style={{ color: '#3A29FF', fontWeight: 700 }}>{p.fecha}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Gráfica 1: Gastos e ingresos */}
        <div style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: textColor }}>Gastos e ingresos</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={modoOscuro ? '#333' : '#e0e8f7'} />
              <XAxis dataKey="dia" stroke={subTextColor} fontSize={13} />
              <YAxis stroke={subTextColor} fontSize={13} />
              <Tooltip contentStyle={{ background: cardBg, color: textColor, borderRadius: 8, border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}` }} />
              <Legend />
              <Bar dataKey="ingresos" fill="#3A8BFF" name="Ingresos" />
              <Bar dataKey="gastos" fill="#e74c3c" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Gráfica 2: Horas */}
        <div style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: textColor }}>Horas trabajadas</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={modoOscuro ? '#333' : '#e0e8f7'} />
              <XAxis dataKey="dia" stroke={subTextColor} fontSize={13} />
              <YAxis stroke={subTextColor} fontSize={13} />
              <Tooltip contentStyle={{ background: cardBg, color: textColor, borderRadius: 8, border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}` }} />
              <Legend />
              <Line type="monotone" dataKey="horas" stroke="#A259FF" name="Horas" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Gráfica 3: Ingresos por hora */}
        <div style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: textColor }}>Ingresos por hora</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={modoOscuro ? '#333' : '#e0e8f7'} />
              <XAxis dataKey="dia" stroke={subTextColor} fontSize={13} />
              <YAxis stroke={subTextColor} fontSize={13} />
              <Tooltip contentStyle={{ background: cardBg, color: textColor, borderRadius: 8, border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}` }} />
              <Legend />
              <Line type="monotone" dataKey="horas" stroke="#A259FF" name="Horas" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="ingresos" stroke="#3A8BFF" name="Ingresos" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="ingresosHora" stroke="#27ae60" name="€/hora" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 