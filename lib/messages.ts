// Shared shape for contact-form messages. Stored on the server at
// DATA_DIR/contact-messages.json, read from the dashboard inbox.

export type ContactMessage = {
  id: string;
  ts: string;
  name: string;
  email: string;
  phone: string;
  countryIso: string;
  service: string;
  description: string;
  read: boolean;
};

export type ContactInput = {
  name: string;
  email: string;
  countryIso: string;
  phone: string;
  service: string;
  description: string;
};
