const environment = process.env.ENVIRONMENT || 'DEVELOPMENT';

const conf = {
    DEVELOPMENT: process.env.DB_DEVELOPMENT,
    test: process.env.DB_TESTING,
    PRODUCTION: process.env.DB_PRODUCTION,
    STAGING: process.env.DB_STAGING
};

module.exports = {
    MONGODB_URI: conf[environment]
};
