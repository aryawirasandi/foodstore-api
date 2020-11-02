const mongoose = require('mongoose');

const {Schema } = mongoose;

const productSchema = mongoose.Schema({
    name : {
        type : String,
        minLength : [3, "panjang nama makananan minimal 3 karakter"],
        maxLength : [255, "panjang nama makanan maksimal 255 karakter"],
        required : [true, "nama produk harus disi"]
    },
    description : {
        type : String,
        maxLength : [1000, 'Panjang deskripsi maksimal 1000 karakter']
    },
    price : {
        type : Number,
        default : 0
    },
    image_url : String,
    category : {
        type : Schema.Types.ObjectId,
        ref : 'Category'
    },
    tags : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Tag'
        }
    ]
}, { timestamps : true });


const Product = mongoose.model("Product", productSchema);

module.exports = Product;