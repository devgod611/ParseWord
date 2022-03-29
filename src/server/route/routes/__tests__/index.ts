import request from 'supertest';
import createServer from '../../../index';
import fs from 'fs-extra';
import path from 'path';

const testText = path.join(__dirname, 'test.txt');

describe('Upload endpoint', () => {
  it('Successfully uploads', async () => {
      await request(createServer)
      .post(`/api/test`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', fs.readFileSync(testText), 'test.txt')
      .expect((res) => {
        expect(res.body.list).toEqual([{"cnt": 2, "key": "message"}, {"cnt": 1, "key": "error"}]);
      });
  }, 5000);
})
