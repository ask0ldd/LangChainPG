import z from "zod";

const addInputSchema = z.object({
    a: z.number().describe('First number to be added'),
    b: z.number().describe('Second number to be added'),
});

export default addInputSchema