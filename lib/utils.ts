export const getExpirationDate = (ttl: string): Date => {
  const now = new Date();
  const parts = ttl.match(/(\d+)([dhms])/);
  if (!parts) throw new Error(`Invalid TTL format: ${ttl}`);

  const value = parseInt(parts[1], 10);
  const unit = parts[2];

  let ms;
  switch (unit) {
    case 'd':
      ms = value * 24 * 60 * 60 * 1000;
      break;
    case 'h':
      ms = value * 60 * 60 * 1000;
      break;
    case 'm':
      ms = value * 60 * 1000;
      break;
    case 's':
      ms = value * 1000;
      break;
    default:
      throw new Error(`Invalid TTL unit: ${unit}`);
  }

  return new Date(now.getTime() + ms);
};