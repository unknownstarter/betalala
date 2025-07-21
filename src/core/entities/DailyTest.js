export class DailyTest {
  constructor({
    id,
    userId,
    date,
    mileageUpdateImageUrl,
    creditEarnedImageUrl,
    completedAt,
    createdAt
  }) {
    this.id = id;
    this.userId = userId;
    this.date = date;
    this.mileageUpdateImageUrl = mileageUpdateImageUrl;
    this.creditEarnedImageUrl = creditEarnedImageUrl;
    this.completedAt = completedAt;
    this.createdAt = createdAt;
  }

  static fromJson(json) {
    return new DailyTest({
      id: json.id,
      userId: json.user_id,
      date: json.date,
      mileageUpdateImageUrl: json.mileage_update_image_url,
      creditEarnedImageUrl: json.credit_earned_image_url,
      completedAt: json.completed_at,
      createdAt: json.created_at
    });
  }

  toJson() {
    return {
      id: this.id,
      user_id: this.userId,
      date: this.date,
      mileage_update_image_url: this.mileageUpdateImageUrl,
      credit_earned_image_url: this.creditEarnedImageUrl,
      completed_at: this.completedAt,
      created_at: this.createdAt
    };
  }
} 