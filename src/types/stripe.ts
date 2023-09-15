import { RolltopiaBundle } from "./shop";

export interface CreatePaymentIntentProps {
    userId: string;
    bundle: RolltopiaBundle;
}