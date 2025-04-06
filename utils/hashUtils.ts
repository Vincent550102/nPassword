// @ts-expect-error - js-md4 doesn't have types
import md4 from "js-md4";

export function calculateNTHash(password: string): string {
  if (!password) return "";

  try {
    const utf16LeBytes = new Uint8Array(password.length * 2);
    for (let i = 0; i < password.length; i++) {
      const charCode = password.charCodeAt(i);
      utf16LeBytes[i * 2] = charCode & 0xff;
      utf16LeBytes[i * 2 + 1] = charCode >> 8;
    }

    return md4(utf16LeBytes);
  } catch (error) {
    console.error("Error calculating NT hash:", error);
    return "";
  }
}
