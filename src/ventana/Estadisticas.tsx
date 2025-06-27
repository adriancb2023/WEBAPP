import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useState, useMemo } from 'react';
import BotonModo from './BotonModo';
import type { Proyecto } from './Home';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

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

  // Estado para fechas personalizadas
  const hoyStr = new Date().toISOString().slice(0, 10);
  const primerDiaMes = hoyStr.slice(0, 8) + '01';
  const [desde, setDesde] = useState(primerDiaMes);
  const [hasta, setHasta] = useState(hoyStr);

  // Filtrar proyectos por rango de fechas
  const proyectosRango = useMemo(() => {
    return proyectos.filter(p => {
      const [d, m, y] = p.fecha.split('/');
      const fecha = new Date(Number(y), Number(m) - 1, Number(d));
      return fecha >= new Date(desde) && fecha <= new Date(hasta);
    });
  }, [proyectos, desde, hasta]);

  // El resto de cálculos usan proyectosRango en vez de proyectosMes
  const proyectosMes = proyectosRango;

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

  // Estado para feedback de exportación
  const [exportando, setExportando] = useState(false);
  const [mensajeExport, setMensajeExport] = useState<string|null>(null);

  // Función para exportar a PDF (ahora incluye feedback visual y manejo de errores)
  const exportarPDF = async () => {
    setExportando(true);
    setMensajeExport('Generando PDF, por favor espera...');
    try {
      const doc = new jsPDF();
      // Cabecera
      doc.setFontSize(18);
      doc.text('Resumen de Estadísticas', 14, 18);
      doc.setFontSize(12);
      doc.text(`Rango: ${desde} a ${hasta}`, 14, 26);
      // Resumen
      doc.setFontSize(11);
      doc.setTextColor(40);
      doc.text(`Proyectos activos: ${totalProyectos}`, 14, 36);
      doc.text(`Ingresos: €${totalIngresos.toLocaleString('es-ES')}`, 14, 44);
      doc.text(`Gastos: €${totalGastos.toLocaleString('es-ES')}`, 14, 52);
      doc.text(`Beneficio: €${totalBeneficio.toLocaleString('es-ES')}`, 14, 60);
      // Próximos vencimientos
      let y = 68;
      if (vencimientos.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(80);
        doc.text('Próximos vencimientos:', 14, y);
        vencimientos.forEach((p, i) => {
          doc.text(`- ${p.nombre} (${p.cliente}) ${p.fecha}`, 18, y + 8 + i * 8);
        });
        y += 8 * (vencimientos.length + 1);
      }
      // Tabla de proyectos
      doc.setFontSize(13);
      doc.setTextColor(30);
      doc.text('Proyectos:', 14, y + 10);
      autoTable(doc, {
        startY: y + 14,
        head: [[
          'Nombre', 'Cliente', 'Fecha', 'Presupuesto', 'Gastos', 'Beneficio'
        ]],
        body: proyectosMes.map(p => [
          p.nombre,
          p.cliente,
          p.fecha,
          `€${p.presupuesto.toLocaleString('es-ES')}`,
          `€${p.gastos.toLocaleString('es-ES')}`,
          `€${(p.presupuesto - p.gastos).toLocaleString('es-ES')}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [58, 41, 255] },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      y = (doc as any).lastAutoTable.finalY || y + 30;
      // Gráficas como imágenes
      const graficas = [
        document.getElementById('grafica-gastos'),
        document.getElementById('grafica-horas'),
        document.getElementById('grafica-ingresos-hora')
      ];
      for (let i = 0; i < graficas.length; i++) {
        const el = graficas[i];
        if (el) {
          const canvas = await html2canvas(el);
          const imgData = canvas.toDataURL('image/png');
          doc.addPage();
          doc.setFontSize(15);
          doc.text(['Gráfica', i === 0 ? 'Gastos e ingresos' : i === 1 ? 'Horas trabajadas' : 'Ingresos por hora'], 14, 20);
          doc.addImage(imgData, 'PNG', 14, 30, 180, 80);
        }
      }
      doc.save(`estadisticas_${desde}_a_${hasta}.pdf`);
      setMensajeExport('¡PDF generado y descargado!');
      setTimeout(() => setMensajeExport(null), 2500);
    } catch (err: any) {
      setMensajeExport(null);
      alert('Error al generar el PDF: ' + (err?.message || err));
    } finally {
      setExportando(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: bgColor, color: textColor, fontFamily: 'inherit', transition: 'background 0.3s, color 0.3s', position: 'relative' }}>
      <BotonModo modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 8px 64px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button onClick={onVolver} style={{ background: 'none', border: 'none', color: '#3A29FF', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>&larr; Volver</button>
          <h1 style={{ fontWeight: 800, fontSize: 28, margin: 0, flex: 1 }}>Estadísticas</h1>
          {/* Selector de fechas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 600, color: subTextColor, fontSize: 15 }}>Desde
              <input type="date" value={desde} onChange={e => setDesde(e.target.value)} style={{ marginLeft: 8, borderRadius: 8, border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: cardBg, color: textColor, fontSize: 15, padding: '6px 10px' }} />
            </label>
            <label style={{ fontWeight: 600, color: subTextColor, fontSize: 15 }}>Hasta
              <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={{ marginLeft: 8, borderRadius: 8, border: `1.5px solid ${modoOscuro ? '#A259FF' : '#3A8BFF'}`, background: cardBg, color: textColor, fontSize: 15, padding: '6px 10px' }} />
            </label>
          </div>
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
        <div id="grafica-gastos" style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 24, marginBottom: 32 }}>
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
        <div id="grafica-horas" style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 24, marginBottom: 32 }}>
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
        <div id="grafica-ingresos-hora" style={{ background: cardBg, borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(58,41,255,0.10)', padding: 24, marginBottom: 32 }}>
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
        {/* Botón exportar PDF */}
        <div style={{ textAlign: 'center', margin: '32px 0 0 0' }}>
          <button className="uiverse-btn" style={{ fontSize: 18, padding: '14px 38px', background: 'linear-gradient(90deg, #3A8BFF 0%, #A259FF 100%)', color: '#fff', fontWeight: 700, borderRadius: 12, border: 'none', boxShadow: '0 4px 18px 0 rgba(58,41,255,0.10)', cursor: exportando ? 'not-allowed' : 'pointer', opacity: exportando ? 0.6 : 1 }} onClick={exportarPDF} disabled={exportando}>
            {exportando ? 'Generando PDF...' : '📄 Exportar PDF de este periodo'}
          </button>
          {mensajeExport && <div style={{ marginTop: 14, color: '#3A29FF', fontWeight: 600, fontSize: 16 }}>{mensajeExport}</div>}
          {exportando && <div style={{ marginTop: 10 }}><span className="spinner" style={{ display: 'inline-block', width: 28, height: 28, border: '4px solid #A259FF', borderTop: '4px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span></div>}
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}