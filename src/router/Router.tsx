/**
 * Beyond Financials - Client-Side Routing Architecture
 * 
 * Provides history pushState / popState navigation with automatic scroll-to-top,
 * active link states, and seamless integration with Express SPA fallback.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  pathname: string;
  navigate: (to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => {
    if (typeof window === 'undefined') return;

    const targetUrl = to.startsWith('/') ? to : `/${to}`;
    
    // Check if it's an anchor jump on current page
    if (targetUrl.includes('#') && targetUrl.split('#')[0] === pathname) {
      const hash = targetUrl.split('#')[1];
      const elem = document.getElementById(hash);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (options?.replace) {
      window.history.replaceState({}, '', targetUrl);
    } else {
      window.history.pushState({}, '', targetUrl);
    }

    setPathname(targetUrl.split('#')[0] || '/');

    if (options?.scrollToTop !== false) {
      // Check if hash exists in targetUrl
      if (targetUrl.includes('#')) {
        const hash = targetUrl.split('#')[1];
        setTimeout(() => {
          const elem = document.getElementById(hash);
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  };

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  activeClassName?: string;
  children: ReactNode;
}

export const Link: React.FC<LinkProps> = ({
  to,
  className = '',
  activeClassName = '',
  children,
  onClick,
  ...rest
}) => {
  const { pathname, navigate } = useRouter();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If user holds cmd / ctrl / shift, let normal new-tab click happen
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  const finalClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a href={to} onClick={handleClick} className={finalClassName} {...rest}>
      {children}
    </a>
  );
};
