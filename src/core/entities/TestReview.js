export class TestReview {
  constructor({
    id,
    userId,
    userEmail,
    testType, // 'core' | 'daily'
    status = 'pending', // 'pending' | 'approved' | 'rejected'
    submittedAt,
    reviewedAt,
    reviewedBy,
    reviewComment,
    files = []
  }) {
    this.id = id;
    this.userId = userId;
    this.userEmail = userEmail;
    this.testType = testType;
    this.status = status;
    this.submittedAt = submittedAt;
    this.reviewedAt = reviewedAt;
    this.reviewedBy = reviewedBy;
    this.reviewComment = reviewComment;
    this.files = files;
  }

  static fromJson(json) {
    return new TestReview({
      id: json.id,
      userId: json.user_id,
      userEmail: json.user_email,
      testType: json.test_type,
      status: json.status || 'pending',
      submittedAt: json.submitted_at,
      reviewedAt: json.reviewed_at,
      reviewedBy: json.reviewed_by,
      reviewComment: json.review_comment,
      files: json.files || []
    });
  }

  toJson() {
    return {
      id: this.id,
      user_id: this.userId,
      user_email: this.userEmail,
      test_type: this.testType,
      status: this.status,
      submitted_at: this.submittedAt,
      reviewed_at: this.reviewedAt,
      reviewed_by: this.reviewedBy,
      review_comment: this.reviewComment,
      files: this.files
    };
  }

  get isPending() {
    return this.status === 'pending';
  }

  get isApproved() {
    return this.status === 'approved';
  }

  get isRejected() {
    return this.status === 'rejected';
  }

  get isCoreTest() {
    return this.testType === 'core';
  }

  get isDailyTest() {
    return this.testType === 'daily';
  }

  get formattedSubmittedAt() {
    if (!this.submittedAt) return '-';
    return new Date(this.submittedAt).toLocaleDateString('ko-KR');
  }

  get formattedReviewedAt() {
    if (!this.reviewedAt) return '-';
    return new Date(this.reviewedAt).toLocaleDateString('ko-KR');
  }

  get statusText() {
    switch (this.status) {
      case 'pending': return '대기 중';
      case 'approved': return '승인됨';
      case 'rejected': return '거부됨';
      default: return '알 수 없음';
    }
  }

  get testTypeText() {
    return this.isCoreTest ? '코어 테스트' : '데일리 테스트';
  }
} 