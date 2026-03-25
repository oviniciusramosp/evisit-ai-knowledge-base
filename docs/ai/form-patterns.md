<!-- AI Reference: Form Patterns for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: react-hook-form usage across codebase -->

# Form Patterns

Stack: react-hook-form, @hookform/resolvers (Yup), ev-components (Input, Dropdown).

---

## Core Pattern: useForm + useController

Forms use `react-hook-form` for state management. Individual fields connect via `useController` (controlled mode), not `register` (uncontrolled).

### Basic Form Setup

```tsx
import { yupResolver } from '@hookform/resolvers/yup';
import { Control, FieldValues, useController, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useTranslation } from 'ev-i18n';

import Button from 'ev-components/Button';
import Input from 'ev-components/Input';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const MyForm = () => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: { firstName: '', lastName: '', email: '' },
  });

  const onSubmit = async (data: FormData) => {
    await saveData(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput
        control={control}
        id="firstName"
        label={t('First Name')}
        name="firstName"
        required
      />
      <ControlledInput
        control={control}
        id="lastName"
        label={t('Last Name')}
        name="lastName"
        required
      />
      <ControlledInput
        control={control}
        id="email"
        label={t('Email')}
        name="email"
        required
      />
      <Button
        disabled={isSubmitting}
        id="submit"
        label={t('Submit')}
        type="submit"
      />
    </form>
  );
};
```

---

## Connecting to ev-components via useController

### Input with useController

```tsx
import { Control, FieldValues, useController } from 'react-hook-form';

import Input from 'ev-components/Input';

type ControlledInputProps = {
  control: Control<FieldValues>;
  name: string;
  id: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
};

const ControlledInput = ({
  control,
  name,
  id,
  label,
  required,
  disabled,
}: ControlledInputProps) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({ name, control, rules: { required } });

  return (
    <Input
      disabled={disabled}
      error={!!error}
      helperText={error?.message}
      id={id}
      label={label}
      onChange={onChange}
      ref={ref}
      required={required}
      value={value}
    />
  );
};
```

### Dropdown with control prop

The `Dropdown` component from `ev-components/Dropdown` accepts a `control` prop directly:

```tsx
import { Control, useController } from 'react-hook-form';

import Dropdown, { Option } from 'ev-components/Dropdown';

const ControlledDropdown = ({ control, name, id, label, options }: Props) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control });

  const initialValue = options.find(opt => opt.value === value);

  return (
    <Dropdown
      control={control}
      error={!!error}
      helperText={error?.message}
      id={id}
      initialValue={initialValue}
      label={label}
      onSelect={(opt: Option) => onChange(opt.value)}
      options={options}
    />
  );
};
```

---

## Yup Validation Schemas

```tsx
import * as Yup from 'yup';

const schema = Yup.object().shape({
  // Required string
  name: Yup.string().required('Name is required'),

  // Email validation
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  // Phone with pattern
  phone: Yup.string()
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format')
    .required('Phone is required'),

  // Optional number with range
  age: Yup.number().min(0).max(150).nullable(),

  // Conditional validation
  insuranceNumber: Yup.string().when('hasInsurance', {
    is: true,
    then: schema => schema.required('Insurance number required'),
    otherwise: schema => schema.nullable(),
  }),

  // Date validation (string format)
  dateOfBirth: Yup.string()
    .required('Date of birth is required')
    .test('valid-date', 'Invalid date', value => {
      return DateTime.fromFormat(value, 'MM/dd/yyyy').isValid;
    }),
});
```

### Using Yup with useForm

```tsx
import { yupResolver } from '@hookform/resolvers/yup';

const { control, handleSubmit } = useForm<FormData>({
  resolver: yupResolver(schema),
  defaultValues: { name: '', email: '' },
});
```

---

## Input Formatting

eVisit has custom formatters in `ev-utils/formatters.ts` for phone, credit card, date, etc.

```tsx
import { formatNumeric, formatPhone } from 'ev-utils/formatters';

<Input
  id="phone"
  label={t('Phone')}
  onChange={e => onChange(formatPhone(e.target.value))}
  value={value}
/>;
```

---

## Form Submission Patterns

### With RTK Query mutation

```tsx
const [createVisit, { isLoading }] = useCreateVisitMutation();
const setToast = useToast();

const onSubmit = async (data: FormData) => {
  try {
    await createVisit(data).unwrap();
    setToast(t('Visit created successfully'), 'success');
    navigate('waiting_room');
  } catch (error) {
    setToast(t('Failed to create visit'), 'error');
  }
};
```

### With unsaved changes tracking

```tsx
import { useAppDispatch } from 'ev-store/redux';
import { setHasUnsavedChanges } from 'ev-store/actions';

const { control, formState: { isDirty } } = useForm<FormData>({ ... });

useEffect(() => {
  dispatch(setHasUnsavedChanges(isDirty));
  return () => { dispatch(setHasUnsavedChanges(false)); };
}, [isDirty, dispatch]);
```

---

## Error Display

### Inline field errors

The `Input` component handles error display via `error` and `helperText` props:

```tsx
<Input
  error={!!fieldState.error}
  helperText={fieldState.error?.message}
  id="email"
  label={t('Email')}
/>
```

### Form-level error summary

```tsx
const {
  formState: { errors },
} = useForm();

{
  Object.keys(errors).length > 0 && (
    <Banner
      aria-live="polite"
      id="form-errors"
      type="error"
      message={t('Please fix the errors below')}
    />
  );
}
```

---

## Real-World Example: UpdateLanguage Component

From `src/ev-common/UpdateLanguage.tsx` -- shows the pattern of a component receiving `control` from a parent form:

```tsx
const UpdateLanguage = ({
  control,
  id,
  value,
  required,
  ...props
}: UpdateLanguageProps) => {
  const {
    field: { onChange, value: fieldValue },
  } = useController({
    name: id,
    control,
    defaultValue: value,
    rules: { required },
  });

  const handleSelect = useCallback(
    async (opt: Option) => {
      onChange(opt.value as UserLanguages);
    },
    [onChange],
  );

  return (
    <Dropdown
      control={control}
      id={id}
      initialValue={findOption(fieldValue)}
      onSelect={handleSelect}
      options={languageOptions}
      required={required}
    />
  );
};
```

Key pattern: The parent form creates `useForm()` and passes `control` down to child components. Each child uses `useController` with the shared `control` object.

---

## Checklist for New Forms

1. Define a TypeScript type for form data
2. Create a Yup validation schema with translated error messages
3. Use `useForm` with `yupResolver` and `defaultValues`
4. Connect inputs via `useController` (NOT `register`)
5. Use RTK Query mutation for submission
6. Show inline errors via `error`/`helperText` props
7. Track `isDirty` for unsaved changes if navigable
8. Add `data-testid` to all form elements
9. Wrap all visible strings with `t()`
10. Test: empty state, filled state, validation errors, successful submission
