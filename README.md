# SmartMeal AI

SmartMeal AI is a responsive web app that connects restaurants and NGOs to rescue surplus food and nourish communities. Visitors can browse public pages (Landing, Food Details, Reviews, FAQ), sign in as an NGO or Restaurant, and—once authenticated—restaurants can manage their dashboard, enter daily servings, schedule events, tweak settings, and view serving history.

---

## 🚀 Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Routing:** React Router v6
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **HTTP:** Axios
- **Styling:** Tailwind CSS
- **State & Forms:** React Hooks (`useState`, `useEffect`)

---

## 📁 File Structure

```
frontend/
└── src/
    ├── App.tsx
    ├── index.tsx
    ├── layouts/
    │   ├── MainLayout.tsx         # Public‐site wrapper (Navbar, Footer, etc.)
    │   └── RestaurantLayout.tsx   # Restaurant area wrapper (animated bg, floating icons, Outlet)
    │
    ├── pages/
    │   ├── public/
    │   │   ├── Landing.tsx        # Hero, mission, “How It Helps”, plate counter
    │   │   ├── FoodDetails.tsx    # Details on a specific rescued‐food offer
    │   │   ├── Reviews.tsx        # Testimonials / feedback carousel
    │   │   └── FAQ.tsx            # Frequently Asked Questions
    │   │
    │   ├── authentication/
    │   │   ├── SigninNGO.tsx      # NGO sign‐in placeholder
    │   │   └── SigninRestaurant.tsx  # Restaurant sign‐in placeholder
    │   │
    │   └── restaurant/
    │       ├── Dashboard.tsx      # Overview: total plates saved, active events, quick links
    │       ├── TodaysServing.tsx  # Form + summary cards for daily serving data
    │       ├── Events.tsx         # CRUD UI for upcoming events
    │       ├── Settings.tsx       # Profile / preferences page
    │       ├── History.tsx        # Past‐days’ summary (earnings, waste, net savings)
    │       └── RestaurantFAQ.tsx  # (future) Restaurant‐specific FAQs
    │
    ├── components/
    │   ├── common/
    │   │   ├── Footer.tsx             # Global footer
    │   │   └── FloatingFoodIcons.tsx  # Background “floating” SVG icons
    │   │
    │   ├── restaurant/
    │   │   └── Navbar.tsx             # Restaurant‐area responsive navbar + mobile drawer
    │   │
    │   └── ui/
    │       ├── Button.tsx             # Styled button variants (solid, outline)
    │       └── Card.tsx               # Simple card container with optional glow
    │
    └── styles/
        └── index.css              # Tailwind base + custom utilities
```

---

## 🔄 Workflow

1. **Public Browsing**  
   - Users land on `/` (Landing).  
   - Navigate to `/food-details`, `/reviews`, or `/faq` via the main navbar (wrapped in `MainLayout`).

2. **Authentication**  
   - NGO users go to `/signin/ngo`; restaurants to `/signin/restaurant`.  
   - (Auth stubs for now—future integration with real backend.)

3. **Restaurant Portal**  
   - After “sign-in” (stub), users land on `/restaurant`, which renders `RestaurantLayout`.  
   - `RestaurantLayout` provides:
     - Animated gradient background (Framer Motion).
     - Floating food icons.
     - `RestaurantNavbar` with links to Dashboard, Serving, Events, Settings, History.
     - `<Outlet />` where child routes render.
     - Global footer.

4. **Managing Servings**  
   - `/restaurant/serving` → `TodaysServing.tsx`:  
     - Fetches `GET /api/servings`, displays summary cards (Total Earnings, Food Waste, Net Savings).  
     - Shows existing servings in cards with delete buttons.  
     - “Add Serving” form posts to `POST /api/servings`, then refetches.

5. **Managing Events**  
   - `/restaurant/events` → `Events.tsx`:  
     - Fetches `GET /api/events`, lists upcoming events in cards with delete.  
     - “Add New Event” form posts to `POST /api/events`.

6. **Settings & FAQ**  
   - `/restaurant/settings` → `Settings.tsx` (profile, preferences).  
   - `/restaurant/faq` → `RestaurantFAQ.tsx` (future).

7. **Viewing History**  
   - `/restaurant/history` → `History.tsx`:  
     - Fetches `GET /api/history`, shows past days’ summaries (earnings, waste, net).

---

## 🛠️ Running Locally

1. **Install dependencies**  
   ```bash
   cd frontend
   npm install
   ```

2. **Start dev server**  
   ```bash
   npm run dev
   ```

3. **API end-points** (assumed running on the same origin or proxied):  
   - `GET /api/servings`  
   - `POST /api/servings`  
   - `DELETE /api/servings/:name`  
   - `POST /api/archive`  
   - `GET /api/events`  
   - `POST /api/events`  
   - `DELETE /api/events/:id`  
   - `GET /api/history`

---

## 📈 Next Steps

- Integrate real authentication & authorization.  
- Hook up to a production-ready backend (Node/Express, Flask, etc.).  
- Flesh out Restaurant FAQ and Settings pages.  
- Add error boundaries, loading spinners, and form validation.  
- Deploy via Vercel/Netlify and configure environment variables.
- Restaurant Dashboard mei NGO wala section jaha pr NGO ki request and response handler wala section banana h
- Jese main page ka review h vesa NGO wala banana h 
- main dashboard se available food hatake ab tk ngo and restaurant ne kya kiya vo sb ayega 


Database :
check number of users 
node -e "const { PrismaClient } = require('@prisma/client'); const db=new PrismaClient(); db.user.count().then(c => console.log('Users:',c))"

JWT_SECRET='4f8d2a3e9b7c1d5f6a4e3c2b1f9d8a7c4e6f2b9a8d7c1e3f6b4a5c2d7e9f8a3d'

to see user data table:  npx prisma studio
---
