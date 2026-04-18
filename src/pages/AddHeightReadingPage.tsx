import { useNavigate } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { HeightReadingForm } from '../components/height/HeightReadingForm';
import { useAppData } from '../context/AppDataContext';
import { createHeightDraft, formatDateInput } from '../lib/readingUtils';

export function AddHeightReadingPage() {
  const navigate = useNavigate();
  const { addHeightReading, heightReadings, settings, heightTags } = useAppData();

  return (
    <SiteShell title="Add Height" subtitle="Enter height in cm, save fast.">
      <HeightReadingForm
        title="New height reading"
        submitLabel="Save reading"
        initialValue={createHeightDraft()}
        tags={heightTags}
        readings={heightReadings}
        settings={settings}
        listPath="/height/list"
        onSubmit={(draft) => {
          const reading = addHeightReading(draft);
          const selectedDate = formatDateInput(new Date(reading.readingDateTimeIso));
          navigate(`/height/list?highlight=${reading.id}&start=${selectedDate}&end=${selectedDate}`);
        }}
      />
    </SiteShell>
  );
}
