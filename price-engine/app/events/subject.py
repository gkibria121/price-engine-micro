# Example enum to mimic `Subject` from TS
class Subject:
    PRODUCT_CREATED = "product:created"
    PRODUCT_UPDATED = "product:updated"
    PRODUCT_DELETED = "product:deleted"

    @classmethod
    def values(cls):
        return [cls.PRODUCT_CREATED, cls.PRODUCT_UPDATED]
