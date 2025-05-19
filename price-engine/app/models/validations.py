# Validator for HH:MM time format

import re
def validate_time(value: str) -> str:
    if not re.match(r"^\d{1,2}:\d{2}$", value):
        raise ValueError(f"{value} is not a valid time format (HH:MM)!")
    return value


