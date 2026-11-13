# Code-a-Nova – Hackathon Registration Portal

A full-stack Hackathon Registration Portal developed using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)** with Nodemailer integration.

The platform allows participants to create accounts, verify their email addresses using OTP, securely log in, access a personal dashboard, and register for a hackathon with complete team details.

---

## Project Overview

**Project:** Code-a-Nova – Hackathon Registration Portal  
**Task:** Full Stack Developer Internship Task  
**Technology:** MERN Stack + Nodemailer

The main objective of this project is to develop a secure, responsive, and functional hackathon registration platform with authentication, email verification, participant management, and automated email notifications.

## Features

### Authentication and Security
- User signup and login.
- Secure password hashing using bcrypt.
- Six-digit email OTP verification.
- OTP expiration after 10 minutes.
- Resend OTP functionality.
- JWT-based authentication.
- Protected frontend routes and backend APIs.
- Session restoration after page refresh.

### Participant Dashboard
- Display participant profile information.
- Show hackathon registration status.
- View submitted registration details.
- Access the registration form when not registered.

### Hackathon Registration
- Participant personal information.
- College and academic details.
- Domain and project information.
- PPT and prototype links.
- Optional demo video link.
- Dynamic team member management.
- Support for individual and team registration (1–5 members).
- Registration data stored in MongoDB.
- Confirmation email after successful registration.

### Email Integration
- OTP verification emails using Nodemailer.
- Hackathon registration confirmation emails.
- Participant and team details in confirmation emails.
- Dedicated project email account.
- Sender name: Code-a-Nova.

### Additional Features
- Responsive home page.
- About page.
- Contact form with email notification.
- Responsive navigation bar and footer.
- Form validation and error handling.

---

## Technology Stack

| Category | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Backend | Node.js |
| API Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| Password Hashing | bcrypt |
| Email Service | Nodemailer |
| API Testing | Postman |
| Version Control | Git and GitHub |

---

## Project Structure

```text
code-a-nova/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── templates/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── screenshots/
├── .gitignore
└── README.md
```

---

## Application Workflow

### 1. Signup
- Participant enters their name, email, password, and confirm password.
- Backend validates the submitted information.
- Password is hashed using bcrypt.
- Account is created in MongoDB.
- OTP is sent to the registered email address.

### 2. OTP Verification
- Participant enters the six-digit OTP.
- Backend verifies the OTP.
- OTP expires after 10 minutes.
- Account is marked as verified after successful verification.
- Participant can request a new OTP.

### 3. Login
- Participant enters email and password.
- Backend verifies credentials.
- JWT token is generated after successful authentication.
- Participant is redirected to the dashboard.

### 4. Dashboard
- Displays participant profile.
- Checks hackathon registration status.
- Shows registration details when an entry exists.
- Provides a registration option when no entry exists.

### 5. Hackathon Registration
- Participant fills in the registration form.
- Adds project and academic details.
- Selects team size and enters additional team members.
- Backend validates and saves registration data in MongoDB.
- Nodemailer sends a confirmation email.
- Dashboard displays the submitted registration information.

### 6. Logout
- Authentication token is cleared.
- User authentication state is reset.
- Participant is redirected to the login page.

---

## Installation and Setup

### Prerequisites

Install the following:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB
- Git
- Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd code-a-nova
```

Replace the placeholder with your actual GitHub repository URL.

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Configure Backend Environment

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_jwt_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_project_email@gmail.com
SMTP_PASS=your_gmail_app_password

EMAIL_FROM=your_project_email@gmail.com
```

Use your own credentials. For Gmail SMTP, use a Gmail App Password.

Never upload actual environment files or credentials to GitHub.

### Step 4: Start Backend

From the `server` directory:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### Step 5: Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### Step 6: Configure Frontend Environment

Create a `.env` file inside the `client` directory.

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Step 7: Start Frontend

From the `client` directory:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

## Environment Variables

### Backend – server/.env

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |
| SMTP_HOST | SMTP server hostname |
| SMTP_PORT | SMTP server port |
| SMTP_USER | Project email account |
| SMTP_PASS | Gmail App Password |
| EMAIL_FROM | Sender email address |

### Frontend – client/.env

| Variable | Description |
|---|---|
| VITE_API_BASE_URL | Backend API base URL |

Both `.env.example` files should be included in the GitHub repository with placeholder values only.

---

## API Documentation

**Base URL**

```text
http://localhost:5000
```

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create participant account |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Authenticate participant |

### User APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/me` | Get authenticated participant profile |

### Hackathon APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/hackathon/register` | Submit hackathon registration |
| GET | `/api/hackathon/my-entry` | Retrieve participant registration |

### Contact API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Submit contact enquiry |

### Protected API Authentication

Protected endpoints require a JWT token in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Database Models

### User

Stores:
- Full name
- Email address
- Hashed password
- Email verification status
- OTP hash and expiry information

### Hackathon Registration

Stores:
- Participant information
- Mobile number
- College and academic details
- Domain or track
- Project name
- PPT and prototype links
- Optional demo video link
- Team size
- Additional team member details
- Registration timestamp

---

## Email Integration

Nodemailer is used for automated email communication.

### OTP Verification Email
- Sent after participant signup.
- Contains a six-digit verification OTP.
- OTP expires after 10 minutes.
- Sender name is Code-a-Nova.

### Registration Confirmation Email
- Sent after successful database registration.
- Contains participant name and details.
- Includes project name and domain.
- Includes team size and member information.
- Includes PPT and prototype links.
- Sender name is Code-a-Nova.

---

## Security

- Passwords hashed using bcrypt.
- JWT-based authentication.
- Protected API endpoints.
- OTP expiration and one-time verification.
- Email verification before hackathon registration.
- Environment variables for sensitive credentials.
- Registration associated with the authenticated user.
- Backend validation of submitted information.

---

## Testing

The application can be tested through the browser and Postman.

### End-to-End Test Cases

1. Open the Home page.
2. Create a new participant account.
3. Verify email using OTP.
4. Test incorrect and expired OTP.
5. Log in with valid credentials.
6. Access the protected dashboard.
7. Refresh the dashboard and verify session restoration.
8. Complete hackathon registration.
9. Test team size and member validation.
10. Verify registration data in MongoDB.
11. Check the confirmation email.
12. Test the Contact form and email.
13. Log out and verify protected route access.

### Additional API Tests

- Missing signup fields.
- Duplicate email registration.
- Incorrect OTP.
- Invalid login credentials.
- Protected API without JWT.
- Invalid team size.
- Incorrect number of team members.
- Duplicate hackathon registration.
- Retrieving registration details.

---

## Screenshots

Create a `screenshots` folder in the project root and add actual screenshots of the completed application.

Recommended screenshots:

| Filename | Description |
|---|---|
| home.png | Home page |
| signup.png | Signup page |
| otp-verification.png | OTP verification |
| login.png | Login page |
| dashboard.png | Participant dashboard |
| registration.png | Hackathon registration |
| confirmation-email.png | Confirmation email |
| contact.png | Contact page |

Display screenshots using Markdown:

```markdown
![Home Page](screenshots/home.png)

![Signup Page](screenshots/signup.png)

![Dashboard](screenshots/dashboard.png)

![Registration](screenshots/registration.png)
```

Only add screenshots after saving the actual images in the `screenshots` folder.

---

## Deployment

Recommended deployment platforms:

| Component | Platform |
|---|---|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MongoDB Atlas |

### Deployment Steps

1. Deploy the backend.
2. Configure backend environment variables.
3. Configure production CORS settings.
4. Deploy the frontend.
5. Set the frontend API URL to the deployed backend.
6. Test all application workflows on the live website.

### Live Links

- Frontend: ADD_YOUR_FRONTEND_URL
- Backend: ADD_YOUR_BACKEND_URL
- GitHub: ADD_YOUR_GITHUB_REPOSITORY_URL
- Demo Video: ADD_YOUR_DEMO_VIDEO_URL

Update these placeholders after deployment.

---

## Demo Video

As required by the internship task, prepare a 3–5 minute screen recording demonstrating:

1. Project introduction.
2. Signup.
3. OTP email verification.
4. Login.
5. Participant dashboard.
6. Hackathon registration.
7. Team member details.
8. Registration confirmation email.

---

## Future Enhancements

- Admin dashboard for registration management.
- Participant approval and registration status management.
- Email confirmation resend functionality.
- Additional hackathon event management.
- Administrative reporting and analytics.

---

## Project Information

**Project Name:** Code-a-Nova – Hackathon Registration Portal  
**Project Type:** Full Stack Web Application  
**Stack:** MERN + Nodemailer  
**Frontend:** React.js and Tailwind CSS  
**Backend:** Node.js and Express.js  
**Database:** MongoDB  
**Authentication:** JWT and bcrypt  
**Email Service:** Nodemailer

---

## License

Developed as part of the Code-a-Nova Full Stack Developer Internship Task.
