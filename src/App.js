import './App.css';
import Sidebar from './components/Sidebar';
import RightSide from './components/RigtSide/RightSide';
import AdminRoutes from './routes/AdminRoutes'; // Import the AdminRoutes
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar navigate={navigate} />
        <AdminRoutes /> {/* Use AdminRoutes here */}
        <RightSide />
      </div>
    </div>
  );
}

export default App;