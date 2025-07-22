export interface InstagramTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

export interface InstagramProfile {
  id: string;
  username: string;
  account_type?: string;
  media_count?: number;
}
