# Design System — Благодійний фонд «Милосердя та здоров'я»

> Референс: savelife.in.ua — темна, потужна естетика.
> Адаптація: блакитний акцент замість зеленого (логотип — голуб, небесно-синій колір).

---

## Color Palette

```css
/* === ФОНИ === */
--color-bg-hero: #0a0f1e; /* темний синьо-чорний — hero, navbar, footer */
--color-bg-dark: #111827; /* темний — чергові секції */
--color-bg-mid: #1a2744; /* темно-синій — картки на темному тлі */
--color-bg-light: #f0f4f8; /* світло-сірий синюватий — світлі секції */

/* === ЛОГОТИП — ГОЛУБ (небесно-синій) === */
--color-accent: #4a9ecc; /* основний акцент */
--color-accent-dark: #2e7da8; /* hover */
--color-accent-light: #7bbfe0; /* підсвітка */
--color-accent-glow: rgba(74, 158, 204, 0.15);

/* === DONATE CTA (як savelife.in.ua) === */
--color-donate: #e8401c; /* яскравий червоно-оранжевий */
--color-donate-hover: #c9340f;

/* === ТИПОГРАФІКА === */
--color-text-primary: #ffffff;
--color-text-secondary: #9baac4;
--color-text-dark: #1a2744;

/* === BORDERS === */
--color-border: rgba(74, 158, 204, 0.2);
--color-border-light: rgba(255, 255, 255, 0.07);
```

---

## Typography

```css
font-family: "Oswald", sans-serif; /* Заголовки — кирилиця ✓ */
font-family: "Montserrat", sans-serif; /* Тіло / UI — кирилиця ✓ */
```

Type Scale: 72px Hero → 48px H2 → 30px H3 → 20px lead → 16px body → 14px label

---

## Components

### Button — Donate

```
bg-[#E8401C] hover:bg-[#C9340F] text-white font-bold uppercase tracking-widest
px-8 py-4 rounded-none (sharp)
```

### Button — Primary (синій)

```
bg-[#4A9ECC] hover:bg-[#2E7DA8] text-white
```

### Button — Outline

```
border border-[#4A9ECC] text-[#4A9ECC] hover:bg-[#4A9ECC] hover:text-white
```

### Project Card

```
bg-[#1A2744] border border-[rgba(74,158,204,0.15)]
hover: border-[#4A9ECC] translateY(-4px) shadow-blue
```

### Progress Bar

```
track: rgba(255,255,255,0.08) h-1.5
fill: linear-gradient(90deg, #4A9ECC, #7BBFE0)
```

### Badge

```
bg-[rgba(74,158,204,0.12)] text-[#4A9ECC]
border border-[rgba(74,158,204,0.3)]
text-xs uppercase tracking-wider px-2.5 py-1
```

### Stats Counter Strip (2 варіанти)

```
Варіант A — темна: bg-[#1A2744] border-y-2 border-[#4A9ECC]
Варіант B — яскрава: bg-[#4A9ECC] text-[#0A0F1E]
```

---

## Layout

### Header (sticky, 2 рядки — як savelife)

```
Row 1 (36px): 093-351-62-00 | 096-145-11-55 | UA / EN
Row 2 (72px): [Logo+Голуб] | [Фонд Nav] [Центр Nav] | [Допомогти →]
bg: rgba(10,15,30,0.97) backdrop-blur-md
border-bottom: 1px solid rgba(74,158,204,0.12)
```

### Hero

```
min-h-screen
bg: linear-gradient(rgba(10,15,30,0.75), rgba(10,15,30,0.95)), url(hero.jpg)
H1: Oswald 72px white
Subtitle: Montserrat 20px #9BAAC4
CTA: [Допомогти зараз (red)] [Дізнатись більше (outline blue)]
```

### Footer

```
bg-[#0A0F1E]
border-top: 2px solid rgba(74,158,204,0.3)
4 columns: Фонд | Центр | Інфо | Контакти
```

---

## Animations (Framer Motion)

### Hero entrance — stagger words

```js
H1: { opacity:0, y:30 } → { opacity:1, y:0 } duration 0.8s delay 0.2s
Subtitle: delay 0.4s | Buttons: delay 0.6s
```

### Stats countUp

```js
// IntersectionObserver → count 0 → N за 2s, easeOut
```

### Scroll reveal

```js
initial: { opacity:0, y:24 }
whileInView: { opacity:1, y:0 }
viewport: { once:true }
staggerChildren: 0.1s
```

---

## Дві секції — різний акцент

|        | Благодійний фонд       | Центр реабілітації  |
| ------ | ---------------------- | ------------------- |
| Акцент | #4A9ECC (синій)        | #5BA05B (зелений)   |
| Тон    | Активний, гуманітарний | Теплий, відновлення |

---

## Mobile

```
< 640px   — 1 col, hamburger
640-768   — 2 col cards
768-1024  — full nav, 3 col
> 1024    — max-w-7xl
```
