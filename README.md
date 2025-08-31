# Placement Preparation Tracker

## Team

**Team Name:** Next()Gen
**Team Members:**

* Sneh Gohel
* Shivam Patel
* Pramukh Prajapati

---

## Overview

The **Placement Preparation Tracker** is a unified platform designed to streamline and support the placement journey for final-year undergraduate students. It integrates resume building, job and internship tracking, placement rules enforcement, analytics, notifications, and preparation resources—all in one platform.

---

## Features

### For Students

* **Dashboard Overview:** Quick stats, placement timeline, daily updates, and application status tracker.
* **Resume Builder:** Templates with auto-fill, multiple resume versions, career objective editor, and live preview with PDF export.
* **Practice & Tests:** Mock tests (aptitude, reasoning, coding, English), company-specific exams, score analytics, and leaderboards.
* **Notifications & Reminders:** Alerts for deadlines, exams, interviews, and status updates.
* **Profile & Skills:** Academic info, skills, progress tracking, and analytics.
* **Job Applications:** Browse/filter jobs, select resume version, and share public profile.
* **Placement History:** Timeline of applications, offers, and final placement outcomes.

### For Training & Placement Officer (TPO / Admin)

* **Placement Rules Enforcement:** Define CGPA, backlog, department, and attempt-based restrictions.
* **Company & Job Management:** Approve/reject recruiters, manage drives, and enforce rules.
* **Student Oversight:** Track applications and enforce placement policies.
* **Communication:** Send announcements, notices, and interview schedules.
* **Analytics & Reporting:** Generate and export department/company-wise placement reports.

### For Companies (Recruiters / HR)

* **Job & Internship Posting:** Post detailed openings with eligibility, roles, and deadlines.
* **Application Management:** View/filter applicants, shortlist candidates, and schedule interviews/tests.
* **Offer Management:** Create offers, manage acceptances, and track candidate responses.
* **Collaboration with TPO:** Coordinate drives and comply with policies.
* **Analytics & Reporting:** Monitor shortlisting ratios, interview outcomes, and download candidate data.

---

## Placement Rules & Policies

* **Application Restrictions:** Students cannot apply for jobs with lower packages once placed.
* **Upgrade Path:** Maximum of 2 upgrades per student (Tier-3 → Tier-2 → Tier-1, or Tier-2 → Tier-1).
* **Job Categories by Package:**

  * Tier-1: ₹15 LPA and above
  * Tier-2: ₹8 LPA – ₹14.99 LPA
  * Tier-3: ₹3 LPA – ₹7.99 LPA
  * Internships: Paid/unpaid
* **Final Offer Rule:** Accepting a Tier-1 offer finalizes placement, and the student is withdrawn from all other offers.

---

## Problem Statement

Choose one of the provided problem statements to implement as your primary project focus. This repository contains the full system design and an implementation roadmap.

---

## Tech Stack (Suggested)

* Frontend: React.js, Tailwind CSS
* Backend: Node.js, Express.js
* Database: MongoDB
* Authentication: JWT-based auth with role-based access
* Other: REST APIs, Analytics & Reporting modules

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Sneh-Gohel/odoo-final-round.git
cd placement-preparation-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

---

## Demo

* **GitHub Repository:** [https://github.com/Sneh-Gohel/odoo-final-round.git](https://github.com/Sneh-Gohel/odoo-final-round.git)
* **Demo Video:** [https://your-video-link.com](https://your-video-link.com)

---

## System Architecture (High-level)

1. **Frontend (React)**

   * Dashboard, Resume Builder, Mock Tests, Notifications, and Profile modules.
   * Role-based UI components (Student, TPO, Company).
2. **Backend (Node/Express)**

   * Authentication & Authorization (JWT)
   * REST endpoints for jobs, applications, tests, analytics, and notifications
   * Business logic for placement rules enforcement
3. **Database (MongoDB)**

   * Collections: users, jobs, applications, resumes, tests, notifications, reports
4. **Integrations**

   * Email/SMS gateway for notifications
   * PDF generation service for resume export

---

## Team Contacts

* Sneh Gohel: snehgohel51@gmail.com
* Shivam Patel: shivampatel.aws@gmail.com
* Pramukh Prajapati: pramukhprajapati17@gmail.com

---

## License

This project is released under the MIT License. See LICENSE for details.
