import json
from app import app
from app.handler import (
    BoardHandler,
    LaneHandler,
    CardHandler
)
from app.schema import (
    LaneSchema,
    BoardSchema,
    CardSchema,
    BoardAndLaneSchema
)

from flask import render_template, request


@app.route('/')
def home():
    return render_template('/home.html', home="Main")


@app.route('/main')
def main():
    return render_template('/main.html', home="Main2")


@app.route('/api/board/create', methods=['POST'])
def create_board():
    board = BoardHandler.post(request.json)
    resp = BoardSchema().dumps(board)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/api/board', methods=['GET'])
def get_boards():
    board_id = request.args.get('boardId', None)
    boards = BoardHandler.get(board_id)
    if board_id:
        resp = BoardAndLaneSchema().dumps(boards)
    else:
        resp = BoardAndLaneSchema(many=True).dumps(boards)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/api/lane/create', methods=['POST'])
def create_lane():
    lane = LaneHandler.post(request.json)
    resp = LaneSchema().dumps(lane)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/api/lane', methods=['GET'])
def get_lanes():
    board_id = request.args.get('boardId')
    lanes = LaneHandler.get(board_id)
    resp = LaneSchema(many=True).dumps(lanes)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/api/card/create', methods=['POST'])
def create_card():
    card = CardHandler.post(request.json)
    resp = CardSchema().dumps(card)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/api/card', methods=['GET'])
def get_cards():
    lane_id = request.args.get('laneId')
    cards = LaneHandler.get(lane_id)
    resp = LaneSchema(many=True).dumps(cards)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )
