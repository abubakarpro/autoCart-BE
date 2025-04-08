import { PartialType } from '@nestjs/swagger';
import { CreateDashboardAnalyticDto } from './create-dashboard-analytic.dto';

export class UpdateDashboardAnalyticDto extends PartialType(CreateDashboardAnalyticDto) {}
