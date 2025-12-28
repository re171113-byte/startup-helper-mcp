// 창업 비용 데이터
// 출처: 소상공인진흥공단, 창업진흥원, 프랜차이즈 정보공개서 참고

// 업종별 비용 기준 (15평 기준, 단위: 만원)
export const BUSINESS_COST_DATA: Record<
  string,
  {
    deposit: { min: number; max: number }; // 보증금
    interior: { basic: number; standard: number; premium: number }; // 인테리어 (평당)
    equipment: { min: number; max: number }; // 장비/설비
    inventory: { min: number; max: number }; // 초기 재고
    monthlyOperating: number; // 월 운영비 (인건비 제외)
    note: string;
  }
> = {
  카페: {
    deposit: { min: 2000, max: 5000 },
    interior: { basic: 80, standard: 120, premium: 180 },
    equipment: { min: 1500, max: 3000 },
    inventory: { min: 200, max: 500 },
    monthlyOperating: 300,
    note: "에스프레소 머신이 비용의 핵심. 중고 장비로 초기 비용 절감 가능",
  },
  음식점: {
    deposit: { min: 2000, max: 6000 },
    interior: { basic: 100, standard: 150, premium: 220 },
    equipment: { min: 2000, max: 5000 },
    inventory: { min: 300, max: 800 },
    monthlyOperating: 400,
    note: "주방 설비가 비용의 핵심. 업종에 따라 편차 큼",
  },
  편의점: {
    deposit: { min: 3000, max: 5000 },
    interior: { basic: 50, standard: 70, premium: 100 },
    equipment: { min: 3000, max: 5000 },
    inventory: { min: 2000, max: 3000 },
    monthlyOperating: 200,
    note: "프랜차이즈 가입비 별도. 본사 지원으로 초기 비용 절감 가능",
  },
  미용실: {
    deposit: { min: 1500, max: 4000 },
    interior: { basic: 100, standard: 150, premium: 200 },
    equipment: { min: 500, max: 1500 },
    inventory: { min: 200, max: 500 },
    monthlyOperating: 250,
    note: "기술력이 핵심. 인테리어보다 입지 선정이 중요",
  },
  치킨: {
    deposit: { min: 2000, max: 4000 },
    interior: { basic: 80, standard: 120, premium: 160 },
    equipment: { min: 1500, max: 3000 },
    inventory: { min: 300, max: 600 },
    monthlyOperating: 350,
    note: "배달 중심이면 소형 매장 가능. 프랜차이즈 가입비 별도",
  },
  호프: {
    deposit: { min: 2500, max: 5000 },
    interior: { basic: 100, standard: 150, premium: 200 },
    equipment: { min: 1000, max: 2000 },
    inventory: { min: 400, max: 800 },
    monthlyOperating: 350,
    note: "심야 영업으로 인건비 증가. 주류 마진율 높음",
  },
  분식: {
    deposit: { min: 1500, max: 3000 },
    interior: { basic: 60, standard: 90, premium: 130 },
    equipment: { min: 800, max: 1500 },
    inventory: { min: 200, max: 400 },
    monthlyOperating: 250,
    note: "학교 앞, 역세권 위주. 회전율이 중요",
  },
  베이커리: {
    deposit: { min: 2500, max: 5000 },
    interior: { basic: 120, standard: 170, premium: 230 },
    equipment: { min: 3000, max: 6000 },
    inventory: { min: 300, max: 600 },
    monthlyOperating: 400,
    note: "오븐, 발효기 등 전문 장비 필수. 기술 습득 필요",
  },
  무인매장: {
    deposit: { min: 1000, max: 2500 },
    interior: { basic: 40, standard: 60, premium: 80 },
    equipment: { min: 2000, max: 4000 },
    inventory: { min: 500, max: 1500 },
    monthlyOperating: 150,
    note: "키오스크, CCTV 필수. 인건비 절감이 핵심",
  },
  스터디카페: {
    deposit: { min: 3000, max: 6000 },
    interior: { basic: 80, standard: 120, premium: 160 },
    equipment: { min: 1500, max: 3000 },
    inventory: { min: 100, max: 300 },
    monthlyOperating: 300,
    note: "좌석당 수익 계산 필요. 24시간 운영 시 관리비 증가",
  },
  네일샵: {
    deposit: { min: 1000, max: 2500 },
    interior: { basic: 80, standard: 120, premium: 160 },
    equipment: { min: 300, max: 800 },
    inventory: { min: 200, max: 400 },
    monthlyOperating: 200,
    note: "소자본 창업 가능. 기술력과 단골 확보가 핵심",
  },
  반려동물: {
    deposit: { min: 2000, max: 4000 },
    interior: { basic: 100, standard: 140, premium: 180 },
    equipment: { min: 500, max: 1500 },
    inventory: { min: 500, max: 1000 },
    monthlyOperating: 300,
    note: "미용, 용품, 호텔 등 세부 업종에 따라 차이",
  },
};

// 지역별 비용 배수
export const REGIONAL_MULTIPLIER: Record<
  string,
  {
    multiplier: number;
    note: string;
  }
> = {
  "서울 강남": { multiplier: 1.8, note: "전국 최고 임대료. 권리금 높음" },
  "서울 홍대": { multiplier: 1.6, note: "유동인구 많음. 권리금 높음" },
  "서울 명동": { multiplier: 1.7, note: "관광특구. 외국인 수요" },
  서울: { multiplier: 1.4, note: "강남/홍대 외 서울 평균" },
  경기: { multiplier: 1.1, note: "서울 근교. 지역 편차 큼" },
  인천: { multiplier: 1.0, note: "서울 대비 저렴" },
  부산: { multiplier: 0.95, note: "해운대/서면 제외 평균" },
  대구: { multiplier: 0.9, note: "동성로 제외 평균" },
  대전: { multiplier: 0.85, note: "둔산동 제외 평균" },
  광주: { multiplier: 0.85, note: "충장로 제외 평균" },
  울산: { multiplier: 0.9, note: "공단 지역 특수성" },
  세종: { multiplier: 0.95, note: "신도시 특수성" },
  제주: { multiplier: 1.1, note: "관광지 프리미엄" },
  지방: { multiplier: 0.75, note: "중소도시 평균" },
};

// 비용 절감 팁
export const COST_SAVING_TIPS: Record<string, string[]> = {
  공통: [
    "중고 장비 활용으로 초기 투자 30-50% 절감 가능",
    "권리금 협상으로 500-2000만원 절감 가능",
    "정책자금(소상공인 융자) 활용 시 금리 2-3% 수준",
    "창업 초기 6개월 운영자금 필수 확보",
  ],
  카페: [
    "에스프레소 머신 리스로 초기 비용 절감",
    "테이크아웃 전문점은 면적 줄여 임대료 절감",
    "셀프 인테리어로 30% 절감 가능",
  ],
  음식점: [
    "주방 장비 렌탈/중고 적극 활용",
    "배달 전문점은 홀 면적 최소화",
    "식자재 공동구매로 원가 절감",
  ],
  편의점: [
    "본사 인테리어 지원 프로그램 활용",
    "신규 출점 지원금 협상",
    "폐점 매물 인수로 초기 비용 절감",
  ],
  미용실: [
    "샵인샵으로 초기 투자 최소화",
    "네이버/카카오 예약 활용으로 마케팅비 절감",
    "기존 미용실 인수 검토",
  ],
  무인매장: [
    "통신사 제휴 키오스크로 초기 비용 절감",
    "무인 아이스크림/세탁이 초기 비용 가장 저렴",
    "관리 대행 서비스로 인건비 제로 유지",
  ],
};

// 업종 정규화 함수
export function normalizeBusinessType(input: string): string {
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

// 지역 정규화 함수
export function normalizeRegion(input: string): string {
  const inputLower = input.toLowerCase();

  if (inputLower.includes("강남")) return "서울 강남";
  if (inputLower.includes("홍대") || inputLower.includes("합정") || inputLower.includes("연남"))
    return "서울 홍대";
  if (inputLower.includes("명동") || inputLower.includes("을지로")) return "서울 명동";
  if (inputLower.includes("서울")) return "서울";
  if (inputLower.includes("경기") || inputLower.includes("수원") || inputLower.includes("성남"))
    return "경기";
  if (inputLower.includes("인천")) return "인천";
  if (inputLower.includes("부산")) return "부산";
  if (inputLower.includes("대구")) return "대구";
  if (inputLower.includes("대전")) return "대전";
  if (inputLower.includes("광주")) return "광주";
  if (inputLower.includes("울산")) return "울산";
  if (inputLower.includes("세종")) return "세종";
  if (inputLower.includes("제주")) return "제주";

  return "지방"; // 기본값
}
