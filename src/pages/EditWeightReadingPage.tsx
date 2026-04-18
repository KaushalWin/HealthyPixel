import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { WeightReadingForm } from '../components/weight/WeightReadingForm';
import { useAppData } from '../context/AppDataContext';
import type { ReadingDraft } from '../lib/types';

export function EditWeightReadingPage() {
  const { readingId } = useParams();
  const navigate = useNavigate();
  const { weightReadings, settings, weightTags, updateWeightReading } = useAppData();
  const reading = weightReadings.find((e) => e.id === readingId);

  if (!reading) return <Navigate to="/weight/list" replace />;

  const initialValue: ReadingDraft = {
    value: reading.value,
    readingDateTimeIso: reading.readingDateTimeIso,
    tagIds: reading.tagIds,
    note: reading.note ?? ''
  };

  return (
    <SiteShell title="Edit Weight" subtitle="Update weight value quickly.">
      <WeightReadingForm
        title="Edit reading"
        submitLabel="Save changes"
        initialValue={initialValue}
        tags={weightTags}
        readings={weightReadings}
        settings={settings}
        listPath="/weight/list"
        onSubmit={(draft) => {
          const updated = updateWeightReading(reading.id, draft);
          if (updated) navigate(`/weight/list?highlight=${updated.id}`);
        }}
      />
    </SiteShell>
  );
}
