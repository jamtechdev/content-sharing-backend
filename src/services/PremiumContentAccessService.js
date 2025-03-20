const ContentRepository = require('../repositories/ContentRepository');
const PremiumContentAccessRepository = require('../repositories/PremiumContentAccessRepository');
const UserService = require('./UserService');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const StripeRepository = require('../repositories/StripeRepository')


class PremiumContentAccessService {
    async createPremiumContentAccess(contentId, data){
        const premiumContent = await PremiumContentAccessRepository.getByContentAndUser(contentId, data.id)
        if(premiumContent){
            return {code: "ERR409", message: "Already purchased the content"}
        }
        const content = await ContentRepository.getContentById(contentId);
        if(!content){
            return {code: "ERR404", message: "No content found"}
        }
        const priceInDollars = parseFloat(content.price);
        const unitAmount = Math.round(priceInDollars * 100);

        console.log("Going to generate session ===========>")
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: content.title,
                            description: content.description
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                }
            ],
            success_url: `https://reinarancy.com/my`,
            cancel_url: `https://reinarancy.com/my/cancel`,
            // success_url: `https://reinarancy.com/my/success?session_id={CHECKOUT_SESSION_ID}`,
            // cancel_url: `https://reinarancy.com/my/cancel`,

            customer_email: data.email,
            metadata: {
                buyer_id: data?.id,
                model_id: 5
            },
            allow_promotion_codes: true,
            billing_address_collection: "required",
        })
        console.log("Session generated =====>", session)
        const result = {
            sessionId: session.id,
            publicKey: process.env.STRIPE_PUBLIC_KEY,
          }; 
          console.log("service result================>", result)  


        //   const saveSessionData = {
        //     // stripe_session_id: session.id,
        //     buyer_id: data.id,
        //     model_id: 5,
        //     content_id: contentId,
        //     price: 599,
        //     // status: session?.status === "complete" ? "active" : session?.status,
        //     payment_mode: "card",
        //     // stripe_raw_data: session,
        //   };
        //     await StripeRepository.saveSessionForPremiumContentAccess(saveSessionData);
        
          return result;
    }

    async getPremiumContentAccessById(id){
        return await PremiumContentAccessRepository.getById(id);
    }

    async getPremiumContentAccessAll(id){
        return await PremiumContentAccessRepository.getAll();
    }
}


module.exports = new PremiumContentAccessService()