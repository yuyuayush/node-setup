import { faker } from "@faker-js/faker"
import logger from "../../config/logger.js"
import Product from "../../models/product.model.js"

const generateProducts = () =>{
    return{
        name:faker.commerce.product(),
        description:faker.commerce.productDescription(),
        price:faker.commerce.price(),
        images:[faker.image.url()],
    }
}

export const seedProducts = async(count=10)=>{
try{
    logger.info(`Seeding ${count} products...`)

    const products = Array.from({length:count},()=>generateProducts())
    await Product.create(products)

    logger.info(`
    
    Products seeded successfully`)
}catch(error){
    logger.error("Error seeding products:",error)
}


}
