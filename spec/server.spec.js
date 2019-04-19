const request = require('request');
describe('calc', () => {
    it('should multiply 2 and 2', () => {
        expect(2 * 2).toBe(4)
    })
})

describe('get messages', () => {
    it('should return 200 okay', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            console.log(err)
            expect(res.statusCode).toEqual(200);
            done()
        })
    })
})