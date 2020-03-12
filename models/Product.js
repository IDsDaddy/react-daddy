const mongoose = require('mongoose');
const {Schema} = mongoose;
const shortid = require('shortid');
const productSchema = new Schema(
    {   
        _id: {
            'type': String,
            'default': shortid.generate
          },
        titleImage: String,
        title: String,
        date: String,
        dateIcon: String,
        extract: String,
        content: [{words: String, imagelink: String, mainTitle:String,}],
    },
)

mongoose.model('products', productSchema);
// mongoose.model('innerPeace', productSchema);