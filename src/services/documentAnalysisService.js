// src/services/documentAnalysisService.js

import { claudeService } from './claudeService';
import './documentAnalysisService.css'

export const analyzeDocument = async (file, documentType) => {
      try {
            const base64Content = await convertFileToBase64(file);

            // 문서 유형에 따른 분석 프롬프트 설정
            const analysisPrompts = {
                  buildingRegistry: `이 건물 등기부등본을 분석하여 다음 사항을 확인해주세요:
1. 소유권 관련 위험 신호
2. 근저당권 설정 현황
3. 압류/가압류 여부
4. 전세권 설정 가능 여부
5. 소유권 이전 이력의 특이사항
6. 사기 위험 판단 및 구체적 이유
7. 안전한 거래를 위한 권장사항`,

                  realEstateRegistry: `이 부동산 등기부등본을 분석하여 다음 사항을 확인해주세요:
1. 부동산의 기본 정보 확인
2. 소유권 관련 문제점
3. 제한물권 설정 현황
4. 임대차 관련 권리관계
5. 잠재적 위험 요소
6. 전세권 설정 가능성
7. 권장 확인 사항`,

                  dateVerification: `이 날짜 증명서를 분석하여 다음 사항을 확인해주세요:
1. 국세 체납 여부
2. 시기별 납부 이력
3. 특이사항 및 위험 신호
4. 추가 확인이 필요한 사항`,

                  localTaxPayment: `이 지방세 납부 증명서를 분석하여 다음 사항을 확인해주세요:
1. 지방세 체납 여부
2. 납부 이력의 특이사항
3. 체납 위험 신호
4. 추가 확인이 필요한 부분`
            };

            // Claude API에 문서 분석 요청
            const analysisResponse = await claudeService.sendMessage({
                  messages: [
                        {
                              role: "system",
                              content: "You are a real estate document analysis expert specialized in detecting lease fraud risks."
                        },
                        {
                              role: "user",
                              content: [
                                    {
                                          type: "text",
                                          text: analysisPrompts[documentType]
                                    },
                                    {
                                          type: "image",
                                          source: {
                                                type: "base64",
                                                media_type: file.type,
                                                data: base64Content.split(',')[1]
                                          }
                                    }
                              ]
                        }
                  ]
            });

            return analysisResponse;
      } catch (error) {
            throw new Error(`문서 분석 중 오류가 발생했습니다: ${error.message}`);
      }
};
