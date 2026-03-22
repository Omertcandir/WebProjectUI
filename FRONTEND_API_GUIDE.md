# Frontend API Guide

This document is prepared for fast frontend integration with WebProjectService.

## 1. General

- Base URL: http://64.226.125.254
- Swagger UI: http://64.226.125.254/swagger/index.html
- OpenAPI JSON: http://64.226.125.254/swagger/v1/swagger.json
- Health Check: GET /health
- Content-Type: application/json

## 2. Authentication

- Token type: Bearer JWT
- Header format:

```http
Authorization: Bearer <token>
```

Typical auth response fields:

```json
{
  "token": "...",
  "expiresAt": "2026-03-18T20:00:00Z",
  "userId": 1,
  "username": "berke",
  "email": "mail@example.com",
  "role": "Member",
  "memberId": 5,
  "trainerId": null
}
```

## 3. Role Rules

- Admin: admin endpoints and most trainer/member endpoints
- Trainer: workouts, member management, selected finance/notification endpoints
- Member: own member/subscription/progress endpoints

Backend enforces role checks at endpoint level. Frontend should conditionally render menus/actions by logged-in user role.

## 4. Enum Values

### Role
- Admin = 1
- Trainer = 2
- Member = 3

### MembershipStatus
- Active = 1
- Expired = 2
- Frozen = 3
- Cancelled = 4

### DifficultyLevel
- Beginner = 1
- Intermediate = 2
- Advanced = 3

### WorkoutSessionStatus
- Scheduled = 1
- Completed = 2
- Cancelled = 3
- Missed = 4

### MuscleGroup
- Chest = 1
- Back = 2
- Legs = 3
- Shoulders = 4
- Arms = 5
- Core = 6
- FullBody = 7
- Cardio = 8

## 5. Endpoints

Swagger currently exposes these route groups:

- /api/Auth/*
- /api/Members/*
- /api/Progress/*
- /api/Subscriptions/*
- /api/Workouts/*
- /api/Finance/*
- /api/Notifications/*

Note: Existing frontend calls use lowercase route segments (for example `/api/auth/login`). ASP.NET Core routing is case-insensitive by default, so this is compatible.

## 6. Frontend Integration Notes

- All id fields are int.
- Backend stores enums as numeric values; use frontend label maps.
- Redirect to login on expired token.
- Handle 401/403 in one shared API layer.
- Send date fields in ISO-8601 format (`toISOString`).

## 7. Expected Error Codes

- 400: validation or business rule error
- 401: missing login or invalid token
- 403: insufficient role permission
- 404: record not found
- 500: server error

## 8. Quick Start Flow

1. POST /api/auth/login and get token
2. Add `Authorization: Bearer <token>` header
3. Member dashboard flow:
4. GET /api/subscriptions/plans
5. POST /api/subscriptions/select-plan
6. GET /api/workouts/members/{memberId}/sessions
7. GET /api/progress/members/{memberId}/chart
