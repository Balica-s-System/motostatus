interface IdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: "signin" | "signup" | "use";
  state_cookie_domain?: string;
  native_callback?: (...args: unknown[]) => void;
  nonce?: string;
  prompt_parent_id?: string;
  intermediate_iframe_close_callback?: (...args: unknown[]) => void;
  ux_mode?: "popup" | "redirect";
  allowed_parent_origin?: string | string[];
  login_uri?: string;
}

interface CredentialResponse {
  credential: string;
  select_by?:
    | "auto"
    | "user"
    | "user_1tap"
    | "user_2tap"
    | "btn"
    | "btn_confirm"
    | "btn_add_session"
    | "btn_confirm_add_session";
}

interface GoogleAccountsId {
  initialize: (config: IdConfiguration) => void;
  prompt: (listener?: (notification: PromptMomentNotification) => void) => void;
  renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
  disableAutoSelect: () => void;
  storeCredential: (
    credential: CredentialResponse["credential"],
    callback?: () => void,
  ) => void;
  cancel: () => void;
  onGoogleLibraryLoad: () => void;
  revoke: (hint: string, callback?: (done: boolean) => void) => void;
}

interface GsiButtonConfiguration {
  type: "standard" | "icon";
  shape?: "rectangular" | "pill" | "circle" | "square";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  logo_alignment?: "left" | "center";
  width?: number | string;
  locale?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () =>
    | "browser_not_supported"
    | "invalid_client"
    | "missing_client_id"
    | "opt_out_or_no_session"
    | "secure_http_required"
    | "suppressed_by_user"
    | "unregistered_origin"
    | "unknown_reason";
  isSkippedMoment: () => boolean;
  getSkippedReason: () =>
    | "auto_cancel"
    | "user_cancel"
    | "tap_outside"
    | "issuing_failed";
  isDismissedMoment: () => boolean;
  getDismissedReason: () =>
    | "credential_returned"
    | "cancel_called"
    | "flow_restarted";
  getMomentType: () => string;
}

interface Window {
  google?: {
    accounts: {
      id: GoogleAccountsId;
    };
  };
}
