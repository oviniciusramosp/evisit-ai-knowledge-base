<!-- AI Reference: Product Context & Domain Terminology for eVisit UI -->
<!-- Source of truth. Referenced by CLAUDE.md -->

## 6. Product Context & Features

### Domain Terminology

| Term                            | Definition                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| **Visit**                       | A telehealth encounter between a provider and patient (can be video, phone, or async) |
| **Provider**                    | Healthcare professional (doctor, nurse, staff)                                        |
| **Patient**                     | Person seeking healthcare                                                             |
| **Practice**                    | Healthcare organization/clinic                                                        |
| **Customer**                    | The organization that owns/operates practices                                         |
| **Waiting Room**                | Virtual queue where patients wait for providers                                       |
| **Front Door**                  | Public-facing entry point for a specific customer                                     |
| **Check-In**                    | Patient pre-visit verification process                                                |
| **Express Room**                | Quick/immediate visit option                                                          |
| **Calendar Blocks**             | Provider availability time blocks                                                     |
| **Visit Types**                 | Categories of visits (e.g., general, follow-up, urgent)                               |
| **Visit Statuses**              | Lifecycle states of a visit                                                           |
| **Custom Forms**                | Dynamic forms for data collection (intake, charts, etc.)                              |
| **Custom Actions**              | Configurable actions for visit management                                             |
| **Custom Columns**              | Configurable data grid columns                                                        |
| **Personal Filter Views (PFV)** | Saved filter/view configurations for waiting room and grids                           |
| **Segments**                    | Waiting room queue segments/categories                                                |
| **Charting**                    | Provider documentation during/after a visit                                           |
| **eVault**                      | Encrypted document storage service                                                    |
| **eData**                       | Electronic data service                                                               |
| **QTC**                         | Quality, Training, and Compliance module                                              |
| **CDX**                         | Clinical Document Exchange                                                            |
| **Mimic**                       | Environment impersonation/proxy feature                                               |
| **Biometrics**                  | Biometric authentication (fingerprint, face)                                          |
| **DoseSpot**                    | E-prescribing integration                                                             |
| **Journey**                     | Multi-step guided workflows                                                           |

### Main User Flows

**Patient Flow:**

1. Registration / Login (with MFA, biometrics support)
2. Select dependent (if applicable)
3. Select visit type
4. Select provider and time slot
5. Fill health records / insurance / intake forms
6. Make payment
7. Enter waiting room / check in
8. Join video visit
9. Post-visit survey
10. View visit history

**Provider Flow:**

1. Login
2. View waiting room / dashboard
3. Manage availability / calendar blocks
4. Accept / initiate visits
5. Conduct video visits with charting
6. Prescribe medications (DoseSpot)
7. Complete / co-sign visits
8. View reports and visit history
9. Manage account, biography, settings

**Admin Flow:**

1. Manage practice settings
2. Configure visit types, statuses, custom actions, custom columns
3. Manage users and roles
4. Configure custom forms
5. Manage video backgrounds
6. Configure interpreter services
7. Manage practice devices

### Realtime Features

- **Pusher** — Waiting room updates, visit status changes, chat messages, notifications.
- **SignalR** — Additional real-time communication channels.
- **Auto-logout** — Session management with keepalive and timeout.
- **Unsaved changes detection** — Warns users when navigating away from unsaved forms.

### Mobile Support

- Responsive design with 3 breakpoints: desktop (1280px+), tablet (900px), mobile (500px).
- React Native WebView bridge (`window.ReactNativeWebView`) for native mobile app embedding.
- Mobile-specific components (MobileDrawer, MobileHeader, MobileBar).
- Touch-friendly interactions (use-long-press, tap highlight removal).
