import { ExperienceShell } from '@/components/labs/experience-shell';
import CompressionLab from '@/components/labs/compression-lab';
import { experiences, experienceMetadata } from '@/lib/experiences';
const item = experiences.find((e) => e.slug === 'image-compression')!;
export const metadata = experienceMetadata(
  item.title,
  item.description,
  '/learn/image-compression',
);
export default function Page() {
  return (
    <ExperienceShell slug="image-compression">
      <CompressionLab />
    </ExperienceShell>
  );
}
