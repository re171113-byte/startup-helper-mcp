// 정책지원금 추천 Tool
// 기업마당 API를 활용한 실시간 정책지원금 매칭

import { bizinfoApi, BizinfoApi } from "../api/bizinfo-api.js";
import { DATA_SOURCES } from "../constants.js";
import type { ApiResult, PolicyFundRecommendation, PolicyFund } from "../types.js";

// 기업마당 API 응답을 PolicyFund 형식으로 변환
function convertBizinfoToFund(item: {
  pblancId: string;
  pblancNm: string;
  bsnsSumryCn: string;
  reqstBeginEndDe: string;
  jrsdInsttNm: string;
  excInsttNm: string;
  refrncNm: string;
  pblancUrl: string;
  hashtags: string;
  trgetNm: string;
  pldirSportRealmLclasCodeNm: string;
  pldirSportRealmMlsfcCodeNm: string;
}): PolicyFund {
  // 지원금 유형 추정
  let type: PolicyFund["type"] = "복합";
  const summary = item.bsnsSumryCn.toLowerCase();
  const name = item.pblancNm.toLowerCase();

  if (summary.includes("융자") || name.includes("융자")) {
    type = "융자";
  } else if (summary.includes("보조금") || name.includes("보조금") || summary.includes("바우처")) {
    type = "보조금";
  } else if (summary.includes("멘토링") || summary.includes("교육")) {
    type = "멘토링";
  }

  // 지원 금액 추출 (요약에서 추출 시도)
  let amount = "공고문 참조";
  const amountMatch = item.bsnsSumryCn.match(/(\d+[천백만억]+원|\d+,?\d*만원)/);
  if (amountMatch) {
    amount = amountMatch[0];
  }

  // 자격요건 추출 (해시태그 기반)
  const requirements: string[] = [];
  const hashtags = item.hashtags.split(",");

  if (hashtags.includes("청년")) requirements.push("청년");
  if (hashtags.includes("여성")) requirements.push("여성");
  if (hashtags.includes("중소기업")) requirements.push("중소기업");
  if (hashtags.includes("창업기업")) requirements.push("창업기업");
  if (hashtags.includes("예비창업")) requirements.push("예비창업자");
  if (item.trgetNm) requirements.push(item.trgetNm);

  if (requirements.length === 0) {
    requirements.push("공고문 확인 필요");
  }

  return {
    id: item.pblancId,
    name: item.pblancNm,
    organization: item.jrsdInsttNm || item.excInsttNm,
    amount,
    type,
    deadline: BizinfoApi.formatDateRange(item.reqstBeginEndDe),
    requirements,
    applyUrl: `https://www.bizinfo.go.kr${item.pblancUrl}`,
    description: BizinfoApi.stripHtml(item.bsnsSumryCn).slice(0, 200) + "...",
  };
}

// 사용자 조건으로 필터링
function filterByUserConditions(
  funds: PolicyFund[],
  region: string,
  _founderType?: string
): PolicyFund[] {
  return funds.filter((fund) => {
    // 지역 필터링 (지역이 명시되어 있으면 해당 지역만)
    const fundName = fund.name.toLowerCase();
    const regionLower = region.toLowerCase();

    // 특정 지역이 명시된 공고
    const regionKeywords = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

    const fundRegion = regionKeywords.find((r) => fundName.includes(r));
    if (fundRegion && !regionLower.includes(fundRegion.toLowerCase())) {
      return false;
    }

    return true;
  });
}

// 추천 팁 생성
function generateTip(
  matchedFunds: PolicyFund[],
  stage: string,
  founderType?: string
): string {
  if (matchedFunds.length === 0) {
    return "현재 조건에 맞는 지원사업이 없습니다. 조건을 변경하거나 기업마당(bizinfo.go.kr)에서 직접 검색해보세요.";
  }

  const hasMentoring = matchedFunds.some((f) => f.type === "멘토링" || f.type === "복합");
  const hasGrant = matchedFunds.some((f) => f.type === "보조금");
  const hasLoan = matchedFunds.some((f) => f.type === "융자");

  if (stage === "예비창업" && hasMentoring) {
    return "예비창업자는 멘토링이 포함된 프로그램을 추천드립니다. 창업 성공률을 높일 수 있습니다.";
  }

  if (hasGrant && hasLoan) {
    return "보조금은 상환 의무가 없어 유리하지만 경쟁률이 높습니다. 융자와 보조금을 함께 준비하세요.";
  }

  if (founderType === "청년") {
    return "청년 대상 지원사업이 많습니다. 여러 개를 동시에 신청하면 선정 확률이 높아집니다.";
  }

  return `${matchedFunds.length}개의 지원사업을 찾았습니다. 신청 기한을 확인하고 서류를 미리 준비하세요.`;
}

export async function recommendPolicyFunds(
  businessType: string,
  stage: "예비창업" | "초기창업" | "운영중" | "재창업",
  region: string,
  founderType?: "청년" | "중장년" | "여성" | "장애인" | "일반",
  _founderAge?: number
): Promise<ApiResult<PolicyFundRecommendation>> {
  try {
    // 기업마당 API로 실시간 지원사업 검색
    const bizinfoResults = await bizinfoApi.searchStartupFunds({
      region,
      founderType,
      count: 30,
    });

    // API 결과를 PolicyFund 형식으로 변환
    let matchedFunds = bizinfoResults.map(convertBizinfoToFund);

    // 사용자 조건으로 추가 필터링
    matchedFunds = filterByUserConditions(matchedFunds, region, founderType);

    // 최대 10개로 제한
    matchedFunds = matchedFunds.slice(0, 10);

    // 추천 팁 생성
    const tip = generateTip(matchedFunds, stage, founderType);

    return {
      success: true,
      data: {
        userProfile: {
          businessType,
          stage,
          region,
          founderType,
        },
        matchedFunds,
        totalCount: matchedFunds.length,
        tip,
      },
      meta: {
        source: DATA_SOURCES.bizinfoApi,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("정책지원금 추천 실패:", error);

    return {
      success: false,
      error: {
        code: "POLICY_FUND_FAILED",
        message: `정책지원금 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "Unknown error"}`,
        suggestion: "기업마당(bizinfo.go.kr)에서 직접 검색해보세요.",
      },
    };
  }
}
