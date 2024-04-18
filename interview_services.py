from models import db, Interview


class InterviewService:
    @staticmethod
    def get_interviews():
        interviews = Interview.query.all()
        return [{'id': interview.id, 'question': interview.question, 'answer': interview.answer} for interview in interviews]

    @staticmethod
    def get_interview(interview_id):
        interview = Interview.query.get(interview_id)
        if interview:
            return {'id': interview.id, 'question': interview.question, 'answer': interview.answer}
        else:
            return None

    @staticmethod
    def create_interview(data):
        interview = Interview(**data)
        db.session.add(interview)
        db.session.commit()
        return {'id': interview.id, 'question': interview.question, 'answer': interview.answer}

    @staticmethod
    def update_interview(interview_id, data):
        interview = Interview.query.get(interview_id)
        if interview:
            interview.question = data.get('question', interview.question)
            interview.answer = data.get('answer', interview.answer)
            db.session.commit()
            return {'id': interview.id, 'question': interview.question, 'answer': interview.answer}
        else:
            return None

    @staticmethod
    def delete_interview(interview_id):
        interview = Interview.query.get(interview_id)
        if interview:
            db.session.delete(interview)
            db.session.commit()
            return True
        else:
            return False
