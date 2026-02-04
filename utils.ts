
export const slugify = (text: string): string => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Split accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start
        .replace(/-+$/, ''); // Trim - from end
};

export const buildLocationSlug = (city?: string, state?: string): string => {
    const citySlug = slugify(city || '');
    if (citySlug) return citySlug;
    return slugify(state || '');
};

export type Rate = { time: string; value: number };

export const toNumber = (value: unknown): number | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value !== 'string') return null;
    const cleaned = value
        .trim()
        .replace(/\./g, '')
        .replace(',', '.')
        .replace(/[^\d.-]/g, '');
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
};

export const extractRatesFromAttributes = (attributes: any): Rate[] => {
    const attrs = attributes || {};
    const fromArray: Rate[] = Array.isArray(attrs.rates)
        ? attrs.rates
            .map((r: any) => ({ time: String(r?.time || ''), value: toNumber(r?.value) }))
            .filter((r: any) => r.time && typeof r.value === 'number') as any
        : [];

    if (fromArray.length > 0) return fromArray;

    const candidates: Array<[string, string]> = [
        ['rate_30m', '30 minutos'],
        ['rate_1h', '1 hora'],
        ['rate_2h', '2 horas'],
        ['rate_3h', '3 horas'],
        ['rate_4h', '4 horas'],
        ['rate_pernoite', 'Pernoite'],
    ];

    const derived: Rate[] = [];
    candidates.forEach(([key, label]) => {
        const val = toNumber(attrs[key]);
        if (typeof val === 'number' && val > 0) derived.push({ time: label, value: val });
    });

    return derived;
};

export const getMinRateValue = (rates: Rate[]): number | null => {
    const values = rates.map(r => r.value).filter(v => typeof v === 'number' && v > 0);
    if (values.length === 0) return null;
    return Math.min(...values);
};
