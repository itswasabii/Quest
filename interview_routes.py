from flask import Blueprint, request, jsonify
from config import db
from interview_services import InterviewService  # Importing InterviewService directly

interview_bp = Blueprint('interview_bp', __name__)

@interview_bp.route('/interviews', methods=['GET'])
def get_interviews():
    interviews = InterviewService.get_interviews()
    return jsonify(interviews)

@interview_bp.route('/interviews/<interview_id>', methods=['GET'])
def get_interview(interview_id):
    interview = InterviewService.get_interview(interview_id)
    if interview:
        return jsonify(interview)
    else:
        return jsonify({'error': 'Interview not found'}), 404

@interview_bp.route('/interviews', methods=['POST'])
def create_interview():
    data = request.json
    interview = InterviewService.create_interview(data)
    return jsonify(interview), 201

@interview_bp.route('/interviews/<interview_id>', methods=['PUT'])
def update_interview(interview_id):
    data = request.json
    interview = InterviewService.update_interview(interview_id, data)
    if interview:
        return jsonify(interview)
    else:
        return jsonify({'error': 'Interview not found'}), 404

@interview_bp.route('/interviews/<interview_id>', methods=['DELETE'])
def delete_interview(interview_id):
    success = InterviewService.delete_interview(interview_id)
    if success:
        return '', 204
    else:
        return jsonify({'error': 'Interview not found'}), 404
