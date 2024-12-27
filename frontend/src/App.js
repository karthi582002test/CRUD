import logo from './logo.svg';
import './App.css';
import Header from './Components/Header';
import Form from './Components/Form';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Header />
      <Form />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
