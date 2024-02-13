import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { UsersService } from 'src/users/user.service';
import { PaymentPageDto } from './dto/payment-page-dto';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly userService: UsersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async verifyWebhookSignature(payload, signature: string): Promise<boolean> {
    try {
      console.log(process.env.STRIPE_WEBHOOK_SECRET)
      const event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
      return true;
    } catch (error) {
      console.log(error.message)
      return false;
    }
  }

  async updateUserStatus(customerId: string): Promise<void> {
    try {
      const user = await this.userService.findByCustomerId(customerId);
      if (user) {
        user.status = 'paid';
        await user.save();
      }
    } catch (error) {
      throw new Error('Failed to update user status');
    }
  }

  async createPaymentPage(paymentPageDto: PaymentPageDto, customerId: string): Promise<string> {
    try {
        const paymentPage = await this.stripe.checkout.sessions.create({
           payment_method_types: ['card'],
           line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: paymentPageDto.description,
                },
                unit_amount: 100,
                
              },
              quantity: 200,
            },
          ],
          mode: 'payment',
          customer: customerId,
          metadata: {
            id: customerId
          },
          success_url: 'http://localhost:3000'
        });
  
        return paymentPage.url;
      } catch (error) {
        // Handle error
        console.log(error)
        throw new Error('Failed to create payment page');
      }
  }
  
}
