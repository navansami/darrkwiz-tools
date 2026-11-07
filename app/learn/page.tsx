import { ExperienceIndex } from '@/components/labs/experience-shell';
import { experienceMetadata } from '@/lib/experiences';
export const metadata = experienceMetadata(
  'Learn colour theory and image compression',
  'Interactive lessons by Navan Sami: explore colour relationships and understand image compression through hands-on browser experiments.',
  '/learn',
);
export default function Page() {
  return <ExperienceIndex section="learn" />;
}
