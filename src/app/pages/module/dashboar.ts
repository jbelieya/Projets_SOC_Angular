import {Type} from '@angular/core';


export interface DashboardItem {
    id: number;
    label: string;
    content: Type<unknown> | null;
    rows?: number;
    columns?: number;
    backgroundColor?: string;
    color?: string;
}