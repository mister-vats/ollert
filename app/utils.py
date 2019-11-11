from flask import session, redirect, url_for
from functools import wraps


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kawrgs):
        if 'google_token' in session:
            return func(*args, **kawrgs)
        else:
            return redirect(url_for('login'))
    return wrapper
