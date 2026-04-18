import { useNavigate } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { BpReadingForm } from '../components/bp/BpReadingForm';
import { useAppData } from '../context/AppDataContext';
import { createBpDraft, formatDateInput } from '../lib/readingUtils';

export function AddBpReadingPage() {
  const navigate = useNavigate();
  const { addBpReading, bpReadings, settings, bpTags } = useAppData();

  return (
    <SiteShell title="Add BP" subtitle="Enter systolic/diastolic, save fast.">
      <BpReadingForm
        title="New blood pressure reading"
        submitLabel="Save reading"
        initialValue={createBpDraft()}
        tags={bpTags}
        readings={bpReadings}
        settings={settings}
        listPath="/bp/list"
        onSubmit={(draft) => {
          const reading = addBpReading(draft);
          const selectedDate = formatDateInput(new Date(reading.readingDateTimeIso));
          navigate(`/bp/list?highlight=${reading.id}&start=${selectedDate}&end=${selectedDate}`);
        }}
      />
    </SiteShell>
  );
}
