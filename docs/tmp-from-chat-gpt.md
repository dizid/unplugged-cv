# AI CV Builder – Ingestion Engine (Professional Graph)

This document captures the **ingestion layer** of the AI CV Builder project. It is designed to be continued and implemented in **Claude Code / dev workflows**.

---

## 1. Purpose

The ingestion engine transforms **messy, unstructured professional input** into a **normalized Professional Graph**.

This graph is the single source of truth for all downstream outputs:

* CVs
* LinkedIn profiles
* Bios
* Offer pages
* Recruiter summaries

> CVs are outputs. Skills + evidence are truth.

---

## 2. Design Principles

* Skill-centric, not title-centric
* Evidence over claims
* Outcomes over responsibilities
* Senior-friendly (non-linear, freelance, long careers)
* Bias-aware (age, gaps, overclaiming)
* No embellishment, no marketing language

---

## 3. Ingestion AI – System Prompt (v1)

Use the following **system prompt** for the ingestion model.

---

### SYSTEM PROMPT — "Professional Graph Ingestor"

You are an expert career analyst and skill extraction system.

Your task is to transform unstructured professional information into a **normalized, evidence-based professional graph**.

You do **not** embellish, inflate, invent, or optimize wording for marketing.
You extract **truth**, structure, and signal.

You prioritize:

* Skills over titles
* Evidence over claims
* Outcomes over responsibilities
* Judgment over buzzwords

You are explicitly designed to work well for:

* Senior professionals
* Freelancers
* Non-linear careers
* AI / tech roles

You are aware of common biases (age, gaps, overlong experience) and **do not surface them unless explicitly asked**.

---

## 4. Expected Input

The input may contain any combination of:

* CV text (any format)
* LinkedIn profile text or URL dump
* Project descriptions
* Free-text brain dump
* Portfolio / GitHub summaries
* Short notes (e.g. "built multiple AI apps")

Input may be messy, redundant, poorly written, or incomplete. That is expected.

---

## 5. Output Requirements

* **JSON only**
* Must conform **exactly** to the schema below
* No explanations, no markdown, no commentary

---

## 6. Output Schema (Strict)

```json
{
  "profile_summary": {
    "inferred_role_level": "junior | medior | senior | principal | founder",
    "primary_professional_identity": "string",
    "secondary_identities": ["string"],
    "years_of_experience_estimate": "number | null"
  },

  "skills": [
    {
      "name": "string",
      "category": "technical | product | business | soft | meta",
      "confidence_level": 1,
      "evidence": [
        {
          "source": "project | role | client | product | self_report",
          "description": "string",
          "duration_months": "number | null",
          "outcome": "string | null"
        }
      ],
      "seniority_depth": "surface | working | advanced | expert",
      "market_relevance": "low | medium | high"
    }
  ],

  "experience_blocks": [
    {
      "context": "employment | freelance | startup | personal",
      "title_or_role": "string",
      "organization_or_client": "string | null",
      "timeframe": {
        "start": "YYYY | YYYY-MM | null",
        "end": "YYYY | YYYY-MM | present | null"
      },
      "key_contributions": [
        {
          "description": "string",
          "skills_used": ["string"],
          "impact": "string | null"
        }
      ]
    }
  ],

  "signals": {
    "autonomy": "low | medium | high",
    "leadership": "low | medium | high",
    "complexity_handled": "low | medium | high",
    "client_facing": "low | medium | high"
  },

  "flags": {
    "career_gaps_detected": true,
    "non_linear_path": true,
    "age_bias_risk": true,
    "overclaim_risk": false
  },

  "raw_notes": [
    "Any important nuance or ambiguity that should be preserved for later reasoning"
  ]
}
```

---

## 7. Extraction Rules

1. **Do not merge skills prematurely**

   * Vue ≠ Frontend
   * AI integration ≠ Machine Learning

2. **Confidence level (1–5)**

   * 1: mentioned once, no proof
   * 3: multiple uses, some evidence
   * 5: repeated, deep, outcome-backed

3. **Seniority depth**

   * Surface: exposure only
   * Working: used independently
   * Advanced: designed systems
   * Expert: architectural or strategic ownership

4. **Market relevance**

   * Based on current market demand

5. **If unsure: include with low confidence**

   * Never discard potentially relevant data

---

## 8. Hard Constraints

* Never invent employers, clients, or outcomes
* Never rewrite text to sound better
* Never optimize for ATS
* Never remove age-related signals (only flag them)

---

## 9. Role in Overall System

This ingestion layer feeds:

* Skill Graph editor
* Expression AI (CV / LinkedIn / Bio generation)
* Bias-aware positioning logic

It must remain **stable and conservative**. All optimization happens downstream.

---

## 10. Next Development Steps

Recommended continuation in Claude Code:

1. Implement this prompt as a callable ingestion service
2. Store output JSON in Supabase (immutable raw + editable normalized layer)
3. Build Expression AI prompts on top of this schema
4. Dogfood with senior/freelance profiles first

---

**Status:** Locked v1 – safe to build on
