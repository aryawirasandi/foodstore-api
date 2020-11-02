const mongoose = require("mongoose");
const { model, Schema } = mongoose;


const InvoiceSchema = Schema({
    sub_total : {
        type : Number,
        required : [true, 'sub_total harus di isi']
    },
    delivery_fee : {
        type : Number,
        required : [true, 'delivery_fee harus di isi']
    },
    delivery_address : {
        provinsi : {
            type : String,
            required : [ true, 'Provinsi harus di isi' ]
        },
        kabupaten : {
            type : String,
            required : [true, 'Kabupaten harus di isi']
        },
        kecamatan : {
            type : String,
            required : [true, 'Kecamatan harus diisi']
        },
        kelurahan : {
            type : String,
            required : [true, "Kelurahan harus diisi"]
        },
        detail : { type : String }
    },
    total : {
        type : Number,
        required : [true, "Total harus di isi"]
    },
    payment_status : {
        type : String,
        enum : ['waiting_payment', 'paid'],
        default : 'waiting_payment'
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    order : {
        type : Schema.Types.ObjectId,
        ref : "Order"
    }
}, {timestamps : true})

module.exports = model("Invoice", InvoiceSchema);