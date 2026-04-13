# OmniCalc — Functional Specification

> **Version:** 0.1.0
> **Last Updated:** 2026-03-30
> **Status:** Draft

---

## 1. Product Overview

OmniCalc is a multiplatform SaaS calculator application targeting Web, iOS, Android, Windows, macOS, and Linux. It provides precision arithmetic, cloud-synced calculation history, and scientific functions under a freemium subscription model.

---

## 2. User Personas

### Casual User (Free)

- Uses basic arithmetic on the web or phone
- No account required
- Sees upgrade prompts for Pro features

### Professional User (Pro)

- Engineer, scientist, or analyst
- Needs scientific functions, precision math, and history sync
- Uses the app across multiple devices daily
- Pays monthly or annually

---

## 3. Functional Requirements

### 3.1 Calculator Engine (Core)

| ID           | Requirement                                                    | Plan |
| ------------ | -------------------------------------------------------------- | ---- |
| **CALC-001** | Basic arithmetic: +, −, ×, ÷                                   | Free |
| **CALC-002** | Percentage (%) and sign toggle (±)                             | Free |
| **CALC-003** | Memory functions: M+, M−, MR, MC                               | Free |
| **CALC-004** | Decimal precision via `decimal.js` (no native JS floats)       | Free |
| **CALC-005** | Division by zero → display "Error", disable keypad until Clear | Free |
| **CALC-006** | Overflow handling → scientific notation (e.g., `1.5e+25`)      | Free |
| **CALC-007** | Display limit: 16 digits maximum                               | Free |
| **CALC-008** | Trigonometric functions: sin, cos, tan, asin, acos, atan       | Pro  |
| **CALC-009** | Logarithmic functions: log, ln                                 | Pro  |
| **CALC-010** | Roots and powers: √, x², xⁿ                                    | Pro  |
| **CALC-011** | Factorial (n!)                                                 | Pro  |
| **CALC-012** | Constants: π, e                                                | Pro  |
| **CALC-013** | Parentheses for expression grouping                            | Pro  |

### 3.2 Authentication

| ID           | Requirement                                                 |
| ------------ | ----------------------------------------------------------- |
| **AUTH-001** | Email + password registration and login                     |
| **AUTH-002** | OAuth: Google and GitHub sign-in                            |
| **AUTH-003** | Password recovery via email                                 |
| **AUTH-004** | Session management with JWT (Better Auth)                   |
| **AUTH-005** | Anonymous usage allowed (no account required for Free tier) |

### 3.3 Cloud Tape (History Sync — Pro)

| ID           | Requirement                                                       |
| ------------ | ----------------------------------------------------------------- |
| **TAPE-001** | Every completed calculation (pressing `=`) is saved to the server |
| **TAPE-002** | History is synced across all devices for the same account         |
| **TAPE-003** | History panel visible on desktop/tablet layouts                   |
| **TAPE-004** | "Clear Tape" action to delete all history                         |
| **TAPE-005** | Each entry records: expression, result, timestamp, device origin  |
| **TAPE-006** | Offline-first: save locally → sync in background (TanStack Query) |
| **TAPE-007** | Failed syncs queued with exponential backoff                      |

### 3.4 Subscription & Payments

| ID          | Requirement                                                   |
| ----------- | ------------------------------------------------------------- |
| **PAY-001** | Stripe Checkout for Web and Desktop payments                  |
| **PAY-002** | Stripe Customer Portal for subscription management            |
| **PAY-003** | RevenueCat SDK for iOS/Android in-app purchases               |
| **PAY-004** | Webhook endpoints for Stripe and RevenueCat events            |
| **PAY-005** | Centralized plan status in database (`plan: 'free' \| 'pro'`) |
| **PAY-006** | Real-time UI update after successful payment                  |

### 3.5 User Settings

| ID          | Requirement                                             |
| ----------- | ------------------------------------------------------- |
| **SET-001** | Theme: Light, Dark, System (Dark/Light limited in Free) |
| **SET-002** | Haptic feedback toggle (mobile)                         |
| **SET-003** | Account status display (Free/Pro badge)                 |
| **SET-004** | Upgrade CTA button                                      |
| **SET-005** | Logout functionality                                    |

---

## 4. Data Schemas

### 4.1 Users Table

```
users
├── id              UUID        PRIMARY KEY
├── email           VARCHAR     UNIQUE, NOT NULL
├── name            VARCHAR
├── avatar_url      VARCHAR
├── created_at      TIMESTAMP   DEFAULT now()
├── stripe_customer_id  VARCHAR UNIQUE
├── plan            VARCHAR     DEFAULT 'free'  -- 'free' | 'pro'
└── subscription_status VARCHAR  -- 'active' | 'canceled' | 'past_due'
```

### 4.2 Calculations Table (Pro)

```
calculations
├── id              UUID        PRIMARY KEY
├── user_id         UUID        FK → users.id, NOT NULL
├── expression      VARCHAR     NOT NULL  -- e.g., "25 * (4 + 6)"
├── result          VARCHAR     NOT NULL  -- e.g., "250"
├── created_at      TIMESTAMP   DEFAULT now()
└── device_origin   VARCHAR     -- 'web' | 'ios' | 'android' | 'desktop'
```

### 4.3 User Settings Table

```
user_settings
├── user_id         UUID        FK → users.id, PRIMARY KEY
├── theme           VARCHAR     DEFAULT 'system'
└── haptic_feedback BOOLEAN     DEFAULT true
```

---

## 5. API Contracts

### 5.1 Authentication (Better Auth — NestJS)

| Endpoint                   | Method | Description                  |
| -------------------------- | ------ | ---------------------------- |
| `/api/auth/sign-up/email`  | POST   | Register with email/password |
| `/api/auth/sign-in/email`  | POST   | Login with email/password    |
| `/api/auth/sign-in/google` | GET    | OAuth (Google)               |
| `/api/auth/sign-in/github` | GET    | OAuth (GitHub)               |
| `/api/auth/sign-out`       | POST   | End session                  |
| `/api/auth/session`        | GET    | Get current session          |

### 5.2 Calculations (Pro)

| Endpoint                   | Method | Auth           | Description                     |
| -------------------------- | ------ | -------------- | ------------------------------- |
| `GET /api/calculations`    | GET    | Required (Pro) | List user's calculation history |
| `POST /api/calculations`   | POST   | Required (Pro) | Save a new calculation          |
| `DELETE /api/calculations` | DELETE | Required (Pro) | Clear all calculation history   |

### 5.3 Users & Settings

| Endpoint                    | Method | Auth     | Description              |
| --------------------------- | ------ | -------- | ------------------------ |
| `GET /api/users/me`         | GET    | Required | Get current user profile |
| `PATCH /api/users/me`       | PATCH  | Required | Update user profile      |
| `GET /api/users/settings`   | GET    | Required | Get user preferences     |
| `PATCH /api/users/settings` | PATCH  | Required | Update user preferences  |

### 5.4 Payments

| Endpoint                             | Method | Auth     | Description                           |
| ------------------------------------ | ------ | -------- | ------------------------------------- |
| `POST /api/payments/checkout`        | POST   | Required | Create Stripe Checkout session        |
| `POST /api/payments/portal`          | POST   | Required | Create Stripe Customer Portal session |
| `POST /api/payments/webhooks/stripe` | POST   | —        | Stripe webhook handler                |
| `POST /api/webhooks/revenuecat`      | POST   | —        | RevenueCat webhook handler            |

---

## 6. State Management (Zustand Stores)

### 6.1 `useCalculatorStore`

```typescript
interface CalculatorState {
  currentValue: string;
  previousValue: string | null;
  operator: string | null;
  memoryValue: string;
  isScientificMode: boolean;
  expression: string;

  // Actions
  inputNumber: (num: string) => void;
  inputOperator: (op: string) => void;
  calculate: () => void;
  clear: () => void;
  toggleSign: () => void;
  percentage: () => void;
  memoryAdd: () => void;
  memorySubtract: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;
  applyScientificFunction: (fn: string) => void;
}
```

### 6.2 `useAuthStore`

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isPro: boolean;

  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

---

## 7. Out of Scope (v1.0)

The following features are explicitly **not** included in v1.0:

- Unit conversions
- Currency conversions
- Graphing capabilities
- Programmable macros
- Collaborative shared calculations
- Multi-language (i18n) — English only for v1.0
- Offline desktop mode (requires account for Pro features)

---

## 8. Edge Cases & Error Handling

| Scenario              | Expected Behavior                                       |
| --------------------- | ------------------------------------------------------- |
| Division by zero      | Display "Error", disable keypad until Clear             |
| Result > 16 digits    | Switch to scientific notation (e.g., `1.5e+25`)         |
| `0.1 + 0.2`           | Must display `0.3` (via decimal.js, not native floats)  |
| Network offline (Pro) | Save calculation locally, sync with exponential backoff |
| Invalid expression    | Display "Error", do not crash                           |
| Rapid button presses  | Debounce input, maintain state consistency              |
| Expired subscription  | Gracefully downgrade to Free, inform user               |
| Webhook failure       | Idempotent retry with Stripe/RevenueCat event IDs       |

---

_Document version: 0.1.0_
