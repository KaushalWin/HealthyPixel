import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { FoodReadingForm } from '../components/food/FoodReadingForm';
import { useAppData } from '../context/AppDataContext';
import type { FoodReadingDraft } from '../lib/types';

export function EditFoodReadingPage() {
  const { readingId } = useParams();
  const navigate = useNavigate();
  const { foodReadings, foodTags, settings, updateFoodReading } = useAppData();
  const reading = foodReadings.find((entry) => entry.id === readingId);

  if (!reading) {
    return <Navigate to="/food/list" replace />;
  }

  const initialValue: FoodReadingDraft = {
    mealName: reading.mealName,
    calories: reading.calories,
    readingDateTimeIso: reading.readingDateTimeIso,
    tagIds: reading.tagIds,
    note: reading.note ?? ''
  };

  return (
    <SiteShell title="Edit Food" subtitle="Update meal details, calories, and tag groups quickly.">
      <FoodReadingForm
        title="Edit food entry"
        submitLabel="Save changes"
        initialValue={initialValue}
        tags={foodTags}
        readings={foodReadings}
        settings={settings}
        listPath="/food/list"
        onSubmit={(draft) => {
          const updated = updateFoodReading(reading.id, draft);
          if (updated) {
            navigate(`/food/list?highlight=${updated.id}`);
          }
        }}
      />
    </SiteShell>
  );
}