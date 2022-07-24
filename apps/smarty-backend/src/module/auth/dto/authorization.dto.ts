export class AuthorizationRequestDTO {
  readonly response_type: string;
  readonly client_id: string;
  readonly redirect_uri: string;
  readonly state: string;
  readonly user_locale: string;
}
