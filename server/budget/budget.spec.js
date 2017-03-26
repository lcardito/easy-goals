'use strict';

const budget = require('./budget');
const expect = require('chai').expect;

describe('budget module', () => {

    it('should export a function', () => {
        expect(budget.calculateMonthlySaving).to.be.a('function');
    })
});