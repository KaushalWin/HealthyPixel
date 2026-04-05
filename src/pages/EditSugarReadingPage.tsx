import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { SugarReadingForm } from '../components/sugar/SugarReadingForm';
import { useAppData } from '../context/AppDataContext';
import type { ReadingDraft } from '../lib/types';

export function EditSugarReadingPage() {
  const { readingId } = useParams();
  const navigate = useNavigate();
  const { readings, settings, tags, updateReading } = useAppData();
  const reading = readings.find((entry) => entry.id === readingId);

  if (!reading) {
    return <Navigate to="/sugar/list" replace />;
  }

  const initialValue: ReadingDraft = {
    value: reading.value,
    readingDateTimeIso: reading.readingDateTimeIso,
    tagIds: reading.tagIds,
    note: reading.note ?? ''
  };

  return (
    <SiteShell
      title="Edit Sugar Reading"
      subtitle="Update value quickly; expand optional details only if needed."
    >
      <SugarReadingForm
        title="Edit reading"
        submitLabel="Save changes"
        initialValue={initialValue}
        tags={tags}
        readings={readings}
        settings={settings}
        onSubmit={(draft) => {
          const updated = updateReading(reading.id, draft);
          if (updated) {
            navigate(`/sugar/list?highlight=${updated.id}`);
          }
        }}
      />
    </SiteShell>
  );
}