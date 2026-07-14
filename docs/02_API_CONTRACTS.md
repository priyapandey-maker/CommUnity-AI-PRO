# CommUnity AI
## API Contracts

Version 2.0

---

# Rules

Every response follows:

{
    success: boolean,
    message: string,
    data: {},
    timestamp: ISODate
}

Every error follows:

{
    success:false,
    error:{
        code:"",
        message:"",
       details:[]
    }
}

---

# Authentication

POST /api/auth/login

Request

{
 email,
 password
}

Response

{
 token,
 user
}

--------------------------------

POST /api/auth/register

--------------------------------

POST /api/auth/logout

--------------------------------

GET /api/auth/profile

--------------------------------

# Incidents

POST /api/incidents

Purpose

Create new incident.

Input

title

description

category

location

images[]

anonymous

Output

incidentId

status

decisionId

--------------------------------

GET /api/incidents

Filters

status

category

priority

department

ward

date

--------------------------------

GET /api/incidents/:id

Returns complete incident.

--------------------------------

PATCH /api/incidents/:id

Officer updates.

--------------------------------

DELETE /api/incidents/:id

Admin only.

--------------------------------

# AI

POST /api/ai/analyze

Runs complete orchestrator.

Input

incidentId

Returns

Decision Object

--------------------------------

GET /api/decision/:id

Returns

Final intelligence object.

--------------------------------

POST /api/feedback

Citizen feedback.

--------------------------------

POST /api/officer-feedback

Officer learning feedback.

--------------------------------

# Dashboard

GET /api/dashboard/summary

Returns

Incident count

Open

Closed

Pending

Hotspots

--------------------------------

GET /api/dashboard/trends

--------------------------------

GET /api/dashboard/heatmap

--------------------------------

GET /api/dashboard/priorities

--------------------------------

# Administration

GET /api/admin/users

GET /api/admin/departments

GET /api/admin/categories

GET /api/admin/audit
