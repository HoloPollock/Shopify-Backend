# Shopify-Backend
This is the code I wrote for the shopify backend devoloper codeing challange
## Database
The database currently is just a json file named `db.json` 
this is json stucted where the `title` of the item is the key of the dictionary item that contains two items `price` and `inventory_count`
## How it works
There are 3 endpoints in this code
they all require an API Key currently this is just "thisissecure" however this is just for tests if the incorrect API Key is sent a 403 resonse will be sent
all endpoints begin with `/api/:apikey` 
### getall
the getall endpoint is `/getall`
getall sends a response of all products in the database the param instock can be added with a value of 1 to get only the products in stock
### get
the get endpoint is `/get/:item`
get sends a response of the item you asked for and if the item does not exists a 400 response will be sent instead
### purchase
the purchase endpoint is `/purchase/:item`
purchase checks to see if the item is in stock and if it is decreases the stock by one



