const { AbilityBuilder, Ability } = require("@casl/ability")

const policies = {
     guest(user, {can}){
        can('read', 'Product')
     },
     user(user, {can}){
        // membaca daftar Order
        can('view', 'Order');

        // membuat order
        can('create', 'Order');

        // membuat Order
        can('read', 'Order', {
            user_id : user._id
        });

        // mengupdate data dirinya
        can('update', 'User', {
            _id : user._id
        });
        //membaca cart miliknya
        can('read', 'Cart', {
            user_id : user._id
        });
        //mengupdate cart miliknya
        can('update', 'Cart', {
            user_id : user._id
        });

        // melihat alamat miliknya
        can("view", "DeliveryAddress");

        //membuat alamat miliknya 
        can("create", "DeliveryAddress", {
            user_id : user._id
        });
        // mengupdate alamat miliknya
        can('update', "DeliveryAddress", {
            user_id : user._id
        });
        // menghapus alamat miliknya
        can('delete', "DeliveryAddress", {
            user_id :  user._id
        });

        // membaca invoice
        can('read', 'Invoice', {
            user_id : user._id
        })
     },
     admin(user, {can}){
        can('manage', 'all')
     }
}


function policyFor(user){
    let builder = new AbilityBuilder();

    if(user && typeof policies[user.role] === 'function'){
        policies[user.role](user, builder);
    }else{
        policies['guest'](user, builder);
    }

    return new Ability(builder.rules);
}

module.exports = {
    policyFor
}