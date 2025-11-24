import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const PedidosContext = createContext();

export const PedidosProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [conductores, setConductores] = useState([]);

  const cargarTodo = async () => {
    try {
      const [c, p, r] = await Promise.all([
        API.get('/conductores'),
        API.get('/pedidos'),
        API.get('/rutas'),
      ]);
      setConductores(c.data);
      setPedidos(p.data);
      setRutas(r.data);
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  useEffect(() => {
    cargarTodo();
    const interval = setInterval(cargarTodo, 3000); // actualizar cada 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <PedidosContext.Provider value={{ pedidos, setPedidos, rutas, setRutas, conductores, setConductores, cargarTodo }}>
      {children}
    </PedidosContext.Provider>
  );
};

export const usePedidosContext = () => useContext(PedidosContext);
