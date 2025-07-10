"use client";

import { useState, useEffect } from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<string>('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Nomad Navigator. All rights reserved.</p>
        <p className="mt-1">Your ultimate travel booking companion.</p>
      </div>
    </footer>
  );
};

export default Footer;
