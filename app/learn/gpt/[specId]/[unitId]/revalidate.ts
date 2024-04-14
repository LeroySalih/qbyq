"use server"

import {revalidatePath} from "next/cache";

const clearCache = async () => {
    revalidatePath("/");
}

export default clearCache;