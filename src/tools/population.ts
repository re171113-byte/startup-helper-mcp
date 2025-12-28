// 상권 인구 분석 Tool
// 상권별 유동인구, 연령대, 시간대 분석
// 출처: 서울열린데이터광장, 통계청, 소상공인마당 참고 추정치

import { kakaoApi } from "../api/kakao-api.js";
import type { ApiResult, PopulationAnalysis, Coordinates } from "../types.js";
import {
  AREA_TYPE_PATTERNS,
  BUSINESS_TARGET_FIT,
  calculateFitScore,
  findAreaData,
  inferAreaType,
  type AreaPopulationData,
} from "../data/population-data.js";
import { normalizeBusinessType } from "../data/startup-cost-data.js";

export async function analyzePopulation(
  location: string,
  businessType?: string,
  radius: number = 500
): Promise<ApiResult<PopulationAnalysis>> {
  try {
    // 1. 먼저 알려진 상권 데이터 찾기
    let areaData = findAreaData(location);
    let coordinates: Coordinates | null = null;
    const address: string = location;

    if (areaData) {
      // 알려진 상권 데이터 사용
      coordinates = areaData.coordinates;
    } else {
      // 2. 카카오 API로 좌표 조회
      try {
        coordinates = await kakaoApi.getCoordinates(location);
      } catch (error) {
        console.error("좌표 조회 실패:", error);
      }

      if (!coordinates) {
        return {
          success: false,
          error: {
            code: "LOCATION_NOT_FOUND",
            message: `위치를 찾을 수 없습니다: ${location}`,
            suggestion: "강남역, 홍대입구, 신촌, 건대입구, 명동, 이태원, 여의도, 잠실, 판교, 해운대, 서면 등 주요 상권명을 입력해주세요.",
          },
        };
      }

      // 3. 상권 유형 추론하여 패턴 데이터 사용
      const areaType = inferAreaType(location);
      const patternData = AREA_TYPE_PATTERNS[areaType];

      // 패턴 데이터에 좌표 추가하여 사용
      areaData = {
        ...patternData,
        coordinates,
      } as AreaPopulationData;
    }

    // 4. 업종 적합도 분석 (업종이 지정된 경우)
    let businessFit: PopulationAnalysis["businessFit"] | undefined;
    if (businessType) {
      const normalizedType = normalizeBusinessType(businessType);
      if (BUSINESS_TARGET_FIT[normalizedType]) {
        businessFit = calculateFitScore(areaData, normalizedType);
      }
    }

    // 5. 인사이트 생성
    const insights: string[] = [];

    // 인구 구성 분석
    const { population, ageDistribution, genderRatio, timeDistribution } = areaData;

    if (population.working > population.residential) {
      insights.push("직장인구가 거주인구보다 많은 오피스형 상권입니다.");
    } else if (population.residential > population.working * 2) {
      insights.push("거주인구가 많은 주거형 상권입니다.");
    }

    if (population.floating > population.total * 0.4) {
      insights.push("유동인구 비중이 높아 외부 유입이 활발합니다.");
    }

    // 연령대 분석
    if (ageDistribution.twenties + ageDistribution.teens > 50) {
      insights.push("10-20대 비중이 50% 이상으로 젊은 층이 주요 타겟입니다.");
    }
    if (ageDistribution.thirties + ageDistribution.forties > 50) {
      insights.push("30-40대 비중이 50% 이상으로 구매력 있는 층이 많습니다.");
    }

    // 성별 분석
    if (genderRatio.female > 55) {
      insights.push("여성 비율이 높아 뷰티, 카페, 디저트 업종에 유리합니다.");
    }
    if (genderRatio.male > 55) {
      insights.push("남성 비율이 높아 주류, 음식점 업종에 유리합니다.");
    }

    // 시간대 분석
    if (timeDistribution.lunch > 25) {
      insights.push("점심 시간대 유동인구가 집중되어 런치 특화 전략이 유효합니다.");
    }
    if (timeDistribution.evening > 30) {
      insights.push("저녁 시간대 유동인구가 많아 디너/야간 영업이 유리합니다.");
    }
    if (timeDistribution.night > 15) {
      insights.push("야간 유동인구가 있어 심야 영업을 고려해볼 수 있습니다.");
    }

    // 업종 적합도 인사이트
    if (businessFit) {
      if (businessFit.score >= 70) {
        insights.push(`${businessType} 업종에 적합도가 높은 상권입니다 (${businessFit.score}점).`);
      } else if (businessFit.score < 50) {
        insights.push(`${businessType} 업종에 적합도가 낮은 편입니다 (${businessFit.score}점). 다른 상권 검토를 권장합니다.`);
      }
    }

    return {
      success: true,
      data: {
        location: {
          name: location,
          address,
          coordinates: areaData.coordinates,
        },
        population: areaData.population,
        timeDistribution: areaData.timeDistribution,
        ageDistribution: areaData.ageDistribution,
        genderRatio: areaData.genderRatio,
        businessFit,
        characteristics: areaData.characteristics,
        insights,
      },
      meta: {
        source: "서울열린데이터광장, 통계청 기반 추정",
        timestamp: new Date().toISOString(),
        dataNote: `반경 ${radius}m 기준 추정치. 실제 유동인구는 요일, 계절, 이벤트에 따라 달라질 수 있습니다.`,
      },
    };
  } catch (error) {
    console.error("인구 분석 실패:", error);

    return {
      success: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: "상권 인구 분석 중 오류가 발생했습니다.",
        suggestion: "위치명을 다시 확인하고 시도해주세요.",
      },
    };
  }
}
