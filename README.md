
# AccRevo company API
##### Implemented following specifications posted here [link to post]


### Starting the API server

The server is implemented using *nodejs* and *mysql*. 
After installing nodejs and mysql, run mysql's CLI, create a database, use the newly created database, and run these commands.
```
mysql> source /path/to/createtable.sql
```
note running `source /path/to/createcompany.sql` is no longer needed.
This will create two tables with some placeholder data rows.

edit the `db/dbconfig-example.js` so it may look like this:
```js
//dbconfig-example.js
module.exports = {
        host    :   'localhost',
        database:   'database-name',
        user    :   'root', 
        password:   'secret'
};
```
and then rename the file to `db/dbconfig.js`

install dependencies by running
```
$ npm install
```

start the server by running
```
$ npm start
```
the server will start listening on port **3307**.

***

### The APIs

#### GET `/company/{companyname}`

returns the data of the company of the name specified.

If there are no companies with that name, returns a 'not found' text with status **404**.
##### example

request link : `/company/BCCFC`

response:
```
[
	{
		"id": 7,
		"name": "BCCFC",
		"address": "25 สาทร กทม",
		"id13": "9876543210987",
		"taxbr": "สนญ",
		"type": 1,
		"comment": null,
		"contactperson": "1",
		"contacttel": "1",
		"year": 2559,
		"owner": "nus_nun_11@hotmail.com",
		"partner": "",
		"code": "bccfc2559",
		"created_at": null,
		"updated_at": null
	}
]
```
note that the JSON response is wrapped in a list, in a case that there are two companies with same names, the API would return the complete list of companies with the name.

***

#### POST `/company`
Create a new company, using the data in the request's body, and insert it into the database.

Accepts `x-www-form-urlencoded` and `JSON`.

This will also generate and `id` field, and the `key` field in `companykey` for the newly created company.

required fields:

 - name
 - address
 - id13
 - taxbr
 - owner
 - partner (leave blank if no partners)
 - code
 - type
 - year

missing a field would result in status **400**.

This transaction **requires authentication**. Which is in form of *Basic Authentication*. Not passing the authentication would result in status **401**.

current authentication module checks for `admin:admin`.

##### example

request link : `/company`
request header : 
```http
...
Authorization: Basic YWRtaW46YWRtaW4=
accept: application/x-www-form-urlencoded
... 
```
request body (in `x-www-form-urlencoded`):
```http
name=peawyoyoyinpost&address=addrpost&id13=0123456789012&taxbr=postt&owner=peaw3&partner=&code=postedcode&type=1&year=2018
```

***

#### GET `/company/getNewAPIkey`

returns a new API key for the company with the name `name` specified in the URL's query parameter. This updates the `key` field in `companykey` of the company to a new value, and then return that value.

If there are no companies with the name in the query parameter, the server would response with a 'not found' message with status **404**.

If there are more than one company with the name in the query parameter, the server would update only the **first** occurrence, ordered by `id`.

##### example

request link: `/company/getNewAPIkey?name=BCCFC`

response body:

```html
bcb30d10-1092-11e7-a23b-0d343409add0
```

***

### Implementation Details

#### Technologies Used

 - MySQL as database. (Sorry I didn't use postgreSQL as preferred, the `createtable.sql` provided wasn't compatible with postgreSQL, and I didn't went through the process of converting it.)
 - nodeJS with following package:
	 - `express` and `body-parser` for receiving and processing requests.
	 - `basic-auth` for parsing basic authentication. [link]
	 - `mysql` [link]
	 - `uuid` [link] (`uuid/v1` to be precise).

#### The API keys 

 - To avoid two companies having the same API keys at the same time. The API keys are generated using `uuid/v1` which is unique depending on time (and space).
 - API keys are generated on creating a new company, and on requesting `/company/getNewAPIkey`.
 - The API Documentation provided specified that the API keys need to be **50** characters long. Right now the UUIDs generated is 36 characters long, perhaps I will change to some other methods that returns a 50-character-long keys later.
