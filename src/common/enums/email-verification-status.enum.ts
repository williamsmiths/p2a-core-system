/**
 * Enum cho trạng thái xác thực email
 */
export enum EmailVerificationStatus {
  /**
   * Email chưa được xác thực
   */
  PENDING = 'pending',

  /**
   * Email đã được xác thực thành công
   */
  VERIFIED = 'verified',

  /**
   * Token xác thực đã hết hạn
   */
  EXPIRED = 'expired',

  /**
   * Đã sử dụng token này rồi
   */
  USED = 'used',
}

