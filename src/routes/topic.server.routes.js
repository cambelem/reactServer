const contests = require('../controllers/contests.server.controller');

module.exports = function(app) {
    app.route('/api/contests')
        .post(contests.create)
        .get(contests.list);
    app.route('/api/contests/:year/:gender')
        .get(contests.byYearAndGender);
    app.route('/api/contests/enter/:year/:gender')
        .post(contests.addEntry);
    app.param('year', contests.yearParam);
    app.param('gender', contests.genderParam);
};
