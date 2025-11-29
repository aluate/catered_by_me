/**
 * Personality messages for Catered By Me
 * 
 * Each message key has multiple variations that are randomly selected
 * to keep the app feeling alive and human.
 */

export type MessageKey =
  | "capacity_overload"
  | "prep_window_too_short"
  | "too_many_projects"
  | "oven_overbooked"
  | "all_oven_no_prep"
  | "no_recipes_yet"
  | "no_events_yet"
  | "no_upcoming_events"
  | "no_recipes_attached"
  | "ambitious_headcount"
  | "tight_timeline"
  | "event_saved"
  | "recipe_saved"
  | "schedule_generated"
  | "grocery_copied";

const messages: Record<MessageKey, string[]> = {
  capacity_overload: [
    "You might not have the space to pull this off. Let's rethink the plan.",
    "Eyes a bit bigger than all those stomachs. Maybe move a dish to the stove or grill.",
    "Your oven is yelling 'I'm full' in advance. Try staggering dishes or swapping in a stovetop option.",
  ],
  prep_window_too_short: [
    "This is a *speedrun*, not a dinner. Let's either start earlier or trim a dish.",
    "Even Gordon Ramsay would sweat this timeline. Add a little more prep time?",
    "We can make this work *or* keep your sanity, but not both. Extend the window a bit.",
  ],
  too_many_projects: [
    "You've built a tasting menu, not a Tuesday night. Maybe swap one 'project' dish for a simple side.",
    "Great choices. Also… do you own a brigade? If not, we might dial one dish back.",
  ],
  oven_overbooked: [
    "Your oven has a full dance card. Consider moving something to the stovetop or grill.",
    "That's a lot of oven time in one window. Maybe stagger the dishes or use multiple cooking methods?",
  ],
  all_oven_no_prep: [
    "All oven, no prep time. Let's add some buffer or simplify one dish.",
    "The oven's busy, but when do you prep? We need more time before things go in.",
  ],
  no_recipes_yet: [
    "Your recipe bank is empty. Time to start building your arsenal.",
    "No recipes yet. Grandma's stuffing and your weeknight tacos are waiting.",
    "Your recipe collection is looking a little thin. Let's fix that.",
  ],
  no_events_yet: [
    "No events planned yet. Let's fix that – create your first event.",
    "Your calendar is empty. Perfect time to plan something delicious.",
    "No events on the horizon. Time to change that.",
  ],
  no_upcoming_events: [
    "Nothing on the calendar. Perfect time to plan something delicious.",
    "No upcoming events. Your kitchen is ready when you are.",
    "Calendar's clear. What are we cooking?",
  ],
  no_recipes_attached: [
    "No recipes attached yet. Attach recipes to generate your grocery list.",
    "This event needs recipes. Add some and we'll build you a list.",
    "No recipes here. Add some to see your grocery list.",
  ],
  ambitious_headcount: [
    "That's a lot of mouths for one oven. We'll make it work, but you might want to delegate dessert.",
    "Ambitious headcount. Your oven might need backup. Consider some stovetop options.",
    "That's a crowd. We'll build you a plan, but consider staggering dishes or using multiple cooking methods.",
  ],
  tight_timeline: [
    "Tomorrow? Ambitious. We'll build you a plan, but consider starting prep tonight.",
    "That's a tight timeline. We can make it work, but you might want to prep ahead.",
    "Not much time. We'll optimize, but consider simplifying one dish or starting earlier.",
  ],
  event_saved: [
    "Event saved! Ready to add recipes?",
    "Got it. Now let's add some recipes.",
    "Event created. Time to plan the menu.",
  ],
  recipe_saved: [
    "Recipe saved! Ready to use it in an event?",
    "Recipe added to your collection.",
    "Got it. This recipe is ready to use.",
  ],
  schedule_generated: [
    "Game plan ready! Check your schedule below.",
    "Schedule generated. You're all set.",
    "Your plan is ready. Let's get cooking.",
  ],
  grocery_copied: [
    "List copied! Now go shop.",
    "Grocery list copied to clipboard.",
    "Got it. Your list is ready to shop.",
  ],
};

/**
 * Get a random message for the given key
 */
export function getMessage(key: MessageKey): string {
  const options = messages[key];
  if (!options || options.length === 0) {
    return `[Message not found: ${key}]`;
  }
  // Pick a random message from the array
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Get all messages for a key (useful for testing or if you want to show multiple)
 */
export function getAllMessages(key: MessageKey): string[] {
  return messages[key] || [];
}

