// test/models/user.js
import chai, { assert } from 'chai';
import truncate from 'test/truncate';
import locationFactory from '../location/factories';

describe('User model', () => {
    
    let location;
  
    beforeEach(async () => {
        await truncate();
        location = await locationFactory();
    });

    it('should do something', async () => {
        // TODO
    });
});