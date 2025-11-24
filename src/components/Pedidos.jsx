import { useState } from 'react';
import API from '../services/api';
import { usePedidosContext } from '../context/PedidosContext';

// Iconos
import { FaTruck, FaBoxOpen, FaTrash, FaPlus } from 'react-icons/fa';

export default function Pedidos() {
  const { pedidos, cargarTodo } = usePedidosContext();
  const [nuevo, setNuevo] = useState({ cliente: '', direccion: '', zona: '' });

  const crear = async () => {
    if (!nuevo.cliente) return alert('Cliente requerido');
    await API.post('/pedidos', nuevo);
    setNuevo({ cliente: '', direccion: '', zona: '' });
    cargarTodo();
  };

  const eliminar = async (id) => {
    if (!window.confirm('Eliminar pedido?')) return;
    await API.delete(`/pedidos/${id}`);
    cargarTodo();
  };

  const cambiarEstado = async (id, estado) => {
    await API.put(`/pedidos/${id}`, { estado });
    cargarTodo();
  };

  const getColor = (estado) => {
    switch (estado) {
      case 'EN DESPACHO': return '#00b0ff';
      case 'ENTREGADO': return '#28a745';
      default: return '#ffc400';
    }
  };

  return (
    <div>
      <h2>Pedidos</h2>
      <div className="input-group" style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input 
          placeholder='Cliente' 
          value={nuevo.cliente} 
          onChange={e => setNuevo({ ...nuevo, cliente: e.target.value })} 
        />
        <input 
          placeholder='Dirección' 
          value={nuevo.direccion} 
          onChange={e => setNuevo({ ...nuevo, direccion: e.target.value })} 
        />
        <input 
          placeholder='Zona' 
          value={nuevo.zona} 
          onChange={e => setNuevo({ ...nuevo, zona: e.target.value })} 
        />
        <button className="assign" onClick={crear}>
          <FaPlus /> Agregar
        </button>
      </div>

      <ul>
        {pedidos.map(p => (
          <li 
            key={p._id} 
          >
            <div>
              <span style={{ fontWeight: 'bold' }}>{p.cliente}</span>
              <span style={{ fontWeight: 400 }}>{p.direccion}</span>
              <span style={{ color: '#999' }}>{p.zona}</span>
              <div style={{ fontSize: 13, marginTop: 2, color: '#ccc' }}>
                Estado: 
                <span style={{ 
                  backgroundColor: getColor(p.estado), 
                  color: '#1e1e1e',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontWeight: 'bold',
                  marginLeft: 8,
                  textTransform: 'uppercase'
                }}>
                  {p.estado}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => cambiarEstado(p._id, 'EN DESPACHO')} style={{ background: 'none', border: '1px solid #00b0ff', padding: '6px 10px' }}>
                <FaTruck color="#00b0ff" />
              </button>
              <button onClick={() => cambiarEstado(p._id, 'ENTREGADO')} style={{ background: 'none', border: '1px solid #28a745', padding: '6px 10px' }}>
                <FaBoxOpen color="#28a745" />
              </button>
              <button onClick={() => eliminar(p._id)} style={{ background: 'none', border: '1px solid #dc3545', padding: '6px 10px' }}>
                <FaTrash color="#dc3545" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}