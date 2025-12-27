// 기업마당 API 클라이언트
// API 문서: https://www.bizinfo.go.kr/web/lay1/program/S1T175C174/apiDetail.do

import { fetchWithTimeout } from "../utils/fetch-with-timeout.js";

const BIZINFO_API_KEY = process.env.BIZINFO_API_KEY || "";
const BIZINFO_API_BASE = "https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do";

// 분야 코드
export const BIZINFO_CATEGORIES = {
  금융: "PLD0001",
  기술: "PLD0002",
  인력: "PLD0003",
  수출: "PLD0004",
  내수: "PLD0005",
  창업: "PLD0006",
  경영: "PLD0007",
  기타: "PLD0008",
} as const;

// API 응답 타입
export interface BizinfoItem {
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
  creatPnttm: string;
  totCnt: number;
}

interface BizinfoResponse {
  jsonArray: BizinfoItem[];
  reqErr?: string;
}

export class BizinfoApi {
  private apiKey: string;

  constructor() {
    this.apiKey = BIZINFO_API_KEY;
  }

  private checkApiKey(): void {
    if (!this.apiKey) {
      throw new Error("BIZINFO_API_KEY가 설정되지 않았습니다.");
    }
  }

  // 지원사업 검색
  async searchFunds(options?: {
    category?: keyof typeof BIZINFO_CATEGORIES;
    hashtags?: string;
    count?: number;
  }): Promise<BizinfoItem[]> {
    this.checkApiKey();

    const params = new URLSearchParams({
      crtfcKey: this.apiKey,
      dataType: "json",
      searchCnt: String(options?.count || 50),
    });

    if (options?.category) {
      params.append("searchLclasId", BIZINFO_CATEGORIES[options.category]);
    }

    if (options?.hashtags) {
      params.append("hashtags", options.hashtags);
    }

    const url = `${BIZINFO_API_BASE}?${params}`;

    const response = await fetchWithTimeout(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`기업마당 API 요청 실패: ${response.status}`);
    }

    const data = (await response.json()) as BizinfoResponse;

    if (data.reqErr) {
      throw new Error(`기업마당 API 오류: ${data.reqErr}`);
    }

    return data.jsonArray || [];
  }

  // 창업 관련 지원사업 검색
  async searchStartupFunds(options?: {
    region?: string;
    founderType?: string;
    count?: number;
  }): Promise<BizinfoItem[]> {
    // 창업 분야로 검색
    let hashtags = "창업";

    if (options?.region) {
      hashtags += `,${options.region}`;
    }

    if (options?.founderType === "청년") {
      hashtags += ",청년";
    } else if (options?.founderType === "여성") {
      hashtags += ",여성";
    }

    return this.searchFunds({
      category: "창업",
      hashtags,
      count: options?.count || 30,
    });
  }

  // HTML 태그 제거
  static stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // 신청기간 파싱 (YYYYMMDD ~ YYYYMMDD -> 읽기 좋은 형식)
  static formatDateRange(dateRange: string): string {
    if (!dateRange || dateRange === "추후 공지") return "추후 공지";

    const parts = dateRange.split("~").map((d) => d.trim());
    if (parts.length !== 2) return dateRange;

    const formatDate = (d: string) => {
      if (d.length !== 8) return d;
      return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
    };

    return `${formatDate(parts[0])} ~ ${formatDate(parts[1])}`;
  }
}

export const bizinfoApi = new BizinfoApi();
