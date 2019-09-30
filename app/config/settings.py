# -*- coding: utf-8 -*-

import os
import os.path

from .utils import get_dtb_config, getenv
from dotenv import load_dotenv

base_dir = os.path.dirname(os.path.dirname(__file__))
load_dotenv(os.path.join(base_dir, '.env'))

class BaseConfig(object):
    
    DEBUG = False

    TESTING = False

    SECRET_KEY = getenv('SECRET_KEY')

    # Databases uri string (e.g. mongodb://localhost/wsys)
    MONGODB_SETTINGS = get_dtb_config(getenv('DATABASE_URL', 'mongodb://localhost/project_tracker'))

    """change your CAS sever here make sure you do not add trailing slash here but in the final url."""
    CAS_SERVER = os.getenv('CAS_SERVER')
    CAS_LOGIN_ROUTE = os.getenv('CAS_LOGIN_ROUTE')
    CAS_VALIDATE_ROUTE = os.getenv('CAS_VALIDATE_ROUTE')
    CAS_AFTER_LOGIN = os.getenv('CAS_AFTER_LOGIN')

    UPLOAD_FOLDER = os.path.join(base_dir, 'media')
