/**
 * Class that contains all DB attributes
 *
 * @class DB
 */
class DB {
    constructor(dbURL, dbPort, dbName) {
        this.dbName = dbName;
        this.dbPort = dbPort;
        this.dbURL = dbURL;
    }

    async connect() {
        if (global.connection) {
            return global.connection.connect();
        }
        const { Pool } = require('pg');
        const pool = new Pool({
            connectionString: `postgres://${this.dbURL}:${this.dbPort}/${this.dbName}`
        });

        //Testing
        const client = await pool.connect();
        console.log("Creating connection!");
        client.release();

        global.connection = pool;
        return pool.connect();

    }
}

/**
 * Singleton class that contains all DB utilies and generic query operations
 *
 * @class DBUtils
 */
class DBUtils {
    constructor(dbURL, dbPort, dbName) {
        if (!DBUtils.instance)
            DBUtils.instance = new DB(dbURL, dbPort, dbName);
    }

    static getInstance() {
        return DBUtils.instance;
    }

    /**
     * Insert object inside the table and may return a specific field
     *
     * @static
     * @param {string} tableName
     * @param {Object} obj
     * @param {string} [return_column='id']
     * @return {Object} 
     * @memberof DBUtils
     */
    static async insert(tableName, obj, return_column = 'id') {
            const client = await DBUtils.instance.connect();
            const sql = `insert into ${tableName} (${Object.keys(obj).join(',')}) values (${Object.keys(obj).map((e,i) => `$${i+1}`).join(', ')}) RETURNING ${return_column};`;
            
            const values = Object.values(obj);           
            const result = await client.query(sql, values);
            client.release();
            return result;
    }

   
    /**
     * Update in DB given a object for update and a key (string or Object)
     *
     * @static
     * @param {string} tableName
     * @param {Object} obj
     * @param {string or Object} keyObject
     * @return {Object} 
     * @memberof DBUtils
     */
    static async update(tableName, obj, keyObject) {
            let value, key;
            if( typeof keyObject === 'string'){
                key = keyObject;
                value = obj[key];
                delete obj[keyObject];
            } else {
                value = Object.values(keyObject)[0];
                key = Object.keys(keyObject)[0];
            }           
            
            const client = await DBUtils.instance.connect();
            const sql = `update ${tableName} set ${Object.keys(obj).map((e,i) => 
                `${e}=$${i+1}`).join(',')} where ${key}=$${Object.keys(obj).length+1};`;
            const values = [...Object.values(obj), value ] ;
            const result = await client.query(sql, values);
            client.release();
            return result;
    }

    /**
     *
     *
     * @static
     * @param {string} tableName
     * @param {Object} idx
     * @return {*} 
     * @memberof DBUtils
     */
    static async delete(tableName, idx) {
            const key = Object.keys(idx)[0];
            const value = idx[key];
            const client = await DBUtils.instance.connect();
            const sql = `delete from ${tableName} where ${key}=$1;`;            
            const result = await client.query(sql, [value]);
            client.release();
            return result;
    }

    /**
     * Query database given object
     *
     * @static
     * @param {string} tableName
     * @param {Object} obj
     * @return {Object}
     * @memberof DBUtils
     */
    static async query(tableName, obj) {
            const client = await DBUtils.instance.connect();
            const sql = `select * from ${tableName} where ${Object.keys(obj).map((e,i) => `${e}=$${i+1}`).join(' and ')};`;
            const values = Object.values(obj);
            const result = await client.query(sql, values);
            client.release();
            return result;
    }

    /**
     * Generic query given string sql and values array
     *
     * @static
     * @param {string} sql
     * @param {Array} values
     * @return {Object} 
     * @memberof DBUtils
     */
    static async genericQuery(sql, values){
        const client = await DBUtils.instance.connect();
        const result = client.query(sql, values);
        client.release();
        return result;
    }

}

module.exports = DBUtils;