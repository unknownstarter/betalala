export class User {
  constructor(id, email, role = 'user') {
    this.id = id;
    this.email = email;
    this.role = role;
  }

  static fromJson(json) {
    return new User(
      json.id,
      json.email,
      json.role || 'user'
    );
  }

  toJson() {
    return {
      id: this.id,
      email: this.email,
      role: this.role
    };
  }

  get isAdmin() {
    console.log('User.isAdmin called, role:', this.role);
    return this.role === 'admin';
  }
} 