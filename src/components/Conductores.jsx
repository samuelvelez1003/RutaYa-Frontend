import React, { useEffect, useState } from 'react';
import API from '../services/api';
// ICONOS
import { FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', licencia: '', activo: true });

  const cargar = async () => {
    const res = await API.get('/conductores');
    setConductores(res.data);
  };

  const crear = async () => {
    if (!nuevo.nombre) return alert('Nombre requerido');
    await API.post('/conductores', nuevo);
    setNuevo({ nombre: '', licencia: '', activo: true });
    cargar();
  };

  const eliminar = async (id) => {
    if (!window.confirm('Eliminar conductor?')) return;
    await API.delete(`/conductores/${id}`);
    cargar();
  };

  const toggleActivo = async (id, actual) => {
    await API.put(`/conductores/${id}`, { activo: !actual });
    cargar();
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div>
      <h2>Conductores</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder='Nombre' value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <input placeholder='Licencia' value={nuevo.licencia} onChange={e => setNuevo({ ...nuevo, licencia: e.target.value })} />
        <button className="assign" onClick={crear}>
          <FaCheckCircle style={{ marginRight: 4 }} /> Agregar
        </button>
      </div>
      <ul>
        {conductores.map(c => (
          <li key={c._id} style={{ marginBottom: 8 }}>
            <div><strong>{c.nombre}</strong></div>
            <div>{c.licencia}</div>
            <div>
              <strong>Estado:</strong> 
              <span style={{ color: c.activo ? 'green' : 'red', fontWeight: 'bold', marginLeft: 4 }}>
                {c.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: 6 }}>
              <button className="assign" onClick={() => toggleActivo(c._id, c.activo)}>
                {c.activo ? <FaTimesCircle color="red" /> : <FaCheckCircle color="green" />}
              </button>
              <button className="delete" onClick={() => eliminar(c._id)}>
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
