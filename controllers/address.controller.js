const { success } = require('../helpers/response')
const axios = require('axios')
axios.defaults.baseURL = 'http://dev.farizdotid.com/api/daerahindonesia/'

// Get array of provinsi
exports.getProvinces = async (req, res, next) => {
  try {
    const provinces = await axios.get('/provinsi')
    success(res, 'show province data', provinces.data.semuaprovinsi, 200)
  } catch (err) {
    failed(res, 'Can\'t show province data', err, 422)
    }
}


// Get array of Kabupaten
exports.getDistricts = async (req, res, next) => {
  const { id_prov } = req.params
  try {
    const districts = await axios.get(`/provinsi/${id_prov}/kabupaten`)
    success(res, 'show kabupaten data', districts.data.kabupatens, 200)
  } catch (err) {
    failed(res, 'Can\'t show kabupaten data', err, 422)
    }
}

// Get array of kecamatan
exports.gerRegencies = async (req, res, next) => {
  const { id_dist } = req.params
  try {
    const districts = await axios.get(`/provinsi/kabupaten/${id_dist}/kecamatan`)
    success(res, 'show kecamatan data', districts.data.kecamatans, 200)
  } catch (err) {
    failed(res, 'Can\'t show kecamatan data', err, 422)
    }
}

// Get array of Village
exports.getVillages = async (req, res, next) => {
  const { id_reg } = req.params
  try {
    const districts = await axios.get(`/provinsi/kabupaten/kecamatan/${id_reg}/desa`)
    success(res, 'show village data', districts.data.desas, 200)
  } catch (err) {
    failed(res, 'Can\'t show village data', err, 422)
    }
}
