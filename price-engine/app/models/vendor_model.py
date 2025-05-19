from odmantic import  EmbeddedModel
class Vendor(EmbeddedModel):
    id:str
    name: str
    email: str
    address: str