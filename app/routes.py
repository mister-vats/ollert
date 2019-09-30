from app import app
from flask import render_template, request


@app.route('/')
def home():
    return render_template('/home.html', home="Main")


@app.route('/main')
def main():
    return render_template('/main.html', home="Main2")