import { z } from "zod/v4";

const sendEmailSchema = z.object({
    to: z.array(z.string()).describe("email addresses"),
    subject: z.string(),
    body: z.string(),
    cc: z.array(z.string()).optional(),
})

export default sendEmailSchema