import { CalculationService } from '../services/CalculationService';

describe('CalculationService', () => {
  it('should calculate project cost correctly for ₹25,000', () => {
    const cost = CalculationService.calculateFeasibleProjectCost(25000);
    expect(cost.toNumber()).toBe(250000); // 10% margin -> 2.5L
  });

  it('should calculate financing correctly for ₹2,50,000', () => {
    const financing = CalculationService.calculatePotentialFinancing(250000);
    expect(financing.toNumber()).toBe(225000); // 90% financing -> 2.25L
  });

  it('should calculate correctly for ₹50,000', () => {
    const cost = CalculationService.calculateFeasibleProjectCost(50000);
    const financing = CalculationService.calculatePotentialFinancing(cost);
    expect(cost.toNumber()).toBe(500000);
    expect(financing.toNumber()).toBe(450000);
  });

  it('should calculate correctly for ₹1,00,000', () => {
    const cost = CalculationService.calculateFeasibleProjectCost(100000);
    const financing = CalculationService.calculatePotentialFinancing(cost);
    expect(cost.toNumber()).toBe(1000000);
    expect(financing.toNumber()).toBe(900000);
  });
});
