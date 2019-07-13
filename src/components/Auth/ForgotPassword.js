import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../firebase';

function ForgotPassword() {
  const { firebase } = useContext(FirebaseContext);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(null);

  const handleResetPassword = async () => {
    try {
      await firebase.resetPassword(resetPasswordEmail);
      setPasswordResetError(null);
      setIsPasswordReset(true);
    } catch (error) {
      console.error('Error sending email');
      setPasswordResetError(error.message);
      setIsPasswordReset(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        className="input"
        placeholder="Provide your account email"
        onChange={event => setResetPasswordEmail(event.target.value)}
      />
      <div>
        <button className="button" onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>
      {isPasswordReset && <p>Check your email to reset password</p>}
      {passwordResetError && <p className="error-text">{passwordResetError}</p>}
    </div>
  );
}

export default ForgotPassword;
