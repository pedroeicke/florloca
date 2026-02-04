import React, { useEffect, useMemo, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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

const sanitizeParams = (params: any) => {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
};

const buildPath = (page: string, params?: any) => {
  const cleanedParams = sanitizeParams(params);
  const qs = cleanedParams ? new URLSearchParams(cleanedParams).toString() : '';

  const normalizedPage = page.startsWith('/') ? page : `/${page}`;

  const basePath =
    page === 'home' ? '/' :
      page === 'listing' ? '/listing' :
        page === 'publish' ? '/publish' :
          page === 'auth' ? '/auth' :
            page === 'profile' ? '/profile' :
              page === 'user-settings' ? '/user-settings' :
                page === 'store-settings' ? '/store-settings' :
                  page === 'dashboard/team' ? '/dashboard/team' :
                    page === 'detail' ? '/detail' :
                      page.startsWith('anuncio/') ? normalizedPage :
                        page === 'seller-profile' ? (cleanedParams?.id ? `/seller-profile/${cleanedParams.id}` : '/seller-profile') :
                          page === 'store' ? (cleanedParams?.id ? `/store/${cleanedParams.id}` : '/store') :
                            normalizedPage;

  const queryString = qs ? `?${qs}` : '';
  return `${basePath}${queryString}`;
};

const parseLegacyHashToPath = (hash: string) => {
  const normalized = hash.startsWith('#') ? hash.substring(1) : hash;
  if (!normalized) return null;

  const [pagePart, queryPart] = normalized.split('?');
  const urlParams = queryPart ? new URLSearchParams(queryPart) : new URLSearchParams();
  const paramsObject = Object.fromEntries(urlParams.entries());

  if (pagePart.startsWith('anuncio/')) {
    const slug = pagePart.replace('anuncio/', '');
    return buildPath(`anuncio/${slug}`, paramsObject);
  }

  const parts = pagePart.split('/').filter(p => p.length > 0);
  if (parts.length === 3) {
    const [location, category, slug] = parts;
    return buildPath(`${location}/${category}/${slug}`, paramsObject);
  }

  return buildPath(pagePart || 'home', paramsObject);
};

const ListingRoute: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const [searchParams] = useSearchParams();
  const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  return <Listing onNavigate={onNavigate} params={params} />;
};

const ProfileRoute: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const [searchParams] = useSearchParams();
  const tab = (searchParams.get('tab') || undefined) as any;
  return <Profile onNavigate={onNavigate} initialTab={tab} />;
};

const DetailBySlugRoute: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { slug } = useParams();
  return <Detail onNavigate={onNavigate} slug={slug} />;
};

const DetailByIdRoute: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || undefined;
  return <Detail onNavigate={onNavigate} id={id} />;
};

const SellerProfileRoute: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { id } = useParams();
  return id ? <SellerProfile onNavigate={onNavigate} id={id} /> : <Home onNavigate={onNavigate} />;
};

const StoreRoute: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const slug = searchParams.get('slug') || undefined;
  return <Store onNavigate={onNavigate} id={id || undefined} slug={slug} />;
};

const AppInner: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const routerNavigate = useNavigate();

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
    const legacyHash = window.location.hash;
    if (!legacyHash) return;

    const target = parseLegacyHashToPath(legacyHash);
    if (!target) return;

    routerNavigate(target, { replace: true });
  }, [routerNavigate]);

  const onNavigate = useMemo(() => {
    return (page: string, params?: any) => {
      const target = buildPath(page, params);
      routerNavigate(target);
    };
  }, [routerNavigate]);

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen font-sans text-gray-900">
        <Header onNavigate={onNavigate} session={session} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onNavigate={onNavigate} />} />
            <Route path="/listing" element={<ListingRoute onNavigate={onNavigate} />} />
            <Route path="/publish" element={<Publish onNavigate={onNavigate} />} />
            <Route path="/auth" element={<Auth onNavigate={onNavigate} />} />
            <Route path="/profile" element={<ProfileRoute onNavigate={onNavigate} />} />
            <Route path="/user-settings" element={<UserSettings onNavigate={onNavigate} />} />
            <Route path="/store-settings" element={<StoreSettings onNavigate={onNavigate} />} />
            <Route
              path="/dashboard/team"
              element={
                <div className="container mx-auto px-4 py-8">
                  <Team />
                </div>
              }
            />
            <Route path="/seller-profile/:id" element={<SellerProfileRoute onNavigate={onNavigate} />} />
            <Route path="/store" element={<StoreRoute onNavigate={onNavigate} />} />
            <Route path="/store/:id" element={<StoreRoute onNavigate={onNavigate} />} />
            <Route path="/detail" element={<DetailByIdRoute onNavigate={onNavigate} />} />
            <Route path="/anuncio/:slug" element={<DetailBySlugRoute onNavigate={onNavigate} />} />
            <Route path="/:location/:category/:slug" element={<DetailBySlugRoute onNavigate={onNavigate} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppInner />
  </BrowserRouter>
);

export default App;
