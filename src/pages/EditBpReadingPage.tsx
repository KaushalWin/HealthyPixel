import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { BpReadingForm } from '../components/bp/BpReadingForm';
import { useAppData } from '../context/AppDataContext';
import type { BpDraft } from '../lib/types';

export function EditBpReadingPage() {
  const { readingId } = useParams();
  const navigate = useNavigate();
  const { bpReadings, settings, bpTags, updateBpReading } = useAppData();
  const reading = bpReadings.find((e) => e.id === readingId);

  if (!reading) return <Navigate to="/bp/list" replace />;

  const initialValue: BpDraft = {
    systolic: reading.systolic,
    diastolic: reading.diastolic,
    readingDateTimeIso: reading.readingDateTimeIso,
    tagIds: reading.tagIds,
    note: reading.note ?? ''
  };

  return (
    <SiteShell title="Edit BP" subtitle="Update blood pressure reading.">
      <BpReadingForm
        title="Edit reading"
        submitLabel="Save changes"
        initialValue={initialValue}
        tags={bpTags}
        readings={bpReadings}
        settings={settings}
        listPath="/bp/list"
        onSubmit={(draft) => {
          const updated = updateBpReading(reading.id, draft);
          if (updated) navigate(`/bp/list?highlight=${updated.id}`);
        }}
      />
    </SiteShell>
  );
}
