import { describe, it, expect } from "vitest";
import { recommendPolicyFunds } from "../tools/policy-funds.js";

// API 키가 없으면 실제 API 호출 테스트 스킵
const hasApiKey = !!process.env.BIZINFO_API_KEY;

describe("recommendPolicyFunds", () => {
  it("should return API result structure", async () => {
    const result = await recommendPolicyFunds(
      "카페",
      "예비창업",
      "서울",
      "청년",
      28
    );

    // API 키 유무와 관계없이 결과 구조는 올바르게 반환
    expect(result).toHaveProperty("success");

    if (result.success) {
      expect(result.data).toBeDefined();
      expect(result.data?.matchedFunds).toBeDefined();
      expect(result.data?.userProfile.founderType).toBe("청년");
    } else {
      // API 키가 없으면 에러 반환이 예상됨
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe("POLICY_FUND_FAILED");
    }
  });

  it.skipIf(!hasApiKey)("should return funds when API key is set", async () => {
    const result = await recommendPolicyFunds(
      "카페",
      "예비창업",
      "서울",
      "청년",
      28
    );

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.matchedFunds.length).toBeGreaterThanOrEqual(0);
  });

  it.skipIf(!hasApiKey)("should filter by founder type", async () => {
    const result = await recommendPolicyFunds(
      "음식점",
      "초기창업",
      "부산",
      "중장년",
      50
    );

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.userProfile.founderType).toBe("중장년");
  });

  it.skipIf(!hasApiKey)("should work with female founder type", async () => {
    const result = await recommendPolicyFunds(
      "미용실",
      "예비창업",
      "서울",
      "여성"
    );

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.userProfile.founderType).toBe("여성");
  });
});
