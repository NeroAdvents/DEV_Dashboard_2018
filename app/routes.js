var User = require('./model/user.js');
var weather_json = "paragraphe";
module.exports = function (app, passport, request, nodeWidget, fs) {

    app.get('/', function (req, res) {
        res.render('index.ejs')
    });

    app.get('/login', function (req, res) {
       res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function (req, res) {
        response = {
            name: req.query.city_name
        };
        var url = `http://api.openweathermap.org/data/2.5/weather?q=${response.name}&units=imperial&appid=c562d7aa3a496d62c0a6a8e8d5b05410`;
        request(url, function (error, response, query) {
            weather_json = JSON.parse(query);
        });
        res.render('profile.ejs', {user:req.user, weather_json});
    });

    app.get('/:username/:password', function (req, res) {
        var newUser = new User();
        newUser.local.username = req.params.username;
        newUser.local.password = req.params.password;
        console.log(newUser.local.username + " " + newUser.local.password);
        newUser.save(function (err) {
            if (err)
                throw err;
        });
        res.send("Success!");
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    let aboutJson = {
        "client": {
            "host": null,
        },
        "server": {
            "current_time":  Math.floor(new Date() / 1000),
            "services": [{
                "name": "weather",
                "widgets": [{
                    "name": "city_weather",
                    "description": "Affichage  de la  météo  pour  une  ville",
                    "params": [{
                        "name": "city",
                        "type": "string"
                    }, {
                        "name": "unit_system",
                        "type": "string"
                    }]
                }]
            }]
        }
    };

    app.get('/about.json', function(req, res, next) {
        aboutJson["client"].host = req.connection.remoteAddress;
        aboutJson["server"].current_time = Math.floor(new Date() / 1000);
        res.json(aboutJson);
    });


};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

