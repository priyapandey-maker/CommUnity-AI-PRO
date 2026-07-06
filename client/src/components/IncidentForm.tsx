import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import Button from './Button';
import FormField from './FormField';
import ImageUpload from './ImageUpload';
import { useSubmitIncident } from '@/hooks';

/* ── Types ─────────────────────────────────────────────── */
export interface IncidentFormValues {
  description: string;
  location: string;
  image: File | null;
}

/* ── Validation rules ───────────────────────────────────── */
const RULES = {
  description: {
    required: 'Description is required.',
    minLength: { value: 20, message: 'Please provide at least 20 characters.' },
    maxLength: { value: 2000, message: 'Description must be under 2000 characters.' },
  },
  location: {
    required: 'Location is required.',
    minLength: { value: 3, message: 'Please enter a valid location.' },
  },
} as const;

/* ── Component ──────────────────────────────────────────── */
export default function IncidentForm() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { isLoading, error, clearError, submit } = useSubmitIncident();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IncidentFormValues>({ mode: 'onTouched' });

  const descriptionValue = watch('description', '');

  const onSubmit = async (data: IncidentFormValues) => {
    await submit({
      description: data.description,
      location:    data.location,
      image:       imageFile,
    });
  };

  return (
    <form
      id="incident-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border p-5 sm:p-6 space-y-5"
      style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--line)' }}
    >
      {/* ── Location (1st in Hierarchy) ──────────────── */}
      <Controller
        name="location"
        control={control}
        rules={RULES.location}
        defaultValue=""
        render={({ field }) => (
          <Input
            {...field}
            id="incident-location"
            label="Location *"
            type="text"
            placeholder="e.g. Oak Ave & 5th St, Downtown"
            error={errors.location?.message}
            hint="Street address, neighborhood area, or local landmark."
            fullWidth
            onChange={(e) => { clearError(); field.onChange(e); }}
          />
        )}
      />

      {/* ── Description (2nd in Hierarchy) ───────────── */}
      <div className="relative">
        <Controller
          name="description"
          control={control}
          rules={RULES.description}
          defaultValue=""
          render={({ field }) => (
            <Textarea
              {...field}
              id="incident-description"
              label="Incident Description *"
              placeholder="e.g. A streetlight at the corner of Oak Ave and 5th St has been out for two weeks, creating a safety hazard at night…"
              rows={4}
              error={errors.description?.message}
              hint="Provide full operational details regarding the issue."
              fullWidth
              onChange={(e) => { clearError(); field.onChange(e); }}
            />
          )}
        />
        <span
          className={[
            'block text-right text-xs tabular-nums mt-1 pr-1',
            (descriptionValue?.length ?? 0) > 1900 ? 'text-amber-400' : 'text-gray-600',
          ].join(' ')}
        >
          {descriptionValue?.length ?? 0} / 2000
        </span>
      </div>

      {/* ── Image Upload (3rd in Hierarchy) ──────────── */}
      <FormField
        id="incident-image"
        label="Supporting Image"
        hint="Optional — attach a clear photo of the incident (JPG, PNG, WebP, GIF · max 5 MB)."
      >
        <ImageUpload onFileChange={setImageFile} />
      </FormField>

      {/* ── Submission error banner ───────────────────── */}
      {error && (
        <div
          role="alert"
          id="incident-submit-error"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/20"
        >
          <svg
            aria-hidden="true"
            className="mt-0.5 w-4 h-4 shrink-0 text-red-600 dark:text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.75-11a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0V7zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Submission failed</p>
            <p className="text-xs text-red-600/80 mt-0.5 dark:text-red-300/80">{error}</p>
          </div>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={clearError}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Actions ──────────────────────────────────── */}
      <div
        className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t"
        style={{ borderColor: 'var(--line)' }}
      >
        <Button
          id="incident-cancel-btn"
          type="button"
          variant="ghost"
          disabled={isLoading}
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
        <Button
          id="incident-submit-btn"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                aria-hidden="true"
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Submitting…
            </>
          ) : (
            'Submit Incident'
          )}
        </Button>
      </div>
    </form>
  );
}
