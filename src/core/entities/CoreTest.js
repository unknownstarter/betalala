export class CoreTest {
  constructor({
    id,
    userId,
    step,
    fileUrl,
    completedAt,
    createdAt
  }) {
    this.id = id;
    this.userId = userId;
    this.step = step;
    this.fileUrl = fileUrl;
    this.completedAt = completedAt;
    this.createdAt = createdAt;
  }

  static fromJson(json) {
    return new CoreTest({
      id: json.id,
      userId: json.user_id,
      step: json.step,
      fileUrl: json.file_url,
      completedAt: json.completed_at,
      createdAt: json.created_at
    });
  }

  toJson() {
    return {
      id: this.id,
      user_id: this.userId,
      step: this.step,
      file_url: this.fileUrl,
      completed_at: this.completedAt,
      created_at: this.createdAt
    };
  }
}

export const CORE_TEST_STEPS = {
  SIGNUP: 'signup',
  EV_CONNECT: 'ev_connect',
  UPDATE: 'update',
  CREDIT: 'credit',
  NFT: 'nft'
};

export const CORE_TEST_STEP_LABELS = {
  [CORE_TEST_STEPS.SIGNUP]: '리사이클팜 앱 회원가입 및 전화번호 인증',
  [CORE_TEST_STEPS.EV_CONNECT]: '테슬라 차량 연동 화면 인증',
  [CORE_TEST_STEPS.UPDATE]: 'EV 주행거리 업데이트 성공 화면',
  [CORE_TEST_STEPS.CREDIT]: '크레딧 획득 UI 인증',
  [CORE_TEST_STEPS.NFT]: 'NFT 민팅 성공 화면 인증'
}; 