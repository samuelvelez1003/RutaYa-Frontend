import { useState } from 'react';
import API from '../services/api';
import { usePedidosContext } from '../context/PedidosContext';

//Iconos
import { FaTruck, FaBoxOpen, FaTrash, FaPlus } from 'react-icons/fa';

export default function Rutas() {
  const { pedidos, rutas, conductores, cargarTodo } = usePedidosContext();
  const [nueva, setNueva] = useState({ conductor_id: '', notas: '' });

  const crearRuta = async () => {
    if (!nueva.conductor_id) return alert('Seleccione conductor');
    await API.post('/rutas', nueva);
    setNueva({ conductor_id: '', notas: '' });
    cargarTodo();
  };

  const asignar = async (rutaId, pedidoId) => {
    await API.post(`/rutas/${rutaId}/asignar/${pedidoId}`);
    await API.put(`/pedidos/${pedidoId}`, { estado: 'EN DESPACHO' });
    cargarTodo();
  };

  const quitar = async (rutaId, pedidoId) => {
    await API.post(`/rutas/${rutaId}/quitar/${pedidoId}`);
    await API.put(`/pedidos/${pedidoId}`, { estado: 'PENDIENTE' });
    cargarTodo();
  };

  const getColor = (estado) => {
    switch (estado) {
      case 'EN DESPACHO': return '#00b0ff';
      case 'ENTREGADO': return '#28a745';
      default: return '#ffc400';
    }
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'EN DESPACHO': return 'dispatch';
      case 'ENTREGADO': return 'delivered';
      default: return 'pending';
    }
  };

  return (
    <div>
      <h2>Rutas</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <select value={nueva.conductor_id} onChange={e => setNueva({ ...nueva, conductor_id: e.target.value })}>
          <option value=''>Seleccione Conductor</option>
          {conductores.map(c => (
            <option key={c._id} value={c._id}>{c.nombre}</option>
          ))}
        </select>
        <input placeholder='Notas' value={nueva.notas} onChange={e => setNueva({ ...nueva, notas: e.target.value })} />
        <button className="assign" onClick={crearRuta}>
          <FaPlus /> Crear Ruta
        </button>
      </div>

      <div>
        {rutas.map(r => (
          <div key={r._id} className="route-card">
            <div style={{ color: '#d1d1d1', marginBottom: '4px' }}><strong>Conductor:</strong> {conductores.find(c => c._id === r.conductor_id)?.nombre || r.conductor_id}</div>
            <div style={{ color: '#d1d1d1', marginBottom: '4px' }}><strong>Notas:</strong> {r.notas || "Sin notas"}</div>
            <div style={{ color: '#d1d1d1', marginBottom: '10px' }}><strong>Pedidos asignados:</strong> {r.pedidos?.length || 0}</div>

            <div style={{ 
                marginTop: 15, 
                paddingTop: 10, 
                borderTop: '1px solid #444444' 
            }}>
              <em style={{ color: '#ffc400', fontSize: '13px' }}>Asignar pedidos pendientes:</em>
              
              {pedidos.filter(p => p.estado === 'PENDIENTE').map(p => (
                <div key={p._id} className="route-pedido" style={{ background: '#333333' }}>
                  <div>
                    <span style={{ color: '#f0f0f0' }}><strong>Cliente:</strong> {p.cliente}</span>
                    <span style={{ color: '#ccc', fontSize: '13px' }}><strong>Dirección:</strong> {p.direccion}</span>
                  </div>
                  <button className="assign" onClick={() => asignar(r._id, p._id)} style={{ padding: '6px 12px' }}>
                    <FaTruck /> Asignar
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 15 }}>
              <em style={{ color: '#d1d1d1', fontSize: '13px' }}>Pedidos en la ruta:</em>
              
              <ul style={{ maxHeight: 'none', overflowY: 'visible', listStyle: 'none', padding: 0 }}>
                {r.pedidos && r.pedidos.length > 0 ? r.pedidos.map(p => (
                  <li key={p._id || p} style={{ 
                      marginBottom: 8, 
                      padding: 10, 
                      borderRadius: 8, 
                      background: '#252525', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                  }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{p.cliente}</span> 
                      <span style={{ color: '#ccc' }}>{p.direccion || "Sin dirección"}</span>
                      <br />
                      Estado: <span className={`status ${getStatusClass(p.estado)}`} style={{ color: '#1e1e1e' }}>{p.estado}</span>
                    </div>
                    <button className="delete" onClick={() => quitar(r._id, p._id || p)} style={{ padding: '6px 12px' }}>
                      <FaTrash />
                    </button>
                  </li>
                )) : <li style={{ background: 'none', padding: '10px 0', color: '#999', border: 'none' }}>No hay pedidos en esta ruta</li>}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}