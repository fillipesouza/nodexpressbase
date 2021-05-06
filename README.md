# NodeExpressBase

NodeExpressBase is a NodeJS that wrapper most of the main backend development features based on express

## Installation

Use the npm [npm](https://npmjs.com/).

```bash
npm i https://github.com/fillipesouza/nodeexpressbase
```

## Usage

```nodejs

const {Server, Logger, DBUtils, Utils } = require('nodeexpressbase');
const server = new Server('Server Name', PORT)
const dbUtils = new DBUtils('dbURL', dbPORT, 'dbName');
const log = Logger.createLogger( config );
server.init(routes);

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[APACHE](https://choosealicense.com/licenses/apache/)
