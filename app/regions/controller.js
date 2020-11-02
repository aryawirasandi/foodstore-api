const csv = require("csvtojson");
const path = require("path");


// get Province
async function getProvince(req, res, next){
    const db_province = path.resolve(__dirname, "./data/provinces.csv");
    try {
        const data = await csv().fromFile(db_province);
        return res.json(data);
    } catch (error) {
        res.json({
            error : 1,
            message : "Tidak bisa memiliki data provinsi, hubungi administrator"
        })
    }
}
// get kabupaten
async function getRegencies(req, res, next){
    const db_regencies = path.resolve(__dirname,"./data/regencies.csv");
    try {
        let {  kode_induk  } = req.query;
        const data = await csv().fromFile(db_regencies);
        if(!kode_induk){
            return res.json(data);
        }
        return res.json(data.filter(regency => regency.kode_provinsi === kode_induk));
    } catch (error) {
        return res.json({
            error: 1,
                  message: 'Tidak bisa mengambil data kabupaten, hubungi administrator'
        });
    }
}

//get kecamatan
async function getDistrict(req, res, next){
    const db_district = path.resolve(__dirname,"./data/districts.csv");
    try {
        let { kode_induk } = req.query;
        const data = await csv().fromFile(db_district);
        if(!kode_induk) return res.json(data);
        return res.json(data.filter(district => district.kode_kabupaten ===  kode_induk));
    } catch (error) {
        return res.json({
            error : 1,
            message : "Tidak bisa mengambil data kecamatan, hubungi administrator"
        });
    }
}

async function getVillage(req, res, next){
    const db_villages = path.resolve(__dirname,"./data/villages.csv");

    try {
        let { kode_induk } = req.query;
        const data = await csv().fromFile(db_villages);
        if(!kode_induk) return req.query;
        return res.json(data.filter(district => district.kode_kecamatan === kode_induk));
    } catch (error) {
        return res.json({
            error : 1,
            message : "Tidak bisa mengambil data desa, hubungi administrator"
        });
    }
}

module.exports = {
    getProvince,
    getRegencies,
    getDistrict, 
    getVillage
}