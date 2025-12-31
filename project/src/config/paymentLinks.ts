export const PAYMENT_LINKS = {
  ANNUAL: 'https://buy.stripe.com/test_8x28wO3QvgLV62kf9tdjO01',
  MONTHLY: 'https://buy.stripe.com/test_cNidR8aeT7blduM3qLdjO02',
  SINGLE_REPORT: 'https://buy.stripe.com/test_28E6oGfzdcvFbmE2mHdjO03',
} as const;

export const VALID_LICENSE_KEYS = [
  'CYTYOS-BETA',
  'VIP-2025',
] as const;

export function getAffiliateTrackingUrl(baseUrl: string): string {
  const affiliateRef = localStorage.getItem('ref');
  if (affiliateRef) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}client_reference_id=${encodeURIComponent(affiliateRef)}`;
  }
  return baseUrl;
}
