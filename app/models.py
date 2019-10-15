from mongoengine import Document, fields


class Board(Document):

    title = fields.StringField()
    description = fields.StringField()
    lanes = fields.ListField(fields.LazyReferenceField('Lane'))


class Lane(Document):
    board = fields.LazyReferenceField('Board')
    title = fields.StringField()
    description = fields.StringField()
    cards = fields.ListField(fields.LazyReferenceField('Card'))


class Card(Document):
    lane = fields.LazyReferenceField('Lane')
    title = fields.StringField()
    description = fields.StringField()
