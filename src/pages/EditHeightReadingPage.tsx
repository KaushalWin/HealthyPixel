import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { HeightReadingForm } from '../components/height/HeightReadingForm';
import { useAppData } from '../context/AppDataContext';
import type { ReadingDraft } from '../lib/types';

export function EditHeightReadingPage() {
  const { readingId } = useParams();
  const navigate = useNavigate();
  const { heightReadings, settings, heightTags, updateHeightReading } = useAppData();
  const reading = heightReadings.find((e) => e.id === readingId);

  if (!reading) return <Navigate to="/height/list" replace />;

  const initialValue: ReadingDraft = {
    value: reading.value,
    readingDateTimeIso: reading.readingDateTimeIso,
    tagIds: reading.tagIds,
    note: reading.note ?? ''
  };

  return (
    <SiteShell title="Edit Height" subtitle="Update height value quickly.">
      <HeightReadingForm
        title="Edit reading"
        submitLabel="Save changes"
        initialValue={initialValue}
        tags={heightTags}
        readings={heightReadings}
        settings={settings}
        listPath="/height/list"
        onSubmit={(draft) => {
          const updated = updateHeightReading(reading.id, draft);
          if (updated) navigate(`/height/list?highlight=${updated.id}`);
        }}
      />
    </SiteShell>
  );
}
