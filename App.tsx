import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listing from './pages/Listing';
import Detail from './pages/Detail';
import Publish from './pages/Publish';
import Auth from './pages/Auth';
import Store from './pages/Store';
import SellerProfile from './pages/SellerProfile';
import Team from './pages/dashboard/Team';
import Profile from './pages/Profile';
import { UserSettings } from './pages/UserSettings';
import { StoreSettings } from './pages/StoreSettings';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

// Simple Hash Router Implementation to act as SPA without react-router dependency
const App: React.FC = () => {
  const [route, setRoute] = useState('home');
  const [params, setParams] = useState<any>({});
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

      setRoute(pagePart || 'home');
      setParams(newParams);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, newParams?: any) => {
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
      case 'auth':
        return <Auth onNavigate={navigate} />;
      case 'store':
        return <Store onNavigate={navigate} id={params.id} slug={params.slug} />;
      case 'seller-profile':
        return <SellerProfile onNavigate={navigate} id={params.id} />;
      case 'dashboard/team':
        // Protected route assumption: Header handles login check or Team component redirects
        return (
          <div className="container mx-auto px-4 py-8">
            <Team />
          </div>
        );
      case 'profile':
        return <Profile onNavigate={navigate} initialTab={params.tab as any} />;
      case 'user-settings':
        return <UserSettings onNavigate={navigate} />;
      case 'store-settings':
        return <StoreSettings onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <Header onNavigate={navigate} session={session} />

      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
