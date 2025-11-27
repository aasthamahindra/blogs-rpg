import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PubSub } from 'graphql-subscriptions'
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// in-memory PubSub for subscriptions
const pubsub = new PubSub();

const POST_CREATED = 'POST_CREATED';

function generateToken(user) {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '12h' });
}

export default {
    Query: {
        me: async (_, __, context) => {
            const { user } = context;
            if (!user) throw new Error('Not authenticated');
            return prisma.user.findUnique({ where: { id: user.id } });
        },
        posts: async () => {
            return prisma.post.findMany({
                include: { author: true },
                orderBy: { createdAt: 'desc' },
            });
        },
        post: async (_, { id }) => {
            return prisma.post.findUnique({
                where: { id: parseInt(id) },
                include: { author: true },
            });
        },
    },

    Mutation: {
        register: async (_, { name, email, password }) => {
            const userEmail = await prisma.user.findUnique({ where: { email }});
            if (userEmail) {
                throw new Error('User already exists!')
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword }
            });
            const token = generateToken(user);
            return { token, user };
        },

        login: async (_, { email, password }) => {
            const user = await prisma.user.findUnique({ where: { email }});
            if (!user) throw new Error ('No user found!');
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Invalid password');
            const token = generateToken(user);
            return { token, user };
        },

        createPost: async (_, { title, content }, context) => {
            const { user } = context;
            if (!user) throw new Error('Not authenticated');
            const post = await prisma.post.create({
                data: {
                    content,
                    title,
                    authorId: user.id,
                },
                include: { author: true },
            });
            // normalize createdAt to ISO for consistent client parsing
            const normalized = {
                ...post,
                createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
            };
            // notify subscribers
            pubsub.publish(POST_CREATED, { postCreated: normalized });
            return normalized;
        },
    },

    // Field resolvers to normalize Date -> ISO strings
    Post: {
        createdAt: (parent) =>
            parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt,
    },
    User: {
        createdAt: (parent) =>
            parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt,
    },

    Subscription: {
        postCreated: {
            subscribe: () => {
                if (typeof pubsub.asyncIterator === 'function') {
                    try {
                        return pubsub.asyncIterator([POST_CREATED]);
                    } catch {
                        return pubsub.asyncIterator(POST_CREATED);
                    }
                }
                if (typeof pubsub.asyncIterableIterator === 'function') {
                    return pubsub.asyncIterableIterator([POST_CREATED]);
                }
                throw new Error('PubSub does not support async iterator');
            },
        },
    },
};