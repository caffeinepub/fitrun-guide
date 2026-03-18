# FitRun Guide

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Home screen with today's fitness tip and "Start Running" CTA
- Explore section with fitness articles organized by category (Fat Loss, Muscle, Running)
- Running Plans section with Beginner (0–2km), Intermediate (3–5km), Advanced (10km+)
  - Each plan has daily targets, rest days
- Progress Tracker: log runs with distance and calories, view weekly summary
- Goals section: set a goal (e.g. 5km in 30 days), track completion percentage
- Navigation: Home, Explore, Plans, Tracker, Goals/Profile tabs

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: store fitness articles, running plans, user run logs, and user goals in stable data structures
2. Backend: CRUD for run logs (add run entry with distance, calories, date)
3. Backend: CRUD for goals (add goal with name, target distance, target days)
4. Backend: expose queries for articles, plans, run logs, and goals
5. Frontend: 5-tab layout (Home, Explore, Plans, Tracker, Goals)
6. Frontend: Home tab — today's tip card + Start Running button
7. Frontend: Explore tab — article cards with category filters
8. Frontend: Plans tab — 3 plan cards with daily schedule
9. Frontend: Tracker tab — log run form + weekly progress chart + summary list
10. Frontend: Goals tab — active goals list with progress + add goal form
