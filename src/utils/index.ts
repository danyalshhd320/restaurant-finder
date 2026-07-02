export const parseCoordinates = (coordinates: string) => {
  const parts = coordinates.split(',');
  if (parts.length !== 2) return null;

  const xPart = parts[0].split('=');
  const yPart = parts[1].split('=');

  const x = Number(xPart[xPart.length - 1]);
  const y = Number(yPart[yPart.length - 1]);

  if (Number.isNaN(x) || Number.isNaN(y)) return null;

  return {
    x,
    y,
  };
};

export const formatCoordinateString = (x: number, y: number) => `x=${x},y=${y}`;

export const messageResponse = (message: string) => ({ message });

export const fieldErrorResponse = (message: string, field: string) => ({
  errors: [{ message, field }],
});
