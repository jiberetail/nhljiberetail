import type { ReactNode } from 'react';
import dashboardBackground from '../../imports/nhl-shop-hudson-yards-dashboard.png';

type NhlPageShellProps = {
  children: ReactNode;
  className?: string;
};

export function NhlPageShell({ children, className = '' }: NhlPageShellProps) {
  return (
    <main
      className={`nhl-dashboard-theme nhl-home-dashboard flex-1 min-h-screen overflow-y-auto ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(180deg, rgba(223, 230, 234, 0.68), rgba(201, 211, 217, 0.78)),
          url(${dashboardBackground})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {children}
    </main>
  );
}
