describe('Utils', () => {
    const Utils = require('../../src/utils/security-utils');
    let word, ciphered, payload, signed, decrypted;
    beforeEach(() => {
        word = "alohaa";
        payload = { user_id: 'alaoa' }
    })
    it('should encrypt word', () => {
        ciphered = Utils.encrypt(word);
        expect(ciphered).toBeDefined();
    })
    it('should decrypt cipher', () => {
        decrypted = Utils.decrypt(ciphered);
        expect(decrypted).toEqual(word);
    })
    it('should sign properly', () => {
        signed = Utils.sign(payload);
        expect(signed).toBeDefined();
    })
    it('should validate properly', () => {
        const result = Utils.validate(signed);
        expect(result.user_id).toEqual(payload.user_id);
    })
    it('should throw permission denied', () => {
        expect(() => Utils.validate(signed, 'daa')).toThrowError("Permission Denied");
    })
    it('should not throw permission denied', () => {
        const result = Utils.validate(signed, 'alaoa');
        expect(result).toBeDefined();
    })
    it('should convert to timestamp', () => {
        const date = new Date();
        expect(Utils.convert_to_timestamp(date)).toBeDefined();
    })
})