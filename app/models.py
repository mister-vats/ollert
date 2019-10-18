from mongoengine import Document, fields


class Board(Document):
    title = fields.StringField()
    description = fields.StringField()
    lanes = fields.ListField(fields.LazyReferenceField('Lane'))
    access_level = fields.IntField()


class Lane(Document):
    board = fields.LazyReferenceField('Board')
    title = fields.StringField()
    description = fields.StringField()
    cards = fields.ListField(fields.LazyReferenceField('Card'))


class Card(Document):
    lane = fields.LazyReferenceField('Lane')
    title = fields.StringField()
    description = fields.StringField()
    ctype = fields.IntField()


class User(Document):
    email = fields.EmailField(unique=True)
    password = fields.StringField()
    name = fields.StringField()
    profile = fields.URLField()
    acquisition_date = fields.DateTimeField()
    last_login = fields.DateTimeField()
    boards = fields.ListField(fields.LazyReferenceField('Board'))


class BoardAccessMatrix(Document):
    board = fields.LazyReferenceField('Board')
    user = fields.LazyReferenceField('User')
    level = fields.StringField()
