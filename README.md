# 🧠🍽️ SmartMeal AI

**SmartMeal AI** is a responsive, intelligent web app that bridges the gap between surplus food and hunger by connecting **restaurants** with **NGOs**. Using real-time dashboards, food availability tracking, and AI-powered predictions, the platform aims to **rescue edible food** and **nourish communities**.

---

## 🚀 Tech Stack

- **Framework**: React + Vite  
- **Language**: TypeScript  
- **Routing**: React Router v6  
- **Styling**: Tailwind CSS  
- **Animations**: Framer Motion  
- **Icons**: Lucide React  
- **State & Forms**: React Hooks (useState, useEffect)  
- **HTTP Client**: Axios  
- **Backend**: Node.js, Express.js  
- **Database**: Prisma ORM with SQLite  
- **Auth**: JWT (Stubbed for now)

---

## 🧩 Features

### 🏠 Public Pages
- ✅ Landing Page (Mission, Counters, How it Works)
- ✅ Food Details (Available rescued food overview)
- ✅ Reviews (Testimonials carousel)
- ✅ FAQs

### 🧑‍🍳 Restaurant Dashboard
- 🍽️ Upload food details with quantity & freshness
- 📊 Recalibration button: Instant AI model prediction
- 🧾 Track total plates served, servings added
- 📅 Upcoming 5 Events section with real-time preview
- ⚙️ Settings & Profile customization
- 🧠 View history: earnings, waste reduction, net savings

### 🏥 NGO Dashboard
- 📦 See all available food items across restaurants
- 📩 Send food requests to restaurants
- 💬 Send feedback after receiving food
- 🔄 NGO activity summary on main dashboard

---

## 📁 File Structure

frontend/
└── src/
├── App.tsx
├── index.tsx
├── layouts/
│ ├── MainLayout.tsx
│ └── RestaurantLayout.tsx
├── pages/
│ ├── public/
│ │ ├── Landing.tsx
│ │ ├── FoodDetails.tsx
│ │ ├── Reviews.tsx
│ │ └── FAQ.tsx
│ ├── authentication/
│ │ ├── SigninNGO.tsx
│ │ └── SigninRestaurant.tsx
│ └── restaurant/
│ ├── Dashboard.tsx
│ ├── TodaysServing.tsx
│ ├── Events.tsx
│ ├── Settings.tsx
│ ├── History.tsx
│ └── RestaurantFAQ.tsx
├── components/
│ ├── common/
│ │ ├── Footer.tsx
│ │ └── FloatingFoodIcons.tsx
│ ├── restaurant/
│ │ └── Navbar.tsx
│ └── ui/
│ ├── Button.tsx
│ └── Card.tsx
└── styles/
└── index.css

yaml
Copy
Edit

---

## 🔄 App Workflow

### 🌐 Public Browsing
- Landing `/`
- `/food-details`, `/reviews`, `/faq`

### 🔐 Authentication
- NGO: `/signin/ngo`
- Restaurant: `/signin/restaurant`  
(Auth is stubbed; backend planned)

### 🧑‍🍳 Restaurant Portal (after login)
- Animated layout (Framer Motion)
- Navbar: Dashboard, Serving, Events, Settings, History
- Dashboard: Quick stats, events, NGO request overview
- Todays Serving: Add/Delete daily food served
- Events: Add/Delete upcoming distribution events
- History: Past-day summaries
- Recalibration button to trigger AI instantly

### 🏥 NGO Dashboard (upcoming)
- Browse available food
- Request from restaurants
- Provide post-delivery feedback
- Dashboard showing NGO activity & request status

---

## 🛠 Run Locally

```bash
git clone https://github.com/your-username/smartmeal-ai.git
cd frontend
npm install
npm run dev
Make sure your backend is running at the same origin or proxied.

🧪 API Endpoints
bash
Copy
Edit
GET     /api/servings
POST    /api/servings
DELETE  /api/servings/:name

GET     /api/events
POST    /api/events
DELETE  /api/events/:id

POST    /api/archive
GET     /api/history
🗂 Developer Tips
🧾 Check user count in DB:

bash
Copy
Edit
node -e "const { PrismaClient } = require('@prisma/client'); const db=new PrismaClient(); db.user.count().then(c => console.log('Users:', c))"
🔍 Explore data:

bash
Copy
Edit
npx prisma studio
🔐 JWT Secret (local):

ini
Copy
Edit
JWT_SECRET='4f8d2a3e9b7c1d5f6a4e3c2b1f9d8a7c4e6f2b9a8d7c1e3f6b4a5c2d7e9f8a3d'
📈 Future Enhancements
🔐 Real authentication & session management

⚙️ NGO dashboard improvements

📊 Advanced analytics for food saved and lives served

🧾 Real-time request logs (NGO <--> Restaurant)

📦 Admin role to monitor ecosystem

🌍 Deployment on Vercel/Netlify

🧪 Add form validation, spinners, error boundaries

🏁 Deployment Preview
Coming soon via Netlify or Vercel. Stay tuned!