# Implementation Plan: JanVikas Setu (ஜன்விகாஸ் சேது)
## National Citizen Infrastructure & Demand Intelligence Platform

JanVikas Setu is an open Digital Public Good (DPG) designed to bridge the gap between grassroots citizen grievances and national capital expenditure planning across India. Built with a dual-portal architecture, it empowers citizens to voice localized infrastructure deficits in their native languages (prioritizing Tamil & English) via voice notes, messaging interfaces, and web forms, while equipping district collectors and national policymakers with spatial demand heatmaps, infrastructure deficit indices, and Gemini-powered project prioritization.

---

### User Experience & Dual-Portal Architecture

```
                                  JANVIKAS SETU
                         (Digital Public Good Architecture)
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│  Citizen Multilingual Portal │              │ Policymaker Spatial Hub      │
│  (குடிமக்கள் தளம் - Tamil / En) │              │ (கொள்கை வகுப்பாளர் தளம்)     │
├──────────────────────────────┤              ├──────────────────────────────┤
│ • Voice Note Recorder & Mic  │              │ • Spatial Heatmap (Districts)│
│ • WhatsApp / SMS Channel Sim │              │ • Deficit vs. Capex Indices  │
│ • Tanglish & Tamil Auto-NLP  │              │ • Demand Hotspot Clustering  │
│ • Instant Ticket & Tracking  │              │ • Gemini Project Prioritizer │
│ • Community Issue Upvoting   │              │ • One-Click DPR Memo Builder │
└──────────────┬───────────────┘              └──────────────┬───────────────┘
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      ▼
               ┌─────────────────────────────────────────────┐
               │ Unified AI Engine (Gemini 3.8 Flash / Express│
               │ • Voice-to-Intent Extraction                │
               │ • Tamil/English Translation & Normalization │
               │ • Capex-to-Demand Alignment Scoring         │
               └─────────────────────────────────────────────┘
```

---

### Key Capabilities & Functional Specification

#### 1. Citizen Multilingual Intake Portal (குடிமக்கள் சேவை மையம்)
- **Bilingual Interface (Tamil தமிழ் & English)**: Complete UI localization switchable in one click, with bilingual prompts, status tags, and voice instructions.
- **Multimodal Intake**:
  - **Voice Input**: Audio recording simulator with real-time browser Web Speech API & Gemini audio transcription fallback. Handles spoken Tamil, English, and colloquial Tanglish (e.g., *"எங்க ஏரியால தண்ணி பைப் உடைஞ்சு 2 வாரமா ரோடெல்லாம் சேறா இருக்கு"* or *"Madurai bypass road streetlights not working"*).
  - **Messaging App Simulator (WhatsApp / Citizen Bot)**: Conversational chat interface replicating a citizen submitting photos, voice notes, and live locations on WhatsApp/Telegram.
  - **Direct Structured Web Form**: Fast form with automatic geo-tagging, district/taluk selection (focusing on Tamil Nadu districts: Chennai, Madurai, Coimbatore, Tiruchirappalli, Salem, Dharmapuri, Ramanathapuram, plus national sample corridors), and department tagging (Jal Jeevan/Water, PMGSY/Roads, Power, Healthcare, Education).
- **Gemini-Powered Extraction**: Auto-extracts category, severity (P1-Critical to P4-Minor), affected population estimate, estimated budget band, and generates a verifiable National Grievance Tracking ID (e.g., `JVS-TN-2026-8942`).
- **Community Transparency Feed**: Local citizens can browse nearby issues in their taluk and upvote or confirm if the issue also affects their household, creating natural demand aggregation.

#### 2. Policymaker Spatial & Demand Intelligence Portal (கொள்கை வகுப்பாளர் அரங்கம்)
- **National & State Overview Dashboard**:
  - Top-line KPIs: Total Citizen Demands, Critical Infrastructure Hotspots, Misaligned Capex Ratio (budget planned vs. actual citizen demand), and High-Priority Project Pipeline.
  - District Vulnerability & Deficit Index (integrating Census/NFHS water scarcity, road connectivity, primary healthcare distance, and grid reliability).
- **Spatial Demand Map & Heatmap Explorer**:
  - Interactive district map of Tamil Nadu & sample national corridors.
  - Color-coded infrastructure deficit vs. citizen demand intensity (Chloropleth / heat pins).
  - Multi-dimensional filters: Sector (Water, Transport, Health, Energy, Education), Urgency, Funding Status (Unfunded Gap, Budget Approved, Under Construction).
- **Hotspot Clustering & Citizen Sentiment Synthesis**:
  - Aggregates hundreds of localized voice and text tickets into systemic infrastructure bottlenecks (e.g., *"142 complaints in Ramanathapuram coastal belt reporting saltwater intrusion in borewells"*).
- **Gemini Project Prioritization Matrix**:
  - An intelligent recommendation engine that analyzes aggregated complaints against state public investment plans (PM GatiShakti, Jal Jeevan Mission, Bharatmala).
  - Computes an **Impact Priority Score** (1-100) based on:
    1. Citizen Demand Volume & Vulnerability Weight (40%)
    2. Infrastructure Deficit Gap (30%)
    3. Economic & Health Multiplier (20%)
    4. Capex Feasibility & Readiness (10%)
- **Cabinet-Ready DPR (Detailed Project Report) & Policy Memo Generator**:
  - Policymakers can select a recommended project (or generate a custom one) and invoke Gemini to formulate an official bilingual Project Proposal / Cabinet Note with objective, budget estimate, timeline, citizen quotes, and expected socio-economic ROI.
  - Exportable / printable formatted memo.

---

### Technical Architecture & File Structure

```
├── server.ts                               # Full-stack Express server with Vite middleware proxy
│                                           # Secure Gemini AI proxy routes (/api/ai/*)
├── package.json                            # Added express dependencies & tsx dev script
├── metadata.json                           # App name: "JanVikas Setu: National Citizen Infrastructure & Demand Intelligence"
├── index.html                              # Updated title, fonts (Inter + Noto Sans Tamil), and metadata
└── src/
    ├── types/
    │   └── index.ts                        # Schemas for Tickets, Districts, Capex Projects, Hotspots
    ├── data/
    │   ├── mockDistricts.ts                # Real-world demographic, infrastructure deficit & capex data
    │   └── mockTickets.ts                  # Seed bilingual complaints across Tamil Nadu & national corridors
    ├── services/
    │   └── geminiService.ts                # Gemini 3.8 Flash calls for audio/text parsing, priority scoring, DPR generation
    ├── utils/
    │   └── translations.ts                 # Full Tamil / English bilingual dictionary & helpers
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx                  # Government DPG header with Ashoka emblem motif & bilingual switch
    │   │   └── TabNav.tsx                  # Clean segmented switch between Citizen Portal & Policymaker Portal
    │   ├── citizen/
    │   │   ├── VoiceIntakeModal.tsx        # Voice recording with live mic waveform & instant AI transcript
    │   │   ├── WhatsAppSimulator.tsx       # Conversational chat intake interface
    │   │   ├── GrievanceForm.tsx           # Structured complaint submission with district selection
    │   │   ├── TicketReceiptModal.tsx      # Formal receipt with DPG QR/Barcode representation
    │   │   └── CommunityFeed.tsx           # Public issues feed with upvoting & map pins
    │   ├── policymaker/
    │   │   ├── MetricCards.tsx             # Capex vs. demand analytics & deficit indicators
    │   │   ├── SpatialHeatmap.tsx          # Interactive district demand & infrastructure deficit map
    │   │   ├── HotspotClusterList.tsx      # Systemic cluster breakdown with AI sentiment summaries
    │   │   ├── ProjectPrioritizer.tsx      # Multi-criteria scoring table with Gemini recommendations
    │   │   └── DPRMemoGenerator.tsx        # Cabinet-ready detailed project report generator & exporter
    └── App.tsx                             # Primary state management & portal coordinator
```

---

### Design System (Strict Frontend Constitution Compliance)
- **Palette**: Civic & institutional authority — Deep State Navy (`#0A192F`, `#0F2744`), Ashoka Emerald (`#065F46`, `#047857`), Saffron/Amber accent (`#D97706`), Slate parchment backgrounds (`#F8FAFC`).
- **Zero-Pill Discipline**: No pill badges or capsule enclosures for static metadata; dates, departments, districts, and status indicators rendered as clean unboxed typographic rows with mid-dots (`·`) and subtle borders.
- **Bilingual Typographic Harmony**: Clean pairing of modern sans-serif with proper Tamil font metrics (`Noto Sans Tamil` / system fonts) ensuring legible diacritics and line-height balance.
- **Audio Feedback**: Waveform visualization during voice recording and clear tactile feedback on submission.

---

### Verification & Testing Plan
1. **Compilation**: Verify build with `compile_applet` and check for clean TypeScript compilation.
2. **Citizen Flow**:
   - Test audio voice note submission in Tamil & English.
   - Verify WhatsApp simulation chat flow and ticket generation.
   - Test upvote functionality and filter by district.
3. **Policymaker Flow**:
   - Verify spatial map sector toggling and district detail drawer.
   - Test Gemini project prioritization and verify DPR memo generation with bilingual outputs.
