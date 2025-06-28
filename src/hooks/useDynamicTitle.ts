import { useEffect } from 'react';

interface UseDynamicTitleProps {
  emailDomain?: string;
  hasLoggedIn: boolean;
}

export const useDynamicTitle = ({ emailDomain, hasLoggedIn }: UseDynamicTitleProps) => {
  useEffect(() => {
    const updateTitle = () => {
      if (!hasLoggedIn) {
        document.title = 'FRM Dashboard';
        updateFavicon('/favicon.ico'); // Default favicon
        return;
      }

      switch (emailDomain?.toLowerCase()) {
        case 'hdfc':
          document.title = 'HDFC FRM Dashboard';
          updateFavicon('/(LT) HDFC Bank.png');
          break;
        case 'icici':
          document.title = 'ICICI FRM Dashboard';
          updateFavicon('/(LT) ICICI Bank.png');
          break;
        default:
          document.title = 'FRM Dashboard';
          updateFavicon('/favicon.ico');
      }
    };

    const updateFavicon = (iconPath: string) => {
      // Remove existing favicon
      const existingFavicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (existingFavicon) {
        existingFavicon.remove();
      }

      // Add new favicon
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.type = iconPath.endsWith('.png') ? 'image/png' : 'image/x-icon';
      newFavicon.href = iconPath;
      document.head.appendChild(newFavicon);
    };

    updateTitle();
  }, [emailDomain, hasLoggedIn]);
}; 