// import { z } from "zod";
import { Schema } from "mongoose";

export interface IPassword {
    userId: Schema.Types.ObjectId;
    passwordHash: string;
}

// export const passwordSchema: z.ZodType<IPassword> = z.object({
//     userId: z.instanceof(Schema.Types.ObjectId),
//     passwordHash: z.string(),
// });
