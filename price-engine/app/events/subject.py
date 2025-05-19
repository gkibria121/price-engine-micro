# Example enum to mimic `Subject` from TS
class Subject:
    PRODUCT_CREATED = "product:created"
    PRODUCT_UPDATED = "product:updated"
    PRODUCT_DELETED = "product:deleted"
    VENDOR_CREATED = "vendor:created"
    VENDOR_UPDATED = "vendor:updated"
    VENDOR_DELETED = "vendor:deleted"
    VENDOR_PRODUCT_CREATED = "vendorProduct:created"
    VENDOR_PRODUCT_UPDATED = "vendorProduct:updated"
    VENDOR_PRODUCT_DELETED = "vendorProduct:deleted"
 
    @classmethod
    def values(cls):
        return [cls.PRODUCT_CREATED,
                cls.PRODUCT_UPDATED,
                cls.PRODUCT_DELETED,
                cls.VENDOR_CREATED,
                cls.VENDOR_DELETED,
                cls.VENDOR_UPDATED,
                cls.VENDOR_PRODUCT_CREATED,
                cls.VENDOR_PRODUCT_UPDATED,
                cls.VENDOR_PRODUCT_DELETED,]
