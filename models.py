from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy


from config import db

# Models go here!
class Interview(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255))
    answer = db.Column(db.Text)