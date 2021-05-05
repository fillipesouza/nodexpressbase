const DBUtils = require('../../src/utils/db-utils');

describe('DBUtils', () => {
    let queryObject, result;
    beforeEach(() => {
        clientMock = { query: (a, b) => { return [a, b] }, release: () => {} }
        queryObject = { user_id: 'a3efaa', email: 't@mail.com', age: 24 };
        DBUtils.instance = { connect: () => clientMock }
    })
    it('should insert ', async() => {
        const [sql, values] = await DBUtils.insert('aloha', queryObject, "user_id");
        expect(sql).toEqual('insert into aloha (user_id,email,age) values ($1, $2, $3) RETURNING user_id;')
        expect(values).toEqual(['a3efaa', 't@mail.com', 24])
    })
    it('should update ', async() => {
        const [sql, values] = await DBUtils.update('aloha', queryObject, "user_id");
        expect(sql).toEqual('update aloha set email=$1,age=$2 where user_id=$3;')
        expect(values).toEqual(['t@mail.com', 24, 'a3efaa'])

    })
    it('should update with composed key', async() => {
        const updateObject = { email: 't@mail.com', age: 24 };
        const [sql, values] = await DBUtils.update('aloha', updateObject, { user_id: 'a3efaa' });
        expect(sql).toEqual('update aloha set email=$1,age=$2 where user_id=$3;')
        expect(values).toEqual(['t@mail.com', 24, 'a3efaa'])

    })
    it('should delete ', async() => {
        const [sql, values] = await DBUtils.delete('aloha', { user_id: 'aloha' });
        expect(sql).toEqual('delete from aloha where user_id=$1;')
        expect(values).toEqual(['aloha'])
    })
    it('should query ', async() => {
        const [sql, values] = await DBUtils.query('aloha', queryObject);
        expect(sql).toEqual('select * from aloha where user_id=$1 and email=$2 and age=$3;')
        expect(values).toEqual(['a3efaa', 't@mail.com', 24])
    })
    it('should use generic query ', async() => {
        const [sql, values] = await DBUtils.genericQuery('select * from test where id=$1;', ['testId']);
        expect(sql).toEqual('select * from test where id=$1;')
        expect(values).toEqual(['testId'])
    })
})