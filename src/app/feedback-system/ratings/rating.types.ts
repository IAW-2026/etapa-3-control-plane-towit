export interface RatingRecord {
	id: number;
	tripId: number;
	rating: number;
	type: string;
	tags: string;
	comment: string;
	raterClerkId: string;
	ratedClerkId: string;
	createdAt: string;
}

export const CUSTOMER_PRESET_TAGS = [
  { slug: 'polite', label: 'Amable' },
  { slug: 'punctual', label: 'Puntual' },
  { slug: 'took_care_of_vehicle', label: 'Cuidadoso con el vehículo' },
  { slug: 'good_communication', label: 'Buena comunicación' },
  { slug: 'professional', label: 'Profesional' },
] as const
