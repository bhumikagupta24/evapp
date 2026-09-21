# GreenSteps (EVService) — Final Viva Q&A & Prep Cheat Sheet

This cheat sheet serves as a quick-reference guide and comprehensive study manual for your final year college project viva. It details the **business logic**, **technical stack**, **mathematical equations**, **UML diagrams**, **code architectures**, and **potential examiner questions** for the **GreenSteps** app.

---

## 📋 1. Project High-Yield Summary (The Pitch)

### The 30-Second Elevator Pitch
> *"GreenSteps (codenamed EVService) is a React Native mobile application that addresses smart city mobility and carbon reduction. It resolves EV range anxiety by mapping charging networks and letting users book simulated charging sessions, while decentralizing the grid by letting home hosts list private chargers. Simultaneously, it gamifies personal fitness by tracking daily steps, converting them to CO2 offset statistics, and rewarding users with EcoPoints to plant virtual trees or unlock dark/light themes."*

### Key Project Statistics to Memorize
* **Development Timeline**: 16 Weeks (divided into 2-week Agile sprints).
* **Target Latency**: Map search and database query synchronization in **under 2 seconds**.
* **Battery Sensor Budget**: Accelerometer and GPS sensor background polling optimized to consume **less than 3% battery per hour**.
* **Standard Tax Rate**: **18% Goods and Services Tax (GST)** automatically calculated on partner transactions to compute net earnings.
* **Authentication Providers**: Multi-provider support integrated through Firebase Auth containing:
  * **Email & Password**: Standard credential-based login.
  * **SMS-based Phone OTP**: Telephony authentication for secure phone verification.
  * **Google Sign-In**: Quick OAuth 2.0 single-sign-on (SSO).
  * **Microsoft Sign-In**: Corporate/enterprise partner identity onboarding.
* **Core Conversion Factors**: 
  * $1\text{ km walked} = 0.12\text{ kg CO}_2\text{ saved}$.
  * $1\text{ virtual tree planted} = 5\text{ kg CO}_2\text{ saved}$.
  * $1\text{ charging hour} = 10\text{ EcoPoints awarded}$.

---

## 🛠️ 2. Core Technology Stack & Versions

Examiners love asking about specific software versions and libraries. Here is your stack:

| Technology Component | Software/Library Used | Version | Core Purpose in GreenSteps |
| :--- | :--- | :--- | :--- |
| **Mobile Framework** | React Native | `v0.73.9` | Compiles a single JS codebase into native iOS & Android threads. |
| **State Coordination** | React (Hooks & Context) | `v18.2.0` | Coordinates UI lifecycle hook loops (`useState`, `useEffect`, `useContext`). |
| **Backend Infrastructure**| Google Firebase Suite | `v10.x` | Serverless backend supplying login session tokens and NoSQL schemas. |
| **Database Provider** | Cloud Firestore | SDK v10 | Low-latency real-time database listener channels (web sockets). |
| **Routing & Navigation** | React Navigation | `v6.x` | Coordinates screens via Stack Routers and Bottom Tabs. |
| **Mapping Engine** | Google Maps SDK | `v1.14.0` | Renders map viewports and Custom Map Marker Pins. |
| **Sensor API** | Expo Sensors (Pedometer) | `v14.x` | Streams physical accelerometer telemetry in the background. |
| **Testing Framework** | Jest & Testing Library | `v29.x` | Runs test specs for conversion formulas and mock booking routes. |

---

## 🧮 3. Core Mathematical Formulas & Logic

Be ready to write these formulas on a whiteboard if asked how the app calculates its data.

### 3.1 Proximity Mapping: The Haversine Formula
Used in [FindStation.js](file:///d:/Green_Natural/Green_Natural/GreenSteps/src/screens/FindStation.js) to compute the distance ($d$) in kilometers between a user's location $(\text{lat}_1, \text{lon}_1)$ and a charging station $(\text{lat}_2, \text{lon}_2)$ on the Earth's surface:

$$\Delta \text{lat} = (\text{lat}_2 - \text{lat}_1) \times \frac{\pi}{180}$$
$$\Delta \text{lon} = (\text{lon}_2 - \text{lon}_1) \times \frac{\pi}{180}$$
$$a = \sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos\left(\text{lat}_1 \times \frac{\pi}{180}\right) \times \cos\left(\text{lat}_2 \times \frac{\pi}{180}\right) \times \sin^2\left(\frac{\Delta \text{lon}}{2}\right)$$
$$c = 2 \times \text{atan2}(\sqrt{a}, \sqrt{1-a})$$
$$d = R \times c \quad (\text{where } R = 6371\text{ km is Earth's mean radius})$$

### 3.2 Carbon Offset Calculations
Used in [CarbonOffsetScreen.js](file:///d:/Green_Natural/Green_Natural/GreenSteps/src/screens/CarbonOffsetScreen.js) to translate distance walked to offset numbers:

$$\text{CO}_2 \text{ Saved (kg)} = \text{Distance Walked (km)} \times 0.12\text{ kg/km}$$
$$\text{Virtual Trees Planted} = \left\lfloor \frac{\text{Total } \text{CO}_2 \text{ Saved}}{5\text{ kg}} \right\rfloor$$

### 3.3 Charger Charging Simulation & Billing
Calculated during mock booking sessions in [BookingStation.js](file:///d:/Green_Natural/Green_Natural/GreenSteps/src/screens/BookingStation.js):

$$\text{Energy Delivered (kWh)} = \text{Charger Speed (kW)} \times \text{Duration (hours)}$$
$$\text{Gross Transaction Cost (₹)} = \text{Energy Delivered (kWh)} \times \text{Price per kWh}$$
$$\text{EcoPoints Awarded} = \text{Duration (hours)} \times 10\text{ points/hour}$$

### 3.4 Partner Earnings and Tax Deductions
Calculated on the [HomeScreen.js](file:///d:/Green_Natural/Green_Natural/GreenSteps/src/screens/HomeScreen.js) dashboard when a host checks their earnings:

$$\text{GST Deduction (₹)} = \text{Gross Transaction Cost} \times 18\% \quad (0.18)$$
$$\text{Net Partner Earnings (₹)} = \text{Gross Transaction Cost} - \text{GST Deduction} = \text{Gross} \times 0.82$$

---

## 🗄️ 4. NoSQL Database Schema Design (Firestore Collections)

Examiners frequently ask how NoSQL models differ from SQL schemas. Explain that we use **Collections** containing **Documents** rather than Tables and Rows.

### 4.1 `users` Collection
* **Path**: `/users/{uid}`
* **Schema**:
```json
{
  "uid": "String (Primary Key)",
  "fullName": "String",
  "email": "String",
  "role": "String ('user' | 'partner')",
  "ecoPoints": "Number (User loyalty wallet)",
  "vehicleName": "String",
  "vehicleNumber": "String",
  "batteryCapacity": "Number (kWh)",
  "vehicleRange": "Number (km)"
}
```

### 4.2 `stations` Collection
* **Path**: `/stations/{stationId}`
* **Schema**:
```json
{
  "id": "String (Primary Key)",
  "ownerId": "String (Foreign Key -> users.uid)",
  "name": "String",
  "address": "String",
  "latitude": "Number",
  "longitude": "Number",
  "price": "Number (₹ per kWh)",
  "chargerSpeed": "Number (kW)",
  "available": "Boolean",
  "availablePoints": "Number",
  "totalPoints": "Number",
  "totalRevenue": "Number (Net earnings post-GST)",
  "totalBookings": "Number"
}
```

### 4.3 `ChargingHistory` Collection
* **Path**: `/users/{uid}/ChargingHistory/{historyId}` (Sub-collection)
* **Schema**:
```json
{
  "id": "String (Primary Key)",
  "stationId": "String (Foreign Key -> stations.id)",
  "stationName": "String",
  "durationHours": "Number",
  "kwhCharged": "Number",
  "totalCost": "Number (Gross billing)",
  "timestamp": "Timestamp",
  "pointsAdded": "Number"
}
```

---

## 💻 5. Key Code Architectures Explained

### 5.1 Real-Time Charger State Locking (Concurrency Control)
In [BookingStation.js](file:///d:/Green_Natural/Green_Natural/GreenSteps/src/screens/BookingStation.js), we query whether a charger has available capacity. To avoid double booking:
1. We read the `stations` document.
2. If `available` is false or `availablePoints` is 0, the booking is aborted.
3. If open, we decrement `availablePoints` and toggle `available` using Firestore transactions, and create the charging log.
4. An active timer loop in the UI calculates increments of `(duration * 3600 * 1000) / 100` to smoothly animate the circular progress bar from 0 to 100% to represent battery charge.

### 5.2 Geolocation Mapping & sorting
In [FindStation.js](file:///d:/Green_Natural/Green_Natural/GreenSteps/src/screens/FindStation.js), the user's phone GPS feeds latitude and longitude state objects. The app loops through all stations retrieved from Firestore, runs them through the **Haversine formula**, and displays the list sorted from closest to farthest.

### 5.3 Theme Provider (Dynamic Context Styling)
The app uses React Context API to manage the UI theme globally:
1. `ThemeContext` distributes style tokens (e.g. `theme.background`, `theme.primary`, `theme.text`).
2. When the user toggles dark mode in [SettingScreen.js](file:///d:/Green_Natural/Green_Natural/GreenSteps/src/screens/SettingScreen.js), the Context state changes and all active components re-render immediately with the new color palette.

---

## ❓ 6. Top 25 Viva Q&A (Examiner Prep)

### 📌 Section A: Architecture & Tech Stack

#### Q1. Why did you choose React Native instead of native Android (Java/Kotlin) or iOS (Swift)?
* **Answer**: React Native (`v0.73.9`) compiles Javascript code into native components. This allows code reusability (write once, run on both iOS and Android platforms), reducing development time by roughly 40-50% while maintaining native rendering speeds.

#### Q2. Why did you select Google Firebase Firestore over relational databases like MySQL?
* **Answer**: Firestore is a serverless NoSQL document database. It is optimized for mobile applications because it supports real-time synchronization through web sockets (`onSnapshot` listeners). When a charger's status is toggled, it syncs immediately with all user devices within 2 seconds without requiring client polling. It also simplifies the architecture by removing the need for a separate mid-tier REST API server.

#### Q3. What is the role of React Navigation in your application?
* **Answer**: React Navigation coordinates the screen routing. We configured a Stack Navigation system nested inside a Bottom Tab bar. This separates routes like Authentication and Onboarding from the core user and partner workflows, ensuring users can't bypass login screens.

#### Q4. How does the application handle state management?
* **Answer**: The application primarily uses local React hooks (`useState`, `useEffect`) for screen-level data and the **React Context API** (`ThemeContext`) for global properties. This keeps the state lightweight and avoids the overhead of libraries like Redux.

#### Q5. How are database security rules handled in Firestore?
* **Answer**: We deployed role-based security rules on Firebase. The rules verify that only authenticated users can read collections, and write permissions are restricted so that users can only modify their own `/users/{uid}` documents or write transactions in their sub-collections. Partner fields (like earnings calculations) require verification that the user's role flag is set to `'partner'`.

---

### 📌 Section B: Core Project Features & Logic

#### Q6. What is the Haversine formula and why did you use it?
* **Answer**: The Haversine formula calculates the shortest distance between two points on a sphere given their latitude and longitude coordinates. We implemented it in the application's station search feature. This allows sorting charging stations relative to the user's current GPS location in ascending order.

#### Q7. Explain how the charging session simulation works in your code.
* **Answer**: When a user books a station, the app locks the charger status in Firestore. It then launches a timer-based interval loop in React Native. The interval increments the progress percentage dynamically over the selected duration. Once the counter reaches 100%, the app triggers billing summaries, unlocks the port in Firestore, and updates the user's EcoPoints wallet.

#### Q8. Why did you simulate OBD-II telemetry and charger relays instead of physical integrations?
* **Answer**: Physical vehicle diagnostic ports (OBD-II CAN buses) and electrical smart relay switches require specific vehicle hardware and proprietary hardware API partnerships. For the scope of this academic project, we simulated these integrations programmatically based on standard EV profiles (e.g. standard battery speeds, rates, and duration curves) to focus on the software workflow, user interface, and database concurrency.

#### Q9. How are partner payouts calculated and how is tax handled?
* **Answer**: When an EV user pays for a simulated session, the transaction records a Gross Cost. On the partner portal, the system sums the gross revenues, deducts an 18% standard GST (Goods and Services Tax), and updates the host's Net Earnings ledger. The formula is:
  $$\text{Net Earnings} = \text{Gross Cost} \times (1 - 0.18)$$

#### Q10. How does the user role system function?
* **Answer**: The `users` collection contains a `role` field. During onboarding, users select either the standard **EV User** role or the **Charging Partner** role. Upon sign-in, [AuthCheck.js](file:///d:/Green_Natural/Green_Natural/GreenSteps/src/auth/AuthCheck.js) reads this field and routes the user. Partners bypass user map screens and load the analytics-driven Partner Dashboard instead.

---

### 📌 Section C: Sensors & Gamification

#### Q11. How does the step-tracking pedometer work in GreenSteps?
* **Answer**: The app accesses native mobile hardware sensors via the Pedometer/Accelerometer APIs. It registers changes in acceleration forces along three axes ($X$, $Y$, and $Z$). A threshold-based filter counts these patterns as steps while ignoring minor device movements.

#### Q12. How do you prevent users from cheating the pedometer by shaking their phones?
* **Answer**: The step-counting engine applies low-pass and band-pass filters to accelerometer inputs. This isolates frequencies matching normal human gaits (typically 1Hz to 3Hz) and rejects high-frequency shaking. For production, checking concurrent GPS speed changes ensures step logging isn't simulated while in a vehicle.

#### Q13. How does the background tracking affect the phone's battery life?
* **Answer**: Background GPS and accelerometer sensors can drain batteries. To optimize this, the app uses passive geofencing and registers listeners to wake up only when movement exceeds a minimum threshold, keeping battery consumption below **3% per hour**.

#### Q14. What are EcoPoints and how are they redeemed?
* **Answer**: EcoPoints are loyalty reward tokens. Users earn 1 point per 1,000 steps walked, or 10 points per hour spent charging their EV. These points are stored in their user profile and can be redeemed in the rewards panel to plant virtual trees or unlock UI customization options.

#### Q15. What calculations did you use to convert walking distance to carbon offsets?
* **Answer**: We adopted research benchmarks where walking replaces average gasoline vehicle commutes. Each kilometer walked saves approximately **0.12 kg of CO2 emissions**.

---

### 📌 Section D: Testing, Limitations & Future Work

#### Q16. How did you test your application for bugs and formula accuracy?
* **Answer**: We wrote unit tests in Jest to verify the Haversine formula, carbon conversion logic, and GST billing calculations. We also used the Android Studio and Xcode emulators to test screen navigation, mock GPS coordinate overrides, database locks, and user state transitions.

#### Q17. What are the key limitations of your current project?
* **Answer**:
  1. Financial payments are simulated using test inputs rather than production gateways like Razorpay or Stripe.
  2. Vehicle data (State of Charge, range) and charger hardware relays are modeled programmatically rather than reading real OBD-II ports and chargers.
  3. Step tracking relies on standard mobile device sensors without integrating wearable health devices (e.g. Apple Watch, Fitbit).

#### Q18. What is the future scope of the GreenSteps app?
* **Answer**:
  1. Integrating physical OBD-II Bluetooth adapters to read real vehicle battery telemetry.
  2. Connecting live API interfaces to smart charger hardware (such as OCPP - Open Charge Point Protocol) to lock and unlock real ports.
  3. Deploying machine learning models to analyze booking history and predict charger occupancy trends throughout the day.
  4. Integrating production payment gateways for actual bank transfers and settlements.

#### Q19. How did you handle network failures or database sync drops during an active booking?
* **Answer**: Firestore's offline data persistence cache stores write queries locally during network drops and syncs them automatically once connectivity is restored. If a critical update fails, local states roll back to avoid transaction errors.

#### Q20. How did you verify compatibility of private chargers listed by Partners?
* **Answer**: During charger registration, the Partner dashboard requires hosts to declare the charger's kW rating, plug type (e.g., Type 2, CCS2), and vehicle compatibility parameters. The search engine then filters listings to display only compatible matches.

---

### 📌 Section E: Soft Skills & Team Roles

#### Q21. What was your specific contribution to this project?
* **Answer**: *(Customize based on your focus)*:
  * *"I focused on developing the React Native UI screens, implementing the theme contexts, and setting up navigation stacks."*
  * *"I set up the Google Maps SDK integrations, proximity search sorting using the Haversine formula, and real-time database listeners."*
  * *"I structured the Firebase Firestore collections, wrote database security rules, and handled the simulation logic for charging progress and billing."*

#### Q22. What was the most challenging technical hurdle you faced and how did you resolve it?
* **Answer**: *"Managing real-time status updates to prevent two users from booking the same charger simultaneously. We solved this by using Firestore's write operations to verify charger state flags before confirming bookings, instantly updating the station's status on all user maps."*

#### Q23. Why did you use Agile methodology instead of the Waterfall model?
* **Answer**: Waterfall requires completing each development phase before starting the next, making changes difficult. Agile allowed us to work in iterations. We built and tested core authentication and mapping features in early sprints, and then added simulated bookings and partner portals in later cycles based on testing feedback.

#### Q24. How did you handle project planning and task division?
* **Answer**: We broke down the project requirements into user stories and mapped them across a 16-week timeline using a Gantt chart. We divided tasks into modular sub-systems (Auth, Maps, Pedometer, Partner Analytics) to work on components independently.

#### Q25. What did you learn from developing this project?
* **Answer**: *"I gained practical experience in mobile app development, real-time NoSQL database design, and sensor telemetry. It also taught me how to break down complex physical systems into modular software models."*

#### Q26. What identity providers or authentication methods did you configure in Firebase Authentication?
* **Answer**: *"To ensure a flexible and user-friendly onboarding experience for different user roles (EV Users and Partners), we integrated multiple identity providers via Firebase Authentication:
  1. **Email & Password**: Standard credentials for basic registration.
  2. **Phone Number OTP**: Standard SMS verification for secure, mobile-first registration.
  3. **Google Sign-In**: Social OAuth login for instant onboarding.
  4. **Microsoft Sign-In**: Enterprise/corporate sign-in option for institutional partners and station hosts."*

---

## 🗺️ 7. Slide-by-Slide Viva Presentation Strategy

Align your talking points with the slides in [GreenSteps_Presentation.md](file:///d:/Green_Natural/Green_Natural/GreenSteps/GreenSteps_Presentation.md):

* **Slide 1 (Title)**: Start strong. Introduce yourself and explain that "GreenSteps" is a sustainable mobility app combining EV routing with carbon active tracking.
* **Slide 2 (Introduction)**: Focus on the company context and the twin goals of infrastructure navigation and gamified tracking.
* **Slide 3 (Objectives)**: Focus on quantitative targets, such as sub-2-second queries, step conversions, and automated GST billing calculations.
* **Slide 4 (Literature Review)**: Highlight the gap analysis matrix. Explain how existing apps like PlugShare or Fitbit operate in silos, while GreenSteps integrates fitness and EV services.
* **Slide 5 (Problem Statement)**: Explain range anxiety, underutilized private chargers, and the lack of incentives for green transit.
* **Slide 6 (Scope)**: Define inclusions (cross-platform client, Firebase backend, step counters) and exclusions (OBD-II hardware, live money transfers, charger relays). This demonstrates clear design boundaries.
* **Slide 7 (Tools & Tech)**: Explain your choices (React Native, NoSQL Firestore, Expo Pedometer, Google Maps SDK) and point out their specific versions.
* **Slide 8 & 9 (Methodology & UML)**: Explain your DFD, ERD, and Sequence flows. Show how the client interacts with sensors and database endpoints.
* **Slide 10 (Modules & UI)**: Present your functional screens. Explain how the math loops run inside `BookingStation.js` and `CarbonOffsetScreen.js`.
* **Slide 11 (Expected Outcomes)**: Reiterate the deliverables (compiled client, maps, telemetry engines, and partner dashboard).
* **Slide 12 (Timeline)**: Walk through the 16-week Gantt chart, demonstrating structured project management.
* **Slide 13 (Conclusion & Future Scope)**: Summarize key takeaways, and discuss future plans (real OBD-II diagnostics, IoT OCPP charger controls, and ML prediction models).
* **Slide 14 (References)**: Note that your bibliography follows IEEE guidelines.
* **Slide 15 (Feedback)**: Show the mock user feedback panel to highlight how you evaluated the application's design and features.
