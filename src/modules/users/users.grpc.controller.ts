import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';

/**
 * gRPC Controller cho User Service
 * Expose user data cho các modules khác thông qua gRPC
 */
@Controller()
export class UsersGrpcController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UserService', 'FindById')
  async findById(data: { id: string }) {
    const user = await this.usersService.findById(data.id);
    
    if (!user) {
      throw new Error('User not found');
    }

    return this.transformUserToGrpc(user);
  }

  @GrpcMethod('UserService', 'FindByEmail')
  async findByEmail(data: { email: string }) {
    const user = await this.usersService.findByEmail(data.email);
    
    if (!user) {
      throw new Error('User not found');
    }

    return this.transformUserToGrpc(user);
  }

  @GrpcMethod('UserService', 'ValidateUser')
  async validateUser(data: { id: string }) {
    const user = await this.usersService.findById(data.id);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive || !user.isEmailVerified) {
      throw new Error('User is not active or email not verified');
    }

    return this.transformUserToGrpc(user);
  }

  @GrpcMethod('UserService', 'GetUsersByIds')
  async getUsersByIds(data: { ids: string[] }) {
    const users = await this.usersService.findByIds(data.ids);
    
    return {
      users: users.map(user => this.transformUserToGrpc(user)),
    };
  }

  /**
   * Transform User entity sang gRPC response format
   */
  private transformUserToGrpc(user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.isActive,
      is_email_verified: user.isEmailVerified,
      created_at: user.createdAt ? user.createdAt.toISOString() : '',
      updated_at: user.updatedAt ? user.updatedAt.toISOString() : '',
      profile: user.profile ? {
        full_name: user.profile.fullName || '',
        avatar_url: user.profile.avatarUrl || '',
        phone_number: user.profile.phoneNumber || '',
        country: user.profile.country || '',
        city: user.profile.city || '',
        bio: user.profile.bio || '',
        date_of_birth: user.profile.dateOfBirth ? 
          (user.profile.dateOfBirth instanceof Date ? 
            user.profile.dateOfBirth.toISOString().split('T')[0] : 
            user.profile.dateOfBirth.toString()) : '',
        gender: user.profile.gender || '',
        linkedin_url: user.profile.linkedinUrl || '',
        website_url: user.profile.websiteUrl || '',
      } : null,
    };
  }
}

