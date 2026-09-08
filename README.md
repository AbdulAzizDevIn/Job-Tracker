# Job Tracker

A full-stack job application tracking platform built with Next.js, TypeScript, MongoDB, Mongoose, and Better Auth.

Job Tracker helps users organize their job search through a Kanban-style workflow, track application details, and monitor their progress from a single dashboard.

## Live Demo

https://job-tracker-aziz.vercel.app

## Features

- 🔐 User authentication with Better Auth
- 👤 User-specific job data and authorization
- 📋 Kanban-style job application management
- ➕ Create job applications
- ✏️ Edit job applications
- 🗑️ Delete job applications
- 🔄 Move applications between hiring stages
- 📊 Dashboard statistics
- 🏷️ Job tags and technology tracking
- 💰 Salary tracking
- 📍 Location tracking
- 🔗 Job posting links
- 📝 Job descriptions and personal notes
- 📅 Application date tracking
- 📱 Responsive design for desktop and mobile
- ⏳ Loading states and disabled actions to prevent duplicate requests
- 🚀 Production deployment with Vercel

## Hiring Workflow

Applications can be organized through different stages:

```text
Wishlist
    ↓
Applied
    ↓
Interviewing
    ↓
Offer

          ↘ Rejected