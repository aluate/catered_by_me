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
  | "all_oven_no_prep";

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

