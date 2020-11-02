const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const deliveryAddressSchema = Schema({
    nama: { 
        type : String,
        required: [true, 'Nama alamat yang harus diisi'],
        maxLength: [255, 'Panjang alamat maksimal adalah 255 karakter']
    },
    kelurahan : {
        type : String,
        required : [true, 'Kelurahan harus diisi'],
        maxLength : [255, 'Panjang maksimal kelurahan adalah 255 karakter']
    },
    kecamatan : {
        type : String,
        required: [true, 'Kecamatan harus diisi'],
        maxLength: [ 255, 'Panjang maksimal kelurahan adalah 255 karakter' ]
    },
    kabupaten : {
        type : String,
        required : [true, 'Kabupaten harus di isi'],
        maxLength: [255, 'Panjang maksimal kelurahan adalah 255']
    },
    provinsi : {
        type : String,
        required : [true, 'Provinsi harus di isi'],
        maxLength : [255, 'Panjang maksimal provinsi adalah 255 karakter']
    },
    detail : {
        type : String,
        required : [true, 'Detail alamat harus diisi'],
        maxLength : [1000, 'Panjang maksimal detail alamat adalah 10000']
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, { 
    timestamps : true
})



const DeliveryAddress = model("DeliveryAddress", deliveryAddressSchema);

module.exports = DeliveryAddress;