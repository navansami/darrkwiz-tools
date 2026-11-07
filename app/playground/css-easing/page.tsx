import { ExperienceShell } from '@/components/labs/experience-shell';
import EasingLab from '@/components/labs/easing-lab';
import { experiences, experienceMetadata } from '@/lib/experiences';
const item = experiences.find((e) => e.slug === 'css-easing')!;
export const metadata = experienceMetadata(item.title, item.description, '/playground/css-easing');
export default function Page() {
  return (
    <ExperienceShell slug="css-easing">
      <EasingLab />
    </ExperienceShell>
  );
}
