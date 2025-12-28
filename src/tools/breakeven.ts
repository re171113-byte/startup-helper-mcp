// 손익분기점 분석 Tool
// 업종별 손익분기점 및 수익성 시뮬레이션
// 출처: 소상공인진흥공단, 업종별 원가 분석 자료

import type { ApiResult, BreakevenAnalysis } from "../types.js";
import {
  BUSINESS_BENCHMARKS,
  RENT_MULTIPLIER,
  ACHIEVABILITY_CRITERIA,
  SCENARIO_MULTIPLIERS,
  PAYBACK_CRITERIA,
  BREAKEVEN_INSIGHTS,
  normalizeBusinessTypeForBreakeven,
} from "../data/breakeven-data.js";
import { normalizeRegion } from "../data/startup-cost-data.js";
import { calculateStartupCost } from "./startup-cost.js";

export async function analyzeBreakeven(
  businessType: string,
  region: string,
  monthlyRent?: number,
  size: number = 15,
  averagePrice?: number
): Promise<ApiResult<BreakevenAnalysis>> {
  try {
    // 업종 및 지역 정규화
    const normalizedType = normalizeBusinessTypeForBreakeven(businessType);
    const normalizedRegion = normalizeRegion(region);

    // 벤치마크 데이터 조회
    const benchmark = BUSINESS_BENCHMARKS[normalizedType];
    if (!benchmark) {
      return {
        success: false,
        error: {
          code: "UNKNOWN_BUSINESS_TYPE",
          message: `알 수 없는 업종입니다: ${businessType}`,
          suggestion: "카페, 음식점, 편의점, 미용실, 치킨, 호프, 분식, 베이커리, 무인매장, 스터디카페, 네일샵, 반려동물 중 선택해주세요.",
        },
      };
    }

    // 지역별 임대료 배수
    const rentMultiplier = RENT_MULTIPLIER[normalizedRegion] || 0.5;

    // 임대료 계산 (입력값 또는 추정값)
    const calculatedRent = monthlyRent || Math.round(benchmark.rentPerPyeong * size * rentMultiplier);

    // 인건비 계산
    const laborCost = benchmark.laborPerPerson * benchmark.minStaff;

    // 공과금 (면적 비례 조정)
    const utilities = Math.round(benchmark.utilities * (size / 15));

    // 기타 고정비
    const otherFixed = benchmark.otherFixed;

    // 총 고정비
    const fixedMonthly = calculatedRent + laborCost + utilities + otherFixed;

    // 변동비율
    const variableRatio = benchmark.variableRatio;

    // 객단가 (입력값 또는 벤치마크)
    const usedAveragePrice = averagePrice || benchmark.averagePrice;

    // 손익분기점 계산: BEP = 고정비 / (1 - 변동비율)
    const breakevenMonthlySales = Math.round(fixedMonthly / (1 - variableRatio));
    const breakevenDailySales = Math.round(breakevenMonthlySales / 30);
    const breakevenDailyCustomers = Math.round(breakevenDailySales / usedAveragePrice * 10000);

    // 달성 가능성 판단
    let achievability: "쉬움" | "보통" | "어려움";
    if (breakevenDailyCustomers <= ACHIEVABILITY_CRITERIA["쉬움"].maxDailyCustomers) {
      achievability = "쉬움";
    } else if (breakevenDailyCustomers <= ACHIEVABILITY_CRITERIA["보통"].maxDailyCustomers) {
      achievability = "보통";
    } else {
      achievability = "어려움";
    }

    // 시나리오별 수익 계산
    const calculateProfit = (salesMultiplier: number): { monthlySales: number; monthlyProfit: number } => {
      const monthlySales = Math.round(breakevenMonthlySales * salesMultiplier);
      const variableCost = Math.round(monthlySales * variableRatio);
      const monthlyProfit = monthlySales - variableCost - fixedMonthly;
      return { monthlySales, monthlyProfit };
    };

    const scenarios = {
      pessimistic: calculateProfit(SCENARIO_MULTIPLIERS.pessimistic),
      realistic: calculateProfit(SCENARIO_MULTIPLIERS.realistic),
      optimistic: calculateProfit(SCENARIO_MULTIPLIERS.optimistic),
    };

    // 투자금 회수 기간 계산 (창업비용 조회)
    const costResult = await calculateStartupCost(businessType, region, size, "standard");
    const investmentAmount = costResult.success && costResult.data
      ? costResult.data.totalCost.estimated
      : fixedMonthly * 12; // 실패 시 고정비 12개월로 추정

    const monthlyRealisticProfit = scenarios.realistic.monthlyProfit;
    let paybackMonths: number;
    let paybackNote: string;

    if (monthlyRealisticProfit <= 0) {
      paybackMonths = 999;
      paybackNote = "현실적 시나리오에서 수익이 발생하지 않아 투자 회수가 어렵습니다. 비용 구조 재검토 필요.";
    } else {
      paybackMonths = Math.ceil(investmentAmount / monthlyRealisticProfit);

      if (paybackMonths <= PAYBACK_CRITERIA.excellent.maxMonths) {
        paybackNote = PAYBACK_CRITERIA.excellent.note;
      } else if (paybackMonths <= PAYBACK_CRITERIA.good.maxMonths) {
        paybackNote = PAYBACK_CRITERIA.good.note;
      } else if (paybackMonths <= PAYBACK_CRITERIA.average.maxMonths) {
        paybackNote = PAYBACK_CRITERIA.average.note;
      } else {
        paybackNote = PAYBACK_CRITERIA.poor.note;
      }
    }

    // 인사이트 생성
    const insights = [
      ...(BREAKEVEN_INSIGHTS[normalizedType] || []),
      ...BREAKEVEN_INSIGHTS["공통"],
    ];

    // 추가 상황별 인사이트
    if (achievability === "어려움") {
      insights.unshift("일 필요 고객수가 많습니다. 입지 선정 시 유동인구가 많은 곳을 우선 검토하세요.");
    }
    if (laborCost > calculatedRent) {
      insights.unshift("인건비가 임대료보다 높습니다. 운영 효율화나 무인화를 검토해보세요.");
    }
    if (paybackMonths > 36) {
      insights.unshift("투자 회수 기간이 3년을 초과합니다. 초기 투자 비용 절감 방안을 검토하세요.");
    }

    return {
      success: true,
      data: {
        businessType: normalizedType,
        region: normalizedRegion,
        size,
        costs: {
          fixedMonthly,
          variableRatio,
          breakdown: {
            rent: calculatedRent,
            labor: laborCost,
            utilities,
            other: otherFixed,
          },
        },
        breakeven: {
          monthlySales: breakevenMonthlySales,
          dailySales: breakevenDailySales,
          dailyCustomers: breakevenDailyCustomers,
          averagePrice: usedAveragePrice,
          achievability,
        },
        scenarios,
        paybackPeriod: {
          investmentAmount,
          months: paybackMonths,
          note: paybackNote,
        },
        insights,
      },
      meta: {
        source: "소상공인진흥공단 업종별 원가 분석 기반 추정",
        timestamp: new Date().toISOString(),
        dataNote: `${size}평 기준, 객단가 ${usedAveragePrice.toLocaleString()}원 기준. 실제 수익은 운영 능력, 입지, 경쟁 상황에 따라 달라집니다.`,
      },
    };
  } catch (error) {
    console.error("손익분기점 분석 실패:", error);

    return {
      success: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: "손익분기점 분석 중 오류가 발생했습니다.",
        suggestion: "입력값을 확인하고 다시 시도해주세요.",
      },
    };
  }
}
