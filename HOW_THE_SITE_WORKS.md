# How Catered By Me Works - Complete User Guide

## 🎯 What the Site Does

**Catered By Me** helps hosts turn recipes into step-by-step cooking schedules. It's like a sous-chef that coordinates everything so all dishes hit the table at the same time.

---

## 👤 User Flows

### 1. **Anonymous Quick Try** (No Login Required)
- Visit homepage (`/`)
- Paste recipe text
- Set headcount and serve time
- Generate schedule instantly
- See step-by-step game plan organized by kitchen stations

### 2. **Sign Up / Sign In** (`/auth/sign-in`)
- Enter email
- Receive magic link (no password!)
- Click link → auto-logged in
- Redirected to dashboard

### 3. **Dashboard** (`/app`)
**What you see:**
- Next upcoming event (with countdown)
- Weekly prep event (if set)
- Recent recipes (3 most recent)
- Quick actions: Create Event, Create Recipe

**Purpose:** Home base - see what's coming up

### 4. **My Recipes** (`/app/recipes`)
**What you can do:**
- View all your saved recipes
- Click recipe → see details
- Edit recipe (change ingredients, times, etc.)
- Delete recipe
- Create new recipe (from scratch or from text)

**Why:** Build your recipe bank over time

### 5. **My Events** (`/app/events`)
**What you can do:**
- View all events (Upcoming / Past tabs)
- Create new event:
  - Name (e.g., "Thanksgiving Dinner")
  - Date & time
  - Headcount
  - Type (dinner, brunch, prep_week, etc.)
  - Vibe (casual, fancy, etc.)
  - Location
- Click event → event detail page

**Why:** Plan meals for specific occasions

### 6. **Event Detail** (`/app/events/[id]`)
**What you can do:**
- See event info (name, date, headcount, vibe)
- Attach recipes to event
- Remove recipes from event
- Generate game plan (combines all recipes into one schedule)
- View grocery list
- Share event (Pro feature)

**Why:** This is where you build your meal plan

### 7. **Grocery List** (`/app/events/[id]/grocery`)
**What you see:**
- All ingredients from all recipes
- Grouped by store section (produce, dairy, meat, etc.)
- Grouped by recipe (if you prefer)
- Quantities automatically calculated
- Checkboxes to track what you've bought
- Print-friendly view

**Why:** Shopping made easy - everything in one list

### 8. **Gift Memberships** (`/gift`)
**Complete gift certificate system:**
- `/gift` - Landing page explaining gifts
- `/gift/create` - Create a gift code (purchaser form)
- `/gift/success/[code]` - Success page with certificate link
- `/gift/[code]/certificate` - Printable certificate (2 templates)
- `/redeem` - Recipients redeem codes here

**Why:** Let people gift Pro memberships

### 9. **Pricing** (`/pricing`)
- Free tier (3 events, 10 recipes)
- Pro tier ($15/year, unlimited everything)
- Holiday Host Pass (free through Jan 15)
- Feature comparison table

### 10. **Profile & Settings**
- `/app/profile` - Edit your profile
- `/app/settings/kitchen` - Set kitchen capacity:
  - Number of ovens
  - Oven capacity
  - Number of burners
  - Counter space

**Why:** Personalizes capacity coaching

---

## 🧠 How It Works Behind the Scenes

### Schedule Generation
1. You provide: Recipe text, headcount, serve time
2. Backend parses: Extracts ingredients, steps, times
3. Backend schedules: Allocates tasks to stations, times them
4. You get: Minute-by-minute game plan

### Capacity Coaching
- Checks your kitchen capacity
- Warns if oven is overbooked
- Warns if prep window is too tight
- Suggests fixes with personality

### Grocery Aggregation
- Collects ingredients from all recipes
- Merges duplicates (e.g., "onion" + "onions")
- Calculates total quantities
- Groups by store section

---

## 🎨 Brand Personality

The site has a **warm, helpful, slightly playful** personality:
- "Host the meal. We've got the rest."
- Capacity warnings are friendly, not harsh
- Empty states are encouraging
- Errors are explained clearly

---

## 📱 What Works Where

**Web Browser:**
- Everything works in modern browsers
- Mobile-responsive design
- Print-friendly grocery lists

**Currently NOT Available:**
- Mobile app (future)
- Offline mode (future)
- Multi-user collaboration (future)

---

## 🔐 User Tiers

### Free Tier
- 3 saved events max
- 10 saved recipes max
- Unlimited schedule generation (try mode)
- Grocery lists
- **No PDF export**
- **No share links**

### Pro Tier ($15/year)
- Unlimited events
- Unlimited recipes
- Everything in Free
- PDF export
- Shareable game plans
- Priority support

### Holiday Host Pass (Until Jan 15, 2026)
- Everything in Pro
- Free
- No credit card needed

---

## 🎯 Core Value Proposition

**For hosts who:**
- Want everything ready at the same time
- Need help coordinating multiple dishes
- Want confidence in their timing
- Like organized, step-by-step plans

**The site helps by:**
- Turning recipes into timed schedules
- Organizing tasks by kitchen station
- Warning about capacity issues
- Providing grocery lists
- Saving your recipes and events

---

## 🚀 Demo Mode

**Currently active** (`apps/web/src/lib/demo.ts`):
- All Pro features unlocked
- No database writes
- Fake data for demos
- Perfect for presentations

**To disable:** Set `DEMO_MODE = false`

