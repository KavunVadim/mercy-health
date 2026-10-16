"use client";

import { useEffect } from "react";

/**
 * Кореневий layout задає <html lang="uk"> для всіх локалей, тому на /en/*
 * атрибут доводиться виправляти. Робимо це інлайн-скриптом (виконується одразу
 * під час парсингу HTML, до першого пейнту), а useEffect лишаємо як фолбек.
 */
export default function LangScript({ lang }: { lang: string }) {
  useEffect(() => {
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `if(document.documentElement.lang!==${JSON.stringify(lang)}){document.documentElement.lang=${JSON.stringify(lang)}}`,
      }}
    />
  );
}
