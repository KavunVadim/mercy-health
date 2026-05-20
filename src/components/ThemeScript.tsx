"use client";

import { useServerInsertedHTML } from "next/navigation";

export default function ThemeScript() {
  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('mercy-health-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(!t&&d)t='dark';if(!t)t='light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
        }}
      />
    );
  });

  return null;
}
