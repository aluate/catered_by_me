from ..models.recipes import Recipe


def scale_recipe(recipe: Recipe, target_headcount: int) -> Recipe:
    """
    Scale a recipe's ingredients to a target headcount.
    
    Returns a new Recipe object with scaled ingredients.
    Tasks are not modified (duration scaling can be added later).
    """
    if recipe.headcount == 0:
        scale_factor = 1.0
    else:
        scale_factor = target_headcount / recipe.headcount
    
    # Create scaled ingredients
    scaled_ingredients = []
    for ing in recipe.ingredients:
        new_quantity = ing.quantity * scale_factor if ing.quantity is not None else None
        new_normalized_grams = ing.normalized_grams * scale_factor if ing.normalized_grams is not None else None
        
        scaled_ingredients.append(
            ing.model_copy(update={
                "quantity": new_quantity,
                "normalized_grams": new_normalized_grams
            })
        )
    
    # Return new recipe with scaled ingredients
    return recipe.model_copy(update={
        "headcount": target_headcount,
        "ingredients": scaled_ingredients
    })

