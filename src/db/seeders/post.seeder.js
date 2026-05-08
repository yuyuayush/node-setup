import { faker } from "@faker-js/faker";
import Post from "../../models/post.model.js";
import Image from "../../models/image.model.js";
import User from "../../models/userModel.js";
import logger from "../../config/logger.js";

export const seedPosts = async (count = 30) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            logger.warn("No users found. Skipping post seeding.");
            return;
        }

        logger.info(`Seeding ${count} posts...`);

        const posts = [];
        for (let i = 0; i < count; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            
            // Create a mock image record first
            const imageUrl = faker.image.url();
            const image = await Image.create({
                mobileUrl: imageUrl,
                mobileKey: `mock/${faker.string.uuid()}`,
                laptopUrl: imageUrl,
                laptopKey: `mock/${faker.string.uuid()}`,
                desktopUrl: imageUrl,
                desktopKey: `mock/${faker.string.uuid()}`,
                owner: randomUser._id
            });

            posts.push({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                image: image._id,
                author: randomUser._id,
                createdAt: faker.date.past()
            });
        }

        await Post.create(posts);
        logger.info("Posts and images seeded successfully!");
    } catch (error) {
        logger.error("Error seeding posts:", error);
    }
};
