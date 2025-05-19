from odmantic import  EmbeddedModel
class Vendor(EmbeddedModel):
    name: str
    email: str
    address: str