const {Schema, model, SchemaTypes} = require('mongoose');
const {ValidInfoContact} = require('../configuration/const');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        age: {
            type: Number,
            min: ValidInfoContact.MIN_AGE,
            max: ValidInfoContact.MAX_AGE,
        },
        email: {
            type: String,
            required: [true, 'Email for contact is required'],
        },
        favorite: {
            type: Boolean,
            default: false,
            required: true,
        },
        owner: {
            type: SchemaTypes.ObjectId,
            ref: 'user',
        },
    },
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                return ret;
            },
        },
        toObject: { virtuals: true },
    },
);

contactSchema.path('name').validate(function (value) {
    const re = /[A-Z]\w+/;
    return re.test(String(value));
});

contactSchema.virtual('status').get(function () {
    if (this.age >= 60) {
        return 'old';
    }
    return 'young';
});

contactSchema.plugin(mongoosePaginate);

const contact = model('contact', contactSchema);

module.exports = contact;