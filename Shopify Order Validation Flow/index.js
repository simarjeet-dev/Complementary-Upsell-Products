export default function main(input) {
  const lineItems = input.order?.lineItems || [];

  let hasMainProduct = false;
  let hasComplementaryOnly = false;

  for (const item of lineItems) {
    const hasFBT = item.customAttributes?.some(attr => attr.key === '_FBT');
    const hasFBTMST = item.customAttributes?.some(attr => attr.key === '_FBTMST');

    if (hasFBT && hasFBTMST) {
      hasMainProduct = true;
      break; // main product found, no need to check further
    }

    if (hasFBT && !hasFBTMST) {
      hasComplementaryOnly = true;
    }
  }

  const issue = hasComplementaryOnly && !hasMainProduct;

  return {
    complementaryIssue: issue,
    message: issue
      ? "Complementary products present without main product"
      : "Main product present or no complementary products"
  };
}
