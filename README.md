# FOUND Run Club 🏃‍♂️

A cross-platform mobile and web application built to manage running groups, track participant attendance, and foster community engagement.

## Overview

FOUND Run Club is a comprehensive platform that connects running instructors with participants, facilitating organized group runs and tracking participant progress. Built using modern web technologies in a monorepo architecture, it delivers a seamless experience across both web and mobile platforms.

## Key Features

- **Multi-Platform Support** 📱

  - Responsive web interface (Next.js)
  - Native mobile experience (Expo/React Native)
  - Shared codebase for consistent functionality

- **Instructor Management** 👥

  - Detailed instructor profiles and bios
  - Collaborative run scheduling
  - Run management dashboard

- **Participant Engagement** 🎯

  - Simple email/password registration
  - Run RSVP system
  - Progress tracking
  - Achievement-based rewards system

- **Run Organization** 🗺️

  - Detailed run scheduling (pace, distance, route)
  - QR code attendance tracking
  - Real-time participant lists
  - Location mapping

- **Rewards System** 🏆
  - Milestone-based achievements
  - Automated reward distribution
  - Progress visualization

## Technical Architecture

### Frontend

- **Web**: Next.js 14
- **Mobile**: Expo/React Native
- **UI Framework**: Tamagui
- **Cross-Platform**: Solito for navigation sharing

### Backend

- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Development

- Monorepo structure using Turborepo
- Shared component library
- Type-safe database queries
- Cross-platform state management
