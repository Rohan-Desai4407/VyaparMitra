import { Decimal } from '@prisma/client/runtime/library';

export class CalculationService {
  // Configurable business rules
  private static readonly MARGIN_PERCENTAGE = new Decimal('0.10'); // 10%
  private static readonly FINANCING_PERCENTAGE = new Decimal('0.90'); // 90%

  /**
   * Calculate feasible project cost based on available margin capital.
   * Feasible Project Cost = Available Margin Capital / Margin Percentage
   */
  static calculateFeasibleProjectCost(marginCapital: number | Decimal): Decimal {
    const capital = typeof marginCapital === 'number' ? new Decimal(marginCapital) : marginCapital;
    return capital.dividedBy(this.MARGIN_PERCENTAGE);
  }

  /**
   * Calculate potential financing based on project cost.
   * Potential Financing = Project Cost * Financing Percentage
   */
  static calculatePotentialFinancing(projectCost: number | Decimal): Decimal {
    const cost = typeof projectCost === 'number' ? new Decimal(projectCost) : projectCost;
    return cost.times(this.FINANCING_PERCENTAGE);
  }

  static getMarginPercentage(): number {
    return this.MARGIN_PERCENTAGE.toNumber();
  }

  static getFinancingPercentage(): number {
    return this.FINANCING_PERCENTAGE.toNumber();
  }
}
