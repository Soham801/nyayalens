<div align="center">

<img src="https://img.shields.io/badge/NyayaLens-AI%20Powered%20IP%20Protection-0F766E?style=for-the-badge&logoColor=white" alt="NyayaLens"/>

# न्यायLens — NyayaLens

### AI-Powered Intellectual Property Protection for India's Artisans

*Empowering 7+ crore weavers, folk artists & craftspeople to prove, protect and defend their creative work — in their own language, at zero cost.*

<br/>

[![Google Solution Challenge 2026](https://img.shields.io/badge/Google%20Solution%20Challenge-2026-4285F4?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/community/gdsc-solution-challenge)
[![Theme](https://img.shields.io/badge/Theme-Digital%20Asset%20Protection-0F766E?style=flat-square)](.)
[![Built With React](https://img.shields.io/badge/Built%20With-React.js-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Gemini AI](https://img.shields.io/badge/Powered%20By-Google%20Gemini%20AI-EA4335?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FBBC04?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License MIT](https://img.shields.io/badge/License-MIT-15803D?style=flat-square)](LICENSE)

<br/>

> **"A Banarasi weaver spends 3 weeks making a saree. A fast-fashion brand copies it in 3 days. NyayaLens gives her the power to fight back — in Hindi, for free, in 5 minutes."**

<br/>

[🚀 Live Demo](#-live-demo) · [🎥 Demo Video](#-demo-video) · [📖 How It Works](#-how-it-works) · [⚙️ Setup](#️-local-setup) · [🏗️ Architecture](#️-architecture)

---

</div>

## 🔴 The Problem

India has **7.2 crore artisans** — the second largest employment sector after agriculture — yet they have **zero accessible tools** to protect their creative work.

| The Gap | Reality |
|---|---|
| 🕐 **Speed of copying** | A design displayed at an exhibition is reproduced industrially within **72 hours** |
| 💸 **Cost of legal action** | A civil IP lawsuit costs ₹2–10 lakh with an 18–36 month timeline |
| 🌐 **Language barrier** | All IP tools require English. Most artisans communicate only in regional languages |
| 📱 **Technology gap** | Brand monitoring tools cost $500–$5,000/month — designed for corporations, not artisans |
| 📄 **No proof of authorship** | Physical objects cannot be timestamped. Artisans have no verifiable record of creation |

> **₹8,000 crore** worth of counterfeit craft goods are sold annually in India *(ASSOCHAM 2023)* — with zero accountability to the original creators.

---

## ✅ Our Solution — NyayaLens

NyayaLens is a **React.js web application** that gives India's artisans a complete IP protection pipeline — from proof of creation to legal complaint — entirely in their own language, at zero cost.

```
Artisan photographs work
        ↓
AI generates tamper-proof Certificate of Creation (pHash + Gemini Vision)
        ↓
Copy found? Photograph it → NyayaLens returns similarity score 0–100%
        ↓
94% match? Gemini auto-generates legal complaint letter in Hindi/Marathi/Tamil
        ↓
One click → complaint sent to NGO partner via WhatsApp
```

### What makes NyayaLens different from every existing solution

| Solution | Proof of Creation | Copy Detection | Legal Complaint | Indian Languages | Cost to Artisan |
|---|:---:|:---:|:---:|:---:|:---:|
| GI Tags (Govt.) | ✗ | ✗ | ✗ | Partial | Free (2–5 yrs wait) |
| Copyright Registration | ✓ complex | ✗ | ✗ | ✗ English only | ₹500–₹2,000 |
| IP Law Firms | ✓ | Manual only | ✓ | ✗ English only | ₹2–₹10 Lakh |
| BrandShield / RedPoints | ✗ | ✓ online only | ✗ | ✗ English only | $500–$5,000/mo |
| **NyayaLens ★** | **✓ AI cert in 60s** | **✓ pHash + Gemini** | **✓ Auto-generated** | **✓ 12 languages** | **₹0 FREE** |

---

## 🎥 Demo Video

[![NyayaLens Demo](https://img.shields.io/badge/▶%20Watch%20Demo-3%20Minutes-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/your-demo-link)

**90-second demo scenario:**
1. Artisan "Sunita Devi" opens NyayaLens → selects Hindi
2. Photographs her handwoven Banarasi saree → Certificate `NL-2026-MH-04921` generated instantly
3. Spots a copy on Flipkart → scans it → **94% similarity match detected**
4. Taps "File Complaint" → legal letter appears in Hindi, pre-filled with all evidence
5. Sends to NGO partner via WhatsApp in one tap → Case reference generated

---

## 🚀 Live Demo

🌐 **[nyayalens.lovable.app](nyayalens.lovable.app)** 

**Test credentials for judges:**
```
Phone: +91 9999999999
OTP:   123456
```
> Pre-loaded with Sunita Devi's test account including 1 registered saree design and 1 detected copy at 94% similarity — ready for the full demo flow.

---

## 🖥️ App Screens

| Screen | Description |
|---|---|
| **🔐 Login** | Firebase Phone OTP — no email needed. Hindi tagline: *"न्याय आपके हाथों में"* |
| **🌐 Language Selection** | 12 Indian languages — Hindi, Marathi, Tamil, Telugu, Kannada, Bengali + more |
| **📋 Dashboard** | Registered works count, active cases, quick-action cards |
| **📸 Register Work** | Camera capture → on-device pHash → Gemini Vision design analysis → PDF certificate |
| **🔍 Copy Scan** | Photograph suspected copy → similarity score 0–100% with match timeline |
| **⚖️ Legal Complaint** | Gemini auto-generates formal complaint in local language citing Copyright Act 1957 |
| **📁 Case History** | All cases with status badges: Draft / Submitted / Resolved |

---

## 📖 How It Works

### 1. Certificate of Creation
When an artisan photographs their work, NyayaLens:
- Computes a **perceptual hash (pHash)** of the image on the client side — a 64-character fingerprint unique to the visual design
- Sends the image to **Google Gemini Vision API** which extracts a structured description: craft type, color palette, geometric motifs, distinctive patterns
- Generates a **timestamped PDF certificate** with: Certificate ID, artisan name & location, creation date/time, AI design description, and the pHash fingerprint
- Saves all metadata to **Firebase Firestore** with GPS coordinates

### 2. Copy Detection
When an artisan scans a suspected copy:
- pHash of the scanned image is computed on-device
- **Hamming distance** is calculated against all stored certificate hashes
- **Gemini Vision** provides semantic similarity scoring for the top matches — detecting copies even when colour or scale has been altered
- Result: similarity score 0–100%, matched certificate, and a **timeline proving temporal precedence**

### 3. Legal Complaint Generation
When similarity exceeds the threshold (75%+):
- **Gemini API** generates a formal legal complaint letter in the artisan's chosen language
- Letter cites **Copyright Act 1957, Section 51** and includes all evidence details
- Complete complaint package (letter + certificate + evidence) dispatched via **WhatsApp** to the nearest NGO partner

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NyayaLens React App                       │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Auth    │  │ Register │  │   Scan   │  │ Complaint │  │
│  │ Screen   │  │  Work    │  │  Copy    │  │ Generator │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       │              │              │               │        │
│  ─────┴──────────────┴──────────────┴───────────────┴─────  │
│                    React Context / State                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
  ┌───────────────┐ ┌──────────────┐ ┌──────────────────┐
  │ Firebase Auth │ │ Gemini Vision│ │   Gemini API     │
  │ Phone OTP     │ │ Image Analyze│ │ Complaint Letter │
  │               │ │ pHash + desc │ │ 12 Indian langs  │
  └───────────────┘ └──────────────┘ └──────────────────┘
          │
  ┌───────▼───────┐
  │   Firestore   │
  │  Certificates │
  │  Case Records │
  └───────────────┘
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- A Firebase project (Spark free plan — no billing required)
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository
```bash
git clone https://github.com/Soham801/nyayalens.git
cd nyayalens
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
REACT_APP_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=nyayalens-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=nyayalens-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=nyayalens-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=XXXXXXXXXXXX
REACT_APP_FIREBASE_APP_ID=1:XXXXXXXXXXXX:web:XXXXXXXXXXXX
```

### 3. Firebase setup
```bash
# Enable Phone Auth in Firebase console → Authentication → Sign-in method → Phone
# Enable Firestore in Firebase console → Firestore Database → Create database
# Add test number for development: +91 9999999999 → OTP: 123456
```

### 4. Run the app
```bash
npm start
# Opens at http://localhost:3000
```

### 5. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
nyayalens/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginScreen.jsx          # Phone OTP login
│   │   ├── onboarding/
│   │   │   └── LanguageSelection.jsx    # 12 Indian languages
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx            # Home screen
│   │   ├── register/
│   │   │   ├── RegisterWork.jsx         # Camera + pHash + Gemini
│   │   │   └── CertificatePreview.jsx   # Generated certificate
│   │   ├── scan/
│   │   │   ├── ScanCopy.jsx             # Copy detection
│   │   │   └── SimilarityResult.jsx     # Match result + timeline
│   │   ├── complaint/
│   │   │   └── ComplaintPreview.jsx     # Gemini letter + WhatsApp
│   │   └── history/
│   │       └── CaseHistory.jsx          # All cases + status
│   ├── services/
│   │   ├── geminiService.js             # Gemini Vision + complaint API
│   │   ├── firebaseService.js           # Auth + Firestore operations
│   │   └── pHashService.js              # On-device perceptual hashing
│   ├── context/
│   │   ├── AuthContext.jsx              # Firebase auth state
│   │   └── AppContext.jsx               # Language, user preferences
│   ├── utils/
│   │   ├── pdfGenerator.js              # Certificate PDF generation
│   │   └── whatsappService.js           # WhatsApp dispatch
│   ├── App.jsx
│   └── index.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js 18 | Component-based UI, routing, state management |
| **AI — Vision** | Google Gemini Vision API | Artwork image analysis, design description, semantic similarity |
| **AI — Language** | Google Gemini API | Legal complaint generation in 12 Indian languages |
| **Authentication** | Firebase Auth (Phone OTP) | Passwordless login — no email required |
| **Database** | Firebase Firestore | Certificate metadata, case records, artisan profiles |
| **Fingerprinting** | On-device pHash (JS) | Perceptual hash computed in browser — works offline |
| **PDF Generation** | jsPDF | Client-side certificate PDF — no server required |
| **Dispatch** | WhatsApp Web API | One-tap complaint delivery to NGO partners |
| **Hosting** | Vercel / Firebase Hosting | Free tier, global CDN |

---

## 🌍 Social Impact

### UN Sustainable Development Goals

| SDG | Connection |
|---|---|
| **SDG 1 — No Poverty** | Protecting artisan incomes directly counters economic displacement from design theft |
| **SDG 8 — Decent Work** | Enabling fair economic participation for 7.2 crore informal sector creators |
| **SDG 10 — Reduced Inequalities** | Giving rural, low-income creators the same IP protection corporations have always had |
| **SDG 11 — Sustainable Communities** | Preserving intangible cultural heritage — 43 Indian art forms listed as endangered by UNESCO |
| **SDG 16 — Justice & Institutions** | Expanding access to justice for a population entirely excluded from the legal system |

### Numbers that matter

```
7.2 Crore    artisans in India with zero IP protection tools
₹8,000 Cr    counterfeit craft market annually (ASSOCHAM 2023)
72 Hours     average time for a design to be copied after exhibition
₹0           cost to use NyayaLens — forever
12           Indian languages supported
5 Minutes    from photographing work to filed complaint
```

---

## 🗺️ Roadmap

### ✅ MVP (Built — Hackathon Submission)
- [x] Phone OTP authentication
- [x] 22 Indian language selection
- [x] AI Certificate of Creation (pHash + Gemini Vision)
- [x] Copy scan with similarity scoring
- [x] Gemini legal complaint generation
- [x] Case history with status tracking
- [x] Dashboard with stats

### 🔜 Phase 2 (Post-Hackathon)
- [ ] Pan-India NGO partner network (50+ partners)
- [ ] Automated e-commerce scanning (Flipkart, Amazon, Meesho)
- [ ] Government API — Copyright Office India integration
- [ ] GI Registry notification system
- [ ] Community design library for GI-tagged craft regions
- [ ] Mobile app (React Native / Flutter)

### 🔮 Phase 3 (Scale)
- [ ] Ministry of Textiles data partnership
- [ ] Blockchain-anchored certificate timestamping
- [ ] Export to WIPO for international IP protection
- [ ] Artisan cooperative collective registration
- [ ] Legal outcome tracking and success metrics

---

## 👥 Team

| Name | Role |
|---|---|
| **Soham Deshmukh** | Team Lead — Full Stack & AI Integration |

**Institution:** MGM University, Aurangabad, Maharashtra
**Contact:** sohamdeshmukh801@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Gemini AI](https://ai.google.dev) — Vision analysis and multilingual complaint generation
- [Firebase](https://firebase.google.com) — Authentication infrastructure
- [Ministry of Textiles, India](https://texmin.nic.in) — Artisan sector data
- [Crafts Council of India](https://craftscouncilofindia.org) — Craft community insights
- [Google Developer Student Clubs](https://developers.google.com/community/gdsc) — Solution Challenge platform

---

<div align="center">

**Built with ❤️ for India's 7.2 crore artisans**

*Google Solution Challenge 2026 | Team NyayaLens | Aurangabad, Maharashtra*

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![Google Solution Challenge](https://img.shields.io/badge/Google%20Solution%20Challenge-2026-34A853?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/community/gdsc-solution-challenge)

</div>
