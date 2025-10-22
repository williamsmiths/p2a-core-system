import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

/**
 * Email Service - Xử lý gửi email
 * Sử dụng Nodemailer với SMTP
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  /**
   * Khởi tạo SMTP transporter
   */
  private initializeTransporter() {
    const mailConfig = this.configService.get('mail');

    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: mailConfig.auth,
    });

    // Verify connection
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Email transporter verification failed', error);
      } else {
        this.logger.log('Email transporter is ready');
      }
    });
  }

  /**
   * Gửi email xác thực tài khoản
   */
  async sendVerificationEmail(email: string, fullName: string, token: string): Promise<void> {
    const mailConfig = this.configService.get('mail');
    const verificationUrl = `${mailConfig.verificationUrl}?token=${token}`;

    const htmlContent = this.getVerificationEmailTemplate(fullName, verificationUrl);

    try {
      await this.transporter.sendMail({
        from: `"${mailConfig.from.name}" <${mailConfig.from.email}>`,
        to: email,
        subject: 'Xác thực tài khoản P2A ASEAN',
        html: htmlContent,
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw error;
    }
  }

  /**
   * Gửi email chào mừng sau khi xác thực thành công
   */
  async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    const mailConfig = this.configService.get('mail');
    const htmlContent = this.getWelcomeEmailTemplate(fullName);

    try {
      await this.transporter.sendMail({
        from: `"${mailConfig.from.name}" <${mailConfig.from.email}>`,
        to: email,
        subject: 'Chào mừng đến với P2A ASEAN!',
        html: htmlContent,
      });

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
      // Không throw error vì email chào mừng không quan trọng bằng email xác thực
    }
  }

  /**
   * Gửi email reset mật khẩu
   */
  async sendPasswordResetEmail(email: string, fullName: string, token: string): Promise<void> {
    const mailConfig = this.configService.get('mail');
    const appUrl = this.configService.get('app.url');
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    const htmlContent = this.getPasswordResetEmailTemplate(fullName, resetUrl);

    try {
      await this.transporter.sendMail({
        from: `"${mailConfig.from.name}" <${mailConfig.from.email}>`,
        to: email,
        subject: 'Đặt lại mật khẩu P2A ASEAN',
        html: htmlContent,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      throw error;
    }
  }

  /**
   * Template email xác thực
   */
  private getVerificationEmailTemplate(fullName: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 P2A ASEAN Platform</h1>
            </div>
            <div class="content">
              <h2>Xin chào ${fullName}!</h2>
              <p>Cảm ơn bạn đã đăng ký tài khoản tại P2A ASEAN Platform.</p>
              <p>Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Xác thực Email</a>
              </div>
              <p>Hoặc copy link sau vào trình duyệt:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
              <p><strong>Lưu ý:</strong> Link này sẽ hết hạn sau 24 giờ.</p>
              <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
            </div>
            <div class="footer">
              <p>© 2025 P2A ASEAN Platform. All rights reserved.</p>
              <p>Email này được gửi tự động, vui lòng không reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template email chào mừng
   */
  private getWelcomeEmailTemplate(fullName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Chào mừng đến với P2A ASEAN!</h1>
            </div>
            <div class="content">
              <h2>Xin chào ${fullName}!</h2>
              <p>Tài khoản của bạn đã được xác thực thành công!</p>
              <p>Bạn đã sẵn sàng khám phá các tính năng của P2A ASEAN Platform:</p>
              <ul>
                <li>🎓 Tìm kiếm cơ hội học tập và trao đổi sinh viên</li>
                <li>💼 Khám phá việc làm và thực tập</li>
                <li>🔬 Kết nối với các dự án nghiên cứu</li>
                <li>🚀 Tìm hiểu về hệ sinh thái khởi nghiệp</li>
              </ul>
              <p>Chúc bạn có trải nghiệm tuyệt vời!</p>
            </div>
            <div class="footer">
              <p>© 2025 P2A ASEAN Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template email reset mật khẩu
   */
  private getPasswordResetEmailTemplate(fullName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Đặt lại mật khẩu</h1>
            </div>
            <div class="content">
              <h2>Xin chào ${fullName}!</h2>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
              <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
              </div>
              <p>Hoặc copy link sau vào trình duyệt:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              <p><strong>Lưu ý:</strong> Link này sẽ hết hạn sau 1 giờ.</p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
            <div class="footer">
              <p>© 2025 P2A ASEAN Platform. All rights reserved.</p>
              <p>Email này được gửi tự động, vui lòng không reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

