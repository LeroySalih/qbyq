"use server"

import { revalidatePath } from "next/cache"

export const refreshCache = (path : string): void => {
    return revalidatePath(path);
}

