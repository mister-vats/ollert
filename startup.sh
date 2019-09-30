#!/usr/bin/env bash

export FLASK_APP=main.py

# gunicorn -b "0.0.0.0:8000" -w 1 --worker-class eventlet main:app
#if [ $ENV = 'Development' ] ; \
#    then pip3 install --trusted-host pypi.python.org -r requirements/dev.txt ; \
#    else pip3 install --trusted-host pypi.python.org -r requirements/prod.txt ; \
#    fi ;

python main.py