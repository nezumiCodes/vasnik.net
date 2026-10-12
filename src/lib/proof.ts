export interface ProofPart {
  text: string;
  mono: boolean;
}

/**
 * Splits CV text on backticks so metrics can be marked inline:
 * "cutting manual work by `60%`" renders "60%" in the mono proof font.
 */
export function splitProof(text: string): ProofPart[] {
  return text
    .split('`')
    .map((segment, index) => ({ text: segment, mono: index % 2 === 1 }))
    .filter((part) => part.text.length > 0);
}
