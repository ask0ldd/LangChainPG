import z from "zod";

const addInputSchema = z.object({
    a: z.number(),
    b: z.number(),
});

export default addInputSchema