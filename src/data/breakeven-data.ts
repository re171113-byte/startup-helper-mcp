// 손익분기점 분석 데이터
// 출처: 소상공인진흥공단, 업종별 원가 분석 자료, 프랜차이즈 정보공개서 참고

// 업종별 벤치마크 데이터
export const BUSINESS_BENCHMARKS: Record<
  string,
  {
    averagePrice: number; // 평균 객단가 (원)
    variableRatio: number; // 변동비율 (원가율)
    rentPerPyeong: number; // 평당 월세 (만원)
    laborPerPerson: number; // 인건비 (만원/인/월)
    minStaff: number; // 최소 인력
    utilities: number; // 공과금 (만원/월, 15평 기준)
    otherFixed: number; // 기타 고정비 (만원/월)
    conversionRate: number; // 유동인구 전환율
    operatingHours: number; // 일 영업시간
    note: string;
  }
> = {
  카페: {
    averagePrice: 5500,
    variableRatio: 0.35,
    rentPerPyeong: 15,
    laborPerPerson: 230,
    minStaff: 2,
    utilities: 40,
    otherFixed: 30,
    conversionRate: 0.015,
    operatingHours: 12,
    note: "음료 원가율 낮음, 디저트 추가 시 객단가 상승",
  },
  음식점: {
    averagePrice: 12000,
    variableRatio: 0.4,
    rentPerPyeong: 18,
    laborPerPerson: 250,
    minStaff: 3,
    utilities: 60,
    otherFixed: 40,
    conversionRate: 0.02,
    operatingHours: 10,
    note: "식재료 원가 관리가 핵심, 배달 시 수수료 15-20% 추가",
  },
  편의점: {
    averagePrice: 8000,
    variableRatio: 0.75,
    rentPerPyeong: 12,
    laborPerPerson: 220,
    minStaff: 2,
    utilities: 50,
    otherFixed: 25,
    conversionRate: 0.05,
    operatingHours: 24,
    note: "마진율 낮지만 회전율 높음, 24시간 운영 시 인건비 증가",
  },
  미용실: {
    averagePrice: 35000,
    variableRatio: 0.15,
    rentPerPyeong: 14,
    laborPerPerson: 280,
    minStaff: 2,
    utilities: 30,
    otherFixed: 30,
    conversionRate: 0.01,
    operatingHours: 10,
    note: "인건비 비중 높음, 기술력에 따른 객단가 편차 큼",
  },
  치킨: {
    averagePrice: 22000,
    variableRatio: 0.45,
    rentPerPyeong: 12,
    laborPerPerson: 230,
    minStaff: 2,
    utilities: 50,
    otherFixed: 35,
    conversionRate: 0.025,
    operatingHours: 10,
    note: "배달 매출 비중 높음, 배달앱 수수료 고려 필요",
  },
  호프: {
    averagePrice: 30000,
    variableRatio: 0.35,
    rentPerPyeong: 16,
    laborPerPerson: 240,
    minStaff: 2,
    utilities: 45,
    otherFixed: 35,
    conversionRate: 0.02,
    operatingHours: 8,
    note: "주류 마진 높음, 야간 영업으로 인건비 할증",
  },
  분식: {
    averagePrice: 8000,
    variableRatio: 0.4,
    rentPerPyeong: 10,
    laborPerPerson: 220,
    minStaff: 2,
    utilities: 35,
    otherFixed: 25,
    conversionRate: 0.03,
    operatingHours: 12,
    note: "객단가 낮지만 회전율 높음, 학원가/역세권 유리",
  },
  베이커리: {
    averagePrice: 15000,
    variableRatio: 0.35,
    rentPerPyeong: 18,
    laborPerPerson: 260,
    minStaff: 3,
    utilities: 55,
    otherFixed: 40,
    conversionRate: 0.02,
    operatingHours: 12,
    note: "새벽 작업으로 인건비 증가, 폐기 손실 관리 중요",
  },
  무인매장: {
    averagePrice: 6000,
    variableRatio: 0.6,
    rentPerPyeong: 8,
    laborPerPerson: 0,
    minStaff: 0,
    utilities: 40,
    otherFixed: 50,
    conversionRate: 0.04,
    operatingHours: 24,
    note: "인건비 제로, 기타 고정비에 관리/유지보수 포함",
  },
  스터디카페: {
    averagePrice: 10000,
    variableRatio: 0.1,
    rentPerPyeong: 10,
    laborPerPerson: 220,
    minStaff: 1,
    utilities: 80,
    otherFixed: 40,
    conversionRate: 0.015,
    operatingHours: 24,
    note: "전기료 비중 높음, 좌석당 수익 계산 필요",
  },
  네일샵: {
    averagePrice: 50000,
    variableRatio: 0.1,
    rentPerPyeong: 12,
    laborPerPerson: 280,
    minStaff: 1,
    utilities: 25,
    otherFixed: 25,
    conversionRate: 0.008,
    operatingHours: 10,
    note: "인건비 비중 매우 높음, 예약제 운영으로 안정적",
  },
  반려동물: {
    averagePrice: 45000,
    variableRatio: 0.25,
    rentPerPyeong: 14,
    laborPerPerson: 250,
    minStaff: 2,
    utilities: 40,
    otherFixed: 35,
    conversionRate: 0.012,
    operatingHours: 10,
    note: "미용, 용품, 호텔 등 세부 업종에 따라 편차",
  },
};

// 지역별 임대료 배수 (서울 강남 = 1.0 기준)
export const RENT_MULTIPLIER: Record<string, number> = {
  "서울 강남": 1.0,
  "서울 홍대": 0.9,
  "서울 명동": 0.95,
  서울: 0.7,
  경기: 0.5,
  인천: 0.45,
  부산: 0.4,
  대구: 0.38,
  대전: 0.35,
  광주: 0.35,
  울산: 0.38,
  세종: 0.4,
  제주: 0.5,
  지방: 0.3,
};

// 달성 가능성 기준
export const ACHIEVABILITY_CRITERIA = {
  쉬움: {
    maxDailyCustomers: 50,
    description: "일 50명 미만, 충분히 달성 가능",
  },
  보통: {
    maxDailyCustomers: 100,
    description: "일 50-100명, 적극적 마케팅 필요",
  },
  어려움: {
    maxDailyCustomers: Infinity,
    description: "일 100명 초과, 높은 유동인구 필수",
  },
};

// 시나리오별 매출 배수
export const SCENARIO_MULTIPLIERS = {
  pessimistic: 0.7, // 비관적: 손익분기점의 70%
  realistic: 1.2, // 현실적: 손익분기점의 120%
  optimistic: 1.8, // 낙관적: 손익분기점의 180%
};

// 투자 회수 기간 기준
export const PAYBACK_CRITERIA = {
  excellent: { maxMonths: 12, note: "1년 이내 회수, 매우 양호" },
  good: { maxMonths: 24, note: "2년 이내 회수, 양호" },
  average: { maxMonths: 36, note: "3년 이내 회수, 보통" },
  poor: { maxMonths: Infinity, note: "3년 초과, 재검토 권장" },
};

// 업종별 인사이트 템플릿
export const BREAKEVEN_INSIGHTS: Record<string, string[]> = {
  공통: [
    "손익분기점은 최소 목표이며, 실제 수익을 위해서는 20-30% 초과 매출 필요",
    "고정비 절감이 손익분기점 낮추는 가장 효과적인 방법",
    "창업 초기 6개월은 적자 감수 필요, 운영자금 확보 필수",
  ],
  카페: [
    "테이크아웃 비중 높이면 좌석 회전율 무관하게 매출 증대 가능",
    "원두/시럽 등 원재료 대량 구매로 원가율 3-5% 절감 가능",
    "디저트 메뉴 추가로 객단가 30-50% 상승 효과",
  ],
  음식점: [
    "점심 특선 메뉴로 회전율 높이고, 저녁에 객단가 높이는 전략",
    "배달앱 수수료(15-20%) 감안한 메뉴 가격 책정 필요",
    "식재료 로스율 관리로 원가율 5% 절감 가능",
  ],
  편의점: [
    "담배, 주류 등 필수품으로 기본 매출 확보",
    "PB상품 비중 높이면 마진율 개선",
    "24시간 운영 시 야간 인건비 할증(1.5배) 고려",
  ],
  미용실: [
    "단골 확보가 안정적 매출의 핵심",
    "시술 시간 단축으로 일 고객수 증대 가능",
    "제품 판매(헤어케어 등) 추가 수익원 확보",
  ],
  치킨: [
    "배달앱 순위 관리가 매출에 직접적 영향",
    "세트메뉴로 객단가 상승 유도",
    "자체 배달 시 수수료 절감 가능",
  ],
  무인매장: [
    "인건비 제로로 손익분기점 낮음",
    "CCTV, 키오스크 유지보수 비용 정기 발생",
    "도난/파손 손실 3-5% 감안 필요",
  ],
};

// 업종 정규화 (startup-cost-data.ts와 동일한 로직 재사용 가능)
export function normalizeBusinessTypeForBreakeven(input: string): string {
  const inputLower = input.toLowerCase();

  if (inputLower.includes("커피") || inputLower.includes("카페")) return "카페";
  if (inputLower.includes("음식") || inputLower.includes("식당") || inputLower.includes("레스토랑"))
    return "음식점";
  if (inputLower.includes("편의점") || inputLower.includes("마트")) return "편의점";
  if (inputLower.includes("미용") || inputLower.includes("헤어") || inputLower.includes("살롱"))
    return "미용실";
  if (inputLower.includes("치킨")) return "치킨";
  if (inputLower.includes("호프") || inputLower.includes("맥주") || inputLower.includes("술집"))
    return "호프";
  if (inputLower.includes("분식") || inputLower.includes("떡볶이")) return "분식";
  if (inputLower.includes("빵") || inputLower.includes("베이커리") || inputLower.includes("제과"))
    return "베이커리";
  if (inputLower.includes("무인")) return "무인매장";
  if (inputLower.includes("스터디") || inputLower.includes("독서실")) return "스터디카페";
  if (inputLower.includes("네일") || inputLower.includes("손톱")) return "네일샵";
  if (inputLower.includes("반려") || inputLower.includes("애견") || inputLower.includes("펫"))
    return "반려동물";

  return "카페"; // 기본값
}
