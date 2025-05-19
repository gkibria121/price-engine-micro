# Example enum to mimic `Subject` from TS
class Subject:
    PRODUCT_CREATED = "product:created"
    PRODUCT_UPDATED = "product:updated"
    PRODUCT_DELETED = "product:deleted"

    @classmethod
    def values(cls):
        return [value for key, value in cls.__dict__.items() if not key.startswith("__") and not callable(value)]
