
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listing from './pages/Listing';
import Detail from './pages/Detail';
import Publish from './pages/Publish';
import AdultContentModal from './components/AdultContentModal';
import { RESTRICTED_CATEGORIES } from './constants';

// Simple Hash Router Implementation to act as SPA without react-router dependency
const App: React.FC = () => {
  const [route, setRoute] = useState('home');
  const [params, setParams] = useState<any>({});
  
  // Adult Content Logic
  const [showAdultModal, setShowAdultModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<{page: string, params?: any} | null>(null);
  
  // Persist verification in sessionStorage so it survives page reloads but clears on browser close
  const [isVerified, setIsVerified] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('adult_verified') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // remove #
      if (!hash) {
        setRoute('home');
        return;
      }
      
      // Basic parsing: #page?param=value
      const [pagePart, queryPart] = hash.split('?');
      let newParams: any = {};

      if (queryPart) {
        const urlParams = new URLSearchParams(queryPart);
        newParams = Object.fromEntries(urlParams.entries());
      }

      // Check for direct link access to restricted categories
      if (pagePart === 'listing' && newParams.category && RESTRICTED_CATEGORIES.includes(newParams.category)) {
         // Logic to handle direct access could go here (e.g. redirect to home if not verified)
         // For now, we rely on the modal flow triggered by navigation actions within the app
      }

      setRoute(pagePart || 'home');
      setParams(newParams);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, newParams?: any) => {
    // Check if trying to access restricted category
    if (page === 'listing' && newParams?.category && RESTRICTED_CATEGORIES.includes(newParams.category)) {
      if (!isVerified) {
        setPendingRoute({ page, params: newParams });
        setShowAdultModal(true);
        return;
      }
    }

    // Normal navigation
    executeNavigation(page, newParams);
  };

  const executeNavigation = (page: string, newParams?: any) => {
    let hash = `#${page}`;
    if (newParams) {
      const qs = new URLSearchParams(newParams).toString();
      hash += `?${qs}`;
    }
    window.location.hash = hash;
  };

  const handleAdultConfirm = () => {
    setIsVerified(true);
    sessionStorage.setItem('adult_verified', 'true');
    setShowAdultModal(false);
    if (pendingRoute) {
      executeNavigation(pendingRoute.page, pendingRoute.params);
      setPendingRoute(null);
    }
  };

  const handleAdultCancel = () => {
    setShowAdultModal(false);
    setPendingRoute(null);
    // If we were blocking a direct URL load, we would navigate to home here.
    // Since we intercept before navigation, we just stay where we are.
  };

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'listing':
        return <Listing onNavigate={navigate} params={params} />;
      case 'detail':
        return <Detail onNavigate={navigate} id={params.id} />;
      case 'publish':
        return <Publish onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <Header onNavigate={navigate} />
      
      <AdultContentModal 
        isOpen={showAdultModal} 
        onConfirm={handleAdultConfirm} 
        onCancel={handleAdultCancel} 
      />

      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
