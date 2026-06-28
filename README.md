# 🌾 AgriRental — Agricultural Equipment Rental & Sharing System

Full-stack MERN application connecting farmers with equipment owners.

---

## 📁 Project Structure

```
agri-rental/
├── backend/                   ← Node.js + Express API
│   ├── config/db.js           ← MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js  ← JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Equipment.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── controllers/           ← Business logic
│   ├── routes/                ← API route definitions
│   ├── uploads/               ← Equipment images (auto-created)
│   ├── .env                   ← Environment variables
│   └── server.js              ← Entry point
│
└── frontend/                  ← React app
    └── src/
        ├── context/
        │   └── AuthContext.jsx    ← Global auth state (JWT + user)
        ├── utils/
        │   └── api.js             ← Axios instance (auto-adds token)
        ├── components/
        │   ├── Navbar.jsx
        │   └── EquipmentCard.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── farmer/
        │   │   ├── EquipmentList.jsx   ← Browse + filter
        │   │   ├── EquipmentDetail.jsx ← Book + reviews
        │   │   └── FarmerBookings.jsx  ← Pay + review
        │   ├── owner/
        │   │   ├── OwnerDashboard.jsx  ← Stats + listings
        │   │   ├── AddEquipment.jsx    ← Upload form
        │   │   └── OwnerBookings.jsx   ← Accept/reject
        │   └── admin/
        │       ├── AdminDashboard.jsx  ← Stats overview
        │       ├── AdminUsers.jsx      ← Verify/ban users
        │       ├── AdminEquipment.jsx  ← Verify listings
        │       └── AdminBookings.jsx   ← Monitor all bookings
        └── App.jsx                 ← Routes + PrivateRoute
```

---

## ⚙️ HOW FILES CONNECT

### 1. Frontend → Backend (API calls)
- `src/utils/api.js` is the **single Axios instance** used everywhere
- It reads JWT from `localStorage` and adds it as `Authorization: Bearer <token>` on every request
- All pages import `API` from `../../utils/api` and call `API.get/post/put`

### 2. Auth Flow
```
Register/Login page → POST /api/auth/register or /login
  → authController creates user, returns { token, user }
  → AuthContext.login() saves token + user to localStorage + React state
  → App.jsx PrivateRoute reads AuthContext to protect pages
```

### 3. Equipment Flow
```
Owner: AddEquipment → POST /api/equipment (multipart/form-data with images)
  → Multer saves images to /backend/uploads/
  → Equipment stored with isVerified: false

Admin: AdminEquipment → GET /api/admin/equipment/pending
  → PUT /api/admin/equipment/:id/verify → isVerified: true

Farmer: EquipmentList → GET /api/equipment (with query filters)
  → EquipmentDetail → GET /api/equipment/:id
```

### 4. Booking Flow
```
Farmer: EquipmentDetail → POST /api/bookings → status: 'pending'
Owner:  OwnerBookings  → PUT /api/bookings/:id/status → 'accepted' or 'rejected'
Farmer: FarmerBookings → PUT /api/bookings/:id/pay   → paymentStatus: 'paid'
Farmer: FarmerBookings → POST /api/reviews (after payment)
```

### 5. Admin Flow
```
Admin routes are all protected by:
  protect middleware (checks JWT) + adminOnly middleware (checks role)
```

---

## 🚀 Setup & Run

### Step 1 — Install MongoDB
Install MongoDB locally or use MongoDB Atlas (free cloud).

### Step 2 — Backend Setup
```bash
cd agri-rental/backend
npm install
# Edit .env:
#   MONGO_URI=mongodb://localhost:27017/agri-rental
#   JWT_SECRET=your_secret_key
npm run dev
```
Backend runs on: http://localhost:5000

### Step 3 — Frontend Setup
```bash
cd agri-rental/frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

### Step 4 — Create Admin User
Use a MongoDB client or Compass. After registering normally, open MongoDB and update:
```js
db.users.updateOne({ email: "admin@agri.com" }, { $set: { role: "admin", isVerified: true } })
```

---

## 🔗 API Endpoints Summary

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET  | /api/equipment | Public |
| GET  | /api/equipment/:id | Public |
| POST | /api/equipment | Owner |
| GET  | /api/equipment/my | Owner |
| POST | /api/bookings | Farmer |
| GET  | /api/bookings/farmer | Farmer |
| GET  | /api/bookings/owner | Owner |
| PUT  | /api/bookings/:id/status | Owner |
| PUT  | /api/bookings/:id/pay | Farmer |
| POST | /api/reviews | Farmer |
| GET  | /api/admin/stats | Admin |
| GET  | /api/admin/users | Admin |
| PUT  | /api/admin/users/:id/verify | Admin |
| PUT  | /api/admin/users/:id/ban | Admin |
| GET  | /api/admin/equipment/pending | Admin |
| PUT  | /api/admin/equipment/:id/verify | Admin |
| GET  | /api/admin/bookings | Admin |

---

## 🛠 Tech Stack
- **Frontend**: React 18, React Router v6, Axios, CSS
- **Backend**: Node.js, Express.js, Multer
- **Database**: MongoDB, Mongoose
- **Auth**: JWT (jsonwebtoken), bcryptjs
