FROM python:3.7

#set the working directory in container

WORKDIR /app

#Copy existing code to image

COPY . /app

#Expoing container port to connect to the host machine

EXPOSE 8000

# Installing dependencies
RUN pip3 install --trusted-host pypi.python.org -r requirements.txt;


#CMD [ "python", "manage.py", "runserver", "--host",  "0.0.0.0" ]

CMD ./startup.sh