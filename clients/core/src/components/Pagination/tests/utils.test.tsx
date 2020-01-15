import { fetchPageNumbers, range } from '../utils';

describe('../utils', () => {
    it('range works correctly for nominal case', () => {
        expect(range(5)).toEqual([0, 1, 2, 3, 4]);
        expect(range(1, 5)).toEqual([1, 2, 3, 4]);
        expect(range(1, 5, 2)).toEqual([1, 3]);
        expect(range(0)).toEqual([]);
    });
});

describe('src/components/paginator - helpers/utilities', () => {
    it('fetchPageNumbers works for nominal case', () => {
        let neighborPillsNum = 2;
        const totalRecords = 720;
        const pageSize = 30;
        let currentPage = 8;
        let expected: string[] = ['6', '7', '8', '9', '10'];
        expect(fetchPageNumbers(totalRecords, neighborPillsNum, pageSize, currentPage)).toEqual(expected);

        neighborPillsNum = 1;
        expected = ['7', '8', '9'];
        expect(fetchPageNumbers(totalRecords, neighborPillsNum, pageSize, currentPage)).toEqual(expected);

        neighborPillsNum = 1;
        expected = ['14', '15', '16'];
        currentPage = 15;
        expect(fetchPageNumbers(totalRecords, neighborPillsNum, pageSize, currentPage)).toEqual(expected);
    });

    it('fetchPageNumbers works for right boundary edge-case', () => {
        const neighborPillsNum = 2;
        const totalRecords = 720;
        const pageSize = 30;
        const currentPage = 24;
        const expected: string[] = ['22', '23', '24'];
        expect(fetchPageNumbers(totalRecords, neighborPillsNum, pageSize, currentPage)).toEqual(expected);
    });

    it('fetchPageNumbers works for left boundary edge-case', () => {
        const neighborPillsNum = 2;
        const totalRecords = 720;
        const pageSize = 30;
        const currentPage = 1;
        const expected: string[] = ['1', '2', '3'];
        expect(fetchPageNumbers(totalRecords, neighborPillsNum, pageSize, currentPage)).toEqual(expected);
    });
});
