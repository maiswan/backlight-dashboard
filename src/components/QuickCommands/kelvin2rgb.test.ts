import kelvin2rgb from "./kelvin2rgb";

describe('kelvin2rgb', () => {
    const htmlBlack = "#000000";

    it('returns #000000 below bound', () => {
        const actual = kelvin2rgb(900);
        expect(actual).toBe(htmlBlack);
    });

    it('returns #000000 above bound', () => {
        const actual = kelvin2rgb(12100);
        expect(actual).toBe(htmlBlack);
    });

    it('returns #000000 on other invalid inputs (e.g., NaN)', () => {
        let actual;

        actual = kelvin2rgb(NaN);
        expect(actual).toBe(htmlBlack);

        actual = kelvin2rgb(Infinity);
        expect(actual).toBe(htmlBlack);

        actual = kelvin2rgb(-42.0);
        expect(actual).toBe(htmlBlack);
    });

    it('returns #[00,FF][00,FF][00,FF] for valid inputs', () => {
        const rgbHex = /^#[0123456789ABCDEF]{6}$/i;

        for (let i = 1000; i < 12000; i += 100) {
            const actual = kelvin2rgb(i);
            expect(actual).toMatch(rgbHex);
        }
    })

    it('rounds input to the nearest 100', () => {
        const expected = kelvin2rgb(1200);
        const shouldEqualExpected = [1150, 1249];
        const shouldNotEqualExpected = [1149, 1250];
        
        for (const number of shouldEqualExpected) {
            expect(kelvin2rgb(number)).toEqual(expected);
        }
        for (const number of shouldNotEqualExpected) {
            expect(kelvin2rgb(number)).not.toEqual(expected);
        }
    })
});