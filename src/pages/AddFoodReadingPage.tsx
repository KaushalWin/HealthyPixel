import { useNavigate } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { FoodReadingForm } from '../components/food/FoodReadingForm';
import { useAppData } from '../context/AppDataContext';
import { createFoodDraft } from '../lib/foodUtils';
import { formatDateInput } from '../lib/readingUtils';

export function AddFoodReadingPage() {
  const navigate = useNavigate();
  const { addFoodReading, foodReadings, foodTags, settings } = useAppData();

  return (
    <SiteShell title="Add Food" subtitle="Log the meal fast, then add plan, actual, context, and behavior tags.">
      <FoodReadingForm
        title="New food entry"
        submitLabel="Save meal"
        initialValue={createFoodDraft()}
        tags={foodTags}
        readings={foodReadings}
        settings={settings}
        listPath="/food/list"
        onSubmit={(draft) => {
          const reading = addFoodReading(draft);
          const selectedDate = formatDateInput(new Date(reading.readingDateTimeIso));
          navigate(`/food/list?highlight=${reading.id}&start=${selectedDate}&end=${selectedDate}`);
        }}
      />
    </SiteShell>
  );
}