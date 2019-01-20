var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

const apikey = "thisissecure"
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/api/:apikey/getall', function (req,res) 
{
    var key = req.params.apikey;
    if (key != apikey)
    {
        res.status(403);
        res.send("<h1>403 Forbidden </h1>request denied: BAD API KEY");
    }
    else
    {
        var db = readdb()
        if (req.query.instock == 1)
        {
            var new_json = {};
            for(var item in db['inventory']) {
                if (db.inventory[item].inventory_count > 0) 
                {
                    new_json[item] = db.inventory[item];
                }
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(new_json));
        }
        else 
        {
            var db = readdb();
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(db.inventory));
        }
    }
});

app.get('/api/:apikey/get/:item', function (req,res) 
{
    var key = req.params.apikey;
    if (key != apikey) 
    {
        res.status(403);
        res.send("<h1>403 Forbidden </h1>request denied: BAD API KEY");
    }
    else 
    {
        var db = readdb();
        var item = req.params.item;
        if(db.inventory.hasOwnProperty(item))
        {
            str_to_send = JSON.stringify(db.inventory[item]);
            res.send(str_to_send);
        }
        else
        {
            res.status(400);
            res.send("<h1>400 Bad Request</h1>Error: Item does not exist")

        }
    }
    
});

app.post('/api/:apikey/addtocart/:item', function (req,res) {
    item = req.params.item;
    db = readdb();
    if(db.inventory.hasOwnProperty(item))
    {
        if (db.inventory[item].inventory_count > 0)
        {
            if(db.cart.hasOwnProperty(item))
            {
                db.cart[item].quantity = db.cart[item].quantity + 1;
                updatedb(db);
                res.send("item added");
            }
            else
            {
                console.log("hello");
                cart = {};
                cart['quantity'] = 1;
                db.cart[item] = cart;
                updatedb(db);
                res.send("item added");
            }
        }
        else
        {
            res.send("Item not in Stock");
        }

    }
    else
    {
        res.status(400)
        res.send("<h1>400 Bad Request</h1>Error: Item does not exist")
    }


    
})

app.post('/api/:apikey/purchase', function (req,res) 
{
    var key = req.params.apikey;
    var canbuy = true;
    var not_enough = [];
    if (key != apikey)
    {
        res.status(403);
        res.send("<h1>403 Forbidden </h1> request denied: BAD API KEY");
    }
    else
    {
        var db = readdb();
        //console.log(db.inventory);
        //console.log(db.cart);
        if(!isEmpty(db.cart))
        {
            for (var item in db.cart)
            {
                if (db.inventory[item].inventory_count-db.cart[item].quantity < 1)
                {
                    canbuy = false;
                    not_enough.push(item);
                }
                
            }
            if (canbuy == true)
            {
                for (item in db.cart)
                {
                    db.inventory[item].inventory_count -= db.cart[item].quantity;
                }
            }
            else
            {
                for (var i in not_enough)
                {
                    delete db.cart[not_enough[i]];
                    updatedb(db);
                    res.send("some items where not able to be purchased as there was not enoguh inventory thye have been removed from your cart")//fix
                }
            }
        }
        else
        {
            res.status(400);
           res.send("<h1>400 Bad Request</h1>Error: Item does not exist");
        }
    }
})

app.listen(3000);

function readdb() 
{
    var obj = JSON.parse(fs.readFileSync('db.json','utf8'));
    return obj;
}

function updatedb(json)
{
    str_to_write = JSON.stringify(json);
    fs.writeFile('db.json',str_to_write,function(err){
        if (err){
            console.log("error Writing to file");
            throw err;
        }
        console.log("db updated");
    })
    
}

function isEmpty(obj) {
    return !Object.keys(obj).length;
  }