export const RADtoDEG = (rad) => {
    return (rad * (180 / Math.PI))
}
  
export const DEGtoRAD = (deg) => {
    return (deg * (Math.PI / 180))
}

export const HSBToRGB = (h, s, b) => {
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)];
};

export const findQuadrant = (rotation) => {
    return Math.floor(rotation / (Math.PI / (list.length / 2)))
}