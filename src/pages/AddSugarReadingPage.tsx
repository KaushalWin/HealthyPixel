import { useNavigate } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { SugarReadingForm } from '../components/sugar/SugarReadingForm';
import { useAppData } from '../context/AppDataContext';
import { createReadingDraft, formatDateInput } from '../lib/readingUtils';

export function AddSugarReadingPage() {
  const navigate = useNavigate();
  const { addReading, readings, settings, tags } = useAppData();

  return (
    <SiteShell
      title="Add Sugar Reading"
      subtitle="Enter value first, save fast, and use optional details only when needed."
    >
      <SugarReadingForm
        title="New sugar reading"
        submitLabel="Save reading"
        initialValue={createReadingDraft()}
        tags={tags}
        readings={readings}
        settings={settings}
        onSubmit={(draft) => {
          const reading = addReading(draft);
          const selectedDate = formatDateInput(new Date(reading.readingDateTimeIso));
          navigate(
            `/sugar/list?highlight=${reading.id}&start=${selectedDate}&end=${selectedDate}`
          );
        }}
      />
    </SiteShell>
  );
}