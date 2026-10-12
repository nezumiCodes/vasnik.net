import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;

export const ENGAGEMENT_LABELS: Record<Service['data']['engagement'], string> = {
  'fixed-scope': 'Fixed scope',
  retainer: 'Monthly retainer',
  'day-rate': 'Day rate',
};

/** Services in display order. */
export async function getServices(): Promise<Service[]> {
  const services = await getCollection('services');
  return services.sort((a, b) => a.data.order - b.data.order);
}
