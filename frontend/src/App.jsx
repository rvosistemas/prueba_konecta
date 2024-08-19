import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/Routes';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
