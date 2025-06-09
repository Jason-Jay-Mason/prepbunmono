export type ReCaptchaVerifyResponse = {
  success: boolean;
  challenge_ts: string; // ISO format timestamp
  hostname?: string; // For web requests
  apk_package_name?: string; // For Android requests
  score: number; // For v3 requests
  action?: string; // For v3 requests
  "error-codes"?: Array<
    | "missing-input-secret"
    | "invalid-input-secret"
    | "missing-input-response"
    | "invalid-input-response"
    | "bad-request"
    | "timeout-or-duplicate"
  >;
};

export type Verify = (token: string) => Promise<ReCaptchaVerifyResponse>;

export type RecaptchaToken = string;
