# AI Agent Specifications

Version 2.0

---

# Global Rules

Every agent has ONE responsibility.

Every agent reads the Incident Object.

Every agent returns JSON only.

Every output contains confidence.

Every output is explainable.

Agents never modify another agent's output.

Only AI Orchestrator merges outputs.

---

# Agent 1

Incident Understanding Agent

Purpose

Understand incident.

Input

title

description

images

Output

{
summary,
category,
severity,
keywords,
confidence
}

Failure

Unknown category

Low confidence

Missing description

---

# Agent 2

Duplicate Detection

Purpose

Prevent duplicate complaints.

Input

Current Incident

Historical incidents

Output

{
duplicate:true,
duplicates:[],
clusterId,
similarityScore
}

---

# Agent 3

Location Intelligence

Input

GPS

Address

Output

{
ward,
zone,
nearbyIncidents,
hotspotScore
}

---

# Agent 4

Priority Prediction

Input

Incident

History

Location

Output

{
priority,
urgency,
riskScore,
recommendedSLA
}

Priority

Critical

High

Medium

Low

---

# Agent 5

Recommendation Agent

Output

{
departments[],
recommendedActions[],
estimatedResources[]
}

---

# Agent 6

Decision Explanation Agent

Output

{
reasoning,
humanExplanation,
confidence
}

---

# Agent 7

Learning Agent

Input

Officer feedback

Citizen feedback

Resolution

Output

Updated learning metrics
