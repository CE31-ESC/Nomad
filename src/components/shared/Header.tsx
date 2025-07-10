"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Briefcase, UserCircle, LogIn, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import *  as React from 'react'; // Import React for useState and useEffect

// Mock authentication state
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userName, setUserName] = React.useState<string | null>(null);

  React.useEffect(() => {
    // In a real app, you would check localStorage/session or make an API call
    const storedAuth = localStorage.getItem('nomad-navigator-auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.isAuthenticated) {
        setIsAuthenticated(true);
        setUserName(authData.userName || 'User');
      }
    }
  }, []);
  
  // Mock login/logout functions for demo purposes
  const login = (name: string) => {
    localStorage.setItem('nomad-navigator-auth', JSON.stringify({isAuthenticated: true, userName: name}));
    setIsAuthenticated(true);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('nomad-navigator-auth');
    setIsAuthenticated(false);
    setUserName(null);
  };


  return { isAuthenticated, userName, login, logout };
};


const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} passHref>
      <Button variant="ghost" className={cn("text-foreground hover:bg-primary/10", isActive && "font-semibold text-primary")}>
        {children}
      </Button>
    </Link>
  );
};

const Header = () => {
  const { isAuthenticated, userName, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/hotels/search">Hotels</NavLink>
          {isAuthenticated && <NavLink href="/profile">My Bookings</NavLink>}
        </nav>
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserCircle size={20} />
                {userName}
              </Button>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="ghost" className="text-foreground hover:bg-primary/10">
                  <LogIn size={18} className="mr-1" /> Login
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <UserPlus size={18} className="mr-1" /> Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
