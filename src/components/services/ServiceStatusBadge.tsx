/**
 * Beyond Financials - Reusable Service Status Indicator
 * 
 * Provides both visual indicators (color-coded dots) and unambiguous textual status.
 */

import React from 'react';
import { ServiceStatusType } from '../../types/services';
import { SERVICE_STATUS_MAP } from '../../data/servicesData';
import { Badge } from '../ui/Badge';

export interface ServiceStatusBadgeProps {
  status: ServiceStatusType;
  size?: 'sm' | 'md' | 'lg';
  showDescriptionTooltip?: boolean;
}

export const ServiceStatusBadge: React.FC<ServiceStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config = SERVICE_STATUS_MAP[status] || SERVICE_STATUS_MAP.COMING_SOON;

  return (
    <Badge variant={config.badgeVariant} size={size} dot>
      {config.label}
    </Badge>
  );
};
