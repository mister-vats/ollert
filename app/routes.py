from app import app, google
from app.models import User
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
from app.utils import (
    login_required
)
from datetime import datetime
from flask import (
    redirect,
    render_template,
    request,
    session,
    url_for,
)


@app.route('/')
@login_required
def home():
    return render_template('/main.html', home="Main")


@app.route('/api/board/create', methods=['POST'])
@login_required
def create_board():
    board = BoardHandler.post(request.json)
    resp = BoardSchema().dumps(board)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/api/board', methods=['GET'])
@login_required
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
@login_required
def create_lane():
    lane = LaneHandler.post(request.json)
    resp = LaneSchema().dumps(lane)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/api/lane', methods=['GET'])
@login_required
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
@login_required
def create_card():
    card = CardHandler.post(request.json)
    resp = CardSchema().dumps(card)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/api/card', methods=['GET'])
@login_required
def get_cards():
    lane_id = request.args.get('laneId')
    cards = CardHandler.get(lane_id)
    resp = CardSchema(many=True).dumps(cards)
    return app.response_class(
        response=resp,
        status=200,
        mimetype='application/json'
    )


@app.route('/login')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))


@app.route('/login/authorized')
def authorized():
    resp = google.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['google_token'] = (resp['access_token'], '')
    user = google.get('userinfo').data
    user = User.objects(email=user['email']).modify(
        set__name=user['name'],
        set__profile=user['picture'],
        set__last_login=datetime.utcnow(),
        new=True, upsert=True
    )
    session['user'] = user
    return redirect(url_for('home'))


@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')


@app.route('/logout')
def logout():
    session.pop('google_token', None)
    return redirect(url_for('home'))
