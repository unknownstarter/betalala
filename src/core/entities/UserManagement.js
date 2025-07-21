export class UserManagement {
  constructor({
    id,
    email,
    role = 'user',
    status = 'active',
    createdAt,
    lastLoginAt,
    testCount = 0,
    coreTestCount = 0,
    dailyTestCount = 0
  }) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
    this.testCount = testCount;
    this.coreTestCount = coreTestCount;
    this.dailyTestCount = dailyTestCount;
  }

  static fromJson(json) {
    return new UserManagement({
      id: json.id,
      email: json.email,
      role: json.role || 'user',
      status: json.status || 'active',
      createdAt: json.created_at,
      lastLoginAt: json.last_login_at,
      testCount: json.test_count || 0,
      coreTestCount: json.core_test_count || 0,
      dailyTestCount: json.daily_test_count || 0
    });
  }

  toJson() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      status: this.status,
      created_at: this.createdAt,
      last_login_at: this.lastLoginAt,
      test_count: this.testCount,
      core_test_count: this.coreTestCount,
      daily_test_count: this.dailyTestCount
    };
  }

  get isAdmin() {
    return this.role === 'admin';
  }

  get isActive() {
    return this.status === 'active';
  }

  get formattedCreatedAt() {
    if (!this.createdAt) return '-';
    return new Date(this.createdAt).toLocaleDateString('ko-KR');
  }

  get formattedLastLogin() {
    if (!this.lastLoginAt) return '-';
    return new Date(this.lastLoginAt).toLocaleDateString('ko-KR');
  }
} 