# CommUnity AI
## UI / UX MASTER SPECIFICATION
### Version 2.0
### Single Source of Truth for Frontend Development

---

# 1. Purpose

This document defines the complete UI/UX philosophy, visual language,
component standards, interaction rules and page architecture for CommUnity AI.

Every frontend implementation MUST follow this specification.

This document takes precedence over implementation convenience.

---

# 2. Product Identity

CommUnity AI is NOT

❌ AI Dashboard

❌ Complaint Portal

❌ Analytics Tool

❌ Smart City Dashboard

CommUnity AI IS

> An AI-powered Decision Intelligence Platform.

Every screen should reinforce

• Trust
• Transparency
• Explainability
• Accountability
• Public Service
• Calm Professionalism

Users should feel

"I understand why this decision exists."

NOT

"The AI made a decision."

---

# 3. Design Principles

Every interface must satisfy:

1. Clarity before beauty.

2. Information before decoration.

3. Evidence before recommendation.

4. Explainability before automation.

5. Accessibility before aesthetics.

6. Consistency before creativity.

---

# 4. Design Language

Visual references

Google Material 3 (minimal influence)

GitHub

Stripe Dashboard

Linear

Notion

Government Digital Services (GDS)

Avoid

Glassmorphism

Heavy gradients

Neon colors

3D illustrations

Over-animated interfaces

Crypto dashboards

Startup landing pages

---

# 5. Color Philosophy

Primary

Community Blue

Success

Green

Warning

Amber

Critical

Red

Information

Blue

Neutral

Gray

Every color has semantic meaning.

Never use color only for decoration.

---

# 6. Theme System

Support

✓ Light

✓ Dark

Every component must have

Light variant

Dark variant

WCAG AA contrast

Never use colors without semantic tokens.

Examples

Background

Surface

Surface Elevated

Primary Text

Secondary Text

Border

Accent

Success

Warning

Danger

Info

---

# 7. Typography

Display

Hero headlines only.

H1

Page title.

H2

Section title.

H3

Card title.

Body

Paragraphs.

Label

Inputs.

Caption

Metadata.

Rules

No more than three font weights.

Consistent line heights.

Readable spacing.

No oversized typography.

---

# 8. Spacing System

Only use

4

8

12

16

24

32

40

48

64

Never arbitrary spacing.

All layouts use an 8-point grid.

---

# 9. Border Radius

Small

Medium

Large

Extra Large

No inconsistent radii.

---

# 10. Elevation

Flat

Border Only

Card

Modal

Maximum four shadow levels.

---

# 11. Motion

Purpose

Guide attention.

Never entertain.

Allowed

Hover elevation

Page fade

Card transition

Progress animation

Expand / collapse

Forbidden

Bounce

Elastic

Flash

Heavy parallax

---

# 12. Icons

Single icon family.

Consistent size.

Consistent stroke width.

Meaningful.

Never decorative.

---

# 13. Accessibility

Every screen must pass

Keyboard navigation

Visible focus

ARIA labels

WCAG AA

Dark mode readability

Screen reader compatibility

---

# 14. Layout Rules

Every page follows

Navigation

↓

Page Header

↓

Primary Content

↓

Secondary Content

↓

Footer

Consistent max-width.

Consistent padding.

Consistent gutters.

---

# 15. Navigation

Persistent top navigation.

Theme toggle.

User menu.

Notifications.

No hidden navigation.

---

# 16. User Roles

Citizen

Authority

Administrator

Every role sees only relevant actions.

No feature overload.

---

# 17. Landing Page

Purpose

Build trust.

Communicate vision.

Structure

Navigation

↓

Hero

↓

Platform Overview

↓

Key Capabilities

↓

Decision Workflow

↓

Call to Action

↓

Footer

Do not market AI.

Market decision support.

---

# 18. Citizen Portal

Purpose

Collect actionable intelligence.

Pages

Report Incident

Track Incident

My Reports

Notifications

Profile

Rules

Simple.

Guided.

Minimal friction.

---

# 19. Incident Reporting

Layout

Header

↓

Form

↓

AI Guidance Sidebar

↓

Submission

Requirements

Autosave

Validation

Image Upload

Location

Accessibility

---

# 20. Authority Portal

Purpose

Support operational decision making.

Sections

Priority Queue

Live Incidents

Assignments

Analytics

Department Status

Decision Timeline

Recommendations

---

# 21. Decision Intelligence Page

This is the flagship page.

Visual order

1 Recommendation

2 Priority

3 Readiness

4 Decision Explanation

5 Evidence

6 AI Pipeline

7 Timeline

8 Technical Metadata

Users must understand

WHY

before

HOW.

---

# 22. Decision Ledger

Purpose

Public transparency.

Not

Admin table.

Requirements

Readable timeline

Search

Filters

Status

Decision history

Audit trail

Professional density.

---

# 23. Analytics

Sections

Incident Trends

Heatmap

Department Performance

Category Distribution

Response Time

Resolution Time

Community Health Score

Predictive Alerts

Charts support understanding.

Not decoration.

---

# 24. Notifications

Grouped

Unread

Recent

Resolved

Context aware.

Actionable.

---

# 25. Search

Global search.

Supports

Incident ID

Location

Category

Status

Citizen

Department

---

# 26. AI Explainability

Every AI recommendation includes

Evidence

Confidence

Reasoning

Alternative actions

Responsible department

Estimated response

No opaque AI outputs.

---

# 27. Empty States

Every page has

Helpful message

Next action

Illustration optional

Never blank.

---

# 28. Loading States

Skeletons preferred.

Buttons disabled.

Meaningful progress.

---

# 29. Error States

Human readable.

Recovery action.

Retry.

Never raw exceptions.

---

# 30. Responsive Rules

Desktop

Tablet

Mobile

Layouts adapt.

No horizontal scrolling.

---

# 31. Reusable Components

AppShell

Navbar

Sidebar

Cards

Buttons

Badges

Tables

Timeline

Evidence Card

Recommendation Card

Metric Card

Search

Filter

Pagination

Modal

Toast

Loader

Empty State

Error Boundary

---

# 32. Component Rules

Every component

Single responsibility.

Accessible.

Reusable.

Typed.

Theme aware.

Responsive.

---

# 33. Forms

Labels always visible.

Validation immediate.

Helpful errors.

Accessible.

Logical tab order.

---

# 34. Tables

Search

Sort

Pagination

Sticky header

Responsive

Readable density

---

# 35. Charts

Used only when they improve decisions.

Never decorative.

Include

Legend

Tooltip

Accessible colors

---

# 36. Dashboard Philosophy

Dashboards answer questions.

Not display data.

Every widget answers exactly one question.

---

# 37. AI Transparency

Every AI output shows

Confidence

Evidence

Explanation

Timestamp

Model status

Fallback state if applicable

---

# 38. Quality Checklist

Before merging any UI change

□ Theme verified

□ Responsive verified

□ Accessibility verified

□ Typography consistent

□ Spacing consistent

□ Component reused

□ No duplicated styles

□ No inline colors

□ No functionality changed

□ Build passes

□ Lint passes

---

# 39. Frontend Engineering Rules

Business logic stays in services.

Pages orchestrate.

Components present.

Hooks manage state.

Never call APIs directly from UI components.

---

# 40. Definition of Done

A feature is complete only if

✓ Functional

✓ Responsive

✓ Accessible

✓ Explainable

✓ Theme compatible

✓ API integrated

✓ Error handled

✓ Loading handled

✓ Tested

✓ Matches this specification

---

# 41. Final Principle

CommUnity AI should never feel like an AI demo.

It should feel like software that a municipality could confidently deploy to support transparent, explainable, and evidence-based community decision making.
