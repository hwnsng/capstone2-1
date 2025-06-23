import { BrowserRouter, useLocation } from 'react-router-dom';
import Router from "./routes/Router";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  const location = useLocation();
  const nowUrl = location.pathname;
  const noneFooter = nowUrl !== "/aichat";

  return (
    <>
      <Header />
      <Router />
      {noneFooter && <Footer />}
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}