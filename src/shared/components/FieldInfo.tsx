import type { AnyFieldApi } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  const { t } = useTranslation();

  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-400 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? <span className="text-[#20B2AA] text-xs">{t('validation.validating')}</span> : null}
    </>
  );
}