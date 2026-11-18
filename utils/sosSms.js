const SOS_API_URL = process.env.EXPO_PUBLIC_SOS_API_URL;

export async function sendSosMessage({ phoneNumber, contactName }) {
  if (!SOS_API_URL) {
    throw new Error("Configure EXPO_PUBLIC_SOS_API_URL to enable SOS messaging.");
  }

  const response = await fetch(SOS_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: phoneNumber,
      contactName,
      message: "SOS: I need help. Please contact me as soon as possible.",
    }),
  });

  if (!response.ok) {
    throw new Error("The SMS service could not accept your SOS message. Please try again.");
  }
}