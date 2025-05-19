def format_pydantic_errors(pydantic_errors):
    formatted = {"message": "The given data was invalid.", "errors": {}}

    for error in pydantic_errors:
        field = ".".join(str(loc) for loc in error.get("loc", []))
        message = error.get("msg", "Invalid input")

        if field not in formatted["errors"]:
            formatted["errors"][field] = []

        formatted["errors"][field].append(message)
 
    return formatted
