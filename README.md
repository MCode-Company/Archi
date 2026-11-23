# LINIA — szablon strony pracowni architektonicznej

Otwórz `index.html` w przeglądarce (podstrona projektu: `projekt.html`).

## Co podmienić
- **Zdjęcia** – teraz to przykładowe zdjęcia z Unsplash (ładowane z internetu).
  Wrzuć własne do folderu `img/` i zmień `src`, np. `src="img/dom-pod-lasem.jpg"`.
  Zalecane: JPG/WebP, ok. 2000 px szerokości dla dużych zdjęć, 1200 px dla kafelków.
- **Nazwy i teksty** – „LINIA”, „Anna Kowalska”, projekty, ceny, adres i telefon są przykładowe.
- **Social media** – linki na górze pliku `js/main.js` (pusty link = pozycja znika).
- **Kolory i fonty** – zmienne w `:root` na początku `css/style.css`.
- **Formularz** – podłącz wysyłkę (np. Formspree albo własna funkcja na Vercelu) w `js/main.js`.

## Wdrożenie na Vercel
Strona jest statyczna – nie wymaga builda ani `npm install`.

**Przez GitHub (zalecane):** wypchnij repo, w Vercelu wybierz *Add New → Project → Import*,
Framework Preset: **Other**, pola Build/Output zostaw puste → *Deploy*.
Każdy push na `main` zrobi nowe wdrożenie produkcyjne, a pull requesty dostaną podglądy.

**Z terminala:** `vercel` (podgląd) albo `vercel --prod` (produkcja).

Konfiguracja w `vercel.json`: ładne adresy (`/projekt` zamiast `/projekt.html`) i podstawowe nagłówki bezpieczeństwa.
`.vercelignore` wyklucza z wdrożenia folder `stara-wersja/`, README i pliki edytora.

## Struktura
- `index.html` – strona główna: hero z pokazem zdjęć, realizacje z filtrem, pracownia, oferta (rozwijana), proces, opinie, kontakt
- `projekt.html` – podstrona projektu: metryczka, opis, galeria z powiększaniem zdjęć, „następny projekt”
- `css/style.css`, `js/main.js`
- `404.html` – strona błędu (Vercel pokazuje ją automatycznie)
- `stara-wersja/` – poprzedni szablon, niewdrażany
