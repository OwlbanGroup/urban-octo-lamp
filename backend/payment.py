import stripe
from fastapi import APIRouter, HTTPException, Depends
from backend.auth import get_current_user
from backend.models import User, Subscription
from backend.database import SessionLocal
from sqlalchemy.orm import Session
from pydantic import BaseModel

stripe.api_key = "your-stripe-secret-key"  # Replace with your Stripe secret key

router = APIRouter()

class CreateCheckoutSessionRequest(BaseModel):
    price_id: str  # Stripe price ID for the subscription plan

@router.post("/create-checkout-session")
async def create_checkout_session(request: CreateCheckoutSessionRequest, current_user: dict = Depends(get_current_user)):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": request.price_id, "quantity": 1}],
            success_url="https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://yourdomain.com/cancel",
            customer_email=current_user["email"],
        )
        return {"checkout_url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = "your-stripe-webhook-secret"  # Replace with your webhook secret

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session.get("customer_email")
        subscription_id = session.get("subscription")

        db: Session = SessionLocal()
        user = db.query(User).filter(User.email == customer_email).first()
        if user:
            user.is_subscribed = True
            # Optionally store subscription_id or update subscription info
            db.commit()
        db.close()

    return {"status": "success"}
