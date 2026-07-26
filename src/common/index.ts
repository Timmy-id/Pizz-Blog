/* eslint-disable prettier/prettier */
export const getVerificationTokenExpiresAt = (numOfHrs: number): Date =>
  new Date(Date.now() + numOfHrs * 60 * 60 * 1000);
