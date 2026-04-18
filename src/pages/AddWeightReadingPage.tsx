import { useNavigate } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { WeightReadingForm } from '../components/weight/WeightReadingForm';
import { useAppData } from '../context/AppDataContext';
import { createWeightDraft, formatDateInput } from '../lib/readingUtils';

export function AddWeightReadingPage() {
  const navigate = useNavigate();
  const { addWeightReading, weightReadings, settings, weightTags } = useAppData();

  return (
    <SiteShell title="Add Weight" subtitle="Enter weight in kg, save fast.">
      <WeightReadingForm
        title="New weight reading"
        submitLabel="Save reading"
        initialValue={createWeightDraft()}
        tags={weightTags}
        readings={weightReadings}
        settings={settings}
        listPath="/weight/list"
        onSubmit={(draft) => {
          const reading = addWeightReading(draft);
          const selectedDate = formatDateInput(new Date(reading.readingDateTimeIso));
          navigate(`/weight/list?highlight=${reading.id}&start=${selectedDate}&end=${selectedDate}`);
        }}
      />
    </SiteShell>
  );
}
