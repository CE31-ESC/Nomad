import Link from 'next/link';
import { Compass } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Compass size={32} />
      <span className="text-2xl font-bold font-headline">Nomad Navigator</span>
    </Link>
  );
};

export default Logo;
