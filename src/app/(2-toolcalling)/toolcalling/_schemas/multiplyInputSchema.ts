import z from "zod"

const multiplyInputSchema = z.object({
    a: z.number(),
    b: z.number(),
})

export default multiplyInputSchema