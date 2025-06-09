import * as React from "react";

interface EmailTemplateProps {
  code: string;
}

export const ConfirmationCodeEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  code,
}) => (
  <div>
    <p>Your Confirmation Code Is:</p>
    <h1>{code}</h1>
  </div>
);
