from bson import ObjectId
from app.models import (
    Board,
    Lane,
    Card,
    User,
    BoardAccessMatrix
)


class BoardHandler(object):

    @staticmethod
    def post(data):
        board = Board()
        board.title = data.get('title')
        board.description = data.get('description')
        board.save()
        access = BoardAccessMatrix()
        access.board = board
        access.user = User.objects.get(email=data.get('email'))
        access.level = 'admin'
        access.save()
        return board

    @staticmethod
    def get(board_id):

        if board_id:
            pipeline = [
                {'$match': {'_id': ObjectId(board_id)}},
                {'$lookup': {
                    'from': 'lane',
                    'localField': 'lanes',
                    'foreignField': '_id',
                    'as': 'lanes'
                }}
            ]
            for board in Board.objects.aggregate(*pipeline):
                return board
        else:
            pipeline = [
                {'$lookup': {
                    'from': 'lane',
                    'localField': 'lanes',
                    'foreignField': '_id',
                    'as': 'lanes'
                }}
            ]
            return [board for board in Board.objects.aggregate(*pipeline)]


class LaneHandler(object):

    @staticmethod
    def post(data):
        board = Board.objects.filter(id=ObjectId(data.get('board_id'))).first()
        lane = Lane()
        lane.title = data.get('title')
        lane.description = data.get('description')
        lane.board = board
        lane.save()
        board.update(add_to_set__lanes=lane)
        return lane

    @staticmethod
    def get(board_id):
        return Lane.objects.filter(board=ObjectId(board_id)).all()


class CardHandler(object):

    @staticmethod
    def post(data):
        lane = Lane.objects.filter(id=ObjectId(data.get('lane_id'))).first()
        card = Card()
        card.title = data.get('title')
        card.description = data.get('description', None)
        card.lane = lane
        card.save()
        lane.update(add_to_set__cards=card)
        return card

    @staticmethod
    def get(lane_id):
        return Card.objects.filter(lane=ObjectId(lane_id)).all()
