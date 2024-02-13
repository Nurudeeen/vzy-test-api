import { Controller, Post, Body, Res, HttpStatus, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';

@Controller('stripe/webhook')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleWebhookEvent(
    @Body() payload: any,
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    try {
      if (!signature) {
        return res.status(HttpStatus.UNAUTHORIZED).send('Stripe signature missing');
      }
      
      const rawPayload = req.rawBody
     
      const isSignatureValid = await this.stripeService.verifyWebhookSignature(rawPayload, signature);
    
      if (!isSignatureValid) {
        return res.status(HttpStatus.UNAUTHORIZED).send('Invalid Stripe signature');
      }

      if (payload.type === 'payment_intent.succeeded') {
        const paymentIntent = payload.data.object;
        const customerId = paymentIntent.customer;

        await this.stripeService.updateUserStatus(customerId);

        return res.status(HttpStatus.OK).send('Payment succeeded');
      }

      return res.status(HttpStatus.OK).send('Event handled');
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error handling webhook event');
    }
  }
}
