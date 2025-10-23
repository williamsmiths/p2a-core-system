/**
 * Enum định nghĩa các vai trò người dùng trong hệ thống P2A ASEAN
 * Mỗi người dùng chỉ có một vai trò duy nhất
 */
export enum UserRole {
  /**
   * Quản trị viên tối cao của hệ thống P2A
   * Có quyền truy cập mọi thứ, đặc biệt là các dashboard quản trị và duyệt nội dung
   */
  SUPER_ADMIN = 'super_admin',

  /**
   * Quản trị viên của hệ thống P2A
   * Có quyền quản lý nội dung và người dùng
   */
  ADMIN = 'admin',

  /**
   * Đại diện cho một trường Đại học
   * Chịu trách nhiệm đăng tải thông tin về trường, khóa học, chương trình trao đổi
   */
  UNIVERSITY = 'university',

  /**
   * Đại diện cho một Doanh nghiệp/Nhà tuyển dụng
   * Chịu trách nhiệm đăng hồ sơ công ty, tin tuyển dụng, tin thực tập
   */
  COMPANY = 'company',

  /**
   * Vai trò dành cho sinh viên đang theo học
   * Tập trung vào việc tìm kiếm thực tập, việc làm, khóa học và dự án nghiên cứu
   */
  STUDENT = 'student',

  /**
   * Vai trò dành cho cựu sinh viên
   * Có thể hoạt động như một cá nhân tìm việc, hoặc đại diện cho doanh nghiệp của mình
   * Có các tính năng đặc biệt liên quan đến mạng lưới cựu sinh viên
   */
  ALUMNI = 'alumni',

  /**
   * Vai trò dành cho các nhà nghiên cứu, giảng viên
   * Tập trung vào việc đăng tải, tìm kiếm dự án nghiên cứu và kết nối học thuật
   */
  RESEARCHER = 'researcher',

  /**
   * Đại diện cho một công ty khởi nghiệp
   * Chịu trách nhiệm đăng hồ sơ startup để kêu gọi vốn hoặc tìm kiếm cố vấn
   */
  STARTUP = 'startup',
}

