import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { STATES } from '../constants';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  session: Session | null;
}

const TYPEWRITER_PHRASES = ['"Celular"', '"Apartamento"', '"Notebook"', '"Sofá"', '"Emprego"'];

const Header: React.FC<HeaderProps> = ({ onNavigate, session }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState('SC');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Typewriter effect state
  const [placeholderText, setPlaceholderText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex % TYPEWRITER_PHRASES.length];

    const typeSpeed = isDeleting ? 50 : 100;
    const delay = isDeleting && charIndex === 0 ? 500 : (charIndex === currentPhrase.length ? 2000 : typeSpeed);

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setPlaceholderText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholderText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex(phraseIndex + 1);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  // Fetch notifications when user logs in
  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('notifications' as any)
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5); // Only latest 5 for dropdown

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount((data || []).filter((n: any) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await supabase.from('notifications' as any).update({ read: true }).eq('id', id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

        {/* Logo */}
        <div
          className="flex items-center cursor-pointer shrink-0"
          onClick={() => onNavigate('home')}
        >
          <img src="/logobrick.svg" alt="Logo" className="h-7 md:h-9" />
        </div>

        {/* Search Bar - FloripaLocal Style (Input | Divider | Location | Search Icon) */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
          <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red bg-white h-12 shadow-sm">
            <input
              type="text"
              className="flex-1 pl-4 pr-2 py-2 text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              placeholder={`Buscar ${placeholderText}`}
            />

            {/* Divider */}
            <div className="w-[1px] bg-gray-200 my-2"></div>

            {/* Location Selector */}
            <div className="relative flex items-center px-2 cursor-pointer hover:bg-gray-50 group transition-colors">
              <Icon name="MapPin" size={16} className="text-brand-red mr-1" />
              <select
                className="appearance-none bg-transparent text-sm font-semibold text-gray-700 outline-none pr-6 cursor-pointer"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Icon name="ChevronDown" size={14} className="absolute right-1 text-gray-400 pointer-events-none group-hover:text-gray-600" />
            </div>

            <button className="px-4 text-gray-500 hover:text-brand-red transition-colors flex items-center justify-center">
              <Icon name="Search" size={20} />
            </button>
          </div>
        </div>

        {/* Actions - FloripaLocal Style */}
        <div className="hidden lg:flex items-center space-x-6 shrink-0">
          <button
            onClick={() => onNavigate('profile', { tab: 'ads' })}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
          >
            <Icon name="ClipboardList" className="mr-2" size={18} />
            Meus Anúncios
          </button>

          <button
            onClick={() => onNavigate('profile', { tab: 'messages' })}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
          >
            <Icon name="MessageCircle" className="mr-2" size={18} />
            Chat
          </button>


          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Icon name="Bell" size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Notificações</h3>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Icon name="Bell" size={32} className="mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nenhuma notificação</p>
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          handleMarkAsRead(notif.id);
                          if (notif.link) {
                            setNotificationsOpen(false);
                            // Parse and navigate
                            const url = new URL(notif.link, window.location.origin);
                            const tab = url.searchParams.get('tab');
                            if (tab) onNavigate('profile', { tab });
                          }
                        }}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`p-1.5 rounded ${!notif.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <Icon
                              name={notif.type === 'new_message' ? 'MessageCircle' : notif.type === 'listing_views' ? 'Eye' : 'Star'}
                              size={16}
                              className={!notif.read ? 'text-blue-600' : 'text-gray-600'}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString('pt-BR')}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-gray-100 text-center">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      onNavigate('profile', { tab: 'notifications' });
                    }}
                    className="text-sm text-brand-red hover:text-red-700 font-semibold"
                  >
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            )}
          </div>

          {session ? (
            <button
              onClick={() => onNavigate('profile')}
              className="text-gray-900 font-bold px-6 py-2.5 rounded-full border border-gray-300 hover:bg-gray-50 transition-all text-sm"
            >
              Olá, {session.user?.email?.split('@')[0]}
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="text-gray-900 font-bold px-6 py-2.5 rounded-full border border-gray-300 hover:bg-gray-50 transition-all text-sm"
            >
              Entrar
            </button>
          )}

          <button
            onClick={() => onNavigate('publish')}
            className="bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow hover:shadow-md text-sm"
          >
            Anunciar grátis
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden ml-auto">
          <Icon name="Search" size={24} className="text-gray-700" />
          <button
            className="text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-lg z-50 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4 space-y-6">
            <button
              onClick={() => { onNavigate('publish'); setMobileMenuOpen(false) }}
              className="w-full bg-brand-red text-white font-bold py-3 rounded-lg text-center shadow-md"
            >
              Anunciar grátis
            </button>

            {session ? (
              <button
                onClick={() => { onNavigate('profile'); setMobileMenuOpen(false) }}
                className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg text-center"
              >
                Olá, {session.user?.email?.split('@')[0]}
              </button>
            ) : (
              <button
                onClick={() => { onNavigate('auth'); setMobileMenuOpen(false) }}
                className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg text-center"
              >
                Entrar
              </button>
            )}

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => { onNavigate('profile', { tab: 'ads' }); setMobileMenuOpen(false) }}
                className="flex items-center text-gray-600 font-medium w-full py-2"
              >
                <Icon name="ClipboardList" className="mr-3" size={20} /> Meus Anúncios
              </button>
              <button
                onClick={() => { onNavigate('profile', { tab: 'messages' }); setMobileMenuOpen(false) }}
                className="flex items-center text-gray-600 font-medium w-full py-2"
              >
                <Icon name="MessageCircle" className="mr-3" size={20} /> Chat
              </button>
              <button
                onClick={() => { onNavigate('profile', { tab: 'notifications' }); setMobileMenuOpen(false) }}
                className="flex items-center text-gray-600 font-medium w-full py-2"
              >
                <Icon name="Bell" className="mr-3" size={20} /> Notificações
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;