# -*- coding: utf-8 -*-

import os

from app.config.settings import BaseConfig
from flask import Flask
from flask_oauthlib.client import OAuth
from flask_mongoengine import MongoEngine, MongoEngineSessionInterface

db = MongoEngine()
oauth = OAuth()


def create_app(configuration='Development'):

    app = Flask(__name__)
    app.session_interface = MongoEngineSessionInterface(db)
    app.config.from_object(BaseConfig)

    db.init_app(app)
    oauth.init_app(app)

    google = oauth.remote_app(
        'google',
        consumer_key=app.config.get('GOOGLE_ID'),
        consumer_secret=app.config.get('GOOGLE_SECRET'),
        request_token_params={
            'scope': 'email profile'
        },
        base_url='https://www.googleapis.com/oauth2/v1/',
        request_token_url=None,
        access_token_method='POST',
        access_token_url='https://accounts.google.com/o/oauth2/token',
        authorize_url='https://accounts.google.com/o/oauth2/auth',
    )

    return app, google


app, google = create_app(os.getenv('APP_CONFIGURATION', 'Development'))


# from app import routes
from app import routes