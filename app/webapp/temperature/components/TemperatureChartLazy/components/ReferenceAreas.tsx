import { ReferenceArea } from 'recharts';
import { TemperatureEquipment } from '../../types';
import { logger } from '@/lib/logger';

interface ReferenceAreasProps {
  chartDataLength: number;
  equipment: TemperatureEquipment;
  xAxisDomain: [number, number];
  yMin: number;
  yMax: number;
}

/**
 * Component for rendering reference areas (red zones) for temperature thresholds
 */
export function ReferenceAreas({
  chartDataLength,
  equipment,
  xAxisDomain,
  yMin,
  yMax,
}: ReferenceAreasProps) {
  const shouldRenderBoth =
    chartDataLength > 0 &&
    equipment.min_temp_celsius !== null &&
    equipment.max_temp_celsius !== null;
  const shouldRenderMinOnly =
    chartDataLength > 0 &&
    equipment.min_temp_celsius !== null &&
    equipment.max_temp_celsius === null;
  const shouldRenderMaxOnly =
    chartDataLength > 0 &&
    equipment.min_temp_celsius === null &&
    equipment.max_temp_celsius !== null;

  logger.dev('[ReferenceArea] Render conditions:', {
    shouldRenderBoth,
    shouldRenderMinOnly,
    shouldRenderMaxOnly,
    chartDataLength,
    min_temp_celsius: equipment.min_temp_celsius,
    max_temp_celsius: equipment.max_temp_celsius,
  });

  if (shouldRenderBoth) {
    logger.dev('[ReferenceArea] Rendering both thresholds:', {
      x1: xAxisDomain[0],
      x2: xAxisDomain[1],
      redBelow: { y1: yMin, y2: equipment.min_temp_celsius },
      redAbove: { y1: equipment.max_temp_celsius, y2: yMax },
    });
    return (
      <>
        <ReferenceArea
          x1={xAxisDomain[0]}
          x2={xAxisDomain[1]}
          y1={yMin}
          y2={equipment.min_temp_celsius}
          fill="#dc2626"
          fillOpacity={0.9}
          stroke="none"
          ifOverflow="extendDomain"
        />
        <ReferenceArea
          x1={xAxisDomain[0]}
          x2={xAxisDomain[1]}
          y1={equipment.max_temp_celsius}
          y2={yMax}
          fill="#dc2626"
          fillOpacity={0.9}
          stroke="none"
          ifOverflow="extendDomain"
        />
      </>
    );
  }

  if (shouldRenderMinOnly) {
    logger.dev('[ReferenceArea] Rendering min only:', {
      x1: xAxisDomain[0],
      x2: xAxisDomain[1],
      redBelow: { y1: yMin, y2: equipment.min_temp_celsius },
    });
    return (
      <ReferenceArea
        x1={xAxisDomain[0]}
        x2={xAxisDomain[1]}
        y1={yMin}
        y2={equipment.min_temp_celsius}
        fill="#dc2626"
        fillOpacity={0.9}
        stroke="none"
        ifOverflow="extendDomain"
      />
    );
  }

  if (shouldRenderMaxOnly) {
    logger.dev('[ReferenceArea] Rendering max only:', {
      x1: xAxisDomain[0],
      x2: xAxisDomain[1],
      redAbove: { y1: equipment.max_temp_celsius, y2: yMax },
    });
    return (
      <ReferenceArea
        x1={xAxisDomain[0]}
        x2={xAxisDomain[1]}
        y1={equipment.max_temp_celsius}
        y2={yMax}
        fill="#dc2626"
        fillOpacity={0.9}
        stroke="none"
        ifOverflow="extendDomain"
      />
    );
  }

  return null;
}
