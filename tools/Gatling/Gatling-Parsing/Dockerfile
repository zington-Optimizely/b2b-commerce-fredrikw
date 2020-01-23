FROM python:3.7
COPY ["Gatling-Parsing/requirements.txt", "/var/code/requirements.txt"]
WORKDIR /var/code
RUN pip install -r requirements.txt
WORKDIR /data

COPY ["Gatling-Parsing", "/data"]

CMD [ "python", "./gatlingParser.py" ]
