import { BrowserRouter, useLocation } from 'react-router-dom';
import Router from "@/routes/Router";
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useMatch } from 'react-router-dom';
import ScrollToTopButton from './components/Button/ScrollToTopButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const nowUrl = location.pathname;

  const isAichat = nowUrl === "/aichat";
  const isChat = nowUrl === "/chat";
  const isCommunityDetail = useMatch("/community/:id");

  const noneFooter = isAichat || isChat || isCommunityDetail;

  return (
    <>
      <Header />
      <Router />
      <ScrollToTopButton />
      <ToastContainer position="top-center" autoClose={2000} />
      {!noneFooter && <Footer />}
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