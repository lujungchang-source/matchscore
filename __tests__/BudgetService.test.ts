/**
 * Test suite for BudgetService
 */

import { BudgetService, budgetService } from '../BudgetService';
import { Budget } from '../Budget';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(() => {
    service = new BudgetService();
  });

  describe('getAll', () => {
    test('should get all budgets', () => {
      // TODO: Implement test
    });
  });

  describe('getByYearMonth', () => {
    test('should get budget by year-month', () => {
      // TODO: Implement test
    });
  });

  describe('getByYear', () => {
    test('should get budgets by year', () => {
      // TODO: Implement test
    });
  });

  describe('add', () => {
    test('should add new budget', () => {
      // TODO: Implement test
    });
  });

  describe('update', () => {
    test('should update existing budget', () => {
      // TODO: Implement test
    });
  });

  describe('delete', () => {
    test('should delete budget by year-month', () => {
      // TODO: Implement test
    });
  });

  describe('getTotalAmount', () => {
    test('should calculate total amount', () => {
      // TODO: Implement test
    });
  });

  describe('singleton instance', () => {
    test('should export a working singleton instance', () => {
      // TODO: Implement test
    });
  });
});
