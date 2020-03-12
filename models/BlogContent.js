const mongoose = require('mongoose');
const {Schema} = mongoose;

const contentSchema = new Schema(
    {
        texts: String,
        imageLink: String,
    }
)

mongoose.model('content', contentSchema);