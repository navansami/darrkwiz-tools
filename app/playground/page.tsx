import { ExperienceIndex } from '@/components/labs/experience-shell';
import { experienceMetadata } from '@/lib/experiences';
export const metadata = experienceMetadata(
  'Creative playgrounds and CSS experiments',
  'Experiment with CSS easing curves and live motion in Darrkwiz, the creative playground by Navan Sami.',
  '/playground',
);
export default function Page() {
  return <ExperienceIndex section="playground" />;
}
