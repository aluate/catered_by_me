# Control Document: Catered By Me

## Project Purpose

Catered By Me is an app that helps users plan and execute cooking for events by:
- Accepting recipes via text or links
- Scaling ingredient quantities to desired headcount
- Breaking recipe steps into atomic tasks
- Generating a backwards-planned cooking schedule with swim lanes for different stations (PREP, OVEN, STOVE, COUNTER, PASSIVE)

## Current Scope (MVP Backend)

This initial phase focuses on building the backend API skeleton with:
- Recipe parsing from text
- Ingredient scaling
- Basic task scheduling engine
- REST API endpoints

## Future Scope Notes

- **Next.js/React Web App** in `apps/web`:
  - Recipe input interface
  - Headcount and serve time selection
  - Interactive swim-lane timeline visualization
  - Recipe management

- **Grocery API Integrations**:
  - Link scaled ingredient lists to local grocery stores
  - Enable pickup/delivery ordering

- **User Accounts & Saved Meal Plans**:
  - User authentication
  - Save favorite recipes
  - Build and save multi-recipe meal plans
  - Recipe history

## Build Order

1. ✅ Recipe models + schedule models
2. ✅ Parsing service for text recipes
3. ✅ Scaling engine
4. ✅ Scheduler engine (backwards from serve time)
5. ✅ API endpoints
6. ✅ Basic tests
7. ⏳ Web app shell (Next.js placeholder)

