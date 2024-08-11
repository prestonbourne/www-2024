
export const makeAPIResponse = (message: string, status: number, error?: string): Response =>{
    const response = {
        message,
    };
    if (error) {
        return Response.json({ ...response, error }, { status });
    }

    return Response.json(response, { status });
}