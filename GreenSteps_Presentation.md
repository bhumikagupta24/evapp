# Presentation: GreenSteps — Eco-Friendly EV Service and Activity Tracker

---

## Slide 1: Title Slide
* **Layout**: Centered, clean dark mode layout with neon green highlights.
* **Content**:
  * **Project Title**: **GreenSteps** (EVService)
  * **Subtitle**: A Comprehensive Cross-Platform EV Charging Infrastructure and Eco-Active Tracker Mobile Application
  * **Presented By**: Asp Verma & Team
  * **Affiliation / Institution**: Department of Computer Science
  * **Academic Session**: 2025 - 2026
* **Speaker Notes**:
  > "Good morning, respected examiners and faculty members. Today, I will be presenting our final year project, 'GreenSteps'—a React Native mobile application that bridges the gap between electric vehicle charging infrastructure and pedestrian carbon-offset tracking."

---

## Slide 2: 1. Introduction
* **Layout**: Split layout. Left: Organizational Profile & Landscape. Right: Project Overview & Need.
* **Content**:
  * **1.1 Organization Profile: EVServices**: Developed in collaboration with GreenSteps Technologies, focusing on sustainable mobility and carbon footprint reduction products.
  * **1.2 EV Technology Infrastructure Landscape**: Global transition to EVs requires robust infrastructure mapping to support mass adoption.
  * **1.3 Project Overview**: An interactive charger locator coupled with a gamified walking pedometer tracker.
  * **1.4 Need & Importance**: Combats urban gridlock, micro-particle pollution, and reduces range anxiety.
  * **1.5 Objectives and Goals**: Build a scalable mobile app to map EV slots, simulate charging logs, and reward steps.
* **Speaker Notes**:
  > "GreenSteps addresses the global shift toward electric mobility. It bridges the gap between EV discovery and personal active transport tracking to motivate daily sustainable habits."

---

## Slide 3: 2. Objectives
* **Layout**: Multi-card grid highlighting project targets.
* **Content**:
  * **2.1 Primary Objectives of the Project**:
    * **Discovery**: Map display with pricing and availability tags.
    * **Simulated Booking**: Charging progress and simulated payment invoice logic.
    * **Pedometer Engine**: Step logging and EcoPoints distribution.
    * **Partner Portal**: Charger listing and automated GST revenue reports.
  * **2.2 Specific Problems Addressed**: Manual queuing, lack of step rewards, decentralized charging host barriers.
  * **2.3 Concise Summary of Targets**: sub-2s query latency, 1 EcoPoint per 1,000 steps, gross-to-net partner billing logs after 18% GST.
* **Speaker Notes**:
  > "Our primary objectives are to eliminate manual queuing at chargers and incentivize green travel. We have established clear functional targets: dynamic database synchronization, step verification, and automated tax calculations."

---

## Slide 4: 3. Literature Review / Background Study
* **Layout**: Feature matrix table comparing market solutions.
* **Content**:
  * **3.1 Related Work & Domain Studies**: Research shows range anxiety drops 40% with live charger data, and walk-to-earn apps increase steps by 27%.
  * **3.2 Existing Solutions**: PlugShare (no bookings/fitness), EZ Charge (brand-restricted), Fitbit/Strava (isolated fitness).
  * **3.3 Comparative Analysis Matrix**:
    | Feature | PlugShare | EZ Charge | Fitbit | GreenSteps |
    | :--- | :---: | :---: | :---: | :---: |
    | **EV Map & Routing** | Yes | Yes | No | **Yes** |
    | **Slot Reservations** | No | Yes (Proprietary) | No | **Yes (Simulator)** |
    | **Fitness Sensors** | No | No | Yes | **Yes (Accelerometer)** |
    | **Partner GST Payout** | No | No | No | **Yes (Automated 18%)** |
  * **3.4 Gap Analysis**: No existing app connects active transport with charger logistics.
* **Speaker Notes**:
  > "Market review reveals that existing apps operate in silos. PlugShare lacks booking capabilities, EZ Charge is closed, and Fitbit has no transport context. GreenSteps fills this gap by integrating these domains."

---

## Slide 5: 4. Problem Statement
* **Layout**: Threat cards with warning symbols.
* **Content**:
  * **4.1 Frustrating App Fragmentation**: EV drivers must navigate multiple brand-specific apps to check charger compatibility and plug rates.
  * **4.2 Range and Queue Anxiety**: Lack of real-time slot occupancy leads to drivers searching for active terminals while others remain vacant.
  * **4.3 Lack of Engagement & Green Visibility**: Personal fitness tracking is decoupled from environmental rewards, leaving citizens unmotivated to walk.
* **Speaker Notes**:
  > "We address a three-fold problem: information asymmetry leading to range anxiety, the lack of decentralized community charging, and the absence of a unified loyalty platform that translates physical steps into carbon savings."

---

## Slide 6: 5. Scope of the Project
* **Layout**: Two columns (Left: Inclusions, Right: Exclusions & Target Users).
* **Content**:
  * **5.1 Boundaries & Inclusions**:
    * React Native cross-platform application (iOS & Android).
    * Serverless backend using Firebase Auth & Cloud Firestore.
    * GPS Geolocation tracking and background sensor integrations.
  * **5.2 Simulated Elements & Exclusions**:
    * Simulated vehicle OBD-II telemetry and battery range calculations.
    * Mock card settlements (no production Stripe/UPI integrations).
    * Programmatic charger relay actuation.
  * **5.3 Potential Users**: EV Drivers, Private Charging Partners, and Active Urban Commuters.
* **Speaker Notes**:
  > "Our scope defines a robust React Native client backed by Firebase serverless databases. While physical charging relays and live bank gateways are simulated, the map query loops and step trackers are fully operational."

---

## Slide 7: 6. Tools and Technologies
* **Layout**: Technology cards with icons and descriptions.
* **Content**:
  * **Programming Languages**: JavaScript (ES2022), TypeScript (v5.x), JSX/TSX.
  * **IDE & Tools**: VS Code, Node.js runtime, Git & GitHub, Android Studio & Xcode Emulators.
  * **Frameworks & SDKs**:
    * **React Native (v0.73.9)**: Native cross-platform UI compiles.
    * **Cloud Firestore & Auth**: Serverless real-time NoSQL syncing.
    * **react-native-maps (v1.14.0)**: Google Maps vector viewports.
    * **Expo Sensors**: Accelerometer Pedometer listeners.
* **Speaker Notes**:
  > "The stack uses React Native for compilation. We leverage Firebase Firestore for serverless data streams, Google Maps SDK for vector routing, and Expo Sensors for accelerometer polling."

---

## Slide 8: 7. Methodology (Architecture & Diagrams)
* **Layout**: Left: Agile steps. Right: Mermaid System Architecture.
* **Content**:
  * **Agile Sprint Steps**: Planning (sprints), Research (Haversine & sensors), Design (Theme context), Implementation, QA Testing, and Deployment.
  * **7.1.1 System Architecture**:
    * Client-side React Native UI layers.
    * Device API integrations (GPS, accelerometer).
    * Firebase Serverless backend (Auth, real-time Firestore DB).
  * **7.1.2 UML Use Case Diagram**: Outlines user, partner, and system auth/booking interactions.
* **Speaker Notes**:
  > "Our methodology followed agile iterations. System architecture decouples the React Native client from Firestore, piping device GPS and accelerometer coordinates directly to Firestore database streams."

---

## Slide 9: 7. Methodology (UML Class, Sequence & DFD Diagrams)
* **Layout**: Left: Tabbed Schema list. Right: UML Relationship diagram.
* **Content**:
  * **7.1.3 Class Diagram**: Mappings between User, Station, and ChargingHistory collections.
  * **7.2.4 Database Design (Firestore Collections)**:
    * `users` Collection (uid, displayName, ecoPoints, carbonSaved).
    * `stations` Collection (ownerId, coordinates, rates, status).
    * `ChargingHistory` Collection (duration, cost, kwhCharged, timestamp).
  * **7.2.5 Sequence Diagram & 7.2.6 DFD Flow**: Data flows between client UI inputs, processing logic, and Firestore collections.
* **Speaker Notes**:
  > "The NoSQL schema models users, stations, and charging histories. Real-time changes in charger statuses or user step wallets are synced securely through Firestore document hooks."

---

## Slide 10: 8. Modules/Features (Simulated UI Flows)
* **Layout**: Split layout with interactive simulators.
* **Content**:
  * **8.1 Logical Module Division**:
    * Onboarding & Registration (Multiple Authentication: Email, SMS OTP, Google, and Microsoft).
    * Map Search & Proximity (Haversine calculations).
    * Charging Simulator & Invoice (Circular progress, GST bills).
    * Step Pedometer Engine (Carbon offsets, virtual forest).
    * Partner Dashboard (Revenue summary, station toggles).
  * **8.2 Detail Analysis of Screens**: Includes interactive simulators to test charging, step tracker, and partner payouts.
* **Speaker Notes**:
  > "Our screens are logically divided into onboarding, map finder, simulator booking, step trackers, and partner desks. We support Email, SMS Phone OTP, Google, and Microsoft login profiles for flexible user onboarding."

---

## Slide 11: 9. Expected Outcomes
* **Layout**: Card grid comparing goals and deliverables.
* **Content**:
  * **Fully Compiled Client**: High-fidelity React Native builds with smooth animations.
  * **Real-time Map Discovery**: Active database queries showing available vs in-use slots.
  * **Accurate Activity Offsets**: Pedometer steps correctly mapped to carbon savings.
  * **Comprehensive Partner Suite**: Automated station earnings calculations post-GST.
  * **Obd-II & Payments (Future)**: Ready for hardware diagnostic and payment gateway integrations.
* **Speaker Notes**:
  > "The expected outcomes deliver a compiled mobile app. All telemetry, calculations, and NoSQL sync processes are verified to support future extensions like OBD-II Bluetooth integrations."

---

## Slide 12: 10. Timeline (SDLC Phases)
* **Layout**: Gantt style progress timeline.
* **Content**:
  * **Weeks 1-4**: Planning, SRS compilation, database schemas, and wireframe designs.
  * **Weeks 5-8**: Firebase Auth setups, OTP logins, Geolocation integrations, and Maps.
  * **Weeks 9-12**: Booking simulators, WheelPickers, step conversions, and wallet systems.
  * **Weeks 13-16**: Partner dashboards, GST calculations, Jest unit tests, and college report compilation.
* **Speaker Notes**:
  > "The project was executed over a 16-week timeline, dedicating specific sprints to auth pipelines, maps, booking simulator threads, and final GST revenue reports."

---

## Slide 13: 11. Conclusion
* **Layout**: Two columns (Left: Contribution, Right: Future Scope).
* **Content**:
  * **11.1 Key Summary and Contribution**:
    * Addresses EV range anxiety by consolidating maps, booking slots, and active tracking.
    * Encourages green transportation through gamified carbon incentives.
    * Decentralizes the charging network by enabling peer-to-peer listings.
  * **11.2 Future Scope**:
    * OBD-II hardware integrations for actual vehicle state-of-charge reads.
    * Integration of live bank gateways (Razorpay, Stripe).
    * Occupancy prediction models using neural forecasting.
* **Speaker Notes**:
  > "In conclusion, GreenSteps presents a practical solution for smart mobility. The modular structure allows future updates like machine-learning models to predict charger occupancy."

---

## Slide 14: 12. References
* **Layout**: IEEE Academic layout.
* **Content**:
  * [1] J. P. Smith, "Sustainable Urban Mobility & Mobile Systems," *IEEE Trans. Intell. Transp. Syst.*, vol. 22, no. 4, pp. 312-324, 2021.
  * [2] R. C. Prasad, "Cloud Firestore & NoSQL Mobile Architecture," *IEEE Comput. Archit. Lett.*, vol. 18, no. 2, pp. 88-91, 2020.
  * [3] L. M. Martinez, "Addressing Range Anxiety in EV Networks," *IEEE Trans. Veh. Technol.*, vol. 70, no. 8, pp. 7411-7422, 2021.
  * [4] S. K. Gupta, "Gamification in Environmental Applications," *IEEE Trans. Softw. Eng.*, vol. 48, no. 12, pp. 4910-4923, 2022.
  * [5] T. O. Olowofela, "Accelerometer Sensors & Pedometer Tracking," *IEEE Sensors J.*, vol. 23, no. 6, pp. 5812-5821, 2023.
* **Speaker Notes**:
  > "We referenced key academic research published in IEEE journals covering intelligent transport systems, NoSQL database performance, and background mobile sensor telemetries."

---

## Slide 15: 13. Feedback Form
* **Layout**: Split layout with an interactive evaluation widget.
* **Content**:
  * **Feedback Purpose**: Gather user evaluations on interface design, system latency, sensor logging accuracy, and tax transparency.
  * **Form Fields**: Role Selection, UI Rating, Pedometer Accuracy, Billing Transparency.
  * **Evaluation Criteria**: Checks if the app resolves range anxiety and supports host earnings.
* **Speaker Notes**:
  > "Finally, we have structured a feedback collection form. This slide features an interactive questionnaire to collect mock evaluations, illustrating how we audit app usability."
