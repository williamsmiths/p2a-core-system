# P2A ASEAN Core System Module
Chắc chắn rồi. Dưới đây là phân tích chi tiết về `enum` cho các vai trò người dùng (roles), cách tổ chức chúng, và giải thích vai trò của từng role trong mỗi module chức năng của dự án.

### Phần 1: Enum Tổng hợp cho Toàn bộ Hệ thống

Cách tiếp cận tốt nhất và được khuyến nghị là sử dụng **một `enum` duy nhất** để định nghĩa tất cả các vai trò có thể có trong hệ thống. Điều này giúp quản lý tập trung, đảm bảo tính nhất quán và dễ dàng cho việc phân quyền.

Mỗi người dùng trong cơ sở dữ liệu sẽ được gán **một và chỉ một** vai trò từ `enum` này.

**File: `src/common/enums/user-role.enum.ts`**
```typescript
export enum UserRole {
  /**
   * Quản trị viên tối cao của hệ thống P2A.
   * Có quyền truy cập mọi thứ, đặc biệt là các dashboard quản trị và duyệt nội dung.
   */
  ADMIN = 'admin',

  /**
   * Đại diện cho một trường Đại học.
   * Chịu trách nhiệm đăng tải thông tin về trường, khóa học, chương trình trao đổi.
   */
  UNIVERSITY = 'university',

  /**
   * Đại diện cho một Doanh nghiệp/Nhà tuyển dụng.
   * Chịu trách nhiệm đăng hồ sơ công ty, tin tuyển dụng, tin thực tập.
   */
  COMPANY = 'company',

  /**
   * Vai trò dành cho sinh viên đang theo học.
   * Tập trung vào việc tìm kiếm thực tập, việc làm, khóa học và dự án nghiên cứu.
   */
  STUDENT = 'student',

  /**
   * Vai trò dành cho cựu sinh viên.
   * Có thể hoạt động như một cá nhân tìm việc, hoặc đại diện cho doanh nghiệp của mình.
   * Có các tính năng đặc biệt liên quan đến mạng lưới cựu sinh viên.
   */
  ALUMNI = 'alumni',

  /**
   * Vai trò dành cho các nhà nghiên cứu, giảng viên.
   * Tập trung vào việc đăng tải, tìm kiếm dự án nghiên cứu và kết nối học thuật.
   */
  RESEARCHER = 'researcher',

  /**
   * Đại diện cho một công ty khởi nghiệp.
   * Chịu trách nhiệm đăng hồ sơ startup để kêu gọi vốn hoặc tìm kiếm cố vấn.
   */
  STARTUP = 'startup',
}
```

**Tại sao chỉ dùng một Enum?**
*   **Tính duy nhất (Single Source of Truth):** Tất cả các vai trò được định nghĩa ở một nơi duy nhất, tránh sự nhầm lẫn và không nhất quán.
*   **Dễ quản lý DB:** Cột `role` trong bảng `users` chỉ cần tham chiếu đến một `enum` này.
*   **Linh hoạt trong phân quyền:** Trong code NestJS, bạn có thể dễ dàng tạo các Guard (bộ bảo vệ) để kiểm tra: "Hành động này có được phép cho `UserRole.ADMIN` hoặc `UserRole.UNIVERSITY` không?".

---

### Phần 2: Giải thích Vai trò (Roles) trong Từng Module

Dưới đây là bảng phân tích chi tiết về vai trò và quyền hạn của từng `enum` member trong mỗi module chức năng.

#### **Module 0: Hệ thống Lõi & Quản lý Người dùng (Core System)**
Đây là module nền tảng, nơi các vai trò được khởi tạo và quản lý.

| Vai trò (Role) | Enum Value | Mô tả vai trò trong Module này |
| :--- | :--- | :--- |
| **Khách (Chưa đăng nhập)** | (Không có) | Có thể thực hiện hành động **Đăng ký** để nhận một vai trò cụ thể. |
| **Tất cả các vai trò** | `ADMIN`, `UNIVERSITY`, `COMPANY`, `STUDENT`, `ALUMNI`, `RESEARCHER`, `STARTUP` | Có thể **Đăng nhập/Đăng xuất**. Có thể **Quản lý hồ sơ cơ bản** của chính mình (đổi mật khẩu, ảnh đại diện). |
| **Quản trị viên** | `ADMIN` | Có quyền truy cập **Admin Dashboard** để xem, khóa, hoặc chỉnh sửa thông tin/quyền của bất kỳ người dùng nào khác. |

#### **Module 2: Career (Việc làm & Thực tập)**
Module này có sự tương tác phức tạp giữa các bên cung (Doanh nghiệp) và cầu (Sinh viên/Cá nhân), với sự giám sát của Admin.

| Vai trò (Role) | Enum Value | Mô tả vai trò trong Module này |
| :--- | :--- | :--- |
| **Doanh nghiệp** | `COMPANY` | **Người cung cấp cơ hội:** Đăng và quản lý hồ sơ công ty, đăng tin tuyển dụng (Job) và thực tập (Internship), xem danh sách ứng viên. |
| **Cựu sinh viên** | `ALUMNI` | **Người cung cấp cơ hội (đặc biệt):** Có thể hành động như `COMPANY` nhưng có thêm tùy chọn ưu tiên cho trường cũ. |
| **Sinh viên** | `STUDENT` | **Người tìm kiếm cơ hội:** Tạo CV, tìm kiếm, lọc và nộp hồ sơ ứng tuyển vào Jobs/Internships. |
| **Nhà nghiên cứu** | `RESEARCHER` | **Người tìm kiếm cơ hội:** Tương tự `STUDENT`, có thể tìm kiếm các vị trí công việc phù hợp. |
| **Quản trị viên** | `ADMIN` | **Người kiểm duyệt:** Duyệt (approve/reject) các tin đăng **Internship** để đảm bảo chất lượng. |

#### **Module 3: Education (Giáo dục & Đào tạo)**
Module này là sân chơi chính của các trường Đại học để quảng bá và kết nối.

| Vai trò (Role) | Enum Value | Mô tả vai trò trong Module này |
| :--- | :--- | :--- |
| **Đại học** | `UNIVERSITY` | **Người cung cấp thông tin:** Tạo và quản lý hồ sơ trường, đăng tải thông tin về khóa học, chương trình trao đổi, và các "Skill course". |
| **Sinh viên** | `STUDENT` | **Người tiêu thụ thông tin:** Tìm kiếm, so sánh các trường/khóa học. Truy cập các "Skill course" thông qua SSO. |
| **Các vai trò khác** | `ALUMNI`, `RESEARCHER`, `GUEST` | Tương tự `STUDENT`, có quyền xem và tìm kiếm thông tin giáo dục công khai. |

#### **Module 4: Research (Nghiên cứu)**
Không gian dành riêng cho cộng đồng học thuật.

| Vai trò (Role) | Enum Value | Mô tả vai trò trong Module này |
| :--- | :--- | :--- |
| **Nhà nghiên cứu** | `RESEARCHER` | **Người tạo và tìm kiếm dự án:** Đăng tải dự án nghiên cứu để tìm cộng tác viên, hoặc tìm kiếm các dự án khác để tham gia. |
| **Đại học** | `UNIVERSITY` | **Tổ chức bảo trợ:** Có thể đăng tải các dự án nghiên cứu lớn của trường, đăng thông tin về các hội thảo khoa học. |
| **Quản trị viên** | `ADMIN` | **Người hỗ trợ:** Có thể giúp các trường đăng tải thông tin về hội thảo. |
| **Sinh viên / Cựu SV** | `STUDENT`, `ALUMNI` | **Người tham gia:** Tìm kiếm các dự án nghiên cứu để xin làm trợ lý hoặc tìm kiếm hội thảo để tham dự. |

#### **Module 5: Business (Trung tâm Khởi nghiệp)**
Hệ sinh thái kết nối Startup với các nguồn lực.

| Vai trò (Role) | Enum Value | Mô tả vai trò trong Module này |
| :--- | :--- | :--- |
| **Startup** | `STARTUP` | **Bên cần hỗ trợ:** Tạo và quản lý hồ sơ startup, trình bày sản phẩm/dịch vụ để kêu gọi vốn hoặc tìm kiếm cố vấn. |
| **Doanh nghiệp** | `COMPANY` | **Nhà đầu tư/Cố vấn tiềm năng:** Tìm kiếm, lọc và liên hệ với các startup để đầu tư hoặc hợp tác. |
| **Cựu sinh viên / Nhà NC** | `ALUMNI`, `RESEARCHER` | **Nhà đầu tư/Cố vấn tiềm năng:** Tương tự `COMPANY`, có thể đóng vai trò là nhà đầu tư thiên thần hoặc cố vấn chuyên môn. |

### Phần 3: Ví dụ triển khai Phân quyền trong NestJS

Để áp dụng `UserRole` enum này, bạn sẽ tạo một `RolesGuard` và một decorator `@Roles`.

**1. Decorator: `src/auth/decorators/roles.decorator.ts`**
```typescript
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

**2. Guard: `src/auth/guards/roles.guard.ts`**
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Nếu không yêu cầu role, cho phép truy cập
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

**3. Áp dụng trên Controller:**
```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('internships')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guard xác thực và guard phân quyền
export class InternshipController {

  // Chỉ ADMIN mới có quyền truy cập endpoint này
  @Post(':id/approve')
  @Roles(UserRole.ADMIN)
  approveInternship(/*...*/) {
    // logic phê duyệt internship
  }

  // Chỉ COMPANY và ALUMNI mới có quyền đăng tin
  @Post()
  @Roles(UserRole.COMPANY, UserRole.ALUMNI)
  createInternship(/*...*/) {
    // logic tạo internship
  }
}
```