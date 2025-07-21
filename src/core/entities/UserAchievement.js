export class UserAchievement {
  constructor({
    id,
    userId,
    totalMileage,
    totalCredits,
    consecutiveDays,
    lastDailyTestDate,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.totalMileage = totalMileage;
    this.totalCredits = totalCredits;
    this.consecutiveDays = consecutiveDays;
    this.lastDailyTestDate = lastDailyTestDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json) {
    return new UserAchievement({
      id: json.id,
      userId: json.user_id,
      totalMileage: json.total_mileage,
      totalCredits: json.total_credits,
      consecutiveDays: json.consecutive_days,
      lastDailyTestDate: json.last_daily_test_date,
      createdAt: json.created_at,
      updatedAt: json.updated_at
    });
  }

  toJson() {
    return {
      id: this.id,
      user_id: this.userId,
      total_mileage: this.totalMileage,
      total_credits: this.totalCredits,
      consecutive_days: this.consecutiveDays,
      last_daily_test_date: this.lastDailyTestDate,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }
} 