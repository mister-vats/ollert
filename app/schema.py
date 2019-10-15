from marshmallow import Schema, fields


class DocumentIdSchema(Schema):

    id = fields.String()


class BoardSchema(Schema):

    id = fields.String()
    title = fields.String()
    description = fields.String()
    lanes = fields.Nested(DocumentIdSchema, many=True)


class LaneSchema(Schema):
    id = fields.String()
    _id = fields.String()
    title = fields.String()
    description = fields.String()
    board = fields.Nested(DocumentIdSchema)
    cards = fields.Nested(DocumentIdSchema, many=True)


class CardSchema(Schema):

    id = fields.String()
    title = fields.String()
    description = fields.String()
    lane = fields.Nested(DocumentIdSchema)


class BoardAndLaneSchema(Schema):
    id = fields.String(attribute='_id')
    title = fields.String()
    description = fields.String()
    lanes = fields.Nested(LaneSchema, many=True, only=['_id', 'title', 'description'])
