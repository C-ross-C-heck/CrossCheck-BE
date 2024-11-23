// src/services/promptService.js

const SYSTEM_PROMPT = `당신은 전세사기 방지를 위한 전문 상담 챗봇입니다.

핵심 역할:
1. 전세 계약 과정 전반에 대한 안내
2. 사기 위험 요소 식별 및 경고
3. 법적 권리와 보호 수단 안내
4. 필요한 서류와 확인사항 체크리스트 제공

준수사항:
- 항상 정중하고 전문적인 어조 유지
- 구체적이고 실행 가능한 조언 제공
- 법적 근거 있는 정보 전달
- 불명확한 사항에 대해서는 추가 질문
- 위험 신호 발견 시 명확한 경고
- 공식 확인 절차 권장

전문성:
- 부동산 계약법
- 주택임대차보호법
- 전세사기 패턴
- 법적 구제 절차
- 부동산 거래 실무

상황별 대응:
1. 계약 전 단계
   - 등기부등본 확인 방법
   - 임대인 신분 확인
   - 물건지 현장 확인 사항
   
2. 계약 단계
   - 계약서 필수 조항
   - 특약 조항 검토
   - 가계약금 사기 주의
   
3. 계약 후 단계
   - 잔금 지급 전 확인사항
   - 전입신고 절차
   - 확정일자 취득

4. 위험 상황 발생 시
   - 즉각적인 법적 조치 안내
   - 관련 기관 연락처 제공
   - 증거 수집 방법 안내`;

export class PromptService {
  static getInitialPrompt() {
    return {
      role: "system",
      content: SYSTEM_PROMPT
    };
  }

  static getDocumentVerificationPrompt(documentType) {
    const prompts = {
      contract: `다음 체크리스트에 따라 임대차계약서를 검토해주세요:

1. 필수 기재사항 확인
   - 임대인/임차인 인적사항
   - 대상 물건의 정확한 주소
   - 계약금, 중도금, 잔금 지급 일정
   - 계약기간
   - 양당사자 서명/날인

2. 등기부등본 대조
   - 임대인과 등기부 소유자 일치 여부
   - 근저당권 설정 현황
   - 압류/가압류 등 권리제한 사항

3. 특약사항 검토
   - 원상복구 조항
   - 계약 해지 조건
   - 위험 조항 여부

4. 사기 위험 신호
   - 시세보다 현저히 낮은 금액
   - 급하게 계약을 서두르는 경우
   - 현장 확인을 회피하는 경우`,

      registration: `등기부등본 검토 사항:

1. 소유권 관계
   - 현재 소유자 확인
   - 소유권 이전 이력
   - 공동소유 여부

2. 권리제한 사항
   - 저당권 설정 금액
   - 압류/가압류 존재 여부
   - 전세권 설정 가능 여부

3. 위험 신호
   - 최근 빈번한 소유권 변동
   - 과도한 담보대출
   - 가처분/가등기 존재`,

      id: `신분증 확인사항:

1. 기본 확인
   - 유효기간 확인
   - 사진 일치 여부
   - 훼손/변조 흔적

2. 임대인 정보 대조
   - 등기부등본상 소유자와 일치
   - 계약서 기재 정보와 일치
   - 대리인 경우 위임장 확인`
    };

    return prompts[documentType] || '문서 유형이 지정되지 않았습니다.';
  }

  static getLegalAdvicePrompt(situation) {
    const prompts = {
      preContract: `계약 전 법적 검토사항:

1. 계약당사자 적격성
2. 계약목적물의 권리관계
3. 계약조건의 적법성
4. 보증금 보호 가능 여부
5. 대항력 취득 요건`,

      dispute: `분쟁 발생 시 법적 조치:

1. 즉시 취해야 할 조치
2. 증거 수집 방법
3. 법적 구제 절차
4. 관할 기관 정보
5. 예상 소요 기간 및 비용`
    };

    return prompts[situation] || '상황이 지정되지 않았습니다.';
  }

  static getCustomPrompt(userMessage, context) {
    // 사용자 메시지 분석을 통한 맞춤형 프롬프트 생성
    const keywords = {
      계약서: '계약서 검토',
      등기: '등기부등본 확인',
      전세금: '보증금 안전',
      사기: '사기 위험',
      대출: '대출 관련'
    };

    let customPrompt = '';
    Object.entries(keywords).forEach(([key, value]) => {
      if (userMessage.includes(key)) {
        customPrompt += `${value}와 관련하여 `;
      }
    });

    return customPrompt ? `${customPrompt}자세히 검토하고 조언해주세요.` : '';
  }
}