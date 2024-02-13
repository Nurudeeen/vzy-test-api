// src/users/users.controller.ts
import { Controller, Post, Body, BadRequestException, HttpStatus, UseGuards, Req, Patch } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user-dto';
import { StripeService } from 'src/stripe/stripe.service';
import { PaymentPageDto } from 'src/stripe/dto/payment-page-dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly stripeService: StripeService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    const createdUser = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: createdUser
    };
  }

  @Post('login')
  async login(@Body() loginUserDto): Promise<any> {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload = { email: user.email, id: user.id, customerId: user.customerId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7m' });

    return {
        statusCode: HttpStatus.OK,
        message: 'Login successfull',
        data: { token: accessToken }
      };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    const updatedUser = await this.usersService.updateProfile(userId, updateUserDto);

    return {
        statusCode: HttpStatus.OK,
        message: 'User record updated',
        data: updatedUser
      };
  }

  @Post('payment-page')
  @UseGuards(JwtAuthGuard)

  async createPaymentPage(@Body() paymentPageDto: PaymentPageDto, @Req() req) {
    try {
      const customerId = req.user.customerId;
      const paymentPageUrl = await this.stripeService.createPaymentPage(paymentPageDto, customerId);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Payment page created',
        data:{ url: paymentPageUrl }
      }
    } catch (error) {
      // Handle error
      console.log(error)
      return { message: 'Failed to create payment page', error: error.message };
    }
  }
}
