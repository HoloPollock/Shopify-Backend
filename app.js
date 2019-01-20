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
            for(var item in db) {
                if (db[item].inventory_count > 0) 
                {
                    new_json[item] = db[item];
                }
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(new_json));
        }
        else 
        {
            var db = readdb();
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(db));
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
        if(db.hasOwnProperty(item))
        {
            str_to_send = JSON.stringify(db[item]);
            res.send(str_to_send);
        }
        else
        {
            res.status(400);
            res.send("<h1>400 Bad Request</h1>Error: item does not exist")

        }
    }
    
});

app.post('/api/:apikey/purchase/:item', function (req,res) 
{
    var key = req.params.apikey;
    if (key != apikey)
    {
        res.status(403);
        res.send("<h1>403 Forbidden </h1> request denied: BAD API KEY");
    }
    else
    {
        var item = req.params.item;
        var db = readdb();
        if(db.hasOwnProperty(item))
        {
            if (db[item].inventory_count > 0){
                db[item].inventory_count = db[item].inventory_count - 1;
                updatedb(db)
                res.send("Item Purchased")
            }
            else 
            {
                res.send("Item not in stock")
            }
        }
        else
        {
           res.send("nope");
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