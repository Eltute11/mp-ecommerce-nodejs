var express = require('express');
var exphbs  = require('express-handlebars');
// const morgan = require('morgan'); 

// SDK de Mercado Pago
const mercadopago = require ('mercadopago');


var app = express();

app.use(express.json());

// app.use(morgan('dev'));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// use Handlebars as templating engine instead of Express default one
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/success', function (req, res) {
    res.render('success', req.query);
});

app.get('/failure', function (req, res) {
    res.render('failure', req.query);
});

app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});

app.get('/pay', function(req, res) {

    // console.log(req.query);
    // res.send('POST REQUEST RECEIVED');
    const productData = req.query;

    // Agrega credenciales
    mercadopago.configure({
        access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
        integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
    });
    
    
    // Crea un objeto de preferencia
    let preference = {
        notification_url: "https://hookb.in/6Ja2qkXk1kILbb031aLb",
        external_reference: 'arausmatias@gmail.com',
        items: [
            {
                id: 1234,
                title: productData.title,
                description: 'Dispositivo móvil de Tienda e-commerce',
                picture_url: productData.img,
                quantity: parseInt(productData.unit),
                unit_price: parseFloat(productData.price)
            }
        ],
        back_urls: {
            success: "localhost:5000/success",
            failure: "localhost:5000/failure",
            pending: "localhost:5000/pending"
        },
        auto_return: "approved",
        payment_methods: {
            excluded_payment_methods: [
                {
                    "id": "amex"
                }
            ],
            excluded_payment_types: [
                {
                    "id": "atm"
                }
            ],
            "installments": 6
        },
        };

    mercadopago.preferences.create(preference)
        .then(function(response){
            // Sandbox
            // const url_sandbox = response.body.sandbox_init_point;

            // Produccion
            const url = response.body.init_point;

            console.log(url);
            res.redirect(url);
        }).catch(function(error){
            console.log(error);
        });
});


app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
