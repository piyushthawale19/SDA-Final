# Navigation Flow Diagram

## 🗺️ Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    LANDING PAGE (/)                             │
│                    [Public Access]                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Navbar: [Features] [Technology] [Sign In] [Get Started] │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              HERO SECTION                                 │  │
│  │  • Animated background                                    │  │
│  │  • Main headline                                          │  │
│  │  • [Get Started] [Watch Demo] buttons                     │  │
│  │  • 3 feature preview cards                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              FEATURES SECTION (#features)                 │  │
│  │  • 6 feature cards with icons                             │  │
│  │  • Scroll animations                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              TECH STACK SECTION (#tech)                   │  │
│  │  • 8 technology cards                                     │  │
│  │  • Problem statement                                      │  │
│  │  • Solution statement                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              CALL-TO-ACTION SECTION                       │  │
│  │  • Final CTA headline                                     │  │
│  │  • [Start Building Now] [View on GitHub]                  │  │
│  │  • Statistics: 1000+ | 5000+ | 99.9%                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌───────────────────┐              ┌───────────────────┐
│   REGISTER (/)    │              │   LOGIN (/login)  │
│  [Public Access]  │              │  [Public Access]  │
├───────────────────┤              ├───────────────────┤
│ • Email input     │              │ • Email input     │
│ • Password input  │              │ • Password input  │
│ • [Register] btn  │              │ • [Login] button  │
│ • Link to Login   │              │ • Link to Register│
│                   │              │                   │
│ Error Handling:   │              │ Error Handling:   │
│ • Duplicate email │              │ • Invalid creds   │
│ • Short password  │              │ • Short password  │
└───────────────────┘              └───────────────────┘
        │                                     │
        │ Success                             │ Success
        │ (stores token)                      │ (stores token)
        │                                     │
        └──────────────────┬──────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   HOME (/home)      │
                │  [Protected Route]  │
                ├─────────────────────┤
                │ • Navbar with logo  │
                │ • Profile menu      │
                │ • [New Project] btn │
                │ • Project cards     │
                │                     │
                │ UserAuth Check:     │
                │ • Has token? ✓      │
                │ • Has user? ✓       │
                │ • No? → /login      │
                └─────────────────────┘
                           │
                           │ Click Project
                           ▼
                ┌─────────────────────┐
                │ PROJECT (/project)  │
                │  [Protected Route]  │
                ├─────────────────────┤
                │ • Code editor       │
                │ • File tree         │
                │ • Terminal          │
                │ • Chat with AI      │
                │ • Collaborators     │
                └─────────────────────┘
                           │
                           │ Logout
                           ▼
                ┌─────────────────────┐
                │   LANDING (/)       │
                │  [Public Access]    │
                │                     │
                │ • Token removed     │
                │ • User cleared      │
                │ • Back to start     │
                └─────────────────────┘
```

---

## 🔐 Authentication States

### Unauthenticated User
```
Landing (/) → Can access
Login (/login) → Can access
Register (/register) → Can access
Home (/home) → Redirects to /login
Project (/project) → Redirects to /login
```

### Authenticated User
```
Landing (/) → Can access
Login (/login) → Can access (but already logged in)
Register (/register) → Can access (but already logged in)
Home (/home) → Full access
Project (/project) → Full access
```

---

## 🎯 Button Actions

### Landing Page Buttons
| Button | Location | Action |
|--------|----------|--------|
| **Sign In** | Navbar | Navigate to `/login` |
| **Get Started** | Navbar | Navigate to `/register` |
| **Get Started** | Hero | Navigate to `/register` |
| **Watch Demo** | Hero | (To be implemented) |
| **Start Building Now** | CTA | Navigate to `/register` |
| **View on GitHub** | CTA | (To be implemented) |

### Login Page Buttons
| Button | Action |
|--------|--------|
| **Login** | Submit form → Navigate to `/home` |
| **Create one** (link) | Navigate to `/register` |

### Register Page Buttons
| Button | Action |
|--------|--------|
| **Register** | Submit form → Navigate to `/home` |
| **Login** (link) | Navigate to `/login` |

### Home Page Buttons
| Button | Action |
|--------|--------|
| **New Project** | Open modal to create project |
| **Project Card** | Navigate to `/project` with project data |
| **Logout** | Clear token → Navigate to `/` |

---

## 🔄 Redirect Logic

### After Login Success
```javascript
localStorage.setItem("token", res.data.token);
setUser(res.data.user);
navigate("/home"); // ← Goes to dashboard
```

### After Register Success
```javascript
localStorage.setItem("token", res.data.token);
setUser(res.data.user);
navigate("/home"); // ← Goes to dashboard
```

### After Logout
```javascript
localStorage.removeItem("token");
setUser(null);
navigate("/"); // ← Goes to landing page
```

### Protected Route Check
```javascript
if (!token || !user) {
  navigate("/login"); // ← Redirects to login
}
```

---

## 📱 Mobile Navigation

### Desktop (> 768px)
```
[Logo] Smart Developer Assistant    [Features] [Technology] [Sign In] [Get Started]
```

### Mobile (< 768px)
```
[Logo] Smart Developer Assistant                                    [☰ Menu]

(When menu clicked)
┌─────────────────┐
│ Features        │
│ Technology      │
│ Sign In         │
│ Get Started     │
└─────────────────┘
```

---

## 🎨 Visual States

### Hover Effects
- **Buttons**: Scale up (1.1x) + shadow glow
- **Cards**: Scale up (1.05x) + translate up + shadow
- **Icons**: Rotate (12deg)
- **Links**: Color change

### Loading States
- **Login/Register**: Spinner + "Processing..." text
- **Protected Routes**: "Loading..." message

### Error States
- **Login**: Red banner with error message
- **Register**: Red banner with error message
- **Protected Routes**: Redirect to login

---

## 🚦 Route Guards

```javascript
// Public Routes (No guard)
/ → Landing
/login → Login
/register → Register

// Protected Routes (UserAuth guard)
/home → Home (requires token + user)
/project → Project (requires token + user)
```

---

## 📊 State Management

### Global State (Context)
- **UserContext**: Stores user data
- **ThemeContext**: Stores theme (light/dark)

### Local Storage
- **token**: JWT authentication token

### Component State
- **isLoading**: Form submission state
- **error**: Error messages
- **isVisible**: Scroll animation state
- **menuOpen**: Mobile menu state

---

This navigation flow ensures a smooth, intuitive user experience from landing to full application usage!
