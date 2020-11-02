const monggose = require("mongoose");
const { model, Schema } = monggose;
const bcrypt = require('bcrypt');
const HASH_ROUND = 10;
const AutoIncrement = require('mongoose-sequence')(monggose)
let userSchema = Schema({
    full_name : {
        type : String,
        required : [true, 'Nama harus di isi'],
        minLength : [3, "Panjang nama karakter harus antara 3 - 255 karakter"],
        maxLength : [255, "Panjang nama harus antara 3 - 255 karakter"]
    },
    customer_id : {
        type : Number
    },
    email : {
        type : String,
        required : [true, 'Email harus di isi'],
        maxLength : [255, 'Panjang email maksimal 255 karakter']
    },
    password : {
        type : String,
        required : [true, 'Passsword harus diisi'],
        maxLength : [255, 'Panjang Password maksimal 255 karakter']
    },
    role : {
        type : String,
        enum : [
            'user',
            'admin'
        ],
        default : 'user'
    },
    token : [String]
}, { timestamps : true })


userSchema.path('email').validate(function(value){
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    emailRegex.test(value);
}, attr => `${attr.value} harus memiliki nilai yang valid`);

userSchema.path('email').validate(async function(value){
    try {
        const count = await this.model('User').count({email : value});
        return !count;
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} sudah terdaftar`);

userSchema.plugin(AutoIncrement, { inc_field : `customer_id`});

userSchema.pre("save", function(next){
    this.password = bcrypt.hashSync(this.password,HASH_ROUND);
    next();
})
module.exports = model("User", userSchema);