import re
import uuid
from typing import Optional
from ..models.recipes import Recipe, Ingredient, AtomicTask


def parse_text_recipe(title: Optional[str], headcount: int, raw_text: str) -> Recipe:
    """
    Parse a raw text recipe into a structured Recipe object.
    
    This is a v0 implementation that uses simple rule-based parsing.
    It assumes the text contains an "Ingredients" section and a "Directions" or "Steps" section.
    """
    recipe_id = str(uuid.uuid4())
    
    # Extract title if not provided
    if not title:
        # Try to extract from first line or heading
        lines = raw_text.strip().split('\n')
        title = lines[0].strip() if lines else "Untitled Recipe"
        if title.lower().startswith(('ingredients', 'directions', 'steps')):
            title = "Untitled Recipe"
    
    # Split into ingredients and steps sections
    text_lower = raw_text.lower()
    ingredients_text = ""
    steps_text = ""
    
    # Find ingredients section
    ingredients_match = re.search(
        r'(?:^|\n)\s*(?:ingredients?|ingredient list)\s*(?::|\n)',
        text_lower,
        re.IGNORECASE | re.MULTILINE
    )
    
    # Find directions/steps section
    directions_match = re.search(
        r'(?:^|\n)\s*(?:directions?|steps?|instructions?|method)\s*(?::|\n)',
        text_lower,
        re.IGNORECASE | re.MULTILINE
    )
    
    if ingredients_match and directions_match:
        start = ingredients_match.end()
        end = directions_match.start()
        ingredients_text = raw_text[start:end]
        steps_text = raw_text[directions_match.end():]
    elif ingredients_match:
        ingredients_text = raw_text[ingredients_match.end():]
    else:
        # Fallback: assume first half is ingredients, second half is steps
        lines = raw_text.split('\n')
        mid = len(lines) // 2
        ingredients_text = '\n'.join(lines[:mid])
        steps_text = '\n'.join(lines[mid:])
    
    # Parse ingredients
    ingredients = []
    for line in ingredients_text.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        
        # Try to extract quantity, unit, and name
        # Pattern: "2 cups flour" or "1/2 tsp salt" or "3 large eggs"
        ingredient = _parse_ingredient_line(line)
        if ingredient:
            ingredients.append(ingredient)
    
    # Parse steps into tasks
    tasks = []
    step_num = 1
    for line in steps_text.split('\n'):
        line = line.strip()
        if not line:
            continue
        
        # Skip numbered prefixes if present
        line = re.sub(r'^\d+[\.\)]\s*', '', line)
        
        if len(line) < 5:  # Skip very short lines
            continue
        
        task = _parse_step_to_task(line, step_num)
        if task:
            tasks.append(task)
            step_num += 1
    
    return Recipe(
        id=recipe_id,
        title=title,
        headcount=headcount,
        ingredients=ingredients,
        tasks=tasks,
        source="manual"
    )


def _parse_ingredient_line(line: str) -> Optional[Ingredient]:
    """Parse a single ingredient line into an Ingredient object."""
    # Pattern: quantity unit name (notes)
    # Examples: "2 cups flour", "1/2 tsp salt", "3 large eggs, beaten"
    
    # Try to match fractions and decimals
    quantity_pattern = r'(\d+(?:\.\d+)?|(?:\d+\s+)?\d+/\d+)'
    unit_pattern = r'(cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|oz|ounce|ounces|lb|pound|pounds|g|gram|grams|kg|kilogram|kilograms|ml|milliliter|milliliters|l|liter|liters|clove|cloves|piece|pieces|large|medium|small|whole|halves|slices|dashes?|pinches?)'
    
    # Try to extract quantity and unit
    match = re.match(
        rf'^{quantity_pattern}\s+{unit_pattern}\s+(.+)$',
        line,
        re.IGNORECASE
    )
    
    if match:
        qty_str, unit, rest = match.groups()
        quantity = _parse_quantity(qty_str)
        name_and_notes = rest.strip()
        
        # Split name and notes (notes often after comma)
        if ',' in name_and_notes:
            name, notes = name_and_notes.split(',', 1)
            name = name.strip()
            notes = notes.strip()
        else:
            name = name_and_notes
            notes = None
        
        return Ingredient(
            name=name,
            quantity=quantity,
            unit=unit.lower(),
            notes=notes
        )
    
    # Fallback: no quantity/unit, just name
    if ',' in line:
        name, notes = line.split(',', 1)
        return Ingredient(name=name.strip(), notes=notes.strip())
    
    return Ingredient(name=line)


def _parse_quantity(qty_str: str) -> float:
    """Parse a quantity string (including fractions) to a float."""
    qty_str = qty_str.strip()
    
    # Handle fractions like "1/2" or "1 1/2"
    if '/' in qty_str:
        parts = qty_str.split()
        if len(parts) == 1:
            # Simple fraction "1/2"
            num, den = map(float, qty_str.split('/'))
            return num / den
        else:
            # Mixed number "1 1/2"
            whole = float(parts[0])
            num, den = map(float, parts[1].split('/'))
            return whole + (num / den)
    
    return float(qty_str)


def _parse_step_to_task(step_text: str, step_num: int) -> AtomicTask:
    """Convert a step text into an AtomicTask."""
    task_id = str(uuid.uuid4())
    
    # Determine station based on keywords
    step_lower = step_text.lower()
    station = "prep"  # default
    
    if any(word in step_lower for word in ["bake", "roast", "broil", "bake"]):
        station = "oven"
    elif any(word in step_lower for word in ["sauté", "sauté", "simmer", "boil", "fry", "cook", "heat", "stir", "reduce"]):
        station = "stove"
    elif any(word in step_lower for word in ["chop", "dice", "slice", "cut", "mince", "grate", "peel", "mix", "combine", "whisk", "beat"]):
        station = "prep"
    elif any(word in step_lower for word in ["rest", "chill", "marinate", "soak", "let stand"]):
        station = "passive"
    else:
        station = "counter"  # for assembly, plating, etc.
    
    # Estimate duration (simple heuristic)
    duration = 5  # default
    
    # Look for time mentions
    time_patterns = [
        (r'(\d+)\s*(?:min|minute|minutes)', lambda m: int(m.group(1))),
        (r'(\d+)\s*(?:hr|hour|hours)', lambda m: int(m.group(1)) * 60),
        (r'(\d+)\s*(?:sec|second|seconds)', lambda m: max(1, int(m.group(1)) // 60)),
    ]
    
    for pattern, converter in time_patterns:
        match = re.search(pattern, step_lower)
        if match:
            duration = converter(match)
            break
    
    # Adjust based on station complexity
    if station == "oven" and duration < 10:
        duration = 15  # oven tasks usually take longer
    elif station == "stove" and duration < 5:
        duration = 8
    elif station == "prep" and duration < 3:
        duration = 5
    
    return AtomicTask(
        id=task_id,
        label=step_text,
        duration_minutes=duration,
        station=station,
        depends_on=[],
        notes=None
    )

