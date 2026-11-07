import { ExperienceShell } from '@/components/labs/experience-shell';
import ColourLab from '@/components/labs/colour-lab';
import { experiences, experienceMetadata } from '@/lib/experiences';
const item = experiences.find((e) => e.slug === 'colour-theory')!;
export const metadata = experienceMetadata(item.title, item.description, '/learn/colour-theory');
export default function Page() {
  return (
    <ExperienceShell slug="colour-theory">
      <ColourLab />
    </ExperienceShell>
  );
}
