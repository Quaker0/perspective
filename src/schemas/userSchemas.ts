import { z, type TypeOf } from 'zod';

export const createUserSchema = z.object({
    body: z
        .object({
            name: z.string({ required_error: 'Name is required' }),
            email: z.string({ required_error: 'Email is required' }).email('Not a valid email'),
        })
        .strict(),
});

export type CreateUserBody = TypeOf<typeof createUserSchema.shape.body>;

export const getUsersSchema = z.object({
    query: z
        .object({
            created: z.enum(['asc', 'desc'], { message: 'Invalid sorting order' }).optional(),
        })
        .strict(),
});
export type GetUsersQuery = z.infer<typeof getUsersSchema.shape.query>;
