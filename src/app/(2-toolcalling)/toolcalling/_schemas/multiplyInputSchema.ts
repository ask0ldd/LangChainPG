import z from "zod"

const multiplyInputSchema = z.object({
    a: z.number().describe('First number to be multiplied'),
    b: z.number().describe('Second number to be multiplied'),
})

export default multiplyInputSchema