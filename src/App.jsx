import Conductores from './components/Conductores';
import Pedidos from './components/Pedidos';
import Rutas from './components/Rutas';
import { PedidosProvider } from './context/PedidosContext';
import './styles.css';

function App() {
  return (
    <PedidosProvider>
      <div className="app-container">
        <h1>🚚 Ruta Ya 2.0</h1>
        <div className="columns">
          <div className="card" style={{ minWidth: 300 }}>
            <Conductores />
          </div>
          <div className="card" style={{ minWidth: 300 }}>
            <Pedidos />
          </div>
          <div className="card" style={{ minWidth: 350 }}>
            <Rutas />
          </div>
        </div>
      </div>
    </PedidosProvider>
  );
}

export default App;
