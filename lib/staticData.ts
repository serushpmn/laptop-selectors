export type PriceRange = { id: string; name: string; range: [number, number] }

export const priceRanges: PriceRange[] = [
  { id: 'p1', name: 'تا ۳۰ میلیون تومان', range: [0, 30] },
  { id: 'p2', name: '۳۰ تا ۵۰ میلیون تومان', range: [30, 50] },
  { id: 'p3', name: '۵۰ تا ۸۰ میلیون تومان', range: [50, 80] },
  { id: 'p4', name: 'بیش از ۸۰ میلیون تومان', range: [80, Infinity] },
  { id: 'p5', name: 'مهم نیست', range: [0, Infinity] },
]
