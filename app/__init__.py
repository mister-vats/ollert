# -*- coding: utf-8 -*-

import os

from flask import Flask
from flask_mongoengine import MongoEngine, MongoEngineSessionInterface
from app.config.settings import BaseConfig

db = MongoEngine()

def create_app(configuration='Development'):

    app = Flask(__name__)
    app.session_interface = MongoEngineSessionInterface(db)
    app.config.from_object(BaseConfig)

    db.init_app(app)

    return app


app = create_app(os.getenv('APP_CONFIGURATION', 'Development'))

# from app import routes
from app import routes