from config import db

class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255))
    answer = db.Column(db.Text)

    def __repr__(self):
        return f"<Interview(id={self.id}, question={self.question}, answer={self.answer})>"
