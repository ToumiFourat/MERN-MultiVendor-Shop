const sellerModel = require('../../models/sellerModel')
const stripeModel = require('../../models/stripeModel')
const {v4: uuidv4} = require('uuid')
const { responseReturn } = require('../../utiles/response')
const stripe = require ('stripe')('sk_test_51Q5pOLF4md42MzNFfd346XC4Ei7UQAadIsfGlApQRmoY7LTNTKCrkzzrXV7LHegwEVhXjoGd4LnCkQI6dDvDiFAB00dT4MULfg')
class paymentController{
    create_stripe_connect_account = async (req,res) =>{
        const {id} = req
        const uid = uuidv4()

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id })
            if (stripeInfo) {
                await stripeModel.deleteOne({ sellerId: id })
                const account = await stripe.accounts.create({ type: 'express' })

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3001/refresh',
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res,201,{url: accountLink.url})
            }else{
                const account = await stripe.accounts.create({ type: 'express' })

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3001/refresh',
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await stripeModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res,201,{url: accountLink.url})
            }
        } catch (error) {
            console.log('stripe connect account error '+error.message)
            responseReturn(res, 500, { error: error.message }) // Ajoute un retour d'erreur si nécessaire
        }
    }

    //END METHOD

    active_stripe_connect_account = async(req,res) =>{
        const {activeCode} = req.params
        const {id} = req
         try {
            const userStripeInfo = await stripeModel.findOne({code: activeCode})

            if (userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id,{
                    payment: 'active'
                })
                responseReturn(res, 200, {message: 'payment Active'})
            } else {
                responseReturn(res, 404, {message: 'payment Active Fails'})
            }
         } catch (error) {
            responseReturn(res, 500, {message: 'Internal Server Error'})
         }
    }
}

module.exports = new paymentController()