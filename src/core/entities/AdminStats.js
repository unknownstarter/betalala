export class AdminStats {
  constructor({
    totalUsers = 0,
    totalCoreTests = 0,
    totalDailyTests = 0,
    pendingTests = 0,
    approvedTests = 0,
    rejectedTests = 0,
    activeUsers = 0,
    inactiveUsers = 0,
    adminUsers = 0,
    regularUsers = 0
  }) {
    this.totalUsers = totalUsers;
    this.totalCoreTests = totalCoreTests;
    this.totalDailyTests = totalDailyTests;
    this.pendingTests = pendingTests;
    this.approvedTests = approvedTests;
    this.rejectedTests = rejectedTests;
    this.activeUsers = activeUsers;
    this.inactiveUsers = inactiveUsers;
    this.adminUsers = adminUsers;
    this.regularUsers = regularUsers;
  }

  static fromJson(json) {
    return new AdminStats({
      totalUsers: json.total_users || 0,
      totalCoreTests: json.total_core_tests || 0,
      totalDailyTests: json.total_daily_tests || 0,
      pendingTests: json.pending_tests || 0,
      approvedTests: json.approved_tests || 0,
      rejectedTests: json.rejected_tests || 0,
      activeUsers: json.active_users || 0,
      inactiveUsers: json.inactive_users || 0,
      adminUsers: json.admin_users || 0,
      regularUsers: json.regular_users || 0
    });
  }

  toJson() {
    return {
      total_users: this.totalUsers,
      total_core_tests: this.totalCoreTests,
      total_daily_tests: this.totalDailyTests,
      pending_tests: this.pendingTests,
      approved_tests: this.approvedTests,
      rejected_tests: this.rejectedTests,
      active_users: this.activeUsers,
      inactive_users: this.inactiveUsers,
      admin_users: this.adminUsers,
      regular_users: this.regularUsers
    };
  }

  get totalTests() {
    return this.totalCoreTests + this.totalDailyTests;
  }

  get approvalRate() {
    if (this.totalTests === 0) return 0;
    return Math.round((this.approvedTests / this.totalTests) * 100);
  }

  get pendingRate() {
    if (this.totalTests === 0) return 0;
    return Math.round((this.pendingTests / this.totalTests) * 100);
  }
} 