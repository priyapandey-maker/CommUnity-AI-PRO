/**
 * Design System — UI Component Barrel
 *
 * Import from '@/components' to consume any component:
 *   import { PrimaryButton, Card, Badge } from '@/components';
 */

// ── Legacy Components (Required by scaffolded pages) ──────
export { default as Button } from './Button';
export { default as PageHeader } from './PageHeader';
export * from './FormField';
export * from './ImageUpload';
export * from './IncidentForm';
export * from './GlobalErrorBoundary';
export * from './SectionErrorBoundary';
export { default as Navbar } from './Navbar';
export * from './ProtectedRoute';
export * from './RoleRoute';

// ── Components ────────────────────────────────────────────
export { PrimaryButton   } from './ui/PrimaryButton';
export { SecondaryButton } from './ui/SecondaryButton';
export { Card            } from './ui/Card';
export { SectionTitle    } from './ui/SectionTitle';
export { PageContainer   } from './ui/PageContainer';
export { Input           } from './ui/Input';
export { Textarea        } from './ui/Textarea';
export { Badge           } from './ui/Badge';
export { Spinner         } from './ui/Spinner';

// ── Prop types ────────────────────────────────────────────
export type { PrimaryButtonProps,   PrimaryButtonSize,   PrimaryButtonVariant } from './ui/PrimaryButton';
export type { SecondaryButtonProps, SecondaryButtonSize                        } from './ui/SecondaryButton';
export type { CardProps,            CardVariant,          CardPadding          } from './ui/Card';
export type { SectionTitleProps,    SectionTitleAlign                          } from './ui/SectionTitle';
export type { PageContainerProps,   PageContainerMaxWidth                      } from './ui/PageContainer';
export type { InputProps                                                        } from './ui/Input';
export type { TextareaProps                                                     } from './ui/Textarea';
export type { BadgeProps,           BadgeVariant,         BadgeSize            } from './ui/Badge';
export type { SpinnerProps,         SpinnerSize,          SpinnerColor         } from './ui/Spinner';
